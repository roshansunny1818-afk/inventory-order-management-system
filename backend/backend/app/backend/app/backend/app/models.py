from sqlalchemy import Column, Integer, String, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from .database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    price = Column(Integer, nullable=False)  # Stored in cents (e.g., $10.00 = 1000)
    stock = Column(Integer, default=0, nullable=False)

    __table_args__ = (CheckConstraint('stock >= 0', name='main_stock_positive'),)

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)

    customer = relationship("Customer")
    product = relationship("Product")

    __table_args__ = (CheckConstraint('quantity > 0', name='quantity_positive'),)
