import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product, ProductSpecification, Brand, Category, ProductImage

app = create_app()

description = (
    "Locally manufactured Lacoste fabric from Skylab, ideal for polo shirts and casual wear. "
    "Features a textured knit with excellent breathability and stretch.\n\n"
    "For bulk orders, kindly send us a private message for further assistance."
)

specs = [
    ('Brand', 'Skylab'),
    ('Fabric Type', 'Lacoste'),
    ('Composition', 'Cotton or CVC (Cotton-Poly Blend)'),
    ('Texture', 'Piqué knit'),
    ('Use', 'Polo shirts, casual tops'),
    ('Color', 'White / Black / Navy / pwede mag add pa mas maganda'),
    ('Width', '1.2m / 1.5m'),
]

with app.app_context():
    # Get or create brand
    brand = Brand.query.filter_by(brand_name='Skylab').first()
    if not brand:
        brand = Brand(brand_name='Skylab', description='Local fabric manufacturer')
        db.session.add(brand)
        db.session.commit()
    # Get Fabrics category
    category = Category.query.filter(Category.category_name.ilike('%fabrics%')).first()
    if not category:
        print('Fabrics category not found!')
        sys.exit(1)
    # Add product
    product = Product(
        product_name='Skylab – Lacoste Fabric',
        model_number='Lacoste',
        description=description,
        category_id=category.category_id,
        brand_id=brand.brand_id,
        base_price=0.0,  # Set price later
        stock_quantity=100
    )
    db.session.add(product)
    db.session.commit()
    # Add specifications
    for idx, (name, value) in enumerate(specs):
        spec = ProductSpecification(product_id=product.product_id, spec_name=name, spec_value=value, display_order=idx)
        db.session.add(spec)
    db.session.commit()
    print('Skylab – Lacoste Fabric product added!') 