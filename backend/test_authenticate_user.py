from sqlalchemy.orm import Session
from app.services.auth_service import authenticate_user
from app.db.session import SessionLocal

# Initialize database session
db: Session = SessionLocal()

# Test credentials
username = "blakvelvet"
password = "chibuike_douglas"
role = "Admin"

# Test the authenticate_user function
user = authenticate_user(db, username=username, password=password, role=role)
if user:
    print(f"Authentication successful: {user.username}, Role: {user.role}")
else:
    print("Authentication failed.")