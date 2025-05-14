from flask import Blueprint, render_template, flash, redirect, url_for, jsonify, request
from flask_login import login_required, current_user
from . import db
from .models import Product, CartItem, SupplyRequest, Category, Review, User
from .payment import process_payment, create_ewallet_source
import os
from werkzeug.utils import secure_filename
from datetime import datetime

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
    category = request.args.get('category')
    print(f"[DEBUG] Requested category: {category}")
    if not category:
        print("[DEBUG] No category specified in request.")
        return jsonify({'error': 'No category specified'}), 400
    cat_obj = Category.query.filter_by(category_name=category).first()
    if not cat_obj:
        print(f"[DEBUG] No category found in DB for: {category}")
        return jsonify({'error': 'No products found'}), 404
    # Get all subcategory IDs
    subcategories = Category.query.filter_by(parent_category_id=cat_obj.category_id).all()
    category_ids = [cat_obj.category_id] + [subcat.category_id for subcat in subcategories]
    products = Product.query.filter(Product.category_id.in_(category_ids)).all()
    print(f"[DEBUG] Number of products found: {len(products)}")
    if not products:
        return jsonify({'error': 'No products found'}), 404
    # Fetch real average rating and review count for each product
    product_list = []
    for product in products:
        reviews = Review.query.filter_by(product_id=product.product_id).all()
        avg_rating = sum(review.rating for review in reviews) / len(reviews) if reviews else 0
        review_count = len(reviews)
        product_list.append({
            'product_id': product.product_id,
            'name': product.product_name,
            'price': float(product.base_price),
            'image': get_product_image_url(product.product_name),
            'discount': None,
            'refurbished': product.refurbished if hasattr(product, 'refurbished') else None,
            'sold': product.sold if hasattr(product, 'sold') else None,
            'rating': avg_rating,
            'review_count': review_count
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
    # Fetch brand name
    brand_name = product.brand_obj.name if product.brand_obj else None
    # Fetch category name
    category_name = product.category.category_name if product.category else None
    # Fetch all specifications, ordered by display_order, excluding 'Category ID'
    specs = [
        {'name': spec.spec_name, 'value': spec.spec_value, 'order': spec.display_order}
        for spec in sorted(product.specifications, key=lambda s: s.display_order or 0)
        if spec.spec_name.lower() != 'category id'
    ]
    # Insert category name as the first spec
    if category_name:
        specs.insert(0, {'name': 'Category', 'value': category_name, 'order': 0})
    return jsonify({
        'product_id': product.product_id,
        'name': product.product_name,
        'model_number': product.model_number,
        'description': product.description,
        'price': float(product.base_price),
        'stock': product.stock_quantity,
        'image': f"/static/pictures/{product.product_name}.jpg",
        'category_id': product.category_id,
        'category_name': category_name,
        'brand': brand_name,
        'specifications': specs
    })

ALLOWED_REVIEW_MEDIA = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}
REVIEW_MEDIA_FOLDER = os.path.join('SadWebApp', 'website', 'static', 'review_media')
os.makedirs(REVIEW_MEDIA_FOLDER, exist_ok=True)

def allowed_review_media(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_REVIEW_MEDIA

@views.route('/api/reviews', methods=['POST'])
@login_required
def submit_review():
    product_id = request.form.get('product_id')
    rating = request.form.get('rating')
    comment = request.form.get('comment')
    file = request.files.get('media')
    if not all([product_id, rating, comment]):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    media_url = None
    media_type = None
    if file and allowed_review_media(file.filename):
        filename = secure_filename(file.filename)
        ext = filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{current_user.user_id}_{product_id}_{int(datetime.utcnow().timestamp())}.{ext}"
        file_path = os.path.join(REVIEW_MEDIA_FOLDER, unique_filename)
        file.save(file_path)
        media_url = f"/static/review_media/{unique_filename}"
        media_type = ext
    review = Review(
        product_id=product_id,
        user_id=current_user.user_id,
        rating=int(rating),
        comment=comment,
        media_url=media_url,
        media_type=media_type
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Review submitted successfully'})

@views.route('/api/reviews', methods=['GET'])
def get_reviews():
    product_id = request.args.get('product_id')
    if not product_id:
        return jsonify({'success': False, 'message': 'Missing product_id'}), 400
    reviews = Review.query.filter_by(product_id=product_id).order_by(Review.created_at.desc()).all()
    review_list = []
    for r in reviews:
        review_list.append({
            'review_id': r.review_id,
            'user_id': r.user_id,
            'username': r.user.username if r.user else 'Unknown',
            'profile_image': f"/static/profile_images/{r.user.profile_image}" if r.user and r.user.profile_image else None,
            'rating': r.rating,
            'comment': r.comment,
            'media_url': r.media_url,
            'media_type': r.media_type,
            'created_at': r.created_at.strftime('%Y-%m-%d %H:%M')
        })
    return jsonify({'success': True, 'reviews': review_list})

@views.route('/api/reviews/average', methods=['GET'])
def get_average_rating():
    product_id = request.args.get('product_id')
    if not product_id:
        return jsonify({'success': False, 'message': 'Missing product_id'}), 400
    from sqlalchemy import func
    avg_rating = db.session.query(func.avg(Review.rating)).filter_by(product_id=product_id).scalar()
    count = db.session.query(func.count(Review.rating)).filter_by(product_id=product_id).scalar()
    return jsonify({'success': True, 'average': round(avg_rating or 0, 2), 'count': count})
