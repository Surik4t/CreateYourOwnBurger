from motor.motor_asyncio import AsyncIOMotorClient


host = "mongodb://localhost:27017"

client = AsyncIOMotorClient(host)

database = client.CreateYourOwnBurgerDB

collection = database.get_collection("CreateYourOwnBurgerCollection")
