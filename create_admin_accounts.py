from website import create_app, db
from website.models import User
from werkzeug.security import generate_password_hash

def create_admin_accounts():
    app = create_app()
    
    with app.app_context():
        # Create Admin Account
        admin = User(
            username='admin',
            email='admin@example.com',
            first_name='Admin',
            last_name='User',
            address='123 Admin St',
            role='admin',
            _password=generate_password_hash('admin123', method='pbkdf2:sha256')
        )
        
        # Create Staff Account
        staff = User(
            username='staff',
            email='staff@example.com',
            first_name='Staff',
            last_name='User',
            address='456 Staff St',
            role='staff',
            _password=generate_password_hash('staff123', method='pbkdf2:sha256')
        )
        
        # Create Supplier Account
        supplier = User(
            username='supplier',
            email='supplier@example.com',
            first_name='Supplier',
            last_name='User',
            address='789 Supplier St',
            role='supplier',
            _password=generate_password_hash('supplier123', method='pbkdf2:sha256')
        )
        
        # Add all users to the session
        db.session.add(admin)
        db.session.add(staff)
        db.session.add(supplier)
        
        try:
            db.session.commit()
            print("Successfully created admin, staff, and supplier accounts!")
            print("\nLogin credentials:")
            print("Admin - Username: admin, Password: admin123")
            print("Staff - Username: staff, Password: staff123")
            print("Supplier - Username: supplier, Password: supplier123")
        except Exception as e:
            db.session.rollback()
            print(f"Error creating accounts: {str(e)}")

if __name__ == '__main__':
    create_admin_accounts() 