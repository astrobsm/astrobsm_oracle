from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.warehouse import Warehouse

router = APIRouter()

@router.get("/")
def get_warehouses(db: Session = Depends(get_db)):
    warehouses = db.query(Warehouse).all()
    return [
        {
            "id": w.id,
            "name": w.name,
            "location": w.location,
            "manager": w.manager,
            "manager_phone": w.manager_phone
        }
        for w in warehouses
    ]

@router.get("", include_in_schema=False)
def get_warehouses_no_slash(db: Session = Depends(get_db)):
    return get_warehouses(db)
