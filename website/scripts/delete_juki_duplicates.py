import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product, ProductSpecification, ProductImage, CartItem, OrderItem, Review

app = create_app()

with app.app_context():
    # List of correct Juki product names
    correct_names = [
        'Juki DDL-8100E – Single Needle High-Speed Lockstitch Machine',
        'Juki MO-6700DA Series – Semi-Dry Head Overlock Machine',
        'Juki W562-02BB – Piping Machine',
        'Juki LU-1508N – Walking Foot Lockstitch Machine',
        'Juki LK-1900S – Computer-Controlled Bartacking Machine',
    ]
    # Find all Juki products not in the correct list
    juki_products = Product.query.filter(Product.product_name.ilike('%juki%')).all()
    for product in juki_products:
        if product.product_name not in correct_names:
            print(f"Deleting duplicate or old Juki product: {product.product_id} - {product.product_name}")
            CartItem.query.filter_by(product_id=product.product_id).delete()
            OrderItem.query.filter_by(product_id=product.product_id).delete()
            Review.query.filter_by(product_id=product.product_id).delete()
            ProductSpecification.query.filter_by(product_id=product.product_id).delete()
            ProductImage.query.filter_by(product_id=product.product_id).delete()
            db.session.delete(product)
    db.session.commit()
    print('Duplicate Juki products deleted!') 