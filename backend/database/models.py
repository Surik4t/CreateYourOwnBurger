from pydantic import BaseModel, Field


class UserModel(BaseModel):
    username: str
    email: str | None = None
    disabled: bool | None = None


class IngredientModel(BaseModel):
    name: str
    price: int = Field(gt=0, description="The price must be greater than zero")
    weight: int = Field(gt=0, description="The weight must be greater than zero")


class BurgerModel(BaseModel):
    name: str
    ingredients: list[IngredientModel]
    price: int = Field(gt=0, description="The price must be greater than zero")
    weight: int = Field(gt=0, description="The weight must be greater than zero")


class OrderModel(BaseModel):
    customer: str
    status: str
    content: list[BurgerModel]
    price: int = Field(gt=0, description="The price must be greater than zero")
    weight: int = Field(gt=0, description="The weight must be greater than zero")
    creation_datetime: str