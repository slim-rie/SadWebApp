import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product, ProductSpecification, ProductImage, CartItem, OrderItem, Review

app = create_app()

with app.app_context():
    product = Product.query.get(7)
    if product:
        # Delete related cart items, order items, and reviews
        CartItem.query.filter_by(product_id=product.product_id).delete()
        OrderItem.query.filter_by(product_id=product.product_id).delete()
        Review.query.filter_by(product_id=product.product_id).delete()
        # Delete related specifications and images
        ProductSpecification.query.filter_by(product_id=product.product_id).delete()
        ProductImage.query.filter_by(product_id=product.product_id).delete()
        db.session.delete(product)
        db.session.commit()
        print('Product and related data deleted!')
    else:
        print('Product not found!') 