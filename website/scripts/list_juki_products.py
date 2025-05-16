import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product, ProductImage

app = create_app()

with app.app_context():
    juki_products = Product.query.filter(Product.product_name.ilike('%juki%')).all()
    for product in juki_products:
        images = ProductImage.query.filter_by(product_id=product.product_id).all()
        print(f"ID: {product.product_id}\nName: {product.product_name}")
        if images:
            for img in images:
                print(f"  Image: {img.image_url}")
        else:
            print("  No images found!")
        print('-' * 40) 