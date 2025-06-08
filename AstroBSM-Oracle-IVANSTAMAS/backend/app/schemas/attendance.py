from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class AttendanceRecordCreate(BaseModel):
    staff_id: int
    action: str  # 'IN' or 'OUT'

class AttendanceRecordOut(BaseModel):
    id: int
    staff_id: int
    date: date
    time_in: Optional[datetime]
    time_out: Optional[datetime]
    hours_worked: Optional[float]
    action: Optional[str]

    class Config:
        orm_mode = True
