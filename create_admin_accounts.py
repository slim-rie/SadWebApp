from flask import Flask
from SadWebApp.website.config import Config
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
    role = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(60), nullable=False)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.first_name}', '{self.last_name}', '{self.role}')"

def create_admin_accounts():
    accounts = [
        {
            'username': 'admin',
            'email': 'admin@example.com',
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'admin',
            'password': 'admin123'
        },
        {
            'username': 'staff',
            'email': 'staff@example.com',
            'first_name': 'Staff',
            'last_name': 'User',
            'role': 'staff',
            'password': 'staff123'
        },
        {
            'username': 'supplier',
            'email': 'supplier@example.com',
            'first_name': 'Supplier',
            'last_name': 'User',
            'role': 'supplier',
            'password': 'supplier123'
        },
        {
            'username': 'user',
            'email': 'user@example.com',
            'first_name': 'Default',
            'last_name': 'User',
            'role': 'user',
            'password': 'user123'
        }
    ]

    for acc in accounts:
        user = User.query.filter_by(email=acc['email']).first()
        if user:
            user.username = acc['username']
            user.first_name = acc['first_name']
            user.last_name = acc['last_name']
            user.role = acc['role']
            user.password_hash = generate_password_hash(acc['password'])
            print(f"Updated {acc['role']} - Username: {acc['username']}, Password: {acc['password']}")
        else:
            user = User(
                username=acc['username'],
                email=acc['email'],
                first_name=acc['first_name'],
                last_name=acc['last_name'],
                role=acc['role'],
                password_hash=generate_password_hash(acc['password'])
            )
            db.session.add(user)
            print(f"Created {acc['role']} - Username: {acc['username']}, Password: {acc['password']}")
    db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        create_admin_accounts() 