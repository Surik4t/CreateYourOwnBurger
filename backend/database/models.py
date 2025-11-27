from pydantic import BaseModel, Field
from datetime import datetime
from bson.objectid import ObjectId


class UserModel(BaseModel):
    username: str
    email: str
    disabled: bool = Field(default=False)
    profile_pic: str | None = None


class NewUserModel(UserModel):
    password: str


class UnconfirmedUser(UserModel):
    hashed_password: str
    confirmation_code: str
    expiring_at: datetime
    attempts: int


class UserInDB(UserModel):
    hashed_password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class IngredientModel(BaseModel):
    name: str
    price: float = Field(gt=0, description="The price must be greater than zero")
    weight: int = Field(gt=0, description="The weight must be greater than zero")


class BurgerModel(BaseModel):
    name: str
    ingredients: list[IngredientModel]
    price: float = Field(gt=0, description="The price must be greater than zero")
    weight: int = Field(gt=0, description="The weight must be greater than zero")


class OrderModel(BaseModel):
    customer: str
    status: str
    content: list[BurgerModel]
    price: float = Field(gt=0, description="The price must be greater than zero")
    weight: int = Field(gt=0, description="The weight must be greater than zero")
    creation_datetime: str


class ReceiptData(OrderModel):
    id: str
    email: str