import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from website import create_app, db
from website.models import User, Order, OrderItem

app = create_app()

with app.app_context():
    user = User.query.filter_by(username='john jerriehlpontino').first()
    if not user:
        print('User not found!')
        sys.exit(1)
    # Find all orders for this user with order_id >= 11
    orders = Order.query.filter(Order.user_id == user.user_id, Order.order_id >= 11).all()
    if not orders:
        print('No old sample orders found to delete.')
        sys.exit(0)
    order_ids = [order.order_id for order in orders]
    # Delete associated order items
    deleted_items = OrderItem.query.filter(OrderItem.order_id.in_(order_ids)).delete(synchronize_session=False)
    # Delete orders
    deleted_orders = Order.query.filter(Order.order_id.in_(order_ids)).delete(synchronize_session=False)
    db.session.commit()
    print(f"Deleted {deleted_orders} orders and {deleted_items} order items for user '{user.username}' with order_id >= 11.")
print("Done.") 