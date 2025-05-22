from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from . import db, login_manager
from datetime import datetime

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.Text)
    role = db.Column(db.String(20), default='user')  # admin, staff, user
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    gender = db.Column(db.String(10))
    date_of_birth = db.Column(db.Date)
    profile_image = db.Column(db.String(255))
    is_google_user = db.Column(db.Boolean, default=False)
    
    # Relationships
    cart_items = db.relationship('CartItem', backref='user', lazy=True, cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='user', lazy=True)
    supply_requests = db.relationship('SupplyRequest', backref='staff', lazy=True)
    addresses = db.relationship('Address', backref='user', lazy=True)
    
    def get_id(self):
        return str(self.user_id)
    
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')
    
    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        if not self.password_hash:
            # No password hash means this is a Google user (or similar)
            return False
        return check_password_hash(self.password_hash, password)
    
    def update_last_login(self):
        self.last_login = datetime.utcnow()
        db.session.commit()

class Brand(db.Model):
    __tablename__ = 'brands'
    brand_id = db.Column(db.Integer, primary_key=True)
    brand_name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    products = db.relationship('Product', backref='brand_obj', lazy=True)

    @property
    def category(self):
        return self.category_obj.name if self.category_obj else None

    @property
    def brand(self):
        return self.brand_obj.name if self.brand_obj else None

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'product_id', name='_user_product_uc'),)

class Order(db.Model):
    __tablename__ = 'orders'
    
    order_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    total_amount = db.Column(db.Float)
    status = db.Column(db.String(20))
    payment_method = db.Column(db.String(50))
    payment_status = db.Column(db.String(20))
    shipping_address = db.Column(db.Text)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    cancellation_reason = db.Column(db.String(255))
    cancellation_requested_by = db.Column(db.String(50))
    order_status = db.Column(db.String(50))
    order_date = db.Column(db.DateTime)
    customer_issue = db.Column(db.Text)
    message = db.Column(db.Text)
    feedback = db.Column(db.Text)
    rate = db.Column(db.Integer)
    
    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True)

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class SupplyRequest(db.Model):
    __tablename__ = 'supply_requests'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    quantity_requested = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='pending')  # pending, approved, rejected, fulfilled
    notes = db.Column(db.Text)
    request_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        db.Index('idx_supply_request_status', 'status'),
        db.Index('idx_supply_request_staff', 'staff_id'),
    )

class Address(db.Model):
    __tablename__ = 'addresses'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    postal_code = db.Column(db.String(20))
    street_address = db.Column(db.String(255))
    complete_address = db.Column(db.String(255))
    label = db.Column(db.String(20))  # home or work
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Category(db.Model):
    __tablename__ = 'categories'

    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(100), nullable=False)
    parent_category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'))

    # Relationships
    parent = db.relationship('Category', remote_side=[category_id], backref='subcategories')
    products = db.relationship('Product', backref='category', lazy=True)

class Product(db.Model):
    __tablename__ = 'products'

    product_id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(255), nullable=False)
    model_number = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'), nullable=False)
    brand_id = db.Column(db.Integer, db.ForeignKey('brands.brand_id'), nullable=True)
    base_price = db.Column(db.Numeric(10, 2), nullable=False)
    discount_percentage = db.Column(db.Numeric(5, 2), default=0)
    stock_quantity = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    images = db.relationship('ProductImage', backref='product', lazy=True, cascade='all, delete-orphan')
    specifications = db.relationship('ProductSpecification', backref='product', lazy=True, cascade='all, delete-orphan')
    cart_items = db.relationship('CartItem', backref='product', lazy=True)
    order_items = db.relationship('OrderItem', backref='product', lazy=True)
    supply_requests = db.relationship('SupplyRequest', backref='product', lazy=True)

class ProductImage(db.Model):
    __tablename__ = 'product_images'

    image_id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    image_type = db.Column(db.String(50), nullable=False)
    display_order = db.Column(db.Integer, nullable=False)
    alt_text = db.Column(db.String(255))

class ProductSpecification(db.Model):
    __tablename__ = 'product_specifications'

    spec_id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    spec_name = db.Column(db.String(100), nullable=False)
    spec_value = db.Column(db.String(255), nullable=False)
    display_order = db.Column(db.Integer, default=0)

class ProductVariant(db.Model):
    __tablename__ = 'product_variants'

    variant_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False, index=True)
    variant_name = db.Column(db.String(100), nullable=False)
    variant_value = db.Column(db.String(100), nullable=False)
    additional_price = db.Column(db.Numeric(10, 2), default=0.00)
    stock_quantity = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<ProductVariant {self.variant_id} {self.variant_name}>'

class Review(db.Model):
    __tablename__ = 'reviews'
    review_id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    media_url = db.Column(db.String(255))
    media_type = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='reviews', lazy=True)
    product = db.relationship('Product', backref='reviews', lazy=True)

class Supplier(db.Model):
    __tablename__ = 'supplier_db'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_category = db.Column(db.String(255), nullable=False)
    product_name = db.Column(db.String(255), nullable=False)
    supplier_name = db.Column(db.String(255), nullable=False)
    contact_person = db.Column(db.String(100), nullable=True)
    phone_number = db.Column(db.String(30), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(50), nullable=True)  # e.g. Active/Inactive
    registration_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class Inventory(db.Model):
    __tablename__ = 'inventory_db'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_name = db.Column(db.String(255), nullable=False)
    product_code = db.Column(db.String(100), nullable=False, unique=True)
    category_name = db.Column(db.String(100), nullable=False)
    selling_price = db.Column(db.Float, nullable=False)
    min_stock = db.Column(db.Integer, nullable=False)
    max_stock = db.Column(db.Integer, nullable=False)
    last_updated = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    supplier_name = db.Column(db.String(255), nullable=False)
    supplier_price = db.Column(db.Float, nullable=False)
    available_stock = db.Column(db.Integer, nullable=False)
    stock_status = db.Column(db.String(100), nullable=False)
    product_status = db.Column(db.String(100), nullable=False)
    memo = db.Column(db.Text, nullable=True)