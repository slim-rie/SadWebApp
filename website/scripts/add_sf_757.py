import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product, ProductSpecification, Brand, Category, ProductImage

app = create_app()

with app.app_context():
    brand = Brand.query.filter_by(brand_name='Shunfa').first()
    if not brand:
        raise Exception('Brand Shunfa not found!')
    category = Category.query.filter(Category.category_name.ilike('%sewing machine%')).first()
    if not category:
        raise Exception('Sewing Machine category not found!')

    product = Product.query.filter_by(product_name='SHUNFA SF-757 – 5-Thread Overlock Machine').first()
    if product:
        product.product_name = 'SHUNFA SF-757 – 5-Thread Overlock Machine'
        db.session.commit()
        print('Product name updated!')
    else:
        product = Product(
            product_name='SHUNFA SF-757 – 5-Thread Overlock Machine',
            model_number='SF-757',
            description='Shunfa SF-757 combines overlock and safety stitching in one operation, ideal for trousers, jeans, and heavy-duty garments.',
            category_id=category.category_id,
            brand_id=brand.brand_id,
            base_price=10999.00,
            stock_quantity=10
        )
        db.session.add(product)
        db.session.commit()
        print('Product added!')

    specs = [
        ('Brand', 'Shunfa'),
        ('Model', 'SF-757'),
        ('Type', '5-Thread Overlock Machine'),
        ('Threads', '5-thread'),
        ('Stitch Length', 'Up to 4mm'),
        ('Overedge Width', '1.5–6mm'),
        ('Motor', '550W'),
    ]
    for idx, (name, value) in enumerate(specs):
        spec = ProductSpecification.query.filter_by(product_id=product.product_id, spec_name=name).first()
        if not spec:
            spec = ProductSpecification(product_id=product.product_id, spec_name=name, spec_value=value, display_order=idx)
            db.session.add(spec)
        else:
            spec.spec_value = value
            spec.display_order = idx
    db.session.commit()
    print('Specifications added/updated!')

    img = ProductImage.query.filter_by(product_id=product.product_id).first()
    correct_path = '/static/pictures/SHUNFA SF-757 – 5-Thread Overlock Machine.jpg'
    if not img:
        img = ProductImage(product_id=product.product_id, image_url=correct_path, image_type='main', display_order=0, alt_text=product.product_name)
        db.session.add(img)
    else:
        img.image_url = correct_path
        img.alt_text = product.product_name
    db.session.commit()
    print('Image set!') 