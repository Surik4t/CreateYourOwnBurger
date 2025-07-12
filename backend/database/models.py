from pydantic import BaseModel


class AccountModel(BaseModel):
    name: str
    password: str
    email: str


class IngredientModel(BaseModel):
    name: str
    weight: int
    price: int


class BurgerModel(BaseModel):
    name: str
    ingredients: list[IngredientModel]


class OrderModel(BaseModel):
    number: str
    customer: str
    status: str
    content: list[BurgerModel]
    price: int
    weight: int