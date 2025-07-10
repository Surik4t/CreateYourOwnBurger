from pydantic import BaseModel


class Account(BaseModel):
    name: str
    password: str
    email: str


class Order(BaseModel):
    number: int
    status: str
    content: str
