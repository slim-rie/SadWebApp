import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product, ProductSpecification, Brand, Category, ProductImage

app = create_app()

with app.app_context():
    # Helper to get or create brand
    def get_or_create_brand(name, desc=None):
        brand = Brand.query.filter_by(brand_name=name).first()
        if not brand:
            brand = Brand(brand_name=name, description=desc or name)
            db.session.add(brand)
            db.session.commit()
        return brand

    # Helper to get or create category
    def get_or_create_category(name):
        category = Category.query.filter(Category.category_name.ilike(f'%{name}%')).first()
        if not category:
            category = Category(category_name=name)
            db.session.add(category)
            db.session.commit()
        return category

    # Helper to match any word in product name to any file in /static/pictures/
    def find_image(product_name):
        static_dir = os.path.join(os.path.dirname(__file__), '../static/pictures')
        static_dir = os.path.abspath(static_dir)
        files = os.listdir(static_dir)
        words = [w.lower() for w in product_name.replace('–', ' ').replace('-', ' ').split()]
        for fname in files:
            lower_fname = fname.lower()
            for word in words:
                if word in lower_fname:
                    print(f"[DEBUG] Matched '{word}' in '{fname}' for product '{product_name}'")
                    return f"/static/pictures/{fname}"
        print(f"[DEBUG] No match for '{product_name}', using default grey image.")
        return "/static/pictures/Skylab – Lacoste Fabric.jpg"

    # List of products to add
    products = [
        {
            'name': 'Skylab – TR Lacoste Fabric',
            'desc': 'TR Lacoste fabric blends polyester and rayon, offering a durable and wrinkle-resistant material with a soft feel, commonly used for uniforms and corporate wear. For bulk orders, kindly send us a private message for further assistance.',
            'brand': 'Skylab',
            'fabric_type': 'TR Lacoste',
            'composition': 'Polyester + Rayon',
            'texture': 'Piqué knit',
            'use': 'Uniforms, casual wear',
            'choices': {'Color': ['Red', 'Navy'], 'Width': ['1.2m', '1.5m']},
            'price': 599.00,
            'category': 'Fabrics',
        },
        {
            'name': 'Quitalig – China Cotton 135 GSM',
            'desc': 'Lightweight 100% cotton fabric suitable for warm climates, shirts, linings, or layering. For bulk orders, kindly send us a private message for further assistance.',
            'brand': 'Quitalig',
            'fabric_type': 'Cotton',
            'gsm': '135',
            'composition': '100% Cotton',
            'use': 'Shirts, linings',
            'choices': {'Color': ['Blue', 'Red', 'Black'], 'Width': ['1.2m', '1.5m']},
            'price': 499.00,
            'category': 'Fabrics',
        },
        {
            'name': 'Quitalig – China Cotton 165 GSM',
            'desc': 'Midweight cotton fabric ideal for general garments like t-shirts, dresses, and uniforms. For bulk orders, kindly send us a private message for further assistance.',
            'brand': 'Quitalig',
            'fabric_type': 'Cotton',
            'gsm': '165',
            'composition': '100% Cotton',
            'use': 'T-shirts, uniforms',
            'choices': {'Color': ['Gray', 'Black', 'White'], 'Width': ['1.2m', '1.5m']},
            'price': 499.00,
            'category': 'Fabrics',
        },
        {
            'name': 'Quitalig – China Cotton 185 GSM',
            'desc': 'Heavier cotton fabric for durable garments like workwear or outerwear with a soft, breathable feel. For bulk orders, kindly send us a private message for further assistance.',
            'brand': 'Quitalig',
            'fabric_type': 'Cotton',
            'gsm': '185',
            'composition': '100% Cotton',
            'use': 'Polo shirts, jackets',
            'choices': {'Color': ['Red', 'Blue', 'White'], 'Width': ['1.2m', '1.5m']},
            'price': 499.00,
            'category': 'Fabrics',
        },
        {
            'name': 'Quitalig – China Cotton 200 GSM',
            'desc': 'High-density cotton for structured clothing and durable garments. Excellent for embroidery. For bulk orders, kindly send us a private message for further assistance.',
            'brand': 'Quitalig',
            'fabric_type': 'Cotton',
            'gsm': '200',
            'composition': '100% Cotton',
            'use': 'Workwear, embroidery',
            'choices': {'Color': ['Black', 'Navy', 'White'], 'Width': ['1.2m', '1.5m']},
            'price': 499.00,
            'category': 'Fabrics',
        },
        {
            'name': 'Skylab – TC Fabric',
            'desc': 'TC (Tetron Cotton) fabric combines polyester with cotton for strength, easy care, and wrinkle resistance. Common in uniforms and casual apparel. For bulk orders, kindly send us a private message for further assistance.',
            'brand': 'Skylab',
            'fabric_type': 'TC (Tetron Cotton)',
            'composition': '65% Polyester, 35% Cotton',
            'gsm': 'Approx. 150–180',
            'use': 'Uniforms, shirts',
            'choices': {'Color': ['Red', 'Blue', 'Gray'], 'Width': ['1.2m', '1.5m']},
            'price': 599.00,
            'category': 'Fabrics',
        },
        {
            'name': 'Skylab – CVC Cotton Fabric',
            'desc': 'CVC (Chief Value Cotton) fabric has higher cotton content for comfort with added durability and lower shrinkage, perfect for everyday garments. For bulk orders, kindly send us a private message for further assistance.',
            'brand': 'Skylab',
            'fabric_type': 'CVC',
            'composition': '60% Cotton, 40% Polyester',
            'gsm': 'Approx. 160–200',
            'use': 'T-shirts, uniforms',
            'choices': {'Color': ['Red', 'Blue', 'Gray'], 'Width': ['1.2m', '1.5m']},
            'price': 599.00,
            'category': 'Fabrics',
        },
        {
            'name': 'Skylab – Ribbings for Neckline',
            'desc': 'Stretchable ribbing fabric used in collars, cuffs, and hems to enhance flexibility and fit. For bulk orders, kindly send us a private message for further assistance.',
            'brand': 'Skylab',
            'fabric_type': 'Ribbing',
            'composition': 'Cotton + Spandex blend',
            'use': 'Necklines, cuffs, hems',
            'choices': {'Color': ['Black', 'White', 'Navy'], 'Width': ['1.0m', '1.5m']},
            'price': 599.00,
            'category': 'Fabrics',
        },
        {
            'name': 'Charmeuse Silk',
            'desc': 'Charmeuse is a luxurious silk fabric known for its high-gloss finish and smooth texture. It is lightweight and drapes beautifully, making it ideal for elegant evening wear, lingerie, and scarves. For bulk orders, kindly send us a private message for further assistance.',
            'brand': None,
            'fabric_type': 'Charmeuse Silk',
            'composition': '100% Mulberry Silk',
            'weight': '85 GSM',
            'width': '44 inches',
            'use': 'Evening wear, lingerie, scarves',
            'choices': {'Silk Type': ['Pure Charmeuse Silk', 'Charmeuse Silk Blend'], 'Color': ['Ivory', 'Champagne', 'Black'], 'Width': ['0.9m', '1.5m']},
            'price': 1499.00,
            'category': 'Silk Fabric',
        },
        {
            'name': 'Chiffon Silk',
            'desc': 'Chiffon silk is a lightweight, sheer fabric with a soft, flowing drape. It is often used in layering garments such as dresses, blouses, and scarves, providing an airy and romantic aesthetic. For bulk orders, kindly send us a private message for further assistance.',
            'brand': None,
            'fabric_type': 'Chiffon Silk',
            'composition': '100% Mulberry Silk',
            'weight': '29–34 GSM',
            'width': '44–54 inches',
            'use': 'Dresses, blouses, scarves',
            'choices': {'Silk Type': ['Pure Charmeuse Silk', 'Charmeuse Silk Blend'], 'Color': ['Ivory', 'Champagne', 'Black'], 'Width': ['0.9m', '1.5m']},
            'price': 1499.00,
            'category': 'Silk Fabric',
        },
        {
            'name': 'Crepe de Chine Silk',
            'desc': 'Crepe de Chine is a lightweight silk fabric with a soft, crinkled texture. It offers a subtle sheen and is commonly used for blouses, dresses, and scarves, providing an elegant and refined appearance. For bulk orders, kindly send us a private message for further assistance.',
            'brand': None,
            'fabric_type': 'Crepe de Chine Silk',
            'composition': '100% Mulberry Silk',
            'weight': '45–60 GSM',
            'width': '44 inches',
            'use': 'Blouses, dresses, scarves',
            'choices': {'Silk Type': ['Pure Crepe de Chine Silk', 'Crepe de Chine Silk Blend'], 'Color': ['Champagne', 'Black', 'Navy'], 'Width': ['0.9m', '1.5m']},
            'price': 1499.00,
            'category': 'Silk Fabric',
        },
    ]

    for prod in products:
        brand = get_or_create_brand(prod['brand']) if prod['brand'] else None
        category = get_or_create_category(prod['category'])
        product = Product.query.filter_by(product_name=prod['name']).first()
        if not product:
            product = Product(
                product_name=prod['name'],
                model_number=prod.get('fabric_type', prod['name']),
                description=prod['desc'],
                category_id=category.category_id,
                brand_id=brand.brand_id if brand else None,
                base_price=prod['price'],
                stock_quantity=100
            )
            db.session.add(product)
            db.session.commit()
        else:
            product.description = prod['desc']
            product.base_price = prod['price']
            db.session.commit()
        # Add/Update specifications
        specs = [
            ('Brand', prod['brand']) if prod['brand'] else None,
            ('Fabric Type', prod.get('fabric_type')),
            ('Composition', prod.get('composition')),
            ('Texture', prod.get('texture')) if prod.get('texture') else None,
            ('GSM', prod.get('gsm')) if prod.get('gsm') else None,
            ('Weight', prod.get('weight')) if prod.get('weight') else None,
            ('Width', prod.get('width')) if prod.get('width') else None,
            ('Use', prod.get('use')),
        ]
        # Add choices as specs
        for choice_name, options in prod['choices'].items():
            specs.append((choice_name + ' Options', ', '.join(options)))
        for idx, spec in enumerate([s for s in specs if s]):
            spec_obj = ProductSpecification.query.filter_by(product_id=product.product_id, spec_name=spec[0]).first()
            if not spec_obj:
                spec_obj = ProductSpecification(product_id=product.product_id, spec_name=spec[0], spec_value=spec[1], display_order=idx)
                db.session.add(spec_obj)
            else:
                spec_obj.spec_value = spec[1]
                spec_obj.display_order = idx
        db.session.commit()
        # Add/Update product image
        image_url = find_image(prod['name'])
        img = ProductImage.query.filter_by(product_id=product.product_id).first()
        if not img:
            img = ProductImage(product_id=product.product_id, image_url=image_url, image_type='main', display_order=0, alt_text=product.product_name)
            db.session.add(img)
        else:
            img.image_url = image_url
            img.alt_text = product.product_name
        db.session.commit()
        print(f"Added/updated product: {prod['name']} with image: {image_url}") 