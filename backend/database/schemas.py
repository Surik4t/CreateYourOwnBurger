def order_schema(order):
    return {
        "id": str(order["_id"]),
    }

def ingredient_schema(ingredient):
    return {
        "id": str(ingredient["_id"]),
        "name": str(ingredient["name"]),
        "weight": int(ingredient["weight"]),
        "price": int(ingredient["price"]),
    }
