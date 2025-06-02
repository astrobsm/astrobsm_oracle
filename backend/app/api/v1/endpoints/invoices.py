from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.invoice import Invoice
from app.schemas.invoices import InvoiceOut, InvoiceCreate
from typing import List
from datetime import date

router = APIRouter()

@router.get("/", response_model=List[InvoiceOut])
def get_invoices(db: Session = Depends(get_db)):
    invoices = db.query(Invoice).all()
    return [InvoiceOut.model_validate(inv).model_dump() for inv in invoices]

@router.post("/", response_model=InvoiceOut)
def create_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db)):
    db_invoice = Invoice(
        invoice_number=invoice.invoice_number,
        customer_name=invoice.customer_name,
        date=invoice.date,
        total_amount=invoice.total_amount,
        status=invoice.status
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return InvoiceOut.model_validate(db_invoice).model_dump()
