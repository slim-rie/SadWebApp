from flask import Blueprint, render_template, flash, redirect, url_for, jsonify, request, session
from flask_login import login_required, current_user
from . import db
from .models import Product, CartItem, SupplyRequest, Category, Review, User, Address, Order, OrderItem, ProductImage, Inventory, Supplier, ProductSpecification, ProductVariant, Role, ProductPromotion, Sales
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
    products = Product.query.filter(Product.category_id.in_([cat.category_id for cat in sewing_categories])).all()
    
    # Get sales data for each product
    product_sales = {}
    for product in products:
        sales_count = Sales.query.filter_by(product_id=product.product_id).count()
        product_sales[product.product_id] = sales_count
    
    return render_template('sewingmachines.html', 
                         user=current_user, 
                         categories=sewing_categories,
                         products=products,
                         product_sales=product_sales)

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
    # Try to find the image with spaces replaced by underscores
    safe_name = product_name.replace(' ', '_')
    for ext in ['.jpg', '.png', '.jpeg']:
        filename = f"{safe_name}{ext}"
        file_path = os.path.join(base_path, filename)
        if os.path.exists(file_path):
            return f"/static/pictures/{filename}"
    # If no image found, return default image
    return "/static/pictures/no-image.png"

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


# Payment Routes
@views.route('/transaction')
@login_required
def transaction():
    buy_now_mode = request.args.get('buy_now')
    buy_now_item = session.get('buy_now_item') if buy_now_mode else None
    # --- Robust buy-now for guests: try to get from request if missing ---
    if buy_now_mode and not buy_now_item and request.is_json:
        buy_now_item = request.get_json().get('buy_now_item')
        if buy_now_item:
            session['buy_now_item'] = buy_now_item
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

    # Get stock from Inventory by product_id
    inventory = Inventory.query.filter_by(product_id=product.product_id).first()
    stock_quantity = inventory.available_stock if inventory and hasattr(inventory, 'available_stock') else 0

    # Get images (use ProductImage relationship)
    images = [img.image_url for img in sorted(product.images, key=lambda i: getattr(i, 'display_order', 0))] if product.images else []

    # Get reviews for this product
    reviews = []
    for r in Review.query.filter_by(product_id=product.product_id).order_by(Review.created_at.desc()).all():
        username = None
        if r.user_id:
            user_obj = User.query.get(r.user_id)
            username = user_obj.username if user_obj else 'Unknown'
        else:
            username = 'Unknown'
        reviews.append({
            'review_id': r.review_id,
            'user_id': r.user_id,
            'username': username,
            'rating': r.rating,
            'comment': r.comment,
            'created_at': r.created_at.strftime('%Y-%m-%d %H:%M') if r.created_at else '',
            'media_url': getattr(r, 'media_url', None),
            'media_type': getattr(r, 'media_type', None)
        })

    # Get related products (same category, exclude current)
    related_products = []
    for p in Product.query.filter(Product.category_id == product.category_id, Product.product_id != product.product_id).limit(8).all():
        related_products.append({
            'product_id': p.product_id,
            'name': p.product_name,
            'model_number': p.model_number,
            'price': float(p.base_price),
            'image': get_product_image_url(p.product_name)
        })

    # Get category name
    category_name = product.category.category_name if product.category else None

    # Get all specifications, ordered by display_order, excluding 'Category ID'
    specs = [
        {'name': spec.spec_name, 'value': spec.spec_value, 'order': spec.display_order}
        for spec in sorted(product.specifications, key=lambda s: s.display_order or 0)
        if spec.spec_name.lower() != 'category id'
    ] if product.specifications else []
    if category_name:
        specs.insert(0, {'name': 'Category', 'value': category_name, 'order': 0})

    # Get all models in the same category
    model_family = Product.query.filter(
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
        'stock': stock_quantity,
        'image': images[0] if images else get_product_image_url(product.product_name),
        'images': images,
        'category_id': product.category_id,
        'category_name': category_name,
        'specifications': specs,
        'model_options': model_options,
        'reviews': reviews,
        'related_products': related_products
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
    reference_number = request.form.get('reference_number')
    vision_api_result = request.form.get('vision_api_result')
    file = request.files.get('proof_of_payment')

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

    # Find the payment record
    payment = Payment.query.filter_by(order_id=order_id, user_id=user_id).first()
    if not payment:
        return jsonify({'success': False, 'message': 'Payment record not found'}), 404

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
        file.save(file_path)
        proof_of_payment_url = f'/static/proof_of_payment/{unique_filename}'
        payment.payment_proof_url = proof_of_payment_url
    else:
        payment.payment_proof_url = None

    payment.reference_number = reference_number
    payment.payment_method_id = payment_method_id
    payment.payment_status = 'pending'
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
    payment_method = (data.get('payment_method') or '').strip().lower()
    allowed_methods = ['cash on delivery', 'bank', 'bank transfer', 'gcash', 'maya']
    if payment_method not in allowed_methods:
        return {'success': False, 'message': 'Invalid payment method.'}, 400
    reference_number = data.get('reference_number')
    proof_of_payment_url = data.get('proof_of_payment_url')

    # Get user's default address
    address = Address.query.filter_by(user_id=current_user.user_id, is_default=True).first()
    if not address:
        return {'success': False, 'message': 'No default address found.'}, 400

    # Get cart items and validate stock
    cart_items = CartItem.query.filter_by(user_id=current_user.user_id).all()
    
    # If cart is empty, check for buy-now item in session
    if not cart_items:
        buy_now_item = session.get('buy_now_item')
        # --- Robust buy-now for guests: try to get from request if missing ---
        if not buy_now_item and data.get('buy_now_item'):
            buy_now_item = data['buy_now_item']
            session['buy_now_item'] = buy_now_item
        if not buy_now_item:
            return {'success': False, 'message': 'Cart is empty and no buy-now item found.'}, 400
        
        # Create a pseudo cart item for buy-now
        product = Product.query.get(buy_now_item['product_id'])
        if not product:
            return {'success': False, 'message': 'Product not found.'}, 400
        
        # FIX: Get stock from Inventory
        inventory = Inventory.query.filter_by(product_id=product.product_id).first()
        available_stock = inventory.available_stock if inventory else 0
        if available_stock < buy_now_item['quantity']:
            return {
                'success': False,
                'message': 'Item is out of stock',
                'out_of_stock_items': [{
                    'product_name': product.product_name,
                    'requested': buy_now_item['quantity'],
                    'available': available_stock
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
             address_id=address.address_id,
             order_date=datetime.utcnow(),
             status_id=1  # <-- Use the correct status_id for 'To Pay' or your default status
        )
        db.session.add(order)
        db.session.flush()  # Get order_id

        # Add order item and update stock
        inventory = Inventory.query.filter_by(product_id=product.product_id).first()
        if inventory:
            inventory.available_stock -= buy_now_item['quantity']
            db.session.add(inventory)
        order_item = OrderItem(
            order_id=order.order_id,
            product_id=product.product_id,
            quantity=buy_now_item['quantity'],
            unit_price=float(product.base_price)
        )
        db.session.add(order_item)
        
        # Clear buy-now session
        session.pop('buy_now_item', None)
        db.session.commit()
        
        # Look up the payment method ID
        payment_method_obj = PaymentMethod.query.filter(func.lower(PaymentMethod.method_name) == payment_method.lower()).first()
        payment_method_id = payment_method_obj.payment_method_id if payment_method_obj else None
        payment = Payment(
            order_id=order.order_id,
            user_id=current_user.user_id,
            payment_method_id=payment_method_id,
            payment_date=datetime.utcnow(),
            payment_proof_url=data.get('proof_of_payment_url'),
            payment_status='pending',
            reference_number=data.get('reference_number')
        )
        db.session.add(payment)
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
        address_id=address.address_id,
        order_date=datetime.utcnow(),
        status_id=1  # <-- Use the correct status_id for 'To Pay' or your default status
    )
    db.session.add(order)
    db.session.flush()  # Get order_id

    # Add order items and update stock
    for item in cart_items:
        product = Product.query.get(item.product_id)
        inventory = Inventory.query.filter_by(product_id=product.product_id).first()
        if inventory:
            inventory.available_stock -= item.quantity
            db.session.add(inventory)
        db.session.add(OrderItem(
            order_id=order.order_id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=float(product.base_price)
        ))

    # Clear cart
    for item in cart_items:
        db.session.delete(item)
    
    db.session.commit()
    
    # Look up the payment method ID
    payment_method_obj = PaymentMethod.query.filter(func.lower(PaymentMethod.method_name) == payment_method.lower()).first()
    payment_method_id = payment_method_obj.payment_method_id if payment_method_obj else None
    payment = Payment(
        order_id=order.order_id,
        user_id=current_user.user_id,
        payment_method_id=payment_method_id,
        payment_date=datetime.utcnow(),
        payment_proof_url=data.get('proof_of_payment_url'),
        payment_status='pending',
        reference_number=data.get('reference_number')
    )
    db.session.add(payment)
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

@views.route('/admin/critical_stock')
def critical_stock():
    results = (
        db.session.query(
            Product.product_id,
            Product.product_name,
            Supplier.supplier_name,
            Inventory.available_stock,
            Inventory.min_stock.label('alert_level'),
            (Inventory.available_stock - Inventory.min_stock).label('below_minimum')
        )
        .join(Inventory, Inventory.product_id == Product.product_id)
        .join(ProductSupplier, Product.product_id == ProductSupplier.product_id)
        .join(Supplier, ProductSupplier.supplier_id == Supplier.supplier_id)
        .filter(Inventory.stock_status == 'Low Stock')
        .all()
    )
    critical = []
    for row in results:
        critical.append({
            "product_id": row.product_id,
            "product_name": row.product_name,
            "supplier_name": row.supplier_name,
            "available_stock": row.available_stock,
            "alert_level": row.alert_level,
            "below_minimum": row.below_minimum
        })
    return jsonify(critical)

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
    from .models import Product, Supplier, ProductSupplier
    inventory_items = (
        db.session.query(
            Inventory.inventory_id,
            Inventory.product_id,
            Inventory.order_id,
            Product.product_name,
            Supplier.supplier_name,
            ProductSupplier.supplier_price,
            Inventory.stock_quantity,
            Inventory.stock_in,
            Inventory.stock_out,
            Inventory.min_stock,
            Inventory.max_stock,
            Inventory.available_stock,
            Inventory.stock_status,
            Inventory.created_at,
            Inventory.updated_at
        )
        .join(Product, Inventory.product_id == Product.product_id)
        .join(ProductSupplier, Inventory.product_id == ProductSupplier.product_id)
        .join(Supplier, ProductSupplier.supplier_id == Supplier.supplier_id)
        .order_by(Inventory.inventory_id.desc())
        .all()
    )
    result = []
    for i in inventory_items:
        result.append({
            'inventory_id': i.inventory_id,
            'product_id': i.product_id,
            'order_id': i.order_id,
            'product_name': i.product_name,
            'supplier_name': i.supplier_name,
            'supplier_price': i.supplier_price,
            'stock_quantity': i.stock_quantity,
            'stock_in': i.stock_in,
            'stock_out': i.stock_out,
            'min_stock': i.min_stock,
            'max_stock': i.max_stock,
            'available_stock': i.available_stock,
            'stock_status': i.stock_status,
            'created_at': i.created_at.strftime('%Y-%m-%d %H:%M:%S') if i.created_at else '',
            'updated_at': i.updated_at.strftime('%Y-%m-%d %H:%M:%S') if i.updated_at else '',
        })
    return jsonify(result)

@views.route('/admin/add_inventory', methods=['POST'])
def add_inventory():
    data = request.get_json()
    required_fields = [
        'product_id', 'order_id', 'stock_quantity', 'stock_in', 'stock_out', 'min_stock', 'max_stock', 'available_stock', 'stock_status'
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
            product_id=data.get('product_id'),
            order_id=data.get('order_id'),
            stock_quantity=data.get('stock_quantity'),
            stock_in=data.get('stock_in'),
            stock_out=data.get('stock_out'),
            min_stock=data.get('min_stock'),
            max_stock=data.get('max_stock'),
            last_updated=last_updated_dt,
            available_stock=data.get('available_stock'),
            stock_status=data.get('stock_status'),
        )
        db.session.add(inventory)
        db.session.commit()
        # Fetch the joined row for this inventory
        joined = db.session.query(
            Inventory.inventory_id,
            Inventory.product_id,
            Inventory.order_id,
            Product.product_name,
            Supplier.supplier_name,
            ProductSupplier.supplier_price,
            Inventory.stock_quantity,
            Inventory.stock_in,
            Inventory.stock_out,
            Inventory.min_stock,
            Inventory.max_stock,
            Inventory.available_stock,
            Inventory.stock_status,
            Inventory.created_at,
            Inventory.updated_at
        ).join(Product, Inventory.product_id == Product.product_id
        ).join(ProductSupplier, Inventory.product_id == ProductSupplier.product_id
        ).join(Supplier, ProductSupplier.supplier_id == Supplier.supplier_id
        ).filter(Inventory.inventory_id == inventory.inventory_id).first()
        if joined:
            result = {
                'inventory_id': joined.inventory_id,
                'product_id': joined.product_id,
                'order_id': joined.order_id,
                'product_name': joined.product_name,
                'supplier_name': joined.supplier_name,
                'supplier_price': joined.supplier_price,
                'stock_quantity': joined.stock_quantity,
                'stock_in': joined.stock_in,
                'stock_out': joined.stock_out,
                'min_stock': joined.min_stock,
                'max_stock': joined.max_stock,
                'available_stock': joined.available_stock,
                'stock_status': joined.stock_status,
                'created_at': joined.created_at.strftime('%Y-%m-%d %H:%M:%S') if joined.created_at else '',
                'updated_at': joined.updated_at.strftime('%Y-%m-%d %H:%M:%S') if joined.updated_at else '',
            }
            return jsonify({'success': True, 'inventory': result})
        else:
            return jsonify({'success': True, 'inventory_id': inventory.inventory_id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@views.route('/admin/update_inventory/<int:inventory_id>', methods=['PUT'])
def update_inventory(inventory_id):
    data = request.get_json()
    inventory = Inventory.query.get_or_404(inventory_id)
    try:
        inventory.stock_quantity = data.get('stock_quantity', inventory.stock_quantity)
        inventory.stock_in = data.get('stock_in', inventory.stock_in)
        inventory.stock_out = data.get('stock_out', inventory.stock_out)
        inventory.min_stock = data.get('min_stock', inventory.min_stock)
        inventory.max_stock = data.get('max_stock', inventory.max_stock)
        inventory.available_stock = data.get('available_stock', inventory.available_stock)
        inventory.stock_status = data.get('stock_status', inventory.stock_status)
        from datetime import datetime
        last_updated = data.get('last_updated')
        if last_updated:
            try:
                inventory.last_updated = datetime.strptime(last_updated, '%Y-%m-%dT%H:%M')
            except Exception:
                pass
        created_at = data.get('created_at')
        if created_at:
            try:
                inventory.created_at = datetime.strptime(created_at, '%Y-%m-%dT%H:%M')
            except Exception:
                pass
        db.session.commit()
        # Fetch joined row
        joined = db.session.query(
            Inventory.inventory_id,
            Inventory.product_id,
            Inventory.order_id,
            Product.product_name,
            Supplier.supplier_name,
            ProductSupplier.supplier_price,
            Inventory.stock_quantity,
            Inventory.stock_in,
            Inventory.stock_out,
            Inventory.min_stock,
            Inventory.max_stock,
            Inventory.available_stock,
            Inventory.stock_status,
            Inventory.created_at,
            Inventory.updated_at
        ).join(Product, Inventory.product_id == Product.product_id
        ).join(ProductSupplier, Inventory.product_id == ProductSupplier.product_id
        ).join(Supplier, ProductSupplier.supplier_id == Supplier.supplier_id
        ).filter(Inventory.inventory_id == inventory.inventory_id).first()
        if joined:
            result = {
                'inventory_id': joined.inventory_id,
                'product_id': joined.product_id,
                'order_id': joined.order_id,
                'product_name': joined.product_name,
                'supplier_name': joined.supplier_name,
                'supplier_price': joined.supplier_price,
                'stock_quantity': joined.stock_quantity,
                'stock_in': joined.stock_in,
                'stock_out': joined.stock_out,
                'min_stock': joined.min_stock,
                'max_stock': joined.max_stock,
                'available_stock': joined.available_stock,
                'stock_status': joined.stock_status,
                'created_at': joined.created_at.strftime('%Y-%m-%d %H:%M:%S') if joined.created_at else '',
                'updated_at': joined.updated_at.strftime('%Y-%m-%d %H:%M:%S') if joined.updated_at else '',
            }
            return jsonify({'success': True, 'inventory': result})
        else:
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
    suppliers = Supplier.query.order_by(Supplier.supplier_id.desc()).all()
    result = []
    for s in suppliers:
        result.append({
            'id': s.supplier_id,
            'supplier_name': s.supplier_name,
            'contact_person': s.contact_person,
            'phone_number': s.phone_number,
            'email': s.email,
            'address': s.address,
            'supplier_status': s.supplier_status,
            'registration_date': s.registration_date.strftime('%Y-%m-%d %H:%M:%S') if s.registration_date else ''
        })
    return jsonify(result)

@views.route('/admin/sales_list')
def sales_list():
    sales = Sales.query.order_by(Sales.sale_date.desc()).all()
    result = []
    for s in sales:
        result.append({
            "sales_id": s.sales_id,
            "order_id": s.order_id,
            "product_id": s.product_id,
            "user_id": s.user_id,
            "sale_date": s.sale_date.strftime('%Y-%m-%d %H:%M:%S') if s.sale_date else "",
            "total_amount": s.total_amount,
            "payment_id": s.payment_id
        })
    return jsonify(result)

@views.route('/api/product_suppliers', methods=['GET'])
def get_supplier_products():
    results = (
        db.session.query(
            ProductSupplier.product_supplier_id,
            ProductSupplier.product_id,
            Product.product_name,
            ProductSupplier.supplier_id,
            ProductSupplier.supplier_price,
            ProductSupplier.is_primary
        )
        .join(Product, ProductSupplier.product_id == Product.product_id)
        .all()
    )
    data = []
    for row in results:
        data.append({
            'product_supplier_id': row[0],
            'product_id': row[1],
            'product_name': row[2],
            'supplier_id': row[3],
            'supplier_price': row[4],
            'is_primary': row[5]
        })
    return jsonify(data)

@views.route('/admin/add_product', methods=['POST'])
def add_product():
    try:
        # Get product fields from form
        product_name = request.form['product_name']
        model_number = request.form['model_number']
        description = request.form.get('description', '')
        category_id = request.form['category_id']
        base_price = request.form['base_price']

        # Create product
        product = Product(
            product_name=product_name,
            model_number=model_number,
            description=description,
            category_id=category_id,
            base_price=base_price,
        )
        db.session.add(product)
        db.session.commit()

        # Handle images, specifications, variants (expand as needed)
        # Example: save images, specs, variants using product.product_id

        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

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
        product.stock_quantity = data.get('stock_quantity', product.stock_quantity)
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
        # Get active promotion if any
        active_promotion = ProductPromotion.query.filter(
            ProductPromotion.product_id == product.product_id,
            ProductPromotion.is_active == True,
            ProductPromotion.start_date <= datetime.utcnow(),
            ProductPromotion.end_date >= datetime.utcnow()
        ).first()

        product_list.append({
            'product_id': getattr(product, 'product_id', ''),
            'name': getattr(product, 'product_name', ''),
            'model_number': getattr(product, 'model_number', ''),
            'description': getattr(product, 'description', ''),
            'category_id': getattr(product, 'category_id', ''),
            'price': float(getattr(product, 'base_price', 0)),
            'discount': float(active_promotion.discount_percentage) if active_promotion else 0,
            'stock_quantity': getattr(product, 'stock_quantity', ''),
            'created_at': str(getattr(product, 'created_at', '')),
            'updated_at': str(getattr(product, 'updated_at', '')),
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

@views.route('/admin/notify_supplier', methods=['POST'])
@login_required
def notify_supplier():
    data = request.get_json()
    product_id = int(data.get('product_id'))
    quantity_requested = int(data.get('quantity_requested'))
    notes = data.get('notes', '')
    user_id = current_user.user_id  # admin or staff

    # Get the right supplier_price from product_suppliers
    ps = ProductSupplier.query.filter_by(product_id=product_id).first()
    supplier_price = ps.supplier_price if ps else 0

    # Create the supply request
    new_request = SupplyRequest(
        product_id=product_id,
        requested_by=user_id,
        quantity_requested=quantity_requested,
        supply_status='Pending',
        notes=notes,
        request_date=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.session.add(new_request)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Supply request sent to supplier.'})

@views.route('/admin/supply_requests')
@login_required
def get_supply_requests():
    requests = (
        db.session.query(SupplyRequest, Product, ProductSupplier, User)
        .join(Product, SupplyRequest.product_id == Product.product_id)
        .join(ProductSupplier, SupplyRequest.product_id == ProductSupplier.product_id)
        .join(User, SupplyRequest.requested_by == User.user_id)
        .all()
    )
    result = []
    for req, prod, ps, user in requests:
        result.append({
            'request_id': req.request_id,
            'product_id': req.product_id,
            'product_name': prod.product_name,
            'supplier_price': ps.supplier_price,
            'requested_by': user.username,  # Show username, not id
            'quantity_requested': req.quantity_requested,
            'status': req.supply_status,
            'notes': req.notes,
            'request_date': req.request_date.strftime('%Y-%m-%d %H:%M'),
            'updated_at': req.updated_at.strftime('%Y-%m-%d %H:%M'),
        })
    return jsonify(result)

# ================= ADMIN: CUSTOMER ORDERS LIST API =================
from .models import Order, OrderItem, User

@views.route('/admin/orders_list')
def admin_orders_list():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    data = []
    for order in orders:
        data.append({
            "order_id": order.order_id,
            "user_id": order.user_id,
            "cancellation_id": order.cancellation_id,
            "order_date": order.created_at.strftime("%Y-%m-%d %H:%M:%S") if order.created_at else "",
            "total_amount": order.total_amount,
            "address_id": order.address_id,
            "status_id": order.status_id,
            "created_at": order.created_at.strftime("%Y-%m-%d %H:%M:%S") if order.created_at else "",
            "updated_at": order.updated_at.strftime("%Y-%m-%d %H:%M:%S") if order.updated_at else "",
        })
    return jsonify(data)

@views.route('/admin/order_items_list')
def admin_order_items_list():
    order_items = OrderItem.query.order_by(OrderItem.order_id.desc()).all()
    data = []
    for item in order_items:
        data.append({
            "item_id": getattr(item, "item_id", getattr(item, "id", None)),
            "order_id": item.order_id,
            "product_id": item.product_id,
            "variant_id": item.variant_id,
            "quantity": item.quantity,
            "unit_price": float(item.unit_price),
            "discount_amount": float(item.discount_amount),
        })
    return jsonify(data)

@views.route('/admin/order_statuses_list')
def admin_order_statuses_list():
    statuses = OrderStatus.query.order_by(OrderStatus.status_id.asc()).all()
    data = []
    for status in statuses:
        data.append({
            "status_id": status.status_id,
            "status_name": status.status_name,
            "description": status.description,
        })
    return jsonify(data)

@views.route('/admin/promotion_list')
def promotion_list():
    promotions = ProductPromotion.query.all()
    promotion_list = []
    for promotion in promotions:
        product = Product.query.get(promotion.product_id)
        promotion_list.append({
            'promotion_id': promotion.promotion_id,
            'product_id': promotion.product_id,
            'product_name': product.product_name if product else 'Unknown Product',
            'promotion_name': promotion.promotion_name,
            'discount_percentage': float(promotion.discount_percentage),
            'start_date': promotion.start_date.strftime('%Y-%m-%d %H:%M:%S'),
            'end_date': promotion.end_date.strftime('%Y-%m-%d %H:%M:%S'),
            'is_active': promotion.is_active,
            'created_at': promotion.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': promotion.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    return jsonify(promotion_list)

@views.route('/admin/add_promotion', methods=['POST'])
def add_promotion():
    try:
        data = request.get_json()
        promotion = ProductPromotion(
            product_id=data['product_id'],
            promotion_name=data['promotion_name'],
            discount_percentage=data['discount_percentage'],
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d %H:%M:%S'),
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d %H:%M:%S'),
            is_active=data.get('is_active', True)
        )
        db.session.add(promotion)
        db.session.commit()
        return jsonify({'success': True, 'promotion_id': promotion.promotion_id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@views.route('/admin/update_promotion/<int:promotion_id>', methods=['PUT'])
def update_promotion(promotion_id):
    try:
        promotion = ProductPromotion.query.get(promotion_id)
        if not promotion:
            return jsonify({'success': False, 'error': 'Promotion not found'})
        
        data = request.get_json()
        promotion.product_id = data.get('product_id', promotion.product_id)
        promotion.promotion_name = data.get('promotion_name', promotion.promotion_name)
        promotion.discount_percentage = data.get('discount_percentage', promotion.discount_percentage)
        promotion.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d %H:%M:%S') if 'start_date' in data else promotion.start_date
        promotion.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d %H:%M:%S') if 'end_date' in data else promotion.end_date
        promotion.is_active = data.get('is_active', promotion.is_active)
        
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@views.route('/admin/delete_promotion/<int:promotion_id>', methods=['DELETE'])
def delete_promotion(promotion_id):
    try:
        promotion = ProductPromotion.query.get(promotion_id)
        if not promotion:
            return jsonify({'success': False, 'error': 'Promotion not found'})
        
        db.session.delete(promotion)
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)})

@views.route('/supplier/update_supply_request_status', methods=['POST'])
@login_required
def update_supply_request_status():
    data = request.get_json()
    request_id = data.get('request_id')
    new_status = data.get('status')
    req = SupplyRequest.query.get(request_id)
    if not req:
        return jsonify({'success': False, 'message': 'Request not found'}), 404
    req.supply_status = new_status
    db.session.commit()

    if new_status == 'Completed':
        # Update inventory logic here
        inventory = Inventory.query.filter_by(product_id=req.product_id).first()
        if inventory:
            inventory.stock_in += req.quantity_requested
            inventory.available_stock += req.quantity_requested
            if inventory.available_stock >= inventory.min_stock:
                inventory.stock_status = 'In Stock'
            db.session.commit()
    return jsonify({'success': True})

@views.route('/supplier/deliveries')
@login_required
def get_deliveries():
    # Define which statuses count as delivery-related
    delivery_statuses = [
        'To Ship', 'To Deliver', 'In Transit', 'Delivered', 'Completed'
    ]
    # Join SupplyRequest, Product, ProductSupplier, Supplier, User
    deliveries = (
        db.session.query(
            SupplyRequest.request_id,
            Product.product_name,
            SupplyRequest.quantity_requested,
            User.username.label('requested_by_username'),
            Supplier.supplier_name,
            SupplyRequest.request_date,
            SupplyRequest.updated_at.label('delivery_date'),
            SupplyRequest.supply_status
        )
        .join(Product, SupplyRequest.product_id == Product.product_id)
        .join(ProductSupplier, SupplyRequest.product_id == ProductSupplier.product_id)
        .join(Supplier, ProductSupplier.supplier_id == Supplier.supplier_id)
        .join(User, SupplyRequest.requested_by == User.user_id)
        .filter(SupplyRequest.supply_status.in_(delivery_statuses))
        .all()
    )
    result = []
    for d in deliveries:
        result.append({
            "delivery_id": d.request_id,  # using request_id as delivery_id
            "request_id": d.request_id,
            "products": [{"name": d.product_name, "quantity": d.quantity_requested}],
            "requested_by": d.requested_by_username,  # Show username, not id
            "supplier_name": d.supplier_name,
            "request_date": d.request_date.strftime('%Y-%m-%d'),
            "delivery_date": d.delivery_date.strftime('%Y-%m-%d'),
            "status": d.supply_status
        })
    return jsonify(result)
