from flask import Blueprint, render_template, flash, redirect, url_for, jsonify, request, session
from flask_login import login_required, current_user
from . import db
from .models import Product, CartItem, SupplyRequest, Category, Review, User, Address, Order, OrderItem, ProductImage
import os
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
from sqlalchemy import func
from sqlalchemy.orm import joinedload, subqueryload

views = Blueprint('views', __name__)

def calculate_shipping_fee(address, cart_items):
    # --- Address-based logic ---
    address_str = (address.complete_address or "").lower()
    metro_manila_keywords = [
        'manila', 'quezon city', 'makati', 'pasig', 'mandaluyong', 'taguig',
        'parañaque', 'caloocan', 'malabon', 'navotas', 'valenzuela', 'las piñas',
        'muntinlupa', 'pasay', 'san juan', 'marikina', 'pateros'
    ]
    is_metro_manila = any(city in address_str for city in metro_manila_keywords)

    # --- Cart-based logic ---
    total_items = sum(item.quantity for item in cart_items)
    subtotal = sum(item.product.base_price * item.quantity for item in cart_items)

    # --- Free shipping threshold ---
    FREE_SHIPPING_THRESHOLD = 2000

    # --- Base rates ---
    if is_metro_manila:
        base_fee = 35
    else:
        base_fee = 60

    # --- Per-item fee (optional, for large orders) ---
    per_item_fee = 0
    if total_items > 5:
        per_item_fee = 5 * (total_items - 5)  # ₱5 per item after 5

    # --- Free shipping if subtotal is high enough ---
    if subtotal >= FREE_SHIPPING_THRESHOLD:
        return 0

    return base_fee + per_item_fee

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
    return redirect(url_for('views.sewingmachines'))

@views.route('/products/<category>')
def products_by_category(category):
    products = Product.query.filter_by(category=category).all()
    return render_template("products.html", user=current_user, products=products, category=category)

@views.route('/product/<int:product_id>')
def product_detail(product_id):
    product = Product.query.get_or_404(product_id)
    # Get category name (assume relationship is product.category)
    category_name = None
    if hasattr(product, 'category') and product.category:
        category_name = product.category.category_name.lower()
    else:
        # fallback: try to get category by id
        category = Category.query.get(product.category_id)
        if category:
            category_name = category.category_name.lower()
    # Choose template based on category
    if category_name:
        if 'sewing machine' in category_name:
            template = 'sm-productdetails.html'
        elif 'sewing part' in category_name:
            template = 'sp-productdetails.html'
        elif 'fabric' in category_name:
            template = 'f-productdetails.html'
        else:
            template = 'sm-productdetails.html'  # fallback
    else:
        template = 'sm-productdetails.html'  # fallback
    return render_template(template, user=current_user, product=product)

@views.route('/sewingmachines')
def sewingmachines():
    sewing_categories = Category.query.filter_by(parent_category_id=1).all()
    return render_template('sewingmachines.html', user=current_user, categories=sewing_categories)

@views.route('/sewingparts')
def sewing_parts():
    return render_template('sewingparts.html', user=current_user)

@views.route('/fabrics')
def fabrics():
    fabric_categories = Category.query.filter(Category.category_name.in_([
        'Cotton Fabric', 'Polyester-Blend Fabrics', 'Lacoste Fabrics', 'Silk Fabrics'])).all()
    return render_template('fabrics.html', user=current_user, categories=fabric_categories)

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
            # Use ProductImage from DB if available, fallback to static folder
            'image_url': (('/static/' + item.product.images[0].image_url.lstrip('/')) if item.product.images and len(item.product.images) > 0 and not item.product.images[0].image_url.startswith('/static/') else (item.product.images[0].image_url if item.product.images and len(item.product.images) > 0 else get_product_image_url(item.product.product_name))),
            'stock_quantity': item.product.stock_quantity
        } for item in cart_items]
    })

@views.route('/api/cart', methods=['POST'])
@login_required
def add_to_cart():
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    color = data.get('color')
    width = data.get('width')
    model = data.get('model')

    if not product_id:
        return jsonify({'success': False, 'message': 'Product ID is required'}), 400

    product = Product.query.get_or_404(product_id)

    # Check if item with same product/color/width/model is already in cart
    cart_item = CartItem.query.filter_by(
        user_id=current_user.user_id,
        product_id=product_id,
        color=color,
        width=width,
        model=model
    ).first()

    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(
            user_id=current_user.user_id,
            product_id=product_id,
            quantity=quantity,
            color=color,
            width=width,
            model=model
        )
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
@views.route('/transaction')
@login_required
def transaction():
    buy_now_mode = request.args.get('buy_now')
    buy_now_item = session.get('buy_now_item') if buy_now_mode else None
    if buy_now_mode and buy_now_item:
        # Use only the buy now item for checkout
        product = Product.query.get(buy_now_item['product_id'])
        formatted_cart_items = [{
            'product_name': product.product_name,
            'image_url': (('/static/' + product.images[0].image_url.lstrip('/')) if product.images and len(product.images) > 0 and not product.images[0].image_url.startswith('/static/') else (product.images[0].image_url if product.images and len(product.images) > 0 else get_product_image_url(product.product_name))),
            'color': buy_now_item.get('color'),
            'width': buy_now_item.get('width'),
            'model': buy_now_item.get('model'),
            'price': float(product.base_price),
            'quantity': buy_now_item.get('quantity', 1),
            'subtotal': float(product.base_price * buy_now_item.get('quantity', 1))
        }]
        subtotal = formatted_cart_items[0]['subtotal']
        # Get user's default address
        address = Address.query.filter_by(user_id=current_user.user_id, is_default=True).first()
        if not address:
            address = Address.query.filter_by(user_id=current_user.user_id).first()
            if not address:
                flash('Please add a shipping address first', 'error')
                return redirect(url_for('auth.addresses'))
        formatted_address = {
            'full_name': f"{address.first_name} {address.last_name}",
            'phone': address.phone_number,
            'full_address': address.complete_address,
            'street_address': address.street_address,
            'postal_code': address.postal_code,
            'is_default': address.is_default
        }
        shipping_fee = calculate_shipping_fee(address, [type('FakeCartItem', (), {'product': product, 'quantity': buy_now_item.get('quantity', 1)})()])
        total = subtotal + shipping_fee
        order_summary = {
            'subtotal': subtotal,
            'shipping': shipping_fee,
            'total': total,
            'total_items': buy_now_item.get('quantity', 1)
        }
        # Shipping option (can be made dynamic based on user selection)
        start_date = datetime.now() + timedelta(days=2)
        end_date = datetime.now() + timedelta(days=3)
        shipping_option = {
            'method': 'Standard Delivery',
            'delivery_date_range': f"Guaranteed to get by {start_date.strftime('%b %d')} - {end_date.strftime('%b %d, %Y')}"
        }
        # QR code URLs and payment details for different methods
        qr_codes = {
            'bank': {
                'name': 'Bank Account',
                'qr_url': url_for('static', filename='pictures/bank_qr.png'),
                'account_name': 'JBR Tanching C.O',
                'account_number': '1234-5678-9012',
                'bank_name': 'BDO'
            },
            'gcash': {
                'name': 'GCash',
                'qr_url': url_for('static', filename='pictures/gcash_qr.png'),
                'account_name': 'JBR Tanching',
                'phone_number': '0912-345-6789'
            },
            'maya': {
                'name': 'Maya',
                'qr_url': url_for('static', filename='pictures/maya_qr.png'),
                'account_name': 'JBR Tanching',
                'phone_number': '0912-345-6789'
            }
        }
        return render_template('transaction.html',
            user=current_user,
            address=formatted_address,
            cart_items=formatted_cart_items,
            shipping_option=shipping_option,
            order_summary=order_summary,
            qr_codes=qr_codes
        )
    else:
        # Get user's default address
        address = Address.query.filter_by(user_id=current_user.user_id, is_default=True).first()
        if not address:
            # If no default address, get the first address or redirect to add address
            address = Address.query.filter_by(user_id=current_user.user_id).first()
            if not address:
                flash('Please add a shipping address first', 'error')
                return redirect(url_for('auth.addresses'))

        # Format address for template
        formatted_address = {
            'full_name': f"{address.first_name} {address.last_name}",
            'phone': address.phone_number,
            'full_address': address.complete_address,
            'street_address': address.street_address,
            'postal_code': address.postal_code,
            'is_default': address.is_default
        }

        # Get cart items
        cart_items = CartItem.query.filter_by(user_id=current_user.user_id).all()
        # Remove duplicates: keep only one entry per product_id, sum quantities
        unique_cart = {}
        for item in cart_items:
            if item.product_id in unique_cart:
                unique_cart[item.product_id].quantity += item.quantity
                db.session.delete(item)  # Remove duplicate
            else:
                unique_cart[item.product_id] = item
        db.session.commit()
        # Exclude items with quantity 0
        cart_items = [item for item in unique_cart.values() if item.quantity > 0]
        if not cart_items:
            flash('Your cart is empty', 'error')
            return redirect(url_for('views.cart'))

        # Calculate order summary
        subtotal = sum(item.product.base_price * item.quantity for item in cart_items)

        # Calculate dynamic shipping fee
        shipping_fee = calculate_shipping_fee(address, cart_items)
        total = subtotal + shipping_fee

        # Format cart items for template
        formatted_cart_items = []
        for item in cart_items:
            product = Product.query.get(item.product_id)
            # Use ProductImage from DB if available, fallback to static folder
            img = None
            if product.images and len(product.images) > 0:
                img = product.images[0].image_url
            if not img:
                img = get_product_image_url(product.product_name)
            # Ensure image URL starts with /static/
            if img and not img.startswith('/static/'):
                img = '/static/' + img.lstrip('/')
            formatted_cart_items.append({
                'product_name': product.product_name,
                'image_url': img,
                'color': item.color,
                'width': item.width,
                'model': item.model,
                'price': float(product.base_price),
                'quantity': item.quantity,
                'subtotal': float(product.base_price * item.quantity)
            })

        # Shipping option (can be made dynamic based on user selection)
        start_date = datetime.now() + timedelta(days=2)
        end_date = datetime.now() + timedelta(days=3)
        shipping_option = {
            'method': 'Standard Delivery',
            'delivery_date_range': f"Guaranteed to get by {start_date.strftime('%b %d')} - {end_date.strftime('%b %d, %Y')}"
        }

        # Order summary
        order_summary = {
            'subtotal': subtotal,
            'shipping': shipping_fee,
            'total': total,
            'total_items': sum(item.quantity for item in cart_items)
        }

        # QR code URLs and payment details for different methods
        qr_codes = {
            'bank': {
                'name': 'Bank Account',
                'qr_url': url_for('static', filename='pictures/bank_qr.png'),
                'account_name': 'JBR Tanching C.O',
                'account_number': '1234-5678-9012',
                'bank_name': 'BDO'
            },
            'gcash': {
                'name': 'GCash',
                'qr_url': url_for('static', filename='pictures/gcash_qr.png'),
                'account_name': 'JBR Tanching',
                'phone_number': '0912-345-6789'
            },
            'maya': {
                'name': 'Maya',
                'qr_url': url_for('static', filename='pictures/maya_qr.png'),
                'account_name': 'JBR Tanching',
                'phone_number': '0912-345-6789'
            }
        }

        return render_template('transaction.html',
            user=current_user,
            address=formatted_address,
            cart_items=formatted_cart_items,
            shipping_option=shipping_option,
            order_summary=order_summary,
            qr_codes=qr_codes
        )

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
def products():
    category = request.args.get('category')
    print(f"[DEBUG] Requested category: {category}")
    if not category:
        print("[DEBUG] No category specified in request.")
        return jsonify({'error': 'No category specified'}), 400

    # Handle 'All' or 'Fabrics' as parent category (show all fabrics)
    if category.strip().lower() in ['all', 'fabrics']:
        # Get all fabric-related categories
        fabric_categories = Category.query.filter(
            Category.category_name.in_(['Cotton Fabric', 'Polyester-Blend Fabrics', 'Lacoste Fabrics', 'Silk Fabrics'])
        ).all()
        if not fabric_categories:
            return jsonify({'error': 'No products found'}), 404
        category_ids = [cat.category_id for cat in fabric_categories]
        products = Product.query.options(subqueryload(Product.images)).filter(Product.category_id.in_(category_ids)).all()
    else:
        # Case-insensitive, trimmed category lookup
        cat_obj = Category.query.filter(
            func.lower(func.trim(Category.category_name)) == category.strip().lower()
        ).first()
        if not cat_obj:
            print(f"[DEBUG] No category found in DB for: {category}")
            return jsonify({'error': 'No products found'}), 404
        subcategories = Category.query.filter_by(parent_category_id=cat_obj.category_id).all()
        category_ids = [cat_obj.category_id] + [subcat.category_id for subcat in subcategories]
        products = Product.query.options(subqueryload(Product.images)).filter(Product.category_id.in_(category_ids)).all()

    print(f"[DEBUG] Number of products found: {len(products)}")
    if not products:
        return jsonify({'error': 'No products found'}), 404
    # Fetch real average rating and review count for each product
    product_list = []
    for product in products:
        print(f"DEBUG: {product.product_id} {product.product_name} images: {product.images}")
        reviews = Review.query.filter_by(product_id=product.product_id).all()
        avg_rating = sum(review.rating for review in reviews) / len(reviews) if reviews else 0
        review_count = len(reviews)
        # Always use ProductImage from DB if available
        img = None
        if product.images and len(product.images) > 0:
            img = product.images[0].image_url
        if not img:
            # Directly query ProductImage if relationship is empty
            img_obj = ProductImage.query.filter_by(product_id=product.product_id).first()
            if img_obj:
                img = img_obj.image_url
            else:
                img = ''  # Return empty string if no image
        # Fallback: use get_product_image_url if img is still empty
        if not img:
            img = get_product_image_url(product.product_name)
        # Ensure image URL starts with /static/
        if img and not img.startswith('/static/'):
            img = '/static/' + img.lstrip('/')
        print(f"DEBUG: Final image for {product.product_name}: {img}")
        product_list.append({
            'product_id': product.product_id,
            'name': product.product_name,
            'price': float(product.base_price),
            'image': img,
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
    product_id = request.args.get('product_id')
    product_name = request.args.get('product')
    product = None
    if product_id:
        product = Product.query.get(product_id)
    elif product_name:
        product = Product.query.filter(func.lower(func.trim(Product.product_name)) == product_name.strip().lower()).first()
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    # Fetch brand name
    brand_name = product.brand_obj.brand_name if product.brand_obj else None
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
    # Fetch all models in the same family (same brand and type)
    model_family = Product.query.filter(
        Product.brand_id == product.brand_id,
        Product.category_id == product.category_id
    ).all()
    model_options = [
        {
            'product_id': m.product_id,
            'name': m.product_name,
            'model_number': m.model_number
        } for m in model_family
    ]
    return jsonify({
        'product_id': product.product_id,
        'name': product.product_name,
        'model_number': product.model_number,
        'description': product.description,
        'price': float(product.base_price),
        'stock': product.stock_quantity,
        'image': get_product_image_url(product.product_name),
        'images': [img.image_url for img in sorted(product.images, key=lambda i: i.display_order)],
        'category_id': product.category_id,
        'category_name': category_name,
        'brand': brand_name,
        'specifications': specs,
        'model_options': model_options
    })

ALLOWED_REVIEW_MEDIA = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}
REVIEW_MEDIA_FOLDER = os.path.join('SadWebApp', 'website', 'static', 'review_media')
os.makedirs(REVIEW_MEDIA_FOLDER, exist_ok=True)

# Register backup/restore endpoints
from .backup_restore import backup_restore_bp

def register_backup_restore(app):
    app.register_blueprint(backup_restore_bp)

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
    avg_rating = db.session.query(func.avg(Review.rating)).filter_by(product_id=product_id).scalar()
    count = db.session.query(func.count(Review.rating)).filter_by(product_id=product_id).scalar()
    return jsonify({'success': True, 'average': round(avg_rating or 0, 2), 'count': count})

@views.route('/api/create-order', methods=['POST'])
@login_required
def create_order():
    data = request.get_json()
    payment_method = data.get('payment_method')
    reference_number = data.get('reference_number')

    # Validate payment method
    allowed_methods = ['Cash on Delivery', 'Bank', 'GCash', 'Maya']
    if payment_method not in allowed_methods:
        return {'success': False, 'message': 'Invalid payment method.'}, 400

    # Get user's default address
    address = Address.query.filter_by(user_id=current_user.user_id, is_default=True).first()
    if not address:
        return {'success': False, 'message': 'No default address found.'}, 400

    # Get cart items and validate stock
    cart_items = CartItem.query.filter_by(user_id=current_user.user_id).all()
    
    # If cart is empty, check for buy-now item in session
    if not cart_items:
        buy_now_item = session.get('buy_now_item')
        if not buy_now_item:
            return {'success': False, 'message': 'Cart is empty and no buy-now item found.'}, 400
        
        # Create a pseudo cart item for buy-now
        product = Product.query.get(buy_now_item['product_id'])
        if not product:
            return {'success': False, 'message': 'Product not found.'}, 400
            
        if product.stock_quantity < buy_now_item['quantity']:
            return {
                'success': False,
                'message': 'Item is out of stock',
                'out_of_stock_items': [{
                    'product_name': product.product_name,
                    'requested': buy_now_item['quantity'],
                    'available': product.stock_quantity
                }]
            }, 400
            
        # Calculate total with dynamic shipping
        subtotal = product.base_price * buy_now_item['quantity']
        shipping_fee = calculate_shipping_fee(address, [type('FakeCartItem', (), {'product': product, 'quantity': buy_now_item['quantity']})()])
        total = subtotal + shipping_fee

        # Create order
        order = Order(
            user_id=current_user.user_id,
            total_amount=total,
            status='pending',
            payment_method=payment_method,
            payment_status='pending',
            shipping_address=address.complete_address
        )
        db.session.add(order)
        db.session.flush()  # Get order_id

        # Add order item and update stock
        product.stock_quantity -= buy_now_item['quantity']  # Reduce stock
        order_item = OrderItem(
            order_id=order.order_id,
            product_id=product.product_id,
            quantity=buy_now_item['quantity'],
            price=float(product.base_price)
        )
        db.session.add(order_item)
        
        # Clear buy-now session
        session.pop('buy_now_item', None)
        db.session.commit()
        
        return {'success': True, 'order_id': order.order_id}

    # Regular cart flow
    # Check stock availability for all items
    out_of_stock_items = []
    for item in cart_items:
        product = Product.query.get(item.product_id)
        if product.stock_quantity < item.quantity:
            out_of_stock_items.append({
                'product_name': product.product_name,
                'requested': item.quantity,
                'available': product.stock_quantity
            })
    
    if out_of_stock_items:
        return {
            'success': False,
            'message': 'Some items are out of stock',
            'out_of_stock_items': out_of_stock_items
        }, 400

    # Calculate total with dynamic shipping
    subtotal = sum(item.product.base_price * item.quantity for item in cart_items)
    shipping_fee = calculate_shipping_fee(address, cart_items)
    total = subtotal + shipping_fee

    # Create order
    order = Order(
        user_id=current_user.user_id,
        total_amount=total,
        status='pending',
        payment_method=payment_method,
        payment_status='pending',
        shipping_address=address.complete_address
    )
    db.session.add(order)
    db.session.flush()  # Get order_id

    # Add order items and update stock
    for item in cart_items:
        product = Product.query.get(item.product_id)
        product.stock_quantity -= item.quantity  # Reduce stock
        db.session.add(OrderItem(
            order_id=order.order_id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=float(item.product.base_price)
        ))

    # Clear cart
    CartItem.query.filter_by(user_id=current_user.user_id).delete()
    db.session.commit()

    return {'success': True, 'order_id': order.order_id}

@views.route('/api/related-products')
def get_related_products():
    product_id = request.args.get('product_id')
    if not product_id:
        return jsonify({'error': 'No product_id specified'}), 400
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    # Get products from the same brand and category, excluding the current product
    related_products = Product.query.filter(
        Product.brand_id == product.brand_id,  # Filter by brand_id
        Product.category_id == product.category_id,
        Product.product_id != product.product_id
    ).limit(4).all()
    
    # Fallback: if no related products from same brand, get other products from same brand
    if not related_products:
        related_products = Product.query.filter(
            Product.brand_id == product.brand_id,
            Product.product_id != product.product_id
        ).limit(10).all()
    
    result = []
    for p in related_products:
        reviews = Review.query.filter_by(product_id=p.product_id).all()
        avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0
        review_count = len(reviews)
        # Use ProductImage if available, fallback to get_product_image_url
        img = None
        if p.images and len(p.images) > 0:
            img = p.images[0].image_url
        if not img:
            img_obj = ProductImage.query.filter_by(product_id=p.product_id).first()
            if img_obj:
                img = img_obj.image_url
            else:
                img = ''
        if not img:
            img = get_product_image_url(p.product_name)
        # Ensure image URL starts with /static/
        if img and not img.startswith('/static/'):
            img = '/static/' + img.lstrip('/')
        result.append({
            'product_id': p.product_id,
            'name': p.product_name,
            'price': float(p.base_price),
            'image': img,
            'sold': p.sold if hasattr(p, 'sold') else 0,
            'rating': avg_rating,
            'review_count': review_count,
            'brand': p.brand_obj.brand_name if p.brand_obj else None
        })
    return jsonify(result)

@views.route('/api/can-review')
@login_required
def can_review():
    product_id = request.args.get('product_id')
    if not product_id:
        return jsonify({'can_review': False, 'reason': 'No product_id specified'}), 400
    # Check if user has a completed order for this product
    completed_orders = Order.query.filter_by(user_id=current_user.user_id, status='completed').all()
    eligible = False
    for order in completed_orders:
        for item in order.order_items:
            if str(item.product_id) == str(product_id):
                eligible = True
                break
        if eligible:
            break
    return jsonify({'can_review': eligible})

@views.route('/api/shipping-fee', methods=['GET'])
@login_required
def get_shipping_fee():
    address = Address.query.filter_by(user_id=current_user.user_id, is_default=True).first()
    if not address:
        return jsonify({'success': False, 'message': 'No default address found.'}), 400
    cart_items = CartItem.query.filter_by(user_id=current_user.user_id).all()
    if not cart_items:
        return jsonify({'success': False, 'message': 'Cart is empty.'}), 400
    shipping_fee = calculate_shipping_fee(address, cart_items)
    return jsonify({'success': True, 'shipping_fee': shipping_fee})

@views.route('/buy-now', methods=['POST'])
@login_required
def buy_now():
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    color = data.get('color')
    width = data.get('width')
    model = data.get('model')
    if not product_id:
        return jsonify({'success': False, 'message': 'Product ID is required'}), 400
    session['buy_now_item'] = {
        'product_id': product_id,
        'quantity': quantity,
        'color': color,
        'width': width,
        'model': model
    }
    return jsonify({'success': True})
