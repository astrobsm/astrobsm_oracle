from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.db.models.invoice import Invoice
from app.db.models.customer import Customer
from typing import List

router = APIRouter()

@router.get("/", response_model=List[dict])
def get_customer_performance(db: Session = Depends(get_db)):
    # Aggregate invoice data per customer
    results = (
        db.query(
            Customer.id.label('id'),
            Customer.name.label('name'),
            func.count(Invoice.id).label('totalTransactions'),
            func.coalesce(func.sum(Invoice.total_amount), 0).label('totalAmount')
        )
        .join(Invoice, Invoice.customer_name == Customer.name)
        .group_by(Customer.id, Customer.name)
        .all()
    )
    # Return as list of dicts
    return [
        {
            'id': r.id,
            'name': r.name,
            'totalTransactions': r.totalTransactions,
            'totalAmount': float(r.totalAmount)
        } for r in results
    ]
