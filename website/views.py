from flask import Blueprint, render_template, flash, redirect, url_for, jsonify, request, session
from flask_login import login_required, current_user
from . import db
from .models import Product, CartItem, SupplyRequest, Category, Review, User, Address, Order, OrderItem, ProductImage, Inventory, Supplier, Brand, ProductSpecification, ProductVariant
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

@views.route('/products-by-category/<category_name>')
def products_by_category_new(category_name):
    # Find category by name (case-insensitive)
    category_obj = Category.query.filter(func.lower(Category.category_name) == category_name.lower()).first()
    if not category_obj:
        # No such category, show empty list
        return render_template("products.html", user=current_user, products=[], category=category_name)
    # Filter products by category_id
    products = Product.query.filter_by(category_id=category_obj.category_id).all()
    return render_template("products.html", user=current_user, products=products, category=category_obj.category_name)

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
            },
            'gcash': {
                'name': 'GCash',
                'qr_url': url_for('static', filename='pictures/gcash_qr.png'),
                'account_name': 'JBR Tanching C.O',
                'phone_number': '092• ••••459'
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
            },
            'gcash': {
                'name': 'GCash',
                'qr_url': url_for('static', filename='pictures/gcash_qr.png'),
                'account_name': 'JBR Tanching C.O',
                'phone_number': '092• ••••459'
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

@views.route('/api/payments', methods=['POST'])
def api_payments():
    order_id = request.form.get('order_id')
    user_id = request.form.get('user_id')
    payment_method_id = request.form.get('payment_method_id')
    reference_number = request.form.get('reference_number')  # This should be the OCR result
    vision_api_result = request.form.get('vision_api_result')
    file = request.files.get('proof_of_payment')  # Field name updated

    print(f"[api_payments] order_id={order_id}, user_id={user_id}, payment_method_id={payment_method_id}, reference_number={reference_number}")

    # Validate required fields
    missing_fields = []
    for field_name, value in [
        ('order_id', order_id),
        ('user_id', user_id),
        ('payment_method_id', payment_method_id),
        ('reference_number', reference_number)
    ]:
        if not value:
            missing_fields.append(field_name)
    if missing_fields:
        return jsonify({'success': False, 'message': f"Missing required fields: {', '.join(missing_fields)}"}), 400

    # Find the order
    order = Order.query.filter_by(order_id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({'success': False, 'message': 'Order not found'}), 404

    # Save file to static/proof_of_payment
    proof_of_payment_url = None
    if file:
        from flask import current_app
        import uuid
        upload_folder = os.path.join(current_app.root_path, 'static', 'proof_of_payment')
        os.makedirs(upload_folder, exist_ok=True)
        ext = file.filename.rsplit('.', 1)[-1].lower()
        unique_filename = f'{uuid.uuid4().hex}.{ext}'
        file_path = os.path.join(upload_folder, unique_filename)
        print(f"Saving file to: {file_path}")  # Debug
        file.save(file_path)
        proof_of_payment_url = f'/static/proof_of_payment/{unique_filename}'
        order.proof_of_payment_url = proof_of_payment_url
    else:
        order.proof_of_payment_url = None

    # Store the OCR result as reference_number
    order.reference_number = reference_number
    order.payment_method = payment_method_id  # Changed from payment_method_id to payment_method
    order.payment_status = 'pending'  # Add payment status
    db.session.commit()
    return jsonify({'success': True})

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
    proof_of_payment_url = data.get('proof_of_payment_url')

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
             shipping_address=address.complete_address,
             order_date=datetime.utcnow(),
             order_status='To Pay'
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
        
        return {'success': True, 'order_id': order.order_id, 'user_id': current_user.user_id}

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
        reference_number=reference_number,
        proof_of_payment_url=proof_of_payment_url,
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
    for item in cart_items:
        db.session.delete(item)
    
    db.session.commit()
    
    return {'success': True, 'order_id': order.order_id, 'user_id': current_user.user_id}

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

#ari

@views.route('/admin/update_profile', methods=['PUT', 'POST'])
@login_required
def update_profile():
    data = request.json or request.get_json()
    user = User.query.get(current_user.user_id)
    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404
    try:
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.role = data.get('role', user.role)
        if data.get('password'):
            user.password = generate_password_hash(data['password'])
        db.session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@views.route('/admin/personnel_list', methods=['GET'])
def personnel_list():
    users = User.query.all()
    user_list = [{
        "user_id": u.user_id,
        "username": u.username,
        "email": u.email,
        "first_name": u.first_name,
        "last_name": u.last_name,
        "role": u.role,
        "last_login": u.last_login
    } for u in users]
    return jsonify(user_list), 200

@views.route('/admin/add_personnel', methods=['POST'])
def add_personnel():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"success": False, "error": "Email already exists"}), 409
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"success": False, "error": "Username already exists"}), 409

    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password,
        first_name=data.get('first_name'),
        middle_name=data.get('middle_name'),
        last_name=data.get('last_name'),
        role=data['role'],
    )
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            "success": True,
            "user": {
                "user_id": new_user.user_id,
                "username": new_user.username,
                "email": new_user.email,
                "first_name": new_user.first_name,
                "middle_name": new_user.middle_name,
                "last_name": new_user.last_name,
                "role": new_user.role,
                "last_login": new_user.last_login
            }
        }), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"success": False, "error": "Database error"}), 500

@views.route('/admin/update_personnel/<int:user_id>', methods=['PUT', 'POST'])
def update_personnel(user_id):
    data = request.json
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404
    try:
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.first_name = data.get('first_name', user.first_name)
        user.middle_name = data.get('middle_name', user.middle_name)
        user.last_name = data.get('last_name', user.last_name)
        user.role = data.get('role', user.role)
        # Only update password if provided
        if data.get('password'):
            user.password = generate_password_hash(data['password'])
        db.session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@views.route('/admin/delete_personnel/<int:user_id>', methods=['DELETE', 'POST'])
def delete_personnel(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "error": "User not found"}), 404
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"success": True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


import traceback
@views.route('/admin/add_supplier', methods=['POST'])
def add_supplier():
    data = request.get_json()
    print("DEBUG: Incoming data for add_supplier:", data)
    required_fields = [
        'product_category', 'product_name', 'supplier_name',
        'contact_person', 'address', 'status', 'phone_number'
    ]
    if not data or not all(field in data and data[field] for field in required_fields):
        print("DEBUG: Missing required fields")
        return jsonify({'success': False, 'error': 'Missing required fields'})
    try:
        supplier = Supplier(
            product_category=data['product_category'],
            product_name=data['product_name'],
            supplier_name=data['supplier_name'],
            contact_person=data['contact_person'],
            phone_number=data['phone_number'],
            address=data['address'],
            status=data['status']
        )
        db.session.add(supplier)
        db.session.commit()
        print("DEBUG: Supplier added successfully")
        return jsonify({'success': True, 'id': supplier.id})
    except Exception as e:
        db.session.rollback()
        print("ERROR: Exception in add_supplier:", e)
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 400

@views.route('/admin/product_spec_list')
def product_spec_list():
    product_id = request.args.get('product_id')
    if product_id:
        specs = ProductSpecification.query.filter_by(product_id=product_id).order_by(ProductSpecification.display_order).all()
    else:
        specs = ProductSpecification.query.order_by(ProductSpecification.product_id, ProductSpecification.display_order).all()
    return jsonify([
        {
            'spec_id': getattr(spec, 'id', getattr(spec, 'spec_id', '')),
            'product_id': spec.product_id,
            'spec_name': spec.spec_name,
            'spec_value': spec.spec_value,
            'display_order': spec.display_order
        }
        for spec in specs
    ])

@views.route('/admin/inventory_list')
def inventory_list():
    items = Inventory.query.order_by(Inventory.id.desc()).all()
    result = []
    for i in items:
        result.append({
            'id': i.id,
            'product_name': i.product_name,
            'product_code': i.product_code,
            'category_name': i.category_name,
            'selling_price': i.selling_price,
            'min_stock': i.min_stock,
            'max_stock': i.max_stock,
            'last_updated': i.last_updated.strftime('%Y-%m-%d %H:%M:%S') if i.last_updated else '',
            'supplier_name': i.supplier_name,
            'supplier_price': i.supplier_price,
            'available_stock': i.available_stock,
            'stock_status': i.stock_status,
            'product_status': i.product_status,
            'memo': i.memo or ''
        })
    return jsonify(result)

@views.route('/admin/add_inventory', methods=['POST'])
def add_inventory():

    data = request.get_json()
    required_fields = [
        'product_name', 'product_code', 'category_name', 'selling_price', 'min_stock',
        'max_stock', 'supplier_name', 'supplier_price', 'available_stock',
        'stock_status', 'product_status'
    ]
    missing = [f for f in required_fields if f not in data or data[f] in (None, '')]
    if missing:
        return jsonify({'success': False, 'error': f'Missing required fields: {", ".join(missing)}'})
    try:
        from datetime import datetime
        last_updated = data.get('last_updated')
        if last_updated:
            try:
                last_updated_dt = datetime.strptime(last_updated, '%Y-%m-%dT%H:%M')
            except Exception:
                last_updated_dt = datetime.utcnow()
        else:
            last_updated_dt = datetime.utcnow()
        inventory = Inventory(
            product_name=data.get('product_name'),
            product_code=data.get('product_code'),
            category_name=data.get('category_name'),
            selling_price=data.get('selling_price'),
            min_stock=data.get('min_stock'),
            max_stock=data.get('max_stock'),
            last_updated=last_updated_dt,
            supplier_name=data.get('supplier_name'),
            supplier_price=data.get('supplier_price'),
            available_stock=data.get('available_stock'),
            stock_status=data.get('stock_status'),
            product_status=data.get('product_status'),
            memo=data.get('memo')
        )
        db.session.add(inventory)
        db.session.commit()
        return jsonify({'success': True, 'id': inventory.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@views.route('/admin/update_inventory/<int:inventory_id>', methods=['PUT'])
def update_inventory(inventory_id):
    data = request.get_json()
    inventory = Inventory.query.get_or_404(inventory_id)
    try:
        inventory.product_name = data.get('product_name', inventory.product_name)
        inventory.product_code = data.get('product_code', inventory.product_code)
        inventory.category_name = data.get('category_name', inventory.category_name)
        inventory.selling_price = data.get('selling_price', inventory.selling_price)
        inventory.min_stock = data.get('min_stock', inventory.min_stock)
        inventory.max_stock = data.get('max_stock', inventory.max_stock)
        inventory.supplier_name = data.get('supplier_name', inventory.supplier_name)
        inventory.supplier_price = data.get('supplier_price', inventory.supplier_price)
        inventory.available_stock = data.get('available_stock', inventory.available_stock)
        inventory.stock_status = data.get('stock_status', inventory.stock_status)
        inventory.product_status = data.get('product_status', inventory.product_status)
        inventory.memo = data.get('memo', inventory.memo)
        # Handle last_updated if provided
        from datetime import datetime
        last_updated = data.get('last_updated')
        if last_updated:
            try:
                inventory.last_updated = datetime.strptime(last_updated, '%Y-%m-%dT%H:%M')
            except Exception:
                pass
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@views.route('/admin/delete_inventory/<int:inventory_id>', methods=['DELETE'])
def delete_inventory(inventory_id):
    inventory = Inventory.query.get(inventory_id)
    if not inventory:
        return jsonify({'success': False, 'error': 'Inventory not found'}), 404
    db.session.delete(inventory)
    db.session.commit()
    return jsonify({'success': True})

@views.route('/admin/update_supplier/<int:supplier_id>', methods=['PUT'])
def update_supplier(supplier_id):
    data = request.get_json()
    supplier = Supplier.query.get_or_404(supplier_id)
    try:
        supplier.product_category = data.get('product_category', supplier.product_category)
        supplier.product_name = data.get('product_name', supplier.product_name)
        supplier.supplier_name = data.get('supplier_name', supplier.supplier_name)
        supplier.contact_person = data.get('contact_person', supplier.contact_person)
        supplier.phone_number = data.get('phone_number', supplier.phone_number)
        supplier.address = data.get('address', supplier.address)
        supplier.status = data.get('status', supplier.status)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@views.route('/admin/delete_supplier/<int:supplier_id>', methods=['DELETE'])
def delete_supplier(supplier_id):
    try:
        supplier = Supplier.query.get(supplier_id)
        if not supplier:
            return jsonify({'success': False, 'error': 'Supplier not found'})
        db.session.delete(supplier)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@views.route('/admin/supplier_list')
def supplier_list():
    suppliers = Supplier.query.order_by(Supplier.id.desc()).all()
    result = []
    for s in suppliers:
        result.append({
            'id': s.id,
            'product_category': s.product_category,
            'product_name': s.product_name,
            'supplier_name': s.supplier_name,
            'contact_person': s.contact_person,
            'phone_number': s.phone_number,
            'address': s.address,
            'status': s.status,
            'registration_date': s.registration_date.strftime('%Y-%m-%d %H:%M:%S') if s.registration_date else ''
        })
    return jsonify(result)

@views.route('/admin/add_product', methods=['POST'])
def add_product():
    try:
        # Get product fields from form
        product_name = request.form['product_name']
        model_number = request.form['model_number']
        description = request.form.get('description', '')
        brand_id = request.form['brand_id']
        category_id = request.form['category_id']
        base_price = request.form['base_price']
        discount_percentage = request.form.get('discount_percentage', 0)
        stock_quantity = request.form['stock_quantity']
        # Ignore subcategory and picture fields if present

        # Create product
        product = Product(
            product_name=product_name,
            model_number=model_number,
            description=description,
            brand_id=brand_id,
            category_id=category_id,
            base_price=base_price,
            discount_percentage=discount_percentage,
            stock_quantity=stock_quantity,
        )
        db.session.add(product)
        db.session.commit()

        # Handle images, specifications, variants (expand as needed)
        # Example: save images, specs, variants using product.product_id

        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

    # In views.py
@views.route('/api/brands')
def get_brands():
    brands = Brand.query.all()
    return jsonify([{
        'brand_id': b.brand_id,
        'brand_name': b.brand_name,
        'description': b.description
    } for b in brands])

@views.route('/admin/brand_list')
def admin_brand_list():
    brands = Brand.query.all()
    return jsonify([
        {
            'brand_id': b.brand_id,
            'brand_name': b.brand_name,
            'description': b.description
        } for b in brands
    ])

@views.route('/api/categories')
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        'category_id': c.category_id,
        'category_name': c.category_name
    } for c in categories])

@views.route('/admin/category_list')
def admin_category_list():
    categories = Category.query.all()
    return jsonify([
        {
            'category_id': c.category_id,
            'category_name': c.category_name,
            'parent_category_id': getattr(c, 'parent_category_id', None)
        } for c in categories
    ])

@views.route('/admin/update_product/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'success': False, 'error': 'Product not found'})
        data = request.get_json()
        # Map JS field names to model attributes
        product.product_name = data.get('name', product.product_name)
        product.model_number = data.get('model_number', product.model_number)
        product.description = data.get('description', product.description)
        product.category_id = data.get('category_id', product.category_id)
        product.base_price = data.get('price', product.base_price)
        product.discount_percentage = data.get('discount', product.discount_percentage)
        product.stock_quantity = data.get('stock_quantity', product.stock_quantity)
        product.brand_id = data.get('brand_id', product.brand_id)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@views.route('/admin/delete_product/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'success': False, 'error': 'Product not found'})
        # Delete all related data
        from .models import ProductVariant, ProductImage, ProductSpecification, CartItem, OrderItem, Review, SupplyRequest
        ProductVariant.query.filter_by(product_id=product_id).delete()
        ProductImage.query.filter_by(product_id=product_id).delete()
        ProductSpecification.query.filter_by(product_id=product_id).delete()
        CartItem.query.filter_by(product_id=product_id).delete()
        OrderItem.query.filter_by(product_id=product_id).delete()
        Review.query.filter_by(product_id=product_id).delete()
        SupplyRequest.query.filter_by(product_id=product_id).delete()
        db.session.delete(product)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@views.route('/admin/product_list')
def admin_product_list():
    products = Product.query.all()
    product_list = []
    for product in products:
        product_list.append({
            'product_id': getattr(product, 'product_id', ''),
            'name': getattr(product, 'product_name', ''),
            'model_number': getattr(product, 'model_number', ''),
            'description': getattr(product, 'description', ''),
            'category_id': getattr(product, 'category_id', ''),
            'price': float(getattr(product, 'base_price', 0)),
            'discount': getattr(product, 'discount_percentage', ''),
            'stock_quantity': getattr(product, 'stock_quantity', ''),
            'created_at': str(getattr(product, 'created_at', '')),
            'updated_at': str(getattr(product, 'updated_at', '')),
            'brand_id': getattr(product, 'brand_id', ''),
            'image': product.images[0].image_url if product.images else '/static/pictures/default.jpg',
        })
    return jsonify(product_list)

@views.route('/admin/product_variant_list')
def product_variant_list():
    variants = ProductVariant.query.order_by(ProductVariant.variant_id).all()
    return jsonify([
        {
            'variant_id': v.variant_id,
            'product_id': v.product_id,
            'variant_name': v.variant_name,
            'variant_value': v.variant_value,
            'additional_price': str(v.additional_price) if hasattr(v, 'additional_price') else '',
            'stock_quantity': v.stock_quantity if hasattr(v, 'stock_quantity') else '',
            'created_at': str(v.created_at) if hasattr(v, 'created_at') else '',
            'updated_at': str(v.updated_at) if hasattr(v, 'updated_at') else ''
        }
        for v in variants
    ])

@views.route('/admin/add_product_variant', methods=['POST'])
def add_product_variant():
    try:
        product_id = request.form['product_id']
        variant_name = request.form['variant_name']
        variant_value = request.form['variant_value']
        additional_price = request.form.get('additional_price', 0)
        stock_quantity = request.form.get('stock_quantity', 0)
        # Convert numeric fields safely
        try:
            additional_price = float(additional_price)
        except Exception:
            additional_price = 0.0
        try:
            stock_quantity = int(stock_quantity)
        except Exception:
            stock_quantity = 0
        new_variant = ProductVariant(
            product_id=product_id,
            variant_name=variant_name,
            variant_value=variant_value,
            additional_price=additional_price,
            stock_quantity=stock_quantity
        )
        db.session.add(new_variant)
        db.session.commit()
        return jsonify({'success': True, 'variant_id': new_variant.variant_id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400

# --- PRODUCT IMAGE UPLOAD ---
UPLOAD_FOLDER = os.path.join('SadWebApp', 'website', 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_image(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS


@views.route('/admin/product_images')
def admin_product_images():



    images = ProductImage.query.all()
    image_list = []
    for img in images:
        image_list.append({
            'image_id': img.image_id,
            'product_id': img.product_id,
            'image_url': img.image_url,
            'image_type': img.image_type,
            'display_order': img.display_order,
            'text': img.alt_text
        })
    return jsonify(image_list)

@views.route('/admin/add_product_image', methods=['POST'])
def add_product_image():
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image file provided'}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400
    if file and allowed_image(file.filename):
        filename = secure_filename(file.filename)
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)
        image_url = f'/static/uploads/{filename}'
        # Save to DB
        new_img = ProductImage(
            product_id=request.form.get('product_id'),
            image_url=image_url,
            image_type=request.form.get('image_type', ''),
            display_order=request.form.get('display_order', 0),
            alt_text=request.form.get('text', '')
        )
        db.session.add(new_img)
        db.session.commit()
        return jsonify({'success': True, 'image_url': image_url})
    else:
        return jsonify({'success': False, 'error': 'Invalid file type'}), 400

@views.route('/admin/add_product_spec', methods=['POST'])
def add_product_spec():
    try:
        product_id = request.form['product_id']
        spec_name = request.form['spec_name']
        spec_value = request.form['spec_value']
        display_order = request.form.get('display_order', 0)

        new_spec = ProductSpecification(
            product_id=product_id,
            spec_name=spec_name,
            spec_value=spec_value,
            display_order=display_order
        )
        db.session.add(new_spec)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 400

# ================= ADMIN: CUSTOMER ORDERS LIST API =================
@views.route('/admin/orders_list')
def admin_orders_list():
    """
    Returns all customer orders (with items) for admin panel. All statuses included.
    """
    from .models import Order, OrderItem, User
    orders = Order.query.order_by(Order.created_at.desc()).all()
    data = []
    for order in orders:
        user = User.query.get(order.user_id)
        items = []
        for item in order.items:
            items.append({
                "order_item_id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": float(item.price),
                "created_at": item.created_at.strftime("%Y-%m-%d %H:%M:%S") if item.created_at else ""
            })
        data.append({
            "order_id": order.order_id,
            "user_id": order.user_id,
            "customer_name": f"{user.first_name} {user.last_name}" if user else "",
            "total_amount": float(order.total_amount) if order.total_amount is not None else 0,
            "status": order.status,
            "payment_method": order.payment_method,
            "payment_status": order.payment_status,
            "shipping_address": order.shipping_address,
            "order_status": order.order_status,
            "order_date": order.order_date.strftime("%Y-%m-%d %H:%M:%S") if order.order_date else "",
            "customer_issue": order.customer_issue,
            "message": order.message,
            "feedback": order.feedback,
            "rate": order.rate,
            "cancellation_reason": order.cancellation_reason,
            "items": items
        })
    return jsonify(data)
