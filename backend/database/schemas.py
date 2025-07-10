def individual_order(order):
    return {
        "id": str(order["_id"])
    }


def all_orders(orders):
    return [individual_order(order) for order in orders]