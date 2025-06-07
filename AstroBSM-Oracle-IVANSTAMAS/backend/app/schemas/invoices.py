from pydantic import BaseModel
from typing import Optional
from datetime import date

class InvoiceBase(BaseModel):
    invoice_number: str
    customer_name: str
    date: date
    total_amount: float
    status: str

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceOut(InvoiceBase):
    id: int
    class Config:
        from_attributes = True
