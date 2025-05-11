from website import create_app, db
from website.models import Category, Product

app = create_app()

with app.app_context():
    # First delete all products
    Product.query.delete()
    db.session.commit()

    # Then delete subcategories (those with parent_category_id)
    Category.query.filter(Category.parent_category_id.isnot(None)).delete()
    db.session.commit()

    # Then delete main categories
    Category.query.filter(Category.parent_category_id.is_(None)).delete()
    db.session.commit()

    # Create main categories
    sewing_machines = Category(category_id=1, category_name="Sewing Machines")
    sewing_parts = Category(category_id=2, category_name="Sewing Parts")
    fabrics = Category(category_id=3, category_name="Fabrics")

    # Add main categories to session
    db.session.add_all([sewing_machines, sewing_parts, fabrics])
    db.session.commit()

    # Create subcategories for Sewing Machines
    shunfa_machines = Category(category_id=4, category_name="Shunfa Industrial Sewing Machines", parent_category_id=1)
    juki_machines = Category(category_id=5, category_name="Juki Sewing Machines", parent_category_id=1)

    # Add subcategories to session
    db.session.add_all([shunfa_machines, juki_machines])

    # Commit all changes
    db.session.commit()
    print("Categories seeded successfully!") 