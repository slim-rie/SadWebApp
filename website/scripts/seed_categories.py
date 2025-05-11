from website import create_app, db
from website.models import Category

app = create_app()

with app.app_context():
    # Get or create main categories
    sewing_machines = Category.query.filter_by(category_name="Sewing Machines").first() or Category(category_name="Sewing Machines")
    sewing_parts = Category.query.filter_by(category_name="Sewing Parts").first() or Category(category_name="Sewing Parts")
    fabrics = Category.query.filter_by(category_name="Fabrics").first() or Category(category_name="Fabrics")
    accessories = Category.query.filter_by(category_name="Accessories").first() or Category(category_name="Accessories")
    notions = Category.query.filter_by(category_name="Notions").first() or Category(category_name="Notions")

    # Add main categories to session if they're new
    for cat in [sewing_machines, sewing_parts, fabrics, accessories, notions]:
        if not cat.category_id:
            db.session.add(cat)
    db.session.commit()

    # Function to get or create subcategory
    def get_or_create_subcategory(name, parent_id):
        return Category.query.filter_by(category_name=name, parent_category_id=parent_id).first() or \
               Category(category_name=name, parent_category_id=parent_id)

    # Create subcategories for Sewing Machines
    industrial_machines = get_or_create_subcategory("Industrial Machines", sewing_machines.category_id)
    home_machines = get_or_create_subcategory("Home Machines", sewing_machines.category_id)
    embroidery_machines = get_or_create_subcategory("Embroidery Machines", sewing_machines.category_id)
    sergers = get_or_create_subcategory("Sergers", sewing_machines.category_id)

    # Create subcategories for Sewing Parts
    needles = get_or_create_subcategory("Needles", sewing_parts.category_id)
    bobbins = get_or_create_subcategory("Bobbins", sewing_parts.category_id)
    presser_feet = get_or_create_subcategory("Presser Feet", sewing_parts.category_id)
    machine_parts = get_or_create_subcategory("Machine Parts", sewing_parts.category_id)

    # Create subcategories for Fabrics
    cotton = get_or_create_subcategory("Cotton", fabrics.category_id)
    polyester = get_or_create_subcategory("Polyester", fabrics.category_id)
    silk = get_or_create_subcategory("Silk", fabrics.category_id)
    wool = get_or_create_subcategory("Wool", fabrics.category_id)
    knit = get_or_create_subcategory("Knit", fabrics.category_id)
    woven = get_or_create_subcategory("Woven", fabrics.category_id)

    # Create subcategories for Accessories
    scissors = get_or_create_subcategory("Scissors", accessories.category_id)
    rulers = get_or_create_subcategory("Rulers", accessories.category_id)
    cutting_tools = get_or_create_subcategory("Cutting Tools", accessories.category_id)
    storage = get_or_create_subcategory("Storage", accessories.category_id)

    # Create subcategories for Notions
    thread = get_or_create_subcategory("Thread", notions.category_id)
    zippers = get_or_create_subcategory("Zippers", notions.category_id)
    buttons = get_or_create_subcategory("Buttons", notions.category_id)
    elastic = get_or_create_subcategory("Elastic", notions.category_id)
    interfacing = get_or_create_subcategory("Interfacing", notions.category_id)

    # Add all subcategories to session if they're new
    subcategories = [
        # Sewing Machines subcategories
        industrial_machines, home_machines, embroidery_machines, sergers,
        # Sewing Parts subcategories
        needles, bobbins, presser_feet, machine_parts,
        # Fabrics subcategories
        cotton, polyester, silk, wool, knit, woven,
        # Accessories subcategories
        scissors, rulers, cutting_tools, storage,
        # Notions subcategories
        thread, zippers, buttons, elastic, interfacing
    ]

    for subcat in subcategories:
        if not subcat.category_id:
            db.session.add(subcat)

    # Commit all changes
    db.session.commit()
    print("Categories seeded successfully!") 