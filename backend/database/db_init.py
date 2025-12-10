import pymongo

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

host = "mongodb://localhost:27017"

client = pymongo.MongoClient(host)

db = client["CreateYourOwnBurgerDB"]
collection = db["IngredientsCollection"]

try:
    collection.delete_many({})
    collection.insert_many(ingredients)
    print("db initialization successful.")
except Exception as e:
    print(f"db initialization failed: {e}")

