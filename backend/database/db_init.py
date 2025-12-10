ingredients = [
    {
        "name": "Bottom Bun",
        "price": 0.39,
        "weight": 50
    },
    {
        "name": "Top Bun",
        "price": 0.39,
        "weight": 50
    },
    {
        "name": "Beef Patty",
        "price": 2.49,
        "weight": 120
    },
    {
        "name": "Chicken",
        "price": 2.29,
        "weight": 100
    },
    {
        "name": "Tomato Slice",
        "price": 0.69,
        "weight": 30
    },
    {
        "name": "Mayo",
        "price": 0.09,
        "weight": 15
    },
    {
        "name": "Ketchup",
        "price": 0.09,
        "weight": 15
    },
    {
        "name": "Mustard",
        "price": 0.09,
        "weight": 10
    },
    {
        "name": "Cheese",
        "price": 0.79,
        "weight": 25
    },
    {
        "name": "Onions",
        "price": 0.39,
        "weight": 15
    },
    {
        "name": "Pickles",
        "price": 0.29,
        "weight": 15
    },
    {
        "name": "Lettuce",
        "price": 0.49,
        "weight": 20
    },
]

import pymongo
import os, dotenv
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

guest_user = {
    "username": "Guest",
    "email": "cyob_guest@cyob.com",
    "disabled": False,
    "hashed_password": pwd_context.hash("Guest1337")
}

dotenv.load_dotenv()

host = os.getenv("DB_HOST")

client = pymongo.MongoClient(host)

db = client["CreateYourOwnBurgerDB"]
ingr_collection = db["IngredientsCollection"]
user_collection = db["UsersCollection"]

try:
    ingr_collection.delete_many({})
    ingr_collection.insert_many(ingredients)
    print("Ingredients loaded.")
    
    guest_user_exists = user_collection.find_one({"email": guest_user["email"]})
    if not guest_user_exists:
        user_collection.insert_one(guest_user)
        print("Guest user created.")

except Exception as e:
    print(f"db initialization failed: {e}")

finally:
    print("db initialization successful.")

