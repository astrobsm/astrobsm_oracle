from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.db.models.user import User

def update_user_status(username: str, new_status: str):
    db: Session = SessionLocal()
    user = db.query(User).filter(User.username == username).first()
    if user:
        user.status = new_status
        db.commit()
        print(f"Updated status for user '{username}' to '{new_status}'.")
    else:
        print(f"User '{username}' not found.")

if __name__ == "__main__":
    update_user_status("blakvelvet", "approved")
