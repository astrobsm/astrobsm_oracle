from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models.settings import Settings

router = APIRouter()

@router.get("")
def get_settings_no_slash(db: Session = Depends(get_db)):
    settings = db.query(Settings).all()
    if not settings:
        raise HTTPException(status_code=404, detail="No settings found")
    return [
        {
            "id": s.id,
            "key": getattr(s, 'key', None),
            "value": getattr(s, 'value', None),
            "description": getattr(s, 'description', None)
        }
        for s in settings
    ]

@router.get("/")
def get_settings_with_slash(db: Session = Depends(get_db)):
    settings = db.query(Settings).all()
    if not settings:
        raise HTTPException(status_code=404, detail="No settings found")
    return [
        {
            "id": s.id,
            "key": getattr(s, 'key', None),
            "value": getattr(s, 'value', None),
            "description": getattr(s, 'description', None)
        }
        for s in settings
    ]

# Both @router.get("") and @router.get("/") are present for settings.
