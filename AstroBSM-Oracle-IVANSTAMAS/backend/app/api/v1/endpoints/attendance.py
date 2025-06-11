from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, date
from app.db.session import get_db
from app.db.models.attendance import AttendanceRecord
from app.db.models.staff import Staff
from app.db.models.user import User
from app.schemas.attendance import AttendanceRecordCreate, AttendanceRecordOut

router = APIRouter()

def match_fingerprint(input_fingerprint, db: Session):
    # Placeholder for actual fingerprint matching logic
    staff = db.query(Staff).filter(Staff.fingerprint_template == input_fingerprint).first()
    return staff

@router.post("/attendance", response_model=AttendanceRecordOut)
def record_attendance(data: AttendanceRecordCreate, db: Session = Depends(get_db)):
    staff = None
    if data.fingerprint_data:
        staff = match_fingerprint(data.fingerprint_data, db)
        if not staff:
            raise HTTPException(status_code=404, detail="Fingerprint not recognized")
    elif data.user_id:
        staff = db.query(Staff).filter(Staff.id == data.user_id).first()
        if not staff:
            raise HTTPException(status_code=404, detail="User not found")
    else:
        raise HTTPException(status_code=400, detail="No authentication data provided")

    today = date.today()
    now = datetime.now()
    record = db.query(AttendanceRecord).filter(AttendanceRecord.staff_id == staff.id, AttendanceRecord.date == today).first()
    if data.action == 'IN':
        if record and record.time_in:
            raise HTTPException(status_code=400, detail="Time-in already recorded for today")
        if not record:
            record = AttendanceRecord(staff_id=staff.id, date=today, time_in=now, action='IN')
            db.add(record)
        else:
            record.time_in = now
            record.action = 'IN'
    elif data.action == 'OUT':
        if not record or not record.time_in:
            raise HTTPException(status_code=400, detail="Time-in must be recorded before time-out")
        if record.time_out:
            raise HTTPException(status_code=400, detail="Time-out already recorded for today")
        record.time_out = now
        record.action = 'OUT'
        record.hours_worked = (record.time_out - record.time_in).total_seconds() / 3600.0
    else:
        raise HTTPException(status_code=400, detail="Invalid action. Use 'IN' or 'OUT'.")
    db.commit()
    db.refresh(record)
    return record

@router.get("/attendance/{staff_id}", response_model=list[AttendanceRecordOut])
def get_attendance_records(staff_id: int, db: Session = Depends(get_db)):
    records = db.query(AttendanceRecord).filter(AttendanceRecord.staff_id == staff_id).order_by(AttendanceRecord.date.desc()).all()
    return records
