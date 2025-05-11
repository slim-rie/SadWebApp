from website import create_app, db
from website.models import Category, Product

app = create_app()

with app.app_context():
    # Get categories
    sewing_machines = Category.query.filter_by(name="Sewing Machines").first()
    sewing_parts = Category.query.filter_by(name="Sewing Parts").first()
    fabrics = Category.query.filter_by(name="Fabrics").first()

    # Example products
    products = [
        Product(name="Brother CS6000i", description="Computerized sewing machine with 60 built-in stitches.", price=14599, stock=10, category_id=sewing_machines.id, image_url="https://example.com/brother_cs6000i.jpg"),
        Product(name="Janome 2212", description="Mechanical sewing machine with 12 built-in stitches.", price=10999, stock=8, category_id=sewing_machines.id, image_url="https://example.com/janome_2212.jpg"),
        Product(name="Universal Needle Set", description="Set of 10 universal sewing machine needles.", price=299, stock=50, category_id=sewing_parts.id, image_url="https://example.com/needle_set.jpg"),
        Product(name="Bobbin Pack", description="Pack of 20 plastic bobbins for most machines.", price=199, stock=40, category_id=sewing_parts.id, image_url="https://example.com/bobbin_pack.jpg"),
        Product(name="Cotton Fabric - Blue", description="1 yard of blue cotton fabric.", price=150, stock=100, category_id=fabrics.id, image_url="https://example.com/cotton_blue.jpg"),
        Product(name="Silk Fabric - Red", description="1 yard of red silk fabric.", price=350, stock=30, category_id=fabrics.id, image_url="https://example.com/silk_red.jpg"),
    ]

    for prod in products:
        if not Product.query.filter_by(name=prod.name).first():
            db.session.add(prod)
    db.session.commit()
    print("Example products seeded.") 