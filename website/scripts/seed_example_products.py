import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from website import create_app, db
from website.models import Category, Product

app = create_app()

with app.app_context():
    # Get categories
    sewing_machines = Category.query.filter_by(category_name="Sewing Machines").first()
    sewing_parts = Category.query.filter_by(category_name="Sewing Parts").first()
    fabrics = Category.query.filter_by(category_name="Fabrics").first()

    # Example products
    products = [
        Product(product_name="Brother CS6000i", model_number="CS6000i", description="Computerized sewing machine with 60 built-in stitches.", base_price=14599, stock_quantity=10, category_id=sewing_machines.category_id),
        Product(product_name="Janome 2212", model_number="2212", description="Mechanical sewing machine with 12 built-in stitches.", base_price=10999, stock_quantity=8, category_id=sewing_machines.category_id),
        Product(product_name="Universal Needle Set", model_number="UNS-10", description="Set of 10 universal sewing machine needles.", base_price=299, stock_quantity=50, category_id=sewing_parts.category_id),
        Product(product_name="Bobbin Pack", model_number="BP-20", description="Pack of 20 plastic bobbins for most machines.", base_price=199, stock_quantity=40, category_id=sewing_parts.category_id),
        Product(product_name="Cotton Fabric - Blue", model_number="CF-BLUE", description="1 yard of blue cotton fabric.", base_price=150, stock_quantity=100, category_id=fabrics.category_id),
        Product(product_name="Silk Fabric - Red", model_number="SF-RED", description="1 yard of red silk fabric.", base_price=350, stock_quantity=30, category_id=fabrics.category_id),
    ]

    for prod in products:
        if not Product.query.filter_by(product_name=prod.product_name).first():
            db.session.add(prod)
    db.session.commit()
    print("Example products seeded.") 