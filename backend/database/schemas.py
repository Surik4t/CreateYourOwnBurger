def order_schema(order):
    return {
        "id": str(order["_id"]),
        "customer": order["customer"],
        "status": order["status"],
        "content": [burger_schema(burger) for burger in order["content"]],
        "price": int(order["price"]),
        "weight": int(order["weight"]),
        "creation_datetime": str(order["creation_datetime"]),
    }


def burger_schema(burger):
    return {
        "name": str(burger["name"]),
        "ingredients": [ingredient_schema(ingr) for ingr in burger["ingredients"]],
        "price": int(burger["price"]),
        "weight": int(burger["weight"]),
    }


def ingredient_schema(ingredient):
    return {
        "index": int(ingredient["index"]),
        "name": str(ingredient["name"]),
        "weight": int(ingredient["weight"]),
        "price": int(ingredient["price"]),
    }
