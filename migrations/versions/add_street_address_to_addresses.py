"""add street_address to addresses

Revision ID: add_street_address_to_addresses
Revises: add_phone_number_to_addresses
Create Date: 2024-03-19 11:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_street_address_to_addresses'
down_revision = 'add_phone_number_to_addresses'
branch_labels = None
depends_on = None

def upgrade():
    # op.add_column('addresses', sa.Column('street_address', sa.String(255), nullable=True))
    pass

def downgrade():
    # op.drop_column('addresses', 'street_address')
    pass