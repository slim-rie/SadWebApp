from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from . import db, login_manager
from datetime import datetime

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class Role(db.Model):
    __tablename__ = 'roles'
    role_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    role_name = db.Column(db.String(20), unique=True, nullable=False)
    description = db.Column(db.Text)
    users = db.relationship('User', backref='role_obj', lazy=True)

class User(UserMixin, db.Model):
    __tablename__ = 'users'

    @property
    def role(self):
        # Return the role name from the related Role object
        return self.role_obj.role_name if self.role_obj else None
    
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.Text)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.role_id'), nullable=False)
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

class Address(db.Model):
    __tablename__ = 'addresses'
    address_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    complete_address = db.Column(db.String(255), nullable=False)
    label = db.Column(db.String(20), nullable=False)  # home or work
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    phone_number = db.Column(db.String(20), nullable=True)
    street_address = db.Column(db.String(255), nullable=True)

class Category(db.Model):
    __tablename__ = 'categories'
    category_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_name = db.Column(db.String(100), nullable=False)
    parent_category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'), nullable=True)
    # Relationships
    parent = db.relationship('Category', remote_side=[category_id], backref='subcategories')
    products = db.relationship('Product', backref='category', lazy=True)

class Product(db.Model):
    __tablename__ = 'products'
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_name = db.Column(db.String(255), nullable=False)
    model_number = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'), nullable=False)
    base_price = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, nullable=True)
    updated_at = db.Column(db.DateTime, nullable=True)
    __table_args__ = (
        db.UniqueConstraint('product_name', 'model_number', name='unique_product_name_model'),
    )
    # Relationships
    images = db.relationship('ProductImage', backref='product', lazy=True, cascade='all, delete-orphan')
    specifications = db.relationship('ProductSpecification', backref='product', lazy=True, cascade='all, delete-orphan')
    cart_items = db.relationship('CartItem', backref='product', lazy=True)
    order_items = db.relationship('OrderItem', backref='product', lazy=True)
    supply_requests = db.relationship('SupplyRequest', backref='product', lazy=True)
    promotions = db.relationship('ProductPromotion', backref='product', lazy=True)

class ProductSpecification(db.Model):
    __tablename__ = 'product_specifications'
    spec_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    spec_name = db.Column(db.String(100), nullable=False)
    spec_value = db.Column(db.String(255), nullable=False)
    display_order = db.Column(db.Integer, nullable=True)

class ProductImage(db.Model):
    __tablename__ = 'product_images'
    image_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    image_url = db.Column(db.String(255), nullable=False)
    image_type = db.Column(db.String(50), nullable=False)
    display_order = db.Column(db.Integer, nullable=False)
    alt_text = db.Column(db.String(255), nullable=True)

class ProductVariant(db.Model):
    __tablename__ = 'product_variants'
    variant_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False, index=True)
    variant_name = db.Column(db.String(100), nullable=False)
    variant_value = db.Column(db.String(100), nullable=False)
    additional_price = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    stock_quantity = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    def __repr__(self):
        return f'<ProductVariant {self.variant_id} {self.variant_name}>'

class ProductPromotion(db.Model):
    __tablename__ = 'product_promotions'
    promotion_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    promotion_name = db.Column(db.String(100), nullable=False)
    discount_percentage = db.Column(db.Numeric(5, 2), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class OrderStatus(db.Model):
    __tablename__ = 'orders_statuses'
    status_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status_name = db.Column(db.String(20), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    orders = db.relationship('Order', backref='order_status_obj', lazy=True)

class Order(db.Model):
    __tablename__ = 'orders'
    
    order_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    cancellation_id = db.Column(db.Integer, db.ForeignKey('order_cancellation.cancellation_id'), nullable=True)
    order_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    total_amount = db.Column(db.Float, nullable=False)
    address_id = db.Column(db.Integer, db.ForeignKey('addresses.address_id'), nullable=False)
    status_id = db.Column(db.Integer, db.ForeignKey('orders_statuses.status_id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    items = db.relationship('OrderItem', backref='order', lazy=True)

class CancellationReason(db.Model):
    __tablename__ = 'cancellation_reason'
    cancellation_reason_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cancellation_reason_name = db.Column(db.String(100), unique=True, nullable=False)
    other_reason = db.Column(db.Text, nullable=True)
    cancellations = db.relationship('OrderCancellation', backref='reason', lazy=True)

class OrderCancellation(db.Model):
    __tablename__ = 'order_cancellation'
    cancellation_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    cancellation_reason_id = db.Column(db.Integer, db.ForeignKey('cancellation_reason.cancellation_reason_id'), nullable=False)
    cancelled_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class TrackingStatus(db.Model):
    __tablename__ = 'tracking_statuses'
    status_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status_name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)

class Tracking(db.Model):
    __tablename__ = 'tracking'
    tracking_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tracking_number = db.Column(db.String(100), nullable=False)
    courier = db.Column(db.String(100), nullable=False)
    status_id = db.Column(db.Integer, db.ForeignKey('tracking_statuses.status_id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class PaymentMethod(db.Model):
    __tablename__ = 'payment_methods'
    payment_method_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    method_name = db.Column(db.String(100), unique=True, nullable=False)

class Payment(db.Model):
    __tablename__ = 'payment'
    payment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    payment_method_id = db.Column(db.Integer, db.ForeignKey('payment_methods.payment_method_id'), nullable=False)
    payment_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    payment_proof_url = db.Column(db.String(255), nullable=True)
    payment_status = db.Column(db.String(20), nullable=False, default='pending')
    reference_number = db.Column(db.Text, nullable=True)

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    variant_id = db.Column(db.Integer, db.ForeignKey('product_variants.variant_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)
    discount_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    cart_item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    variant_id = db.Column(db.Integer, db.ForeignKey('product_variants.variant_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class Review(db.Model):
    __tablename__ = 'reviews'
    review_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class ReviewMedia(db.Model):
    __tablename__ = 'review_media'
    media_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    review_id = db.Column(db.Integer, db.ForeignKey('reviews.review_id'), nullable=False)
    media_url = db.Column(db.String(255), nullable=True)
    media_type = db.Column(db.String(50), nullable=True)

class Refund(db.Model):
    __tablename__ = 'refunds'
    refund_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    refund_reason = db.Column(db.String(255), nullable=False)
    refund_status = db.Column(db.String(50), nullable=False)
    proof_of_refund = db.Column(db.String(255), nullable=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    return_id = db.Column(db.Integer, db.ForeignKey('returns.return_id'), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class Return(db.Model):
    __tablename__ = 'returns'
    return_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    return_reason = db.Column(db.String(255), nullable=False)
    return_issue = db.Column(db.String(50), nullable=False)
    return_status = db.Column(db.String(50), nullable=False)
    refund_id = db.Column(db.Integer, db.ForeignKey('refunds.refund_id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    supplier_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    supplier_name = db.Column(db.String(255), nullable=False)
    contact_person = db.Column(db.String(100), nullable=True)
    phone_number = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    address = db.Column(db.String(255), nullable=True)
    supplier_status = db.Column(db.String(50), nullable=False, default='active')
    registration_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    # Relationship to product_suppliers
    products = db.relationship('ProductSupplier', backref='supplier', lazy=True)

class ProductSupplier(db.Model):
    __tablename__ = 'product_suppliers'
    product_supplier_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.supplier_id'), nullable=False)
    supplier_price = db.Column(db.Numeric(10, 2), nullable=False)
    is_primary = db.Column(db.Boolean, nullable=False, default=False)

class DamageProduct(db.Model):
    __tablename__ = 'damage_products'
    damage_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    damage_reason = db.Column(db.Text, nullable=False)
    reported_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.supplier_id'), nullable=False)
    return_id = db.Column(db.Integer, db.ForeignKey('returns.return_id'), nullable=False)
    refund_id = db.Column(db.Integer, db.ForeignKey('refunds.refund_id'), nullable=False)

class InventoryTransaction(db.Model):
    __tablename__ = 'inventory_transactions'
    transaction_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    quantity_change = db.Column(db.Integer, nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)
    reference_id = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    transaction_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    staff_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)

class Inventory(db.Model):
    __tablename__ = 'inventory'
    inventory_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    stock_quantity = db.Column(db.Integer, nullable=False)
    stock_in = db.Column(db.Integer, nullable=False)
    stock_out = db.Column(db.Integer, nullable=False)
    min_stock = db.Column(db.Integer, nullable=False)
    max_stock = db.Column(db.Integer, nullable=False)
    available_stock = db.Column(db.Integer, nullable=False)
    stock_status = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

class SupplyRequest(db.Model):
    __tablename__ = 'supply_requests'
    request_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    quantity_requested = db.Column(db.Integer, nullable=False)
    supply_status = db.Column(db.String(20), nullable=False, default='pending')
    notes = db.Column(db.Text, nullable=True)
    request_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    __table_args__ = (
        db.Index('idx_supply_request_staff', 'staff_id'),
        db.Index('idx_supply_request_status', 'supply_status'),
    )

class Sales(db.Model):
    __tablename__ = 'sales'
    sales_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    sale_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    total_amount = db.Column(db.Numeric(10,2), nullable=False)
    payment_id = db.Column(db.Integer, db.ForeignKey('payment.payment_id'), nullable=False)
    __table_args__ = (
        db.Index('idx_sale_user', 'user_id'),
        db.Index('idx_sale_payment', 'payment_id'),
    )

class EmailVerification(db.Model):
    __tablename__ = 'email_verifications'
    email_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(150), nullable=False)
    code = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_used = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<EmailVerification {self.email}>'

class PhoneVerification(db.Model):
    __tablename__ = 'phone_verifications'
    phone_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    phone = db.Column(db.String(20), nullable=False)
    code = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_used = db.Column(db.Boolean, default=False)

