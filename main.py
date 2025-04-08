from website import create_app, db
from website.models import User, Product, CartItem
import os
from flask_migrate import Migrate

app = create_app()
migrate = Migrate(app, db)

def init_db():
    products = [
        Product(
            name='Singer Heavy Duty Sewing Machine',
            price=11999.00,
            description='Professional grade sewing machine for heavy fabrics',
            image_url='Singer Heavy Duty Sewing Machine.jpg',
            stock=10,
            category='Machines'
        ),
        Product(
            name='Vintage Singer Sewing Machine',
            price=15999.00,
            description='Classic vintage sewing machine, fully restored',
            image_url='Vingate Singer Sewing Machine.JPG',
            stock=5,
            category='Machines'
        ),
        Product(
            name='Anysew Big Hook',
            price=1299.00,
            description='Large capacity hook for industrial machines',
            image_url='Anysew Big Hook.JPG',
            stock=50,
            category='Parts'
        ),
        Product(
            name='Foot Pedal',
            price=999.00,
            description='Universal foot control pedal for sewing machines',
            image_url='Foot Pedal.jpg',
            stock=30,
            category='Parts'
        ),
        Product(
            name='Chiffon Purple',
            price=199.00,
            description='High-quality purple chiffon fabric per yard',
            image_url='Chiffon Purple.jpg',
            stock=100,
            category='Fabrics'
        ),
        Product(
            name='White Chiffon',
            price=199.00,
            description='Premium white chiffon fabric per yard',
            image_url='White Chiffon.jpg',
            stock=100,
            category='Fabrics'
        ),
        Product(
            name='Buttonhole Attachment',
            price=499.00,
            description='Professional buttonhole maker attachment',
            image_url='Buttonhole.jpg',
            stock=25,
            category='Parts'
        ),
        Product(
            name='Gemsy Presser Foot',
            price=799.00,
            description='Quick adjustable screw device presser foot',
            image_url='Gemsy Presser Foot Quick Adjustable Screw Device Presser Foot.jpg',
            stock=20,
            category='Parts'
        )
    ]
    
    # Add all products
    for product in products:
        existing = Product.query.filter_by(name=product.name).first()
        if not existing:
            db.session.add(product)
    
    try:
        db.session.commit()
        print("Products initialized successfully!")
    except Exception as e:
        db.session.rollback()
        print(f"Error initializing products: {str(e)}")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
        init_db()  # Initialize with sample products
    app.secret_key = os.urandom(24).hex()  # Generate a secure random key
    app.run(debug=True)