from website import create_app, db
from website.models import Category, Product

app = create_app()

with app.app_context():
    # 1. Add categories if they don't exist
    categories = [
        Category(category_name="Sewing Machines"),
        Category(category_name="Sewing Parts"),
        Category(category_name="Fabrics"),
    ]
    for cat in categories:
        if not Category.query.filter_by(category_name=cat.category_name).first():
            db.session.add(cat)
    db.session.commit()

    # 2. Map old category names to new category IDs
    category_map = {cat.category_name: cat.category_id for cat in Category.query.all()}

    # 3. Update existing products to use category_id
    for product in Product.query.all():
        # If the old category string exists and matches a new category
        if hasattr(product, 'category') and product.category in category_map:
            product.category_id = category_map[product.category]
    db.session.commit()

    print("Categories seeded and products updated.") 