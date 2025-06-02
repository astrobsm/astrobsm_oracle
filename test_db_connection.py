from sqlalchemy import create_engine

# Database connection URL
DATABASE_URL = "postgresql+psycopg2://postgres:natiss_natiss@localhost/astrooraclemanager_db"

def test_connection():
    try:
        engine = create_engine(DATABASE_URL)
        connection = engine.connect()
        print("Connection successful!")
        connection.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    test_connection()
