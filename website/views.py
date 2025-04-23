from flask import Blueprint, render_template, flash, redirect, url_for, jsonify, request
from flask_login import login_required, current_user
from . import db
from .models import Product, CartItem, SupplyRequest

views = Blueprint('views', __name__)

@views.route('/home')
@login_required
def home():
    products = Product.query.all()
    categories = sorted(list(set(p.category for p in products)))
    return render_template("home.html", user=current_user, products=products, categories=categories)

@views.route('/add-to-cart/<int:product_id>', methods=['POST'])
@login_required
def add_to_cart(product_id):
    product = Product.query.get_or_404(product_id)
    
    # Check if item already in cart
    cart_item = CartItem.query.filter_by(user_id=current_user.user_id, product_id=product_id).first()
    
    if cart_item:
        cart_item.quantity += 1
    else:
        cart_item = CartItem(user_id=current_user.user_id, product_id=product_id)
        db.session.add(cart_item)
    
    db.session.commit()
    return redirect(url_for('auth.cart'))

@views.route('/update-cart-quantity/<int:item_id>', methods=['POST'])
@login_required
def update_cart_quantity(item_id):
    cart_item = CartItem.query.get_or_404(item_id)
    if cart_item.user_id != current_user.user_id:
        flash('Unauthorized access', 'error')
        return redirect(url_for('auth.cart'))
    
    action = request.form.get('action')
    if action == 'increase':
        cart_item.quantity += 1
    elif action == 'decrease':
        if cart_item.quantity > 1:
            cart_item.quantity -= 1
        else:
            db.session.delete(cart_item)
    
    db.session.commit()
    return redirect(url_for('auth.cart'))

@views.route('/remove-from-cart/<int:item_id>', methods=['POST'])
@login_required
def remove_from_cart(item_id):
    cart_item = CartItem.query.get_or_404(item_id)
    if cart_item.user_id != current_user.user_id:
        flash('Unauthorized access', 'error')
        return redirect(url_for('auth.cart'))
    
    db.session.delete(cart_item)
    db.session.commit()
    flash('Item removed from cart', 'success')
    return redirect(url_for('auth.cart'))

@views.route('/get-cart-count')
@login_required
def get_cart_count():
    count = CartItem.query.filter_by(user_id=current_user.user_id).count()
    return jsonify({'count': count})

@views.route('/supplier-requests')
@login_required
def supplier_requests():
    if current_user.role != 'staff':
        flash('Access denied. Staff members only.', 'error')
        return redirect(url_for('views.home'))
    
    products = Product.query.all()
    supply_requests = SupplyRequest.query.filter_by(staff_id=current_user.user_id).order_by(SupplyRequest.request_date.desc()).all()
    return render_template('supplier_requests.html', user=current_user, products=products, supply_requests=supply_requests)

@views.route('/create-supply-request', methods=['POST'])
@login_required
def create_supply_request():
    if current_user.role != 'staff':
        flash('Access denied. Staff members only.', 'error')
        return redirect(url_for('views.home'))
    
    product_id = request.form.get('product_id')
    quantity = request.form.get('quantity')
    notes = request.form.get('notes')
    
    if not product_id or not quantity:
        flash('Please fill in all required fields.', 'error')
        return redirect(url_for('views.supplier_requests'))
    
    try:
        new_request = SupplyRequest(
            product_id=product_id,
            staff_id=current_user.user_id,
            quantity_requested=int(quantity),
            notes=notes
        )
        db.session.add(new_request)
        db.session.commit()
        flash('Supply request submitted successfully!', 'success')
    except Exception as e:
        db.session.rollback()
        flash('An error occurred while submitting the request.', 'error')
    
    return redirect(url_for('views.supplier_requests'))