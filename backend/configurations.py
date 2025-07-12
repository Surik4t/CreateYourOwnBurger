from motor.motor_asyncio import AsyncIOMotorClient


host = "mongodb://localhost:27017"

client = AsyncIOMotorClient(host)

database = client.CreateYourOwnBurgerDB

orders_collection = database.get_collection("OrdersCollection")
ingredient_collection = database.get_collection("IngredientsCollection")
