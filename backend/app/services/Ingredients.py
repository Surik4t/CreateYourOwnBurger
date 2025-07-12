from fastapi import APIRouter, HTTPException
from configurations import ingredient_collection
from database.models import IngredientModel
from database.schemas import ingredient_schema
from bson.objectid import ObjectId

router = APIRouter(prefix="/ingredients", tags=["ingredients"])

@router.get("/")
async def get_all_ingredients():
    result = list()
    async for ingredient in ingredient_collection.find():
        result.append(ingredient_schema(ingredient))
    return result


@router.post("/")
async def add_ingredient(new_ingredient: IngredientModel):
    try:
        cursor = await ingredient_collection.insert_one(dict(new_ingredient))
        return {"status_code": 200, "id": str(cursor)}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Could not create an order: {e}")


@router.delete("/{ingredient_id}")
async def remove_ingredient(ingredient_id):
    try:
        order = await ingredient_collection.find_one({"_id": ObjectId(ingredient_id)})
        if order:
            await ingredient_collection.delete_one({"_id": ObjectId(ingredient_id)})
            return {"message": "Ingredient removed."}
        else:
            return HTTPException(status_code=404, detail="Ingredient not found.")
    except Exception as e:
        return HTTPException(status_code=500, detail=f"An error occured: {e}")
