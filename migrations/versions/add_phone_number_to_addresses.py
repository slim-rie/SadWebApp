"""add phone_number to addresses

Revision ID: add_phone_number_to_addresses
Revises: 211272e8aad6
Create Date: 2024-03-19 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_phone_number_to_addresses'
down_revision = '211272e8aad6'
branch_labels = None
depends_on = None

def upgrade():
    # Add phone_number column to addresses table
    op.add_column('addresses', sa.Column('phone_number', sa.String(20), nullable=True))

def downgrade():
    # Remove phone_number column from addresses table
    op.drop_column('addresses', 'phone_number') 