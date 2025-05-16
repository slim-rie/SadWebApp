import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product, ProductImage

app = create_app()

with app.app_context():
    # Fix image for W562-02BB
    prod = Product.query.filter_by(product_name='Juki W562-02BB – Piping Machine').first()
    if prod:
        img = ProductImage.query.filter_by(product_id=prod.product_id).first()
        correct_url = '/static/pictures/Juki W562-02BB – Piping Machine.jpg'
        if img:
            img.image_url = correct_url
            db.session.commit()
            print(f'Fixed image for: {prod.product_name}')
        else:
            img = ProductImage(product_id=prod.product_id, image_url=correct_url, image_type='main', display_order=0, alt_text=prod.product_name)
            db.session.add(img)
            db.session.commit()
            print(f'Added image for: {prod.product_name}')
    else:
        print('W562-02BB product not found!')

    # Print all Juki products and their images
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