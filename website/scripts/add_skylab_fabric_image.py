import sys
import os
from PIL import Image, ImageDraw
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product, ProductImage

app = create_app()

with app.app_context():
    product = Product.query.filter_by(product_name='Skylab – Lacoste Fabric').first()
    if not product:
        print('Skylab – Lacoste Fabric product not found!')
        sys.exit(1)
    img_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../static/pictures/Skylab – Lacoste Fabric.jpg'))
    # Create placeholder if not exists
    if not os.path.exists(img_path):
        img = Image.new('RGB', (400, 300), color=(200, 200, 200))
        d = ImageDraw.Draw(img)
        d.text((10, 140), 'Skylab – Lacoste Fabric', fill=(0, 0, 0))
        img.save(img_path)
        print(f'Created placeholder: {img_path}')
    # Add image to DB if not exists
    img_record = ProductImage.query.filter_by(product_id=product.product_id).first()
    if not img_record:
        img_record = ProductImage(product_id=product.product_id, image_url='/static/pictures/Skylab – Lacoste Fabric.jpg', image_type='main', display_order=0, alt_text=product.product_name)
        db.session.add(img_record)
        db.session.commit()
        print('Added image to product!')
    else:
        print('Image already exists in DB.') 