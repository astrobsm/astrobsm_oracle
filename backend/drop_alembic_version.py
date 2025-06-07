# drop_alembic_version.py
"""
This script drops the alembic_version table from your database. Use with caution!
"""
import os
from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://mdcan_bdm2025enugu_user:SqqPDfWX6vw2dYmOiEexSq64BglxF9NZ@dpg-d0ummsbe5dus739ns56g-a/mdcan_bdm2025enugu")
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS alembic_version CASCADE;"))
    print("Dropped alembic_version table.")
