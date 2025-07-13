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
        return HTTPException(status_code=500, detail=f"Could not create an ingredient: {e}")


@router.put("/{ingredient_id}")
async def update_ingredient(ingredient_id, updated_ingredient: IngredientModel):
    try:
        ingredient = await ingredient_collection.find_one({"_id": ObjectId(ingredient_id)})
        if ingredient:
            await ingredient_collection.replace_one({"_id": ObjectId(ingredient_id)}, dict(updated_ingredient))
            return {"message": "Ingredient changed."}
        else:
            return HTTPException(status_code=404, detail="Ingredient not found.")
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Error updating ingredient: {e}")



@router.delete("/{ingredient_id}")
async def remove_ingredient(ingredient_id):
    try:
        ingredient = await ingredient_collection.find_one({"_id": ObjectId(ingredient_id)})
        if ingredient:
            await ingredient_collection.delete_one({"_id": ObjectId(ingredient_id)})
            return {"message": "Ingredient removed."}
        else:
            return HTTPException(status_code=404, detail="Ingredient not found.")
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Error deleting ingredient: {e}")
