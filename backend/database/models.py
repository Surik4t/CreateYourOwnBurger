from pydantic import BaseModel, Field
from datetime import datetime


class AccountModel(BaseModel):
    name: str
    password: str
    email: str


class IngredientModel(BaseModel):
    name: str
    weight: int = Field(gt=0, description="The price must be greater than zero")
    price: int = Field(gt=0, description="The weight must be greater than zero")


class BurgerModel(BaseModel):
    name: str
    ingredients: list[IngredientModel]


class OrderModel(BaseModel):
    number: str
    customer: str
    status: str
    content: list[BurgerModel]
    price: int = Field(gt=0, description="The price must be greater than zero")
    weight: int = Field(gt=0, description="The weight must be greater than zero")
    creation_datetime: datetime