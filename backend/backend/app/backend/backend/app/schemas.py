from pydantic import BaseModel, EmailStr, Field
from typing import List

class ProductCreate(BaseModel):
    sku: str
    name: str
    price: int = Field(..., gt=0, description="Price in cents")
    stock: int = Field(..., ge=0)

class ProductResponse(ProductCreate):
    id: int
    class Config:
        from_attributes = True

class CustomerCreate(BaseModel):
    email: EmailStr
    name: str

class CustomerResponse(CustomerCreate):
    id: int
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: int = Field(..., gt=0)

class OrderResponse(BaseModel):
    id: int
    customer_id: int
    product_id: int
    quantity: int
    class Config:
        from_attributes = True
