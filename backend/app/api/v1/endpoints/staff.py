from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.staff import Staff
from app.schemas.registration import StaffOut

router = APIRouter()

@router.get("", response_model=list[StaffOut])
@router.get("/", response_model=list[StaffOut])
def get_staff(db: Session = Depends(get_db)):
    try:
        staff_members = db.query(Staff).all()
        if not staff_members:
            raise HTTPException(status_code=404, detail="No staff members found")
        # Use .model_dump() for Pydantic v2 to ensure serialization works
        return [StaffOut.model_validate(staff).model_dump() for staff in staff_members]
    except Exception as e:
        print("Staff endpoint error:", e)
        raise HTTPException(status_code=500, detail=str(e))
