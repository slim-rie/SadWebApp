from flask import Blueprint

auth = Blueprint('auth', __name__)

from flask import render_template, request, flash, redirect, url_for, session, current_app, jsonify
from .models import User, CartItem, Product, Address, Order
from . import db
from flask_login import login_user, login_required, logout_user, current_user
import os
import requests
import json
from requests_oauthlib import OAuth2Session
from werkzeug.utils import secure_filename
import uuid
import re
from werkzeug.security import generate_password_hash
from datetime import datetime

# Allow OAuth over HTTP for development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
# Skip HTTPS verification for localhost
os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'

try:
    from .config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL
except ImportError:
    GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID"
    GOOGLE_CLIENT_SECRET = "YOUR_CLIENT_SECRET"
    GOOGLE_CALLBACK_URL = "http://127.0.0.1:5000/google-oauth-callback"

# Google OAuth endpoints
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo"

# OAuth2 session setup
google = OAuth2Session(
    GOOGLE_CLIENT_ID,
    redirect_uri=GOOGLE_CALLBACK_URL,
    scope=['openid', 'email', 'profile']
)

# Profile image settings
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    if len(password) < 8:
        return False, 'Password must be at least 8 characters long'
    if not re.search(r'[A-Z]', password):
        return False, 'Password must contain at least one uppercase letter'
    if not re.search(r'[a-z]', password):
        return False, 'Password must contain at least one lowercase letter'
    if not re.search(r'\d', password):
        return False, 'Password must contain at least one number'
    return True, ''

@auth.route('/')
def index():
    return redirect(url_for('auth.login'))

@auth.route('/change-password', methods=['GET', 'POST'])
@login_required
def change_password():
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')
        
        if not current_user.verify_password(current_password):
            message = 'Current password is incorrect'
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 400
            flash(message, 'error')
            return render_template('change_password.html', user=current_user)
        
        if new_password != confirm_password:
            message = 'New passwords do not match'
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 400
            flash(message, 'error')
            return render_template('change_password.html', user=current_user)
        
        is_valid, message = validate_password(new_password)
        if not is_valid:
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 400
            flash(message, 'error')
            return render_template('change_password.html', user=current_user)
        
        try:
            current_user.password = new_password
            db.session.commit()
            
            if request.is_json:
                return jsonify({
                    'success': True,
                    'message': 'Password changed successfully',
                    'redirect': url_for('auth.my_account')
                })
            flash('Password changed successfully', 'success')
            return redirect(url_for('auth.my_account'))
        except Exception as e:
            db.session.rollback()
            message = 'An error occurred while changing your password'
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 500
            flash(message, 'error')
    
    return render_template('change_password.html', user=current_user)

@auth.route('/add-item')
@login_required
def add_item():
    return render_template('example_add.html')

@auth.route('/feedback')
@login_required
def feedback():
    return render_template('feedback.html')

@auth.route('/supplier')
@login_required
def supplier():
    return render_template('supplier.html')

@auth.route('/profile')
@login_required
def profile():
    return render_template('profile.html')

@auth.route('/Cart')
@login_required
def cart():
    cart_items = CartItem.query.filter_by(user_id=current_user.user_id).all()
    total_items = sum(item.quantity for item in cart_items)
    total_amount = sum(item.quantity * float(item.product.base_price) for item in cart_items)
    return render_template("cart.html", user=current_user, cart_items=cart_items,
                         total_items=total_items, total_amount=total_amount)

@auth.route('/add-to-cart/<int:product_id>')
@login_required
def add_to_cart(product_id):
    # Add product to cart logic here
    flash('Product added to cart successfully!', category='success')
    return redirect(url_for('auth.cart'))

@auth.route('/admin', methods=['GET', 'POST'])
@login_required
def admin():
    if current_user.role != 'admin':
        flash('Access denied. Admin only.', category='error')
        return redirect(url_for('views.home'))
    return render_template("admin.html", user=current_user)

@auth.route('/staff', methods=['GET', 'POST'])
@login_required
def staff():
    if current_user.role != 'staff':
        flash('Access denied. Staff only.', category='error')
        return redirect(url_for('views.home'))
    return render_template("staff.html", user=current_user)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        if request.is_json:
            return jsonify({'success': True, 'redirect': url_for('views.home')}), 200
        return redirect(url_for('views.home'))
    
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        username = data.get('username')
        password = data.get('password')
        remember = data.get('remember', False)
        
        user = User.query.filter((User.username == username) | (User.email == username)).first()
        
        if user and user.verify_password(password):
            if not user.is_active:
                if request.is_json:
                    return jsonify({'success': False, 'message': 'Account is deactivated'}), 403
                return redirect(url_for('views.home'))
            
            login_user(user, remember=remember)
            user.update_last_login()
            
            if request.is_json:
                return jsonify({
                    'success': True,
                    'message': 'Login successful',
                    'redirect': url_for('views.home')
                })
            return redirect(url_for('views.home'))
        
        if request.is_json:
            return jsonify({'success': False, 'message': 'Invalid username or password'}), 401
        flash('Invalid username or password', 'error')
    
    if request.is_json:
        return jsonify({'success': False, 'message': 'Invalid request'}), 400
    return redirect(url_for('views.home'))

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('views.home'))

@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if current_user.is_authenticated:
        return redirect(url_for('views.home'))
    
    if request.method == 'POST':
        data = request.get_json() if request.is_json else request.form
        first_name = data.get('firstname')  # Get first name from form
        last_name = data.get('lastname')    # Get last name from form
        email = data.get('email')
        password = data.get('new-password')
        confirm_password = data.get('confirm-password')
        
        # Validation
        if not all([first_name, last_name, email, password, confirm_password]):
            message = 'All fields are required'
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 400
            flash(message, 'error')
            return render_template('signup.html')
        
        if password != confirm_password:
            message = 'Passwords do not match'
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 400
            flash(message, 'error')
            return render_template('signup.html')
        
        if not validate_email(email):
            message = 'Invalid email format'
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 400
            flash(message, 'error')
            return render_template('signup.html')
        
        is_valid, message = validate_password(password)
        if not is_valid:
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 400
            flash(message, 'error')
            return render_template('signup.html')
        
        # Generate personalized username
        base_username = f"{first_name.lower()}{last_name.lower()}"
        username = base_username
        counter = 1
        
        # Keep trying until we find a unique username
        while User.query.filter_by(username=username).first():
            username = f"{base_username}{counter}"
            counter += 1
        
        # Check if email already exists
        if User.query.filter_by(email=email).first():
            message = 'Email already exists'
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 400
            flash(message, 'error')
            return render_template('signup.html')
        
        # Create new user
        new_user = User(
            username=username,  # Use generated username
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password
        )
        
        try:
            db.session.add(new_user)
            db.session.commit()
            
            if request.is_json:
                return jsonify({
                    'success': True,
                    'message': 'Account created successfully',
                    'redirect': url_for('auth.login')
                })
            flash('Account created successfully', 'success')
            return redirect(url_for('auth.login'))
        except Exception as e:
            import traceback
            db.session.rollback()
            tb = traceback.format_exc()
            print(f"\n[SignUp Error] {str(e)}\nTraceback:\n{tb}")
            message = f'An error occurred while creating your account: {str(e)}'
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 500
            flash(message, 'error')
            return render_template('signup.html', error=message)
    
    return render_template('signup.html')

@auth.route('/google-oauth-login')
def google_oauth_login():
    try:
        # Generate state token
        state = os.urandom(16).hex()
        session['oauth_state'] = state
        
        # Create authorization URL
        params = {
            'client_id': GOOGLE_CLIENT_ID,
            'redirect_uri': GOOGLE_CALLBACK_URL,
            'scope': 'openid email profile',
            'state': state,
            'response_type': 'code',
            'access_type': 'offline',
            'prompt': 'select_account'
        }
        
        auth_url = f"{GOOGLE_AUTH_URL}?{'&'.join(f'{k}={v}' for k, v in params.items())}"
        print('\n=== Google OAuth Login Initiated ===')
        print(f'Redirect URI being used: {GOOGLE_CALLBACK_URL}')
        print(f'Full auth URL: {auth_url}')
        print('='*50 + '\n')
        return redirect(auth_url)
    except Exception as e:
        print(f"Login Error: {str(e)}")
        flash('Failed to initiate Google login', category='error')
        return redirect(url_for('auth.login'))

@auth.route('/google-oauth-callback')
def google_oauth_callback():
    code = request.args.get('code')
    if not code:
        flash("No code provided from Google.", "danger")
        return redirect(url_for('views.home'))

    # Exchange code for token
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_CALLBACK_URL,
        "grant_type": "authorization_code"
    }
    r = requests.post(token_url, data=data)
    if not r.ok:
        flash("Failed to get token from Google.", "danger")
        return redirect(url_for('views.home'))
    token_info = r.json()
    access_token = token_info.get("access_token")

    # Get user info
    userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"
    headers = {"Authorization": f"Bearer {access_token}"}
    userinfo = requests.get(userinfo_url, headers=headers).json()
    email = userinfo.get("email")
    name = userinfo.get("name")
    picture = userinfo.get("picture")

    # Check if user exists, else create
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            username=email.split("@")[0],
            email=email,
            first_name=name.split()[0] if name else "",
            last_name=" ".join(name.split()[1:]) if name and len(name.split()) > 1 else "",
            profile_image=picture,
            is_google_user=True
        )
        db.session.add(user)
        db.session.commit()
    else:
        # Always update the profile image with the latest from Google
        user.profile_image = picture
        db.session.commit()

    login_user(user)
    flash("Successfully signed in with Google!", "success")
    return redirect(url_for('views.home'))

@auth.route('/update-profile', methods=['POST'])
@login_required
def update_profile():
    if request.method == 'POST':
        try:
            # Handle profile image upload
            if 'profile_image' in request.files:
                file = request.files['profile_image']
                if file and file.filename and allowed_file(file.filename):
                    if file.content_length and file.content_length > MAX_FILE_SIZE:
                        flash('File size too large. Maximum size is 5MB.', 'error')
                        return redirect(url_for('auth.profile'))
                    
                    # Generate unique filename
                    filename = secure_filename(file.filename)
                    ext = filename.rsplit('.', 1)[1].lower()
                    new_filename = f"{uuid.uuid4().hex}.{ext}"
                    
                    # Save file
                    file_path = os.path.join('website/static/profile_images', new_filename)
                    file.save(file_path)
                    
                    # Update user's profile_image in database
                    current_user.profile_image = new_filename

            # Update user information
            username = request.form.get('username')
            address = request.form.get('address')
            first_name = request.form.get('first_name')
            middle_name = request.form.get('middle_name')
            last_name = request.form.get('last_name')

            # Validate username uniqueness
            if username != current_user.username:
                existing_user = User.query.filter_by(username=username).first()
                if existing_user:
                    flash('Username already taken', 'error')
                    return redirect(url_for('auth.profile'))

            # Update user information
            current_user.username = username
            current_user.address = address
            current_user.first_name = first_name
            current_user.middle_name = middle_name
            current_user.last_name = last_name

            db.session.commit()
            flash('Profile updated successfully!', 'success')
            return redirect(url_for('auth.profile'))

        except Exception as e:
            db.session.rollback()
            flash(f'Error updating profile: {str(e)}', 'error')
            return redirect(url_for('auth.profile'))

    return redirect(url_for('auth.profile'))

@auth.route('/contact-seller/<int:product_id>', methods=['GET', 'POST'])
@login_required
def contact_seller(product_id):
    product = Product.query.get_or_404(product_id)
    
    if request.method == 'POST':
        issue = request.form.get('issue')
        other_issue = request.form.get('other_issue')
        message = request.form.get('message')
        
        if not issue or not message:
            flash('Please fill in all required fields.', category='error')
        else:
            # Format the issue for staff
            final_issue = other_issue if issue == 'other' else issue
            
            # TODO: Integration with staff page
            # This is a placeholder for the staff page integration
            # The actual message handling will be implemented by the other programmer
            # Pass both the selected issue and the message to staff
            flash('Message sent successfully! Staff will process your request.', category='success')
            return redirect(url_for('views.home'))
    
    return render_template('contact_seller.html', user=current_user, product=product)

@auth.route('/my-account', methods=['GET', 'POST'])
@login_required
def my_account():
    if request.method == 'POST':
        try:
            # Get form data
            first_name = request.form.get('fullName')
            email = request.form.get('email')
            phone_number = request.form.get('phone')
            gender = request.form.get('gender')
            day = request.form.get('day')
            month = request.form.get('month')
            year = request.form.get('year')

            # Update user fields
            if first_name:
                current_user.first_name = first_name
            if email:
                if not validate_email(email):
                    if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                        return jsonify({'error': 'Invalid email format'}), 400
                    flash('Invalid email format', 'error')
                    return redirect(url_for('auth.my_account'))
                current_user.email = email
            if phone_number:
                # Validate phone number (Philippine format)
                phone_regex = r'^(\+63|0)9\d{9}$'
                if not re.match(phone_regex, phone_number):
                    if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                        return jsonify({'error': 'Please enter a valid Philippine mobile number (e.g., +639XXXXXXXXX or 09XXXXXXXXX)'}), 400
                    flash('Please enter a valid Philippine mobile number (e.g., +639XXXXXXXXX or 09XXXXXXXXX)', 'error')
                    return redirect(url_for('auth.my_account'))
                current_user.phone_number = phone_number
            if gender:
                current_user.gender = gender
            
            # Handle date of birth
            if day and month and year:
                try:
                    current_user.date_of_birth = datetime(int(year), int(month), int(day))
                except Exception:
                    if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                        return jsonify({'error': 'Invalid date format'}), 400
                    flash('Invalid date format', 'error')
                    return redirect(url_for('auth.my_account'))

            # Handle profile image upload
            if 'profile_image' in request.files:
                file = request.files['profile_image']
                if file and file.filename:
                    # Check file extension
                    if not allowed_file(file.filename):
                        if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                            return jsonify({'error': 'Invalid file type. Only JPG, JPEG, and PNG files are allowed.'}), 400
                        flash('Invalid file type. Only JPG, JPEG, and PNG files are allowed.', 'error')
                        return redirect(url_for('auth.my_account'))
                    
                    # Check file size
                    file.seek(0, os.SEEK_END)
                    file_size = file.tell()
                    file.seek(0)
                    
                    if file_size > MAX_FILE_SIZE:
                        if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                            return jsonify({'error': 'File size too large. Maximum size is 5MB.'}), 400
                        flash('File size too large. Maximum size is 5MB.', 'error')
                        return redirect(url_for('auth.my_account'))
                    
                    try:
                        # Generate unique filename
                        filename = secure_filename(file.filename)
                        ext = filename.rsplit('.', 1)[1].lower()
                        new_filename = f"{current_user.user_id}_{int(datetime.utcnow().timestamp())}.{ext}"
                        
                        # Create profile_images directory if it doesn't exist
                        profile_images_dir = os.path.join(current_app.root_path, 'static', 'profile_images')
                        os.makedirs(profile_images_dir, exist_ok=True)
                        
                        # Save file
                        file_path = os.path.join(profile_images_dir, new_filename)
                        print(f"Saving profile image to: {file_path}")  # Debug print
                        file.save(file_path)
                        
                        # Update user's profile_image in database
                        current_user.profile_image = new_filename
                        print(f"Updated profile_image in database to: {new_filename}")  # Debug print
                    except Exception as e:
                        print(f"Error saving profile image: {str(e)}")  # Debug print
                        if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                            return jsonify({'error': f'Error saving image: {str(e)}'}), 500
                        flash(f'Error saving image: {str(e)}', 'error')
                        return redirect(url_for('auth.my_account'))

            db.session.commit()

            if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                response_data = {
                    'message': 'Profile updated successfully',
                    'user': {
                        'first_name': current_user.first_name,
                        'email': current_user.email,
                        'phone': current_user.phone_number,
                        'gender': current_user.gender,
                        'date_of_birth': current_user.date_of_birth.strftime('%Y-%m-%d') if current_user.date_of_birth else None,
                        'profile_image': current_user.profile_image
                    }
                }
                print(f"Sending response data: {response_data}")  # Debug print
                return jsonify(response_data)

            flash('Profile updated successfully', 'success')
            return redirect(url_for('auth.my_account'))

        except Exception as e:
            print(f"Error in my_account route: {str(e)}")  # Debug print
            db.session.rollback()
            if request.is_json or request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                return jsonify({'error': f'Error updating profile: {str(e)}'}), 500
            flash(f'Error updating profile: {str(e)}', 'error')
            return redirect(url_for('auth.my_account'))

    return render_template('my_account.html', user=current_user)

@auth.route('/orders')
@login_required
def orders():
    import os
    # Get all orders for the current user
    user_orders = Order.query.filter_by(user_id=current_user.user_id).order_by(Order.created_at.desc()).all()
    
    # Format orders for the frontend
    formatted_orders = []
    for order in user_orders:
        order_items = []
        for item in order.items:
            product = Product.query.get(item.product_id)
            # Dynamic image path logic
            if getattr(product, 'image_url', None):
                image_path = url_for('static', filename=product.image_url)
            else:
                jpg_path = f"pictures/{product.product_name}.jpg"
                png_path = f"pictures/{product.product_name}.png"
                static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
                jpg_full = os.path.join(static_dir, jpg_path)
                png_full = os.path.join(static_dir, png_path)
                if os.path.exists(jpg_full):
                    image_path = url_for('static', filename=jpg_path)
                elif os.path.exists(png_full):
                    image_path = url_for('static', filename=png_path)
                else:
                    image_path = url_for('static', filename='pictures/default.png')
            order_items.append({
                'name': product.product_name,
                'variation': '',  # Add variation if you have it
                'quantity': item.quantity,
                'price': float(item.price),
                'originalPrice': float(product.base_price),
                'image': image_path
            })
        # Map database status to frontend status
        status_mapping = {
            'pending': 'to-pay',
            'paid': 'to-ship',
            'shipped': 'to-receive',
            'delivered': 'completed',
            'cancelled': 'cancelled',
            'refunded': 'return-refund'
        }
        status_text_mapping = {
            'pending': 'Pending Payment',
            'paid': 'Seller is preparing your order',
            'shipped': 'Out for delivery',
            'delivered': 'Parcel has been delivered',
            'cancelled': 'Cancelled by you',
            'refunded': 'REFUND COMPLETED'
        }
        formatted_orders.append({
            'id': order.order_id,
            'status': status_mapping.get(order.status, 'to-pay'),
            'statusText': status_text_mapping.get(order.status, 'Pending Payment'),
            'products': order_items,
            'total': float(order.total_amount),
            'deliveryDate': '',  # Add delivery date if you have it
            'paymentMethod': order.payment_method
        })
    return render_template('orders.html', orders=formatted_orders)

@auth.route('/chat')
@login_required
def chat():
    return render_template('chat.html')

@auth.route('/api/sign-up', methods=['POST'])
def api_sign_up():
    data = request.get_json()
    first_name = data.get('firstname')
    last_name = data.get('lastname')
    email = data.get('email')
    password = data.get('new-password')

    if not all([first_name, last_name, email, password]):
        return jsonify({'success': False, 'message': 'All fields are required'}), 400

    if User.query.filter_by(username=first_name).first():
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'Email already exists'}), 400

    try:
        new_user = User(
            username=first_name,  # Use first name as username
            email=email,
            first_name=first_name,
            last_name=last_name
        )
        new_user.password = password  # This will hash the password
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Account created successfully!'}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Database error: {e}")
        return jsonify({'success': False, 'message': 'Database error: ' + str(e)}), 500

@auth.route('/addresses')
@login_required
def addresses():
    return render_template('addresses.html')

@auth.route('/privacy-settings')
@login_required
def privacy_settings():
    return render_template('privacysettings.html', user=current_user)

@auth.route('/add-address', methods=['POST'])
@login_required
def add_address():
    data = request.get_json() or request.form
    print('Received address data:', data)
    try:
        address = Address(
            user_id=current_user.user_id,
            first_name=data.get('firstName'),
            last_name=data.get('lastName'),
            phone_number=data.get('phoneNumber'),
            postal_code=data.get('postalCode'),
            street_address=data.get('streetAddress'),
            complete_address=data.get('completeAddress'),
            label=data.get('label'),
            is_default=data.get('isDefault', False)
        )
        db.session.add(address)
        db.session.commit()
        print('Address saved successfully!')
        return jsonify({'success': True, 'message': 'Address saved successfully!'})
    except Exception as e:
        db.session.rollback()
        print('Error saving address:', str(e))
        return jsonify({'success': False, 'message': str(e)}), 500

@auth.route('/api/addresses', methods=['GET'])
@login_required
def api_get_addresses():
    addresses = Address.query.filter_by(user_id=current_user.user_id).all()
    address_list = []
    for addr in addresses:
        address_list.append({
            'id': addr.id,
            'firstName': addr.first_name,
            'lastName': addr.last_name,
            'phoneNumber': addr.phone_number,
            'postalCode': addr.postal_code,
            'street_address': addr.street_address,
            'complete_address': addr.complete_address,
            'label': addr.label,
            'isDefault': addr.is_default
        })
    return jsonify({'success': True, 'addresses': address_list})

@auth.route('/api/address/<int:address_id>', methods=['DELETE'])
@login_required
def delete_address(address_id):
    address = Address.query.filter_by(id=address_id, user_id=current_user.user_id).first()
    if not address:
        return jsonify({'success': False, 'message': 'Address not found'}), 404
    try:
        db.session.delete(address)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Address deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth.route('/api/address/<int:address_id>', methods=['PUT'])
@login_required
def update_address(address_id):
    address = Address.query.filter_by(id=address_id, user_id=current_user.user_id).first()
    if not address:
        return jsonify({'success': False, 'message': 'Address not found'}), 404
    data = request.get_json() or request.form
    try:
        address.first_name = data.get('firstName', address.first_name)
        address.last_name = data.get('lastName', address.last_name)
        address.phone_number = data.get('phoneNumber', address.phone_number)
        address.postal_code = data.get('postalCode', address.postal_code)
        address.street_address = data.get('streetAddress', address.street_address)
        address.complete_address = data.get('completeAddress', address.complete_address)
        address.label = data.get('label', address.label)
        address.is_default = data.get('isDefault', address.is_default)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Address updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth.route('/api/delete-account', methods=['DELETE'])
@login_required
def delete_account():
    try:
        # TODO: Check for pending purchases, sales, or legal matters here
        # Example: if Order.query.filter_by(user_id=current_user.user_id, status='pending').count() > 0:
        #     return jsonify({'success': False, 'message': 'Cannot delete account with pending orders.'}), 400

        # Delete all addresses
        Address.query.filter_by(user_id=current_user.user_id).delete()
        # Delete all cart items
        CartItem.query.filter_by(user_id=current_user.user_id).delete()
        # Optionally: delete other related data (orders, etc.)
        # Finally, delete the user
        user = User.query.get(current_user.user_id)
        db.session.delete(user)
        db.session.commit()
        logout_user()
        return jsonify({'success': True, 'message': 'Account deleted successfully.'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth.route('/test-db')
def test_db():
    try:
        # Test database connection
        db.session.execute('SELECT 1')
        
        # Check if users table exists and get its structure
        result = db.session.execute('DESCRIBE users')
        columns = [row[0] for row in result]
        
        # Get sample data (first user if exists)
        sample_user = User.query.first()
        
        return jsonify({
            'status': 'success',
            'message': 'Database connection successful',
            'table_exists': True,
            'columns': columns,
            'sample_user': {
                'id': sample_user.user_id if sample_user else None,
                'username': sample_user.username if sample_user else None,
                'email': sample_user.email if sample_user else None
            } if sample_user else None
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@auth.route('/api/address/<int:address_id>', methods=['GET'])
@login_required
def get_address(address_id):
    address = Address.query.filter_by(id=address_id, user_id=current_user.user_id).first()
    if not address:
        return jsonify({'success': False, 'message': 'Address not found'}), 404
    
    return jsonify({
        'success': True,
        'address': {
            'id': address.id,
            'firstName': address.first_name,
            'lastName': address.last_name,
            'phoneNumber': address.phone_number,
            'postalCode': address.postal_code,
            'streetAddress': address.street_address,
            'completeAddress': address.complete_address,
            'label': address.label,
            'isDefault': address.is_default
        }
    })

@auth.route('/api/address/<int:address_id>/set-default', methods=['POST'])
@login_required
def set_default_address(address_id):
    address = Address.query.filter_by(id=address_id, user_id=current_user.user_id).first()
    if not address:
        return jsonify({'success': False, 'message': 'Address not found'}), 404
    try:
        # Unset all other addresses
        Address.query.filter_by(user_id=current_user.user_id).update({'is_default': False})
        # Set this address as default
        address.is_default = True
        db.session.commit()
        return jsonify({'success': True, 'message': 'Default address updated'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth.route('/cancel-order-details')
@login_required
def cancel_order_details():
    import os
    order_id = request.args.get('order_id')
    order = None
    if order_id:
        from .models import Order, Product
        order = Order.query.filter_by(order_id=order_id, user_id=current_user.user_id).first()
        if order:
            for item in order.items:
                # Get the product image path
                jpg_path = f"pictures/{item.product.product_name}.jpg"
                png_path = f"pictures/{item.product.product_name}.png"
                static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static')
                jpg_full = os.path.join(static_dir, jpg_path)
                png_full = os.path.join(static_dir, png_path)
                
                if os.path.exists(jpg_full):
                    item.image_path = jpg_path
                elif os.path.exists(png_full):
                    item.image_path = png_path
                else:
                    item.image_path = 'pictures/default.png'
    
    return render_template('cancel_order_details.html', order=order)

@auth.route('/api/cancel_order', methods=['POST'])
@login_required
def api_cancel_order():
    data = request.get_json()
    order_id = data.get('order_id')
    reason = data.get('reason')
    if not order_id or not reason:
        return jsonify({'success': False, 'message': 'Order ID and reason are required.'}), 400
    from .models import Order
    order = Order.query.filter_by(order_id=order_id, user_id=current_user.user_id).first()
    if not order:
        return jsonify({'success': False, 'message': 'Order not found.'}), 404
    if order.status == 'cancelled':
        return jsonify({'success': False, 'message': 'Order is already cancelled.'}), 400
    order.status = 'cancelled'
    order.cancellation_reason = reason
    db.session.commit()
    return jsonify({'success': True, 'message': 'Order cancelled successfully.'}) 