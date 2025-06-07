from sqlalchemy import create_engine, text

# Replace this with your Render production DB URL if different
DATABASE_URL = "postgresql://mdcan_bdm2025enugu_user:SqqPDfWX6vw2dYmOiEexSq64BglxF9NZ@dpg-d0ummsbe5dus739ns56g-a/mdcan_bdm2025enugu"

LATEST_REVISION = "07b4fe21d9e5"

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    # Create alembic_version table if it doesn't exist
    conn.execute(text("""
        CREATE TABLE IF NOT EXISTS alembic_version (
            version_num VARCHAR(32) NOT NULL
        );
    """))
    # Remove any existing version (safety)
    conn.execute(text("DELETE FROM alembic_version;"))
    # Insert the latest revision
    conn.execute(text("INSERT INTO alembic_version (version_num) VALUES (:rev);"), {"rev": LATEST_REVISION})
    print(f"alembic_version table set to {LATEST_REVISION}")
