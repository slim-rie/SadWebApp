import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from website import create_app, db
from website.models import Product

app = create_app()

components = [
    "Bobbin Case",
    "Bobbin",
    "Positioning Finger",
    "Rotating Hook",
    "Presser Foot",
    "Clutch Motor for Sewing Machine",
    "Servo Motor for Sewing Machine",
    "Table and Stand for Industrial Sewing Machine"
]

needles = [
    "Universal Needles",
    "Ballpoint Needles",
    "Jeans Needles",
    "Microtex Needles"
]

with app.app_context():
    updated = 0
    for name in components:
        product = Product.query.filter_by(product_name=name).first()
        if product:
            product.subcategory = "SewingMachineComponents"
            updated += 1
            print(f"Updated {name} to SewingMachineComponents")
        else:
            print(f"Product not found: {name}")

    for name in needles:
        product = Product.query.filter_by(product_name=name).first()
        if product:
            product.subcategory = "SewingMachineNeedles"
            updated += 1
            print(f"Updated {name} to SewingMachineNeedles")
        else:
            print(f"Product not found: {name}")

    db.session.commit()
    print(f"Subcategory update complete. {updated} products updated.") 