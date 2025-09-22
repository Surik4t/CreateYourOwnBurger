from fastapi import FastAPI, APIRouter, HTTPException
from configurations import client
from .services import Ingredients, Orders, Users
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

app = FastAPI()
router = APIRouter()


origins = ["http://localhost:5173", "localhost:5173"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@router.get("/dbcheck")
async def db_response():
    try:
        info = await client.server_info()
        if info:
            return {"message": "DB connection: OK"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{e}")


@router.get("/healthcheck")
async def health_check():
    return {"message": "Server is working fine."}


app.include_router(router)
app.include_router(Orders.router)
app.include_router(Ingredients.router)
app.include_router(Users.router)
