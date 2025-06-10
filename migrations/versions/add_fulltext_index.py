"""add fulltext index to products table

Revision ID: add_fulltext_index
Revises: 
Create Date: 2024-03-19

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_fulltext_index'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    # Add FULLTEXT index to products table
    op.create_index('idx_product_fulltext', 'products', ['product_name', 'description'], mysql_prefix='FULLTEXT')

def downgrade():
    # Remove FULLTEXT index from products table
    op.drop_index('idx_product_fulltext', table_name='products') 