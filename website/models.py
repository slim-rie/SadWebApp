from . import db
from flask_login import UserMixin
from flask_bcrypt import Bcrypt
import re
from datetime import datetime

bcrypt = Bcrypt()

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.Text)
    products = db.relationship('Product', backref='category', lazy=True)

class Supplier(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_info = db.Column(db.String(200))
    address = db.Column(db.Text)
    products = db.relationship('Product', backref='supplier', lazy=True)

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200))
    stock = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('supplier.id'), nullable=False)
    cart_items = db.relationship('CartItem', backref='product', lazy=True)
    sku = db.Column(db.String(50), unique=True)  # Stock Keeping Unit
    unit_of_measure = db.Column(db.String(20))  # e.g., meters, pieces

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    added_at = db.Column(db.DateTime, default=datetime.utcnow)

class User(db.Model, UserMixin):
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    first_name = db.Column(db.String(100))
    middle_name = db.Column(db.String(100), nullable=True)
    last_name = db.Column(db.String(100))
    password = db.Column(db.String(225))
    role = db.Column(db.String(100), nullable=False, default='user')
    cart_items = db.relationship('CartItem', backref='user', lazy=True)

    def get_id(self):
        return str(self.user_id)
    
    @staticmethod
    def is_password_valid(password):
        # Check if password meets requirements:
        # - At least 8 characters long
        # - Contains at least one number
        # - Contains at least one letter
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        if not re.search(r"[0-9]", password):
            return False, "Password must contain at least one number"
        if not re.search(r"[a-zA-Z]", password):
            return False, "Password must contain at least one letter"
        return True, ""
    
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        if self.password is None:
            return False
        return bcrypt.check_password_hash(self.password, password)