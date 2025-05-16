import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product, ProductImage

app = create_app()

with app.app_context():
    updates = [
        ('Juki LK-1900S – Computer-Controlled Bartacking Machine', 'Juki LK-1900S – Computer-Controlled Bartacking Machine.jpg'),
        ('Juki LU-1508N – Walking Foot Lockstitch Machine', 'Juki LU-1508N – Walking Foot Lockstitch Machine.jpg'),
        ('Juki W562-02BB – Piping Machine', 'Juki W562-02BB – Piping Machine.jpg'),
    ]
    for prod_name, img_file in updates:
        prod = Product.query.filter_by(product_name=prod_name).first()
        if prod:
            img = ProductImage.query.filter_by(product_id=prod.product_id).first()
            img_url = f'/static/pictures/{img_file}'
            if img:
                img.image_url = img_url
                img.alt_text = prod_name
            else:
                img = ProductImage(product_id=prod.product_id, image_url=img_url, image_type='main', display_order=0, alt_text=prod_name)
                db.session.add(img)
            print(f'Updated image for: {prod_name}')
        else:
            print(f'Product not found: {prod_name}')
    db.session.commit()
print('Done.') 