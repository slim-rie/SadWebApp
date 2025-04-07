from website import create_app, db
from website.models import Product

app = create_app()

def add_sample_products():
    with app.app_context():
        # Clear existing products
        Product.query.delete()
        
        # Sample products
        products = [
            {
                'name': 'Chiffon Purple',
                'description': 'High-quality purple chiffon fabric',
                'price': 199.99,
                'image_url': '/static/pictures/Chiffon Purple.jpg',
                'category': 'Fabric',
                'stock': 50
            },
            {
                'name': 'Plain Chiffon Fabric',
                'description': 'Versatile plain chiffon fabric',
                'price': 149.99,
                'image_url': '/static/pictures/plain-chiffon-fabric.jpg',
                'category': 'Fabric',
                'stock': 100
            },
            {
                'name': 'White Chiffon',
                'description': 'Elegant white chiffon fabric',
                'price': 179.99,
                'image_url': '/static/pictures/White Chiffon.jpg',
                'category': 'Fabric',
                'stock': 75
            },
            {
                'name': 'Foot Pedal',
                'description': 'Universal sewing machine foot pedal',
                'price': 599.99,
                'image_url': '/static/pictures/Foot Pedal.jpg',
                'category': 'Sewing Parts',
                'stock': 20
            },
            {
                'name': 'Gemsy Presser Foot',
                'description': 'Quick adjustable screw device presser foot',
                'price': 299.99,
                'image_url': '/static/pictures/Gemsy Presser Foot Quick Adjustable Screw Device Presser Foot.jpg',
                'category': 'Sewing Parts',
                'stock': 30
            },
            {
                'name': 'Balance Wheel',
                'description': 'Sewing machine balance wheel',
                'price': 249.99,
                'image_url': '/static/pictures/sewing-machine-balance-wheel.jpg',
                'category': 'Sewing Parts',
                'stock': 40
            },
            {
                'name': 'Shuttle Hook',
                'description': 'High-quality shuttle hook',
                'price': 199.99,
                'image_url': '/static/pictures/shuttle hook.jpg',
                'category': 'Sewing Parts',
                'stock': 60
            },
            {
                'name': 'Anysew Big Hook',
                'description': 'Large capacity Anysew hook',
                'price': 349.99,
                'image_url': '/static/pictures/Anysew Big Hook.jpg',
                'category': 'Sewing Parts',
                'stock': 25
            },
            {
                'name': 'Singer Heavy Duty',
                'description': 'Singer heavy duty sewing machine',
                'price': 12999.99,
                'image_url': '/static/pictures/Singer Heavy Duty Sewing Machine.jpg',
                'category': 'Sewing Machines',
                'stock': 10
            },
            {
                'name': 'Vintage Singer',
                'description': 'Classic vintage Singer sewing machine',
                'price': 15999.99,
                'image_url': '/static/pictures/Vingate Singer Sewing Machine.jpg',
                'category': 'Sewing Machines',
                'stock': 5
            }
        ]
        
        # Add products to database
        for product_data in products:
            product = Product(**product_data)
            db.session.add(product)
        
        db.session.commit()
        print("Sample products added successfully!")

if __name__ == '__main__':
    add_sample_products()
