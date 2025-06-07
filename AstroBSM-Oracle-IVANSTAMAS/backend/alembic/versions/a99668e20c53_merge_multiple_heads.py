"""merge multiple heads

Revision ID: a99668e20c53
Revises: ad8368bfe416, c331c0ee4c80
Create Date: 2025-05-29 23:16:43.335271

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'a99668e20c53'
down_revision = ('ad8368bfe416', 'c331c0ee4c80')
branch_labels = None
depends_on = None

def upgrade():
    pass

def downgrade():
    pass
