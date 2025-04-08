from flask import Blueprint, render_template, request, flash, redirect, url_for, jsonify
from flask_login import login_required, current_user
from .models import Product, CartItem, Category
from . import db

views = Blueprint('views', __name__)

@views.route('/')
@login_required
def home(): #default page of user
    category_id = request.args.get('category', type=int)
    search_query = request.args.get('search', '')
    
    # Get all categories for the dropdown
    categories = Category.query.all()
    
    # Base query
    query = Product.query
    
    # Apply category filter if specified
    if category_id:
        query = query.filter_by(category_id=category_id)
    
    # Apply search filter if specified
    if search_query:
        search = f"%{search_query}%"
        query = query.filter(Product.name.ilike(search) | Product.description.ilike(search))
    
    # Get the filtered products
    products = query.all()
    
    return render_template("home.html", 
                           user=current_user, 
                           products=products, 
                           categories=categories,
                           current_category=category_id,
                           search_query=search_query)

@views.route('/add-to-cart/<int:product_id>', methods=['POST'])
@login_required
def add_to_cart(product_id):
    product = Product.query.get_or_404(product_id)
    
    # Check if product is already in cart
    cart_item = CartItem.query.filter_by(
        user_id=current_user.user_id,
        product_id=product_id
    ).first()
    
    if cart_item:
        # If product already in cart, increment quantity
        cart_item.quantity += 1
    else:
        # If product not in cart, create new cart item
        cart_item = CartItem(
            user_id=current_user.user_id,
            product_id=product_id,
            quantity=1
        )
        db.session.add(cart_item)
    
    db.session.commit()
    flash('Item added to cart!', category='success')
    return redirect(url_for('auth.cart'))

@views.route('/update-cart-quantity/<int:item_id>', methods=['POST'])
@login_required
def update_cart_quantity(item_id):
    cart_item = CartItem.query.get_or_404(item_id)
    
    # Verify the cart item belongs to the current user
    if cart_item.user_id != current_user.user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    quantity = request.form.get('quantity', type=int)
    if quantity is None or quantity < 1:
        return jsonify({'error': 'Invalid quantity'}), 400
    
    cart_item.quantity = quantity
    db.session.commit()
    
    return jsonify({
        'success': True,
        'new_quantity': quantity
    })

@views.route('/remove-from-cart/<int:item_id>', methods=['POST'])
@login_required
def remove_from_cart(item_id):
    cart_item = CartItem.query.get_or_404(item_id)
    
    # Verify the cart item belongs to the current user
    if cart_item.user_id != current_user.user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(cart_item)
    db.session.commit()
    
    flash('Item removed from cart!', category='success')
    return redirect(url_for('auth.cart'))