from fastapi import FastAPI, APIRouter, HTTPException
from configurations import collection, client
from database.schemas import individual_order
from database.models import Order
from fastapi.middleware.cors import CORSMiddleware
from bson.objectid import ObjectId


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
        if info:
            return {"message": "DB connection: OK"}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"{e}")


@router.get("/healthcheck")
async def health_check():
    return {"message": "Server is working fine."}


@router.get("/", tags=["orders"])
async def get_all_orders():
    result = list()
    async for order in collection.find():
        result.append(individual_order(order))
    return result


@router.post("/", tags=["orders"])
async def create_order(new_order: Order):
    try:
        cursor = await collection.insert_one(dict(new_order))
        return {"status_code": 200, "id": str(cursor)}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Could not create an order: {e}")


@router.delete("/{order_id}", tags=["orders"])
async def remove_order(order_id):
    try:
        order = await collection.find_one({"_id": ObjectId(order_id)})
        if order:
            await collection.delete_one({"_id": ObjectId(order_id)})
            return {"message": "Order removed."}
        else:
            return HTTPException(status_code=404, detail="Order not found.")
    except Exception as e:
        return HTTPException(status_code=500, detail=f"An error occured: {e}")

app.include_router(router)
