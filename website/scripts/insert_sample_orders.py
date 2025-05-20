import os
import sys
import random
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from website import create_app, db
from website.models import User, Product, Order, OrderItem, Address
from datetime import datetime

app = create_app()

ORDER_STATUSES = [
    ('to-pay', 'pending'),
    ('to-ship', 'paid'),
    ('to-receive', 'shipped'),
    ('completed', 'delivered'),
    ('cancelled', 'cancelled'),
    ('return/refund', 'refunded'),
]

with app.app_context():
    user = User.query.filter_by(username='john jerriehlpontino').first()
    if not user:
        print('User not found!')
        sys.exit(1)
    address = Address.query.filter_by(user_id=user.user_id).first()
    if not address:
        print('No address found for user!')
        sys.exit(1)
    # Get all products with price > 0 and stock > 0
    products = Product.query.filter(Product.base_price > 0, Product.stock_quantity > 0).all()
    if not products:
        print('No products with price and stock found!')
        sys.exit(1)
    for label, status in ORDER_STATUSES:
        # Always use only one item per order
        order_product = random.choice(products)
        quantity = random.randint(1, 2)
        price = float(order_product.base_price)
        total = price * quantity
        order_items = [(order_product, quantity, price)]
        order = Order(
            user_id=user.user_id,
            total_amount=total,
            status=status,
            payment_method='Cash on Delivery',
            payment_status='pending' if status == 'pending' else 'paid',
            shipping_address=address.complete_address,
            created_at=datetime.now()
        )
        db.session.add(order)
        db.session.flush()  # get order_id
        for prod, quantity, price in order_items:
            order_item = OrderItem(
                order_id=order.order_id,
                product_id=prod.product_id,
                quantity=quantity,
                price=price
            )
            db.session.add(order_item)
        print(f"Inserted order with status {status} and 1 item, total ₱{total:.2f}")
    db.session.commit()
print("Done.") 