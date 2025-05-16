import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product, ProductSpecification, Brand, Category, ProductImage

app = create_app()

with app.app_context():
    # Find brand and category
    brand = Brand.query.filter_by(brand_name='Shunfa').first()
    if not brand:
        raise Exception('Brand Shunfa not found!')
    category = Category.query.filter(Category.category_name.ilike('%sewing machine%')).first()
    if not category:
        raise Exception('Sewing Machine category not found!')

    # Check if product already exists
    product = Product.query.filter_by(product_name='SHUNFA SF-781 – Buttonholer Machine').first()
    if product:
        product.product_name = 'SHUNFA SF-781 – Buttonholer Machine'
        db.session.commit()
        print('Product name updated to all caps SHUNFA!')
    else:
        product = Product(
            product_name='SHUNFA SF-781 – Buttonholer Machine',
            model_number='SF-781',
            description='Shunfa SF-781 is an industrial buttonholer ideal for producing precise, consistent buttonholes across light to medium fabrics.',
            category_id=category.category_id,
            brand_id=brand.brand_id,
            base_price=10999.00,  # Same as other Shunfa machines
            stock_quantity=10
        )
        db.session.add(product)
        db.session.commit()
        print('Product added!')

    # Add/Update specifications
    specs = [
        ('Brand', 'Shunfa'),
        ('Model', 'SF-781'),
        ('Type', 'Buttonholer Machine'),
        ('Stitch Type', 'Buttonhole Stitch'),
        ('Needle System', 'DBx1 #11'),
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

    # Set image (fix path to match actual file)
    img = ProductImage.query.filter_by(product_id=product.product_id).first()
    correct_path = '/static/pictures/SHUNFA SF-781 Buttonholer machine.jpg'
    if not img:
        img = ProductImage(product_id=product.product_id, image_url=correct_path, image_type='main', display_order=0, alt_text=product.product_name)
        db.session.add(img)
    else:
        img.image_url = correct_path
        img.alt_text = product.product_name
    db.session.commit()
    print('Image set!') 