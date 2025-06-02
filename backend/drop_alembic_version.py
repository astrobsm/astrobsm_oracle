# drop_alembic_version.py
"""
This script drops the alembic_version table from your database. Use with caution!
"""
from sqlalchemy import create_engine, text
from app.core.config import settings
import psycopg2

DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)

conn = psycopg2.connect(
    dbname="astrobsm_oracle",
    user="postgres",
    password="natiss_natiss",
    host="localhost"
)
cur = conn.cursor()
cur.execute("DROP TABLE IF EXISTS alembic_version CASCADE;")
conn.commit()
print("Dropped alembic_version table.")
cur.close()
conn.close()
