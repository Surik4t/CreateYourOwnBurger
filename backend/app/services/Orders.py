from fastapi import APIRouter, HTTPException, Depends
from configurations import orders_collection
from database.schemas import order_schema
from database.models import OrderModel, ReceiptData
from bson.objectid import ObjectId
from .Users import get_current_user
from app.RabbitMQ.Message_sender import queue_message

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("")
async def get_orders(
    customer: str = None, current_user: dict = Depends(get_current_user)
):
    result = list()
    if customer:
        if customer == current_user.username:
            query = {"customer": customer}
    else:
        query = {}

    async for order in orders_collection.find(query):
        result.append(order_schema(order))
    return sorted(result, key=lambda order: order["creation_datetime"], reverse=True)


@router.post("")
async def create_order(new_order: OrderModel):
    try:
        cursor = await orders_collection.insert_one(dict(**new_order.model_dump()))
        return {
            "status_code": 200,
            "message": f"Order id: {cursor.inserted_id} created.",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not create an order: {e}")


@router.put("/{order_id}")
async def update_order(order_id, updated_order: OrderModel):
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
async def remove_order(order_id):
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
async def send_receipt(data: ReceiptData):
    try:
        queue_message(data.model_dump(), queue="receipts")
        return {"message": f"Receipt for order {data.id} sent to queue."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occured: {e}")
    
