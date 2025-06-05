# reset_admin_password_and_status.py
"""
Script to reset the password and status for the admin user 'blakvelvet'.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.models.user import User
from app.core.security import get_password_hash

DATABASE_URL = "postgresql://astrobsm_dboracle_user:WttcHRFGuDdzcwFn5YtdcNodlshXJ3sT@dpg-cp1v1g1gkuv2qv7v7v80-a.oregon-postgres.render.com/astrobsm_dboracle"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def reset_admin():
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.username == "blakvelvet").first()
        if not user:
            print("User 'blakvelvet' not found.")
            return
        user.hashed_password = get_password_hash("chibuike_douglas")
        user.status = "active"
        session.commit()
        print("Password and status reset for user 'blakvelvet'.")
    except Exception as e:
        print(f"Error: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    reset_admin()
