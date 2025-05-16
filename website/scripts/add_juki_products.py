import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product, ProductSpecification, Brand, Category, ProductImage

app = create_app()

with app.app_context():
    brand = Brand.query.filter_by(brand_name='Juki').first()
    if not brand:
        brand = Brand(brand_name='Juki', description='Juki industrial sewing machines')
        db.session.add(brand)
        db.session.commit()
    category = Category.query.filter(Category.category_name.ilike('%sewing machine%')).first()
    if not category:
        raise Exception('Sewing Machine category not found!')

    products = [
        {
            'name': 'Juki DDL-8100E – Single Needle High-Speed Lockstitch Machine',
            'model': 'DDL-8100E',
            'desc': 'The Juki DDL-8100E is a high-speed, single-needle lockstitch sewing machine designed for industrial applications. It offers precise stitching and is suitable for light to medium-weight fabrics.',
            'base_price': 10898.00,
            'stock_quantity': 10,
            'specs': [
                ('Brand', 'Juki'),
                ('Model', 'DDL-8100E'),
                ('Type', 'Single Needle High-Speed Lockstitch'),
                ('Speed', '4,500 stitches per minute'),
                ('Stitch Length', 'Up to 5mm'),
                ('Needle System', 'DB×1 #9–#18'),
                ('Motor', 'Servo motor'),
                ('Weight', '26kg'),
            ],
            'image': '/static/pictures/Juki DDL-8100E – Single Needle High-Speed Lockstitch Machine.jpg',
        },
        {
            'name': 'Juki MO-6700DA Series – Semi-Dry Head Overlock Machine',
            'model': 'MO-6700DA Series',
            'desc': 'The Juki MO-6700DA Series is a high-speed overlock machine featuring semi-dry head technology, which reduces oil stains on sewing products. It is suitable for various fabrics and offers enhanced durability.',
            'base_price': 8998.00,
            'stock_quantity': 10,
            'specs': [
                ('Brand', 'Juki'),
                ('Model', 'MO-6700DA Series'),
                ('Type', 'Overlock / Safety Stitch'),
                ('Speed', '7,000 stitches per minute'),
                ('Stitch Length', '0.8–4mm'),
                ('Needle System', 'DC×27'),
                ('Differential Feed Ratio', 'Gathering 1:2 (max. 1:4), Stretching 1:0.7 (max. 1:0.6)'),
                ('Overedging Width', '1.6, 3.2, 4.0, 4.8mm'),
                ('Weight', '28kg'),
            ],
            'image': '/static/pictures/Juki MO-6700DA Series – Semi-Dry Head Overlock Machine.jpg',
        },
        {
            'name': 'Juki W562-02BB – Piping Machine',
            'model': 'W562-02BB',
            'desc': 'The Juki W562-02BB is a specialized piping machine designed for sewing piping into seams, commonly used in garment manufacturing for decorative or functional purposes.',
            'base_price': 10998.00,
            'stock_quantity': 10,
            'specs': [
                ('Brand', 'Juki'),
                ('Model', 'W562-02BB'),
                ('Type', 'Piping Machine'),
                ('Threads', '4-thread'),
                ('Stitch Length', 'Up to 4mm'),
                ('Overedge Width', '1.5–6mm'),
                ('Motor', '550W'),
            ],
            'image': '/static/pictures/Juki W562-02BB – Piping Machine.jpg',
        },
        {
            'name': 'Juki LU-1508N – Walking Foot Lockstitch Machine',
            'model': 'LU-1508N',
            'desc': 'The Juki LU-1508N is a walking foot lockstitch sewing machine designed for heavy-duty applications, providing consistent stitching on thick and multi-layered materials.',
            'base_price': 12998.00,
            'stock_quantity': 10,
            'specs': [
                ('Brand', 'Juki'),
                ('Model', 'LU-1508N'),
                ('Type', 'Walking Foot Lockstitch'),
                ('Speed', '2,000 stitches per minute'),
                ('Stitch Length', 'Up to 9mm'),
                ('Needle System', 'DP×17 #22–#27'),
                ('Motor', 'Servo motor'),
                ('Weight', '70kg'),
            ],
            'image': '/static/pictures/Juki LU-1508N – Walking Foot Lockstitch Machine.jpg',
        },
        {
            'name': 'Juki LK-1900S – Computer-Controlled Bartacking Machine',
            'model': 'LK-1900S',
            'desc': 'The Juki LK-1900S is a computer-controlled bartacking machine designed for high-speed and high-quality bartack stitching, suitable for various garment applications.',
            'base_price': 11998.00,
            'stock_quantity': 10,
            'specs': [
                ('Brand', 'Juki'),
                ('Model', 'LK-1900S'),
                ('Type', 'Computer-Controlled Bartacking'),
                ('Speed', '3,200 stitches per minute'),
                ('Stitch Length', '0.1–10mm'),
                ('Needle System', 'DP×5 (#14)'),
                ('Motor', 'Compact AC servo motor'),
                ('Weight', '47.1kg'),
            ],
            'image': '/static/pictures/Juki LK-1900S – Computer-Controlled Bartacking Machine.jpg',
        },
    ]

    for prod in products:
        product = Product.query.filter_by(product_name=prod['name']).first()
        if product:
            product.product_name = prod['name']
            product.model_number = prod['model']
            product.description = prod['desc']
            product.category_id = category.category_id
            product.brand_id = brand.brand_id
            product.base_price = prod['base_price']
            product.stock_quantity = prod['stock_quantity']
            db.session.commit()
            print(f"Product {prod['name']} updated!")
        else:
            product = Product(
                product_name=prod['name'],
                model_number=prod['model'],
                description=prod['desc'],
                category_id=category.category_id,
                brand_id=brand.brand_id,
                base_price=prod['base_price'],
                stock_quantity=prod['stock_quantity']
            )
            db.session.add(product)
            db.session.commit()
            print(f"Product {prod['name']} added!")

        for idx, (name, value) in enumerate(prod['specs']):
            spec = ProductSpecification.query.filter_by(product_id=product.product_id, spec_name=name).first()
            if not spec:
                spec = ProductSpecification(product_id=product.product_id, spec_name=name, spec_value=value, display_order=idx)
                db.session.add(spec)
            else:
                spec.spec_value = value
                spec.display_order = idx
        db.session.commit()
        print(f"Specifications for {prod['name']} added/updated!")

        img = ProductImage.query.filter_by(product_id=product.product_id).first()
        if not img:
            img = ProductImage(product_id=product.product_id, image_url=prod['image'], image_type='main', display_order=0, alt_text=product.product_name)
            db.session.add(img)
        else:
            img.image_url = prod['image']
            img.alt_text = product.product_name
        db.session.commit()
        print(f"Image for {prod['name']} set!") 