from fastapi import FastAPI, APIRouter, HTTPException
from configurations import client
from .services import Ingredients, Orders, Users
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
router = APIRouter()


origins = ["http://localhost:5173", "http://localhost", "http://127.0.0.1:5173", "https://create-your-own-burger-surik4t.netlify.app"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization", "Origin"],
)


@router.get("/dbcheck")
async def db_response():
    try:
        info = await client.server_info()
        if info:
            return {"message": "DB connection: OK"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{e}")


app.include_router(router)
app.include_router(Orders.router)
app.include_router(Ingredients.router)
app.include_router(Users.router)
