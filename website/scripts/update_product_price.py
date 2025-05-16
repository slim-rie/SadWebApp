import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product

app = create_app()

with app.app_context():
    product_id = 55  # Change this to your actual product_id if needed
    product = Product.query.get(product_id)
    if product:
        product.base_price = 499.00  # Set your reasonable price here
        db.session.commit()
        print(f"Updated price for product {product.product_name} to ₱{product.base_price}")
    else:
        print(f"Product with id {product_id} not found!") 