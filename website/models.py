from . import db
from flask_login import UserMixin

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

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200))
    category = db.Column(db.String(50), nullable=False)
    cart_items = db.relationship('CartItem', backref='product', lazy=True)

class CartItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    date_added = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())