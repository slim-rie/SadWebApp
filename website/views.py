from flask import Blueprint, render_template, flash, redirect, url_for, jsonify, request
from flask_login import login_required, current_user
from . import db
from .models import Product, CartItem, SupplyRequest, Category
from .payment import process_payment, create_ewallet_source
import os

views = Blueprint('views', __name__)

# Home and Product Routes
@views.route('/')
@views.route('/home')
def home():
    products = Product.query.all()
    categories = sorted(
        [c for c in set(p.category for p in products) if c],
        key=lambda c: c.category_name
    )
    return render_template("index.html", user=current_user, products=products, categories=categories)

@views.route('/products')
def products_redirect():
    return redirect(url_for('views.sewing_machines'))

@views.route('/products/<category>')
def products_by_category(category):
    products = Product.query.filter_by(category=category).all()
    return render_template("products.html", user=current_user, products=products, category=category)

@views.route('/product/<int:product_id>')
def product_detail(product_id):
    product = Product.query.get_or_404(product_id)
    return render_template("product_detail.html", user=current_user, product=product)

@views.route('/sewingmachines')
def sewing_machines():
    return render_template('sewingmachines.html', user=current_user)

@views.route('/sewingparts')
def sewing_parts():
    return render_template('sewingparts.html', user=current_user)

@views.route('/fabrics')
def fabrics():
    return render_template('fabrics.html', user=current_user)

@views.route('/about')
def about():
    return render_template('about.html')

@views.route('/contact')
def contact():
    return render_template('contact.html')

@views.route('/sm-productdetails')
def sm_productdetails():
    return render_template('sm-productdetails.html')

@views.route('/sp-productdetails')
def sp_productdetails():
    return render_template('sp-productdetails.html')

@views.route('/f-productdetails')
def f_productdetails():
    return render_template('f-productdetails.html')

# Cart Routes
def get_product_image_url(product_name):
    base_path = os.path.join('SadWebApp', 'website', 'static', 'pictures')
    for ext in ['.jpg', '.png']:
        filename = f"{product_name}{ext}"
        file_path = os.path.join(base_path, filename)
        if os.path.exists(file_path):
            return f"/static/pictures/{filename}"
    return "/static/pictures/default.jpg"

@views.route('/api/cart', methods=['GET'])
@login_required
def get_cart():
    cart_items = CartItem.query.filter_by(user_id=current_user.user_id).all()
    return jsonify({
        'items': [{
            'id': item.id,
            'product_id': item.product_id,
            'name': item.product.product_name,
            'price': float(item.product.base_price),
            'quantity': item.quantity,
            'image_url': get_product_image_url(item.product.product_name)
        } for item in cart_items]
    })

@views.route('/api/cart', methods=['POST'])
@login_required
def add_to_cart():
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    if not product_id:
        return jsonify({'success': False, 'message': 'Product ID is required'}), 400
    
    product = Product.query.get_or_404(product_id)
    
    # Check if item already in cart
    cart_item = CartItem.query.filter_by(user_id=current_user.user_id, product_id=product_id).first()
    
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(user_id=current_user.user_id, product_id=product_id, quantity=quantity)
        db.session.add(cart_item)
    
    db.session.commit()
    return jsonify({'success': True, 'message': 'Item added to cart'})

@views.route('/api/cart/<int:item_id>', methods=['PUT'])
@login_required
def update_cart_item(item_id):
    cart_item = CartItem.query.get_or_404(item_id)
    if cart_item.user_id != current_user.user_id:
        return jsonify({'success': False, 'message': 'Unauthorized access'}), 403
    
    data = request.get_json()
    action = data.get('action')
    
    if action == 'increase':
        cart_item.quantity += 1
    elif action == 'decrease':
        if cart_item.quantity > 1:
            cart_item.quantity -= 1
        else:
            db.session.delete(cart_item)
    
    db.session.commit()
    return jsonify({'success': True, 'message': 'Cart updated'})

@views.route('/api/cart/<int:item_id>', methods=['DELETE'])
@login_required
def remove_cart_item(item_id):
    cart_item = CartItem.query.get_or_404(item_id)
    if cart_item.user_id != current_user.user_id:
        return jsonify({'success': False, 'message': 'Unauthorized access'}), 403
    
    db.session.delete(cart_item)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Item removed from cart'})

@views.route('/cart')
def cart():
    return render_template('cart.html', user=current_user)

# Supply Request Routes
@views.route('/api/supply-requests', methods=['GET'])
@login_required
def get_supply_requests():
    if current_user.role != 'staff':
        return jsonify({'success': False, 'message': 'Access denied. Staff members only.'}), 403
    
    supply_requests = SupplyRequest.query.filter_by(staff_id=current_user.user_id).order_by(SupplyRequest.request_date.desc()).all()
    return jsonify({
        'requests': [{
            'id': req.id,
            'product_id': req.product_id,
            'product_name': req.product.name,
            'quantity_requested': req.quantity_requested,
            'status': req.status,
            'request_date': req.request_date.isoformat(),
            'notes': req.notes
        } for req in supply_requests]
    })

@views.route('/api/supply-requests', methods=['POST'])
@login_required
def create_supply_request():
    if current_user.role != 'staff':
        return jsonify({'success': False, 'message': 'Access denied. Staff members only.'}), 403
    
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity')
    notes = data.get('notes')
    
    if not product_id or not quantity:
        return jsonify({'success': False, 'message': 'Please fill in all required fields.'}), 400
    
    try:
        new_request = SupplyRequest(
            product_id=product_id,
            staff_id=current_user.user_id,
            quantity_requested=int(quantity),
            notes=notes
        )
        db.session.add(new_request)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Supply request submitted successfully!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# Payment Routes
@views.route('/api/payment/process', methods=['POST'])
@login_required
def process_payment_route():
    try:
        data = request.get_json()
        payment_method_id = data.get('payment_method_id')
        amount = float(data.get('amount'))

        if not all([payment_method_id, amount]):
            return jsonify({'success': False, 'message': 'Missing required payment information'}), 400

        success, message = process_payment(payment_method_id, amount)
        
        if success:
            return jsonify({'success': True, 'message': 'Payment successful'})
        else:
            return jsonify({'success': False, 'message': message}), 400

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@views.route('/api/payment/ewallet', methods=['POST'])
@login_required
def create_ewallet_source_route():
    try:
        data = request.get_json()
        amount = float(data.get('amount'))
        ewallet_type = data.get('type')  # 'gcash' or 'paymaya'
        redirect_url = data.get('redirect_url')
        
        if not all([amount, ewallet_type]):
            return jsonify({'success': False, 'message': 'Missing required information'}), 400
            
        source = create_ewallet_source(amount, ewallet_type, redirect_url=redirect_url)
        if source and hasattr(source, 'redirect') and source.redirect.get('checkout_url'):
            return jsonify({'success': True, 'checkout_url': source.redirect['checkout_url']})
        else:
            return jsonify({'success': False, 'message': 'Failed to create e-wallet source'}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@views.route('/transaction')
def transaction():
    return render_template('transaction.html', user=current_user)

@views.route('/confirmation')
def confirmation():
    return render_template('confirmation.html', user=current_user)

@views.route('/deleteinfo')
def delete_info():
    return render_template('deleteinfo.html')

@views.route('/search')
def search():
    query = request.args.get('q', '')
    category = request.args.get('category', 'All')
    products = Product.query
    if category and category != 'All':
        products = products.join(Product.category_obj).filter_by(name=category)
    if query:
        products = products.filter(Product.name.ilike(f'%{query}%'))
    products = products.all()
    return render_template('search_results.html', user=current_user, products=products, query=query, category=category)

@views.route('/api/products')
def get_products():
    category_name = request.args.get('category', 'Sewing Machines')
    category = Category.query.filter_by(category_name=category_name).first()
    
    if not category:
        return jsonify([])
    
    # Get all subcategory IDs
    subcategories = Category.query.filter_by(parent_category_id=category.category_id).all()
    category_ids = [category.category_id] + [subcat.category_id for subcat in subcategories]
    
    products = Product.query.filter(Product.category_id.in_(category_ids)).all()
    product_list = []
    
    for product in products:
        product_list.append({
            'name': product.product_name,
            'price': float(product.base_price),
            'rating': 4.5,  # Default rating
            'sold': "0",    # Default sold count
            'image': f"/static/pictures/{product.product_name}.jpg",  # Assuming image naming convention
            'discount': None,
            'refurbished': False
        })
    
    return jsonify(product_list)

@views.route('/addresses')
@login_required
def addresses():
    return render_template('addresses.html', user=current_user)

@views.route('/api/productdetails')
def get_product_details():
    product_name = request.args.get('product')
    if not product_name:
        return jsonify({'error': 'No product specified'}), 400
    product = Product.query.filter_by(product_name=product_name).first()
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    return jsonify({
        'product_id': product.product_id,
        'name': product.product_name,
        'model_number': product.model_number,
        'description': product.description,
        'price': float(product.base_price),
        'stock': product.stock_quantity,
        'image': f"/static/pictures/{product.product_name}.jpg",
        'category_id': product.category_id
    })
