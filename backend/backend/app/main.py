from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from .database import engine, Base, get_db
from . import schemas, crud

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory & Order Management System")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/products/", response_model=List[schemas.ProductResponse])
def read_products(db: Session = Depends(get_db)):
    return crud.get_products(db)

@app.post("/products/", response_model=schemas.ProductResponse)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, product)

@app.get("/customers/", response_model=List[schemas.CustomerResponse])
def read_customers(db: Session = Depends(get_db)):
    return crud.get_customers(db)

@app.post("/customers/", response_model=schemas.CustomerResponse)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db, customer)

@app.get("/orders/", response_model=List[schemas.OrderResponse])
def read_orders(db: Session = Depends(get_db)):
    return crud.get_orders(db)

@app.post("/orders/", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db, order)
