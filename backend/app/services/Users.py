import jwt
import logging
import uuid
from pathlib import Path
from bson.objectid import ObjectId
from random import randint
from jwt.exceptions import InvalidTokenError
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from database.models import (
    UserModel,
    NewUserModel,
    UnconfirmedUser,
    UserInDB,
    Token,
    TokenData,
)
from configurations import client, users_collection, unconfirmed_users_collection
from passlib.context import CryptContext
from datetime import timedelta, datetime, timezone
from app.RabbitMQ.Message_sender import queue_message
from dotenv import load_dotenv
import os

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")

router = APIRouter(prefix="/users", tags=["users"])

load_dotenv()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600


logging.getLogger("passlib").setLevel(logging.ERROR)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def get_user(username: str):
    user = await users_collection.find_one({"username": username})
    if user:
        return UserInDB(**user)


async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = await get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[UserModel, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@router.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me")
async def read_users_me(
    current_user: Annotated[UserModel, Depends(get_current_active_user)],
):
    return {
        "username": current_user.username,
        "email": current_user.email,
        "disabled": current_user.disabled,
        "profile_pic": current_user.profile_pic,
    }


@router.post("/user_verification")
async def verify_user(new_user: NewUserModel):
    try:
        if await users_collection.find_one({"username": new_user.username}):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Username already taken"
            )

        if await users_collection.find_one({"email": new_user.email}):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with such email already exists",
            )

        await unconfirmed_users_collection.find_one_and_delete(
            {"email": new_user.email}
        )

        unconfirmed_user = UnconfirmedUser(
            username=new_user.username,
            email=new_user.email,
            disabled=new_user.disabled,
            hashed_password=get_password_hash(new_user.password),
            confirmation_code="".join(str(randint(0, 9)) for x in range(4)),
            expiring_at=datetime.now() + timedelta(minutes=15),
            attempts=0,
        )

        await unconfirmed_users_collection.insert_one(dict(unconfirmed_user))

        message = {
            "username": unconfirmed_user.username,
            "email": unconfirmed_user.email,
            "code": unconfirmed_user.confirmation_code,
        }
        queue_message(message, queue="confirmation")

        return {
            "status_code": 200,
            "message": f"Confirmation code sent to {unconfirmed_user.email}",
        }

    except HTTPException as http_e:
        raise http_e

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


async def get_unconfirmed_user(email):
    user = await unconfirmed_users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Something went wrong.",
        )
    return UnconfirmedUser(**user)


@router.post("/code_confirmation")
async def confirm_code(data: dict):
    code = data["confirmation_code"]
    email = data["email"]

    try:
        user = await get_unconfirmed_user(email)
        if user.attempts >= 3:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="You have exceeded the maximum number of activation attempts. Please request a new code.",
            )    
        if code != user.confirmation_code:
            await unconfirmed_users_collection.update_one(
                {"email": user.email}, {"$inc": {"attempts": 1}}
            )

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid confirmation code.",
            )

        confirmed_user = UserInDB(**user.model_dump())
        await users_collection.insert_one(dict(confirmed_user))

        return {"status_code": 200, "message": f"User {str(confirmed_user.username)} created."}

    except HTTPException as http_e:
        raise http_e

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


@router.post("")
async def create_user(new_user: NewUserModel):
    try:
        user_in_db = UserInDB(
            username=new_user.username,
            email=new_user.email,
            disabled=new_user.disabled,
            hashed_password=get_password_hash(new_user.password),
        )

        cursor = await users_collection.insert_one(dict(user_in_db))

        return {"status_code": 200, "message": f"User {str(cursor)} created"}

    except HTTPException as http_e:
        raise http_e

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    

@router.get("")
async def fetch_user(user: Annotated[UserInDB, Depends(get_user)]):
    if user:
        return user
    raise HTTPException(status_code=404, detail="User not found.")


@router.get("/exists")
async def check_user_exists(user: Annotated[UserInDB, Depends(get_user)]):
    if user:
        raise HTTPException(status_code=409, detail="Username is already taken.")
    raise HTTPException(status_code=404, detail="User not found.")


@router.put("")
async def update_user(
        data: dict, 
        user: Annotated[UserInDB, Depends(get_user)], 
        logged_in: Annotated[UserInDB ,Depends(get_current_user)],
    ):

    old_username = user.username
    new_username = data.get("new_username")

    from .Orders import update_customer
    
    async with await client.start_session() as session:
        try:
            await update_customer(old_customer=old_username, new_customer=new_username, session=session)
            
            user.username = new_username
            await users_collection.replace_one({"email": user.email}, dict(user), session=session)

            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": new_username}, expires_delta=access_token_expires
            )
            new_token = Token(access_token=access_token, token_type="bearer")

            return {
                "message": "Username changed.",
                "access_token": new_token.access_token,
            }
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating username: {e}")


@router.post("/profilepic")
async def upload_pic(
        user: Annotated[UserInDB, Depends(get_user)],
        logged_in: Annotated[UserInDB ,Depends(get_current_user)],
        image: UploadFile = File(),
    ):
    if not user:
        raise HTTPException(status_code=401, detail="Not authorized.")

    path = Path("../frontend/public/profile_pics")
    if path.exists():
        try:
            print(f"current uuid: {user.profile_pic}")
            if not user.profile_pic:
                print("creating profile pic uuid")
                profile_pic = f"{uuid.uuid4()}.png"
                user.profile_pic = profile_pic
                users_collection.replace_one({"email": user.email}, dict(user))

            with open(f"{path}/{user.profile_pic}", "wb") as file:
                content = await image.read()
                file.write(content)
                print("Image upload successful")
            return {"message": "Profile picture updated."}
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error uplading profile picture: {e}")

    print(f"{path} does not exist")
    raise HTTPException(status_code=500, detail="Internal server error.")
    
    