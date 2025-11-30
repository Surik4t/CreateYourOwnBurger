from fastapi import APIRouter, HTTPException, Depends
from configurations import orders_collection
from database.schemas import order_schema
from database.models import OrderModel, ReceiptData
from database.models import UserInDB
from bson.objectid import ObjectId
from .Users import get_current_user
from app.RabbitMQ.Message_sender import queue_message

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("")
async def get_orders(user: UserInDB = Depends(get_current_user)):
    result = list()
    query = {"customer": user.username}
    async for order in orders_collection.find(query):
        result.append(order_schema(order))

    return sorted(result, key=lambda order: order["creation_datetime"], reverse=True)


@router.post("")
async def create_order(new_order: OrderModel, user: UserInDB = Depends(get_current_user)):
    try:
        cursor = await orders_collection.insert_one(dict(**new_order.model_dump()))
        return {
            "status_code": 200,
            "message": f"Order id: {cursor.inserted_id} created.",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not create an order: {e}")


@router.put("/{order_id}")
async def update_order(order_id, updated_order: OrderModel, user: UserInDB = Depends(get_current_user)):
    try:
        order = await orders_collection.find_one({"_id": ObjectId(order_id)})
        if order:
            await orders_collection.replace_one(
                {"_id": ObjectId(order_id)}, dict(**updated_order.model_dump())
            )
            return {"message": "Order updated."}
        else:
            raise HTTPException(status_code=404, detail="Order not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating order: {e}")


@router.delete("/{order_id}")
async def remove_order(order_id, user: UserInDB = Depends(get_current_user)):
    try:
        order = await orders_collection.find_one({"_id": ObjectId(order_id)})
        if order:
            await orders_collection.delete_one({"_id": ObjectId(order_id)})
            return {"message": "Order removed."}
        else:
            raise HTTPException(status_code=404, detail="Order not found.")
    except HTTPException as http_e:
        raise HTTPException(status_code=http_e.status_code, detail=http_e.detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occured: {e}")
    

@router.post("/email")
async def send_receipt(data: ReceiptData, user: UserInDB = Depends(get_current_user)):
    try:
        queue_message(data.model_dump(), queue="receipts")
        return {"message": f"Receipt for order {data.id} sent to queue."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occured: {e}")
    

async def update_customer(old_customer: str, new_customer: str, session=None):
    try:    
        orders_collection.update_many(
            {"customer": old_customer},
            {"$set": {"customer": new_customer}},
            session=session,
        )
    except Exception as e:
        raise Exception(e)
    
