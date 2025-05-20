<<<<<<< HEAD
from website import create_app, db
from website.models import User, Roles
from werkzeug.security import generate_password_hash

def create_admin_accounts():
    app = create_app()
    with app.app_context():
        # Get role IDs
        admin_role = Roles.query.filter_by(role_name='admin').first()
        staff_role = Roles.query.filter_by(role_name='staff').first()
        supplier_role = Roles.query.filter_by(role_name='supplier').first()

        # Create Admin Account
        admin = User(
            username='admin',
            email='admin@example.com',
            first_name='Admin',
            last_name='User',
            role_id=admin_role.role_id,
            password_hash=generate_password_hash('admin123', method='pbkdf2:sha256')
        )

        # Create Staff Account
        staff = User(
            username='staff',
            email='staff@example.com',
            first_name='Staff',
            last_name='User',
            role_id=staff_role.role_id,
            password_hash=generate_password_hash('staff123', method='pbkdf2:sha256')
        )

        # Create Supplier Account
        supplier = User(
            username='supplier',
            email='supplier@example.com',
            first_name='Supplier',
            last_name='User',
            role_id=supplier_role.role_id,
            password_hash=generate_password_hash('supplier123', method='pbkdf2:sha256')
        )

        db.session.add_all([admin, staff, supplier])
        try:
            db.session.commit()
            print("Successfully created admin, staff, and supplier accounts!")
        except Exception as e:
            db.session.rollback()
            print(f"Error creating accounts: {str(e)}")

if __name__ == '__main__':
    create_admin_accounts()
=======
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
            role='admin',
            password_hash=generate_password_hash('admin123', method='pbkdf2:sha256')
        )
        
        # Create Staff Account
        staff = User(
            username='staff',
            email='staff@example.com',
            first_name='Staff',
            last_name='User',
            role='staff',
            password_hash=generate_password_hash('staff123', method='pbkdf2:sha256')
        )
        
        # Create Supplier Account
        supplier = User(
            username='supplier',
            email='supplier@example.com',
            first_name='Supplier',
            last_name='User',
            role='supplier',
            password_hash=generate_password_hash('supplier123', method='pbkdf2:sha256')
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
>>>>>>> f73beff4590b78755c03bf65d206d8b5ac1a2cad
