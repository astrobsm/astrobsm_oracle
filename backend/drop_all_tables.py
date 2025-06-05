# drop_all_tables.py
"""
This script drops all tables in the connected PostgreSQL database. Use with caution!
"""
from sqlalchemy import create_engine, MetaData, text
from sqlalchemy.engine import reflection
from sqlalchemy.exc import ProgrammingError

# Set your Render production DB URL directly here for this operation
DATABASE_URL = "postgresql://astrobsm_dboracle_user:WttcHRFGuDdzcwFn5YtdcNodlshXJ3sT@dpg-cp1v1g1gkuv2qv7v7v80-a.oregon-postgres.render.com/astrobsm_dboracle"

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
    # Also drop alembic_version if it exists
    try:
        conn.execute(text('DROP TABLE IF EXISTS alembic_version CASCADE;'))
        print("Dropped alembic_version table.")
    except Exception as e:
        print(f"Error dropping alembic_version: {e}")
print("All tables dropped.")
