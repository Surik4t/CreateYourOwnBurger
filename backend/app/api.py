from fastapi import FastAPI, APIRouter, HTTPException
from configurations import collection, client
from database.schemas import individual_order
from database.models import Order
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
router = APIRouter()




origins = [
    "http://localhost:5173",
    "localhost:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@router.get("/dbcheck")
async def db_response():
    try:
        info = await client.server_info()
        return {"info": info}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"{e}")


@router.get("/")
async def get_all_orders():
    result = list()
    async for order in collection.find():
        result.append(individual_order(order))
    return result


@router.post("/")
async def create_order(new_order: Order):
    try:
        cursor = await collection.insert_one(dict(new_order))
        return {"status_code": 200, "id": str(cursor)}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Could not create an order: {e}")

app.include_router(router)
