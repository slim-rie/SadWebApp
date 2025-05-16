import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from website import create_app, db
from website.models import Product, ProductImage, ProductSpecification, CartItem, OrderItem, Review, Category

app = create_app()

with app.app_context():
    fabrics_category = Category.query.filter(Category.category_name.ilike('%fabrics%')).first()
    if not fabrics_category:
        print('Fabrics category not found!')
        sys.exit(1)
    fabric_products = Product.query.filter_by(category_id=fabrics_category.category_id).all()
    for product in fabric_products:
        print(f"Deleting: {product.product_id} - {product.product_name}")
        CartItem.query.filter_by(product_id=product.product_id).delete()
        OrderItem.query.filter_by(product_id=product.product_id).delete()
        Review.query.filter_by(product_id=product.product_id).delete()
        ProductSpecification.query.filter_by(product_id=product.product_id).delete()
        ProductImage.query.filter_by(product_id=product.product_id).delete()
        db.session.delete(product)
    db.session.commit()
    print('All fabric products deleted!') 