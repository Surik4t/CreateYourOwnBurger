from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

host = "mongodb://localhost:27017"

client = AsyncIOMotorClient(host)

database = client.CreateYourOwnBurgerDB

users_collection = database.get_collection("UsersCollection")
unconfirmed_users_collecition = database.get_collection("UnconfirmedUsersCollection")
orders_collection = database.get_collection("OrdersCollection")
ingredient_collection = database.get_collection("IngredientsCollection")
