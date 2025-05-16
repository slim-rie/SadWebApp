import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product

app = create_app()

with app.app_context():
    product = Product.query.filter_by(product_name='Skylab – Lacoste Fabric').first()
    if product:
        print(f"Product ID: {product.product_id}")
    else:
        print('Skylab – Lacoste Fabric product not found!') 