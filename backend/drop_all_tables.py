# drop_all_tables.py
"""
This script drops all tables in the connected PostgreSQL database. Use with caution!
"""
from sqlalchemy import create_engine, MetaData, text
from sqlalchemy.engine import reflection
from sqlalchemy.exc import ProgrammingError
from app.core.config import settings

# Adjust this import if your config is elsewhere
DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL)
metadata = MetaData()
metadata.reflect(bind=engine)

with engine.connect() as conn:
    trans = conn.begin()
    inspector = reflection.Inspector.from_engine(engine)
    tables = inspector.get_table_names()
    for table in tables:
        try:
            conn.execute(text(f'DROP TABLE IF EXISTS "{table}" CASCADE;'))
            print(f"Dropped table: {table}")
        except ProgrammingError as e:
            print(f"Error dropping table {table}: {e}")
    trans.commit()
print("All tables dropped.")
