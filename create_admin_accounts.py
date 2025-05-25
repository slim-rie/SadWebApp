from flask import Flask
# tanggalin nyo nalang yung comment then comment nyo yung line 3 import, from SadWebApp.website.config import Config
from website.config import Config
from werkzeug.security import generate_password_hash
from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    first_name = db.Column(db.String(20), nullable=False)
    last_name = db.Column(db.String(20), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.role_id'), nullable=False)
    password_hash = db.Column(db.String(60), nullable=False)
    is_active = db.Column(db.Boolean, default=True)  # Add this column to match main User model

    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.first_name}', '{self.last_name}', '{self.role}')"

def create_admin_accounts():
    # Passwords will be hashed using generate_password_hash before saving to the database
    accounts = [
        {
            'username': 'admin',
            'email': 'admin@example.com',
            'first_name': 'Admin',
            'last_name': 'User',
            'role_id': 1,
            'password': 'admin123'
        },
        {
            'username': 'staff',
            'email': 'staff@example.com',
            'first_name': 'Staff',
            'last_name': 'User',
            'role_id': 2,
            'password': 'staff123'
        },
        {
            'username': 'supplier',
            'email': 'supplier@example.com',
            'first_name': 'Supplier',
            'last_name': 'User',
            'role_id': 3,
            'password': 'supplier123'
        },
        {
            'username': 'user',
            'email': 'user@example.com',
            'first_name': 'Default',
            'last_name': 'User',
            'role_id': 4,
            'password': 'user123'
        }
    ]

    for acc in accounts:
        user = User.query.filter_by(email=acc['email']).first()
        if user:
            user.username = acc['username']
            user.first_name = acc['first_name']
            user.last_name = acc['last_name']
            user.role_id = acc['role_id']
            user.password_hash = generate_password_hash(acc['password'])
            setattr(user, 'is_active', True)  # Ensure account is active
            print(f"Updated {acc['role_id']} - Username: {acc['username']}, Password: {acc['password']}")
        else:
            user = User(
                username=acc['username'],
                email=acc['email'],
                first_name=acc['first_name'],
                last_name=acc['last_name'],
                role_id =acc['role_id'],
                password_hash=generate_password_hash(acc['password']),
            )
            setattr(user, 'is_active', True)  # Ensure account is active after creation
            db.session.add(user)
            print(f"Created role_id={acc['role_id']} - Username: {acc['username']}, Password: {acc['password']}")
    db.session.commit()

from website import create_app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        from website.models import db, User  # Import inside app context!
        create_admin_accounts()