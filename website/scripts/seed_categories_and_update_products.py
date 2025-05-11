from website import create_app, db
from website.models import Category, Product

app = create_app()

with app.app_context():
    # 1. Add categories if they don't exist
    categories = [
        Category(name="Sewing Machines", description="All types of sewing machines"),
        Category(name="Sewing Parts", description="Parts and accessories for sewing machines"),
        Category(name="Fabrics", description="Various types of fabrics"),
    ]
    for cat in categories:
        if not Category.query.filter_by(name=cat.name).first():
            db.session.add(cat)
    db.session.commit()

    # 2. Map old category names to new category IDs
    category_map = {cat.name: cat.id for cat in Category.query.all()}

    # 3. Update existing products to use category_id
    for product in Product.query.all():
        # If the old category string exists and matches a new category
        if hasattr(product, 'category') and product.category in category_map:
            product.category_id = category_map[product.category]
    db.session.commit()

    print("Categories seeded and products updated.") 