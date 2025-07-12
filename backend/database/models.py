from pydantic import BaseModel


class Account(BaseModel):
    name: str
    password: str
    email: str


class Ingredient(BaseModel):
    name: str
    weight: int
    price: int


class Burger(BaseModel):
    name: str
    ingredients: list[Ingredient]


class Order(BaseModel):
    number: str
    customer: str
    status: str
    content: list[Burger]
    price: int
    weight: int