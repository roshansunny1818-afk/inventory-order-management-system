from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from . import models, schemas

# Products
def get_products(db: Session):
    return db.query(models.Product).all()

def create_product(db: Session, product: schemas.ProductCreate):
    existing = db.query(models.Product).filter(models.Product.sku == product.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail="SKU already exists")
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Customers
def get_customers(db: Session):
    return db.query(models.Customer).all()

def create_customer(db: Session, customer: schemas.CustomerCreate):
    existing = db.query(models.Customer).filter(models.Customer.email == customer.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_customer = models.Customer(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

# Orders with Inventory Validation & Atomic Reduction
def get_orders(db: Session):
    return db.query(models.Order).all()

def create_order(db: Session, order: schemas.OrderCreate):
    # Lock the row to prevent race conditions during inventory checks
    product = db.query(models.Product).filter(models.Product.id == order.product_id).with_for_update().first()
    customer = db.query(models.Customer).filter(models.Customer.id == order.customer_id).first()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    # Inventory Validation Rule
    if product.stock < order.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Insufficient stock. Available stock: {product.stock}"
        )
    
    # Automatic Stock Reduction
    product.stock -= order.quantity
    
    db_order = models.Order(**order.model_dump())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order
