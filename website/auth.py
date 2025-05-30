from flask import Blueprint
from flask_mail import Message

auth = Blueprint('auth', __name__)

from flask import render_template, request, flash, redirect, url_for, session, current_app, jsonify
from .models import User, CartItem, Product, Address, Order, OrderItem, Role, ProductSpecification, Inventory, Review, OrderStatus, Payment, PaymentMethod, CancellationReason, OrderCancellation, ProductImage, Refund, Return, ReviewMedia
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
from datetime import datetime, timedelta
from . import mail  # Import mail from your app
from .email_verification import send_verification_email, verify_code
import random

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
        
        if user:
            if not user.password_hash:
                message = "This account was created with Google. Please log in using Google."
                if request.is_json:
                    return jsonify({'success': False, 'message': message}), 401
                flash(message, 'error')
                return render_template('login.html')
            if user.verify_password(password):
                if not user.is_active:
                    if request.is_json:
                        return jsonify({'success': False, 'message': 'Account is deactivated'}), 403
                    return redirect(url_for('views.home'))
                login_user(user, remember=remember)
                user.update_last_login()
                if user.role == 'admin':
                    redirect_url = url_for('auth.admin')
                elif user.role == 'staff':
                    redirect_url = url_for('auth.staff')
                elif user.role == 'supplier':
                    redirect_url = url_for('auth.dashboard')
                else:
                    redirect_url = url_for('views.home')
                if request.is_json:
                    return jsonify({
                        'success': True,
                        'message': 'Login successful',
                        'redirect': redirect_url
                    })
                return redirect(redirect_url)
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
    if request.method == 'POST':
        data = request.get_json()
        # ...validate fields...
        # Do NOT create the user yet!
        # Store signup data in session
        session['pending_signup'] = {
            'firstname': data['firstname'],
            'lastname': data['lastname'],
            'email': data['email'],
            'password': data['new-password'],
            'confirm_password': data['confirm-password']
        }
        send_verification_email(data['email'])
        return jsonify({'success': True, 'message': 'Verification code sent to your email.'})
    else:
        return render_template('signup.html')

@auth.route('/resend-verification', methods=['POST'])
def resend_verification():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'success': False, 'message': 'Email is required'})

    if send_verification_email(email):
        return jsonify({'success': True, 'message': 'Verification code resent successfully'})
    else:
        return jsonify({'success': False, 'message': 'Error sending verification code'})

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
@auth.route('/auth/google/callback')
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

    # Check if user already exists
    user = User.query.filter_by(email=email).first()
    if user:
        # Update profile image from Google
        user.profile_image = picture
        db.session.commit()
        login_user(user)
        send_login_notification(user.email)
        flash("Logged in successfully with Google!", "success")
        return redirect(url_for('views.home'))

    # If user does not exist, proceed with verification flow
    session['pending_google_user'] = {
        'email': email,
        'name': name,
        'picture': picture
    }

    # Generate verification token
    verification_token = str(uuid.uuid4())
    session['verification_token'] = verification_token

    # Send verification email
    verification_url = url_for('auth.verify_google_email', token=verification_token, _external=True)
    msg = Message(
        "Verify your email for JBR Tanching C.O",
        recipients=[email]
    )
    msg.html = f"""
    <h2>Welcome to JBR Tanching C.O!</h2>
    <p>Please verify your email address to complete your registration.</p>
    <p>Click the button below to verify your email and log in:</p>
    <div style="text-align: center; margin: 30px 0;">
        <a href=\"{verification_url}\" style=\"background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-size: 16px;\">
            Verify Your Email
        </a>
    </div>
    <p>If you did not create an account with JBR Tanching C.O, please ignore this email.</p>
    """
    mail.send(msg)

    # Redirect to check email page
    return redirect(url_for('auth.check_email'))

@auth.route('/check-email')
def check_email():
    if 'pending_google_user' not in session:
        flash("No pending Google signup found.", "danger")
        return redirect(url_for('views.home'))
    return render_template('check_email.html', email=session['pending_google_user']['email'])

@auth.route('/verify-google-email/<token>')
def verify_google_email(token):
    if 'pending_google_user' not in session or 'verification_token' not in session:
        flash("Invalid or expired verification link.", "danger")
        return redirect(url_for('views.home'))
    
    if token != session['verification_token']:
        flash("Invalid verification token.", "danger")
        return redirect(url_for('views.home'))

    user_data = session['pending_google_user']
    email = user_data.get('email')
    name = user_data.get('name')
    picture = user_data.get('picture')

    user_role = Role.query.filter_by(role_name='user').first()
    if not user_role:
        user_role = Role(role_name='user', description='Regular user')
        db.session.add(user_role)
        db.session.commit()

    # Check if user exists, else create
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            username=email.split("@")[0],
            email=email,
            first_name=name.split()[0] if name else "",
            last_name=" ".join(name.split()[1:]) if name and len(name.split()) > 1 else "",
            profile_image=picture,
            is_google_user=True,
            role_id=user_role.role_id

        )
        db.session.add(user)
        db.session.commit()
    else:
        # Always update the profile image with the latest from Google
        user.profile_image = picture
        db.session.commit()

    login_user(user)
    send_login_notification(user.email)  # Send email notification after login
    
    # Clear the session data
    session.pop('pending_google_user', None)
    session.pop('verification_token', None)
    
    flash("Email verified successfully! You are now logged in.", "success")
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
            # Robust image path logic
            img = None
            if hasattr(product, 'images') and product.images and len(product.images) > 0:
                img = product.images[0].image_url
            if not img:
                from .views import get_product_image_url
                img = get_product_image_url(product.product_name)
            # Ensure image URL starts with /static/
            if img and not img.startswith('/static/'):
                img = '/static/' + img.lstrip('/')
            image_path = img
            order_items.append({
                'id': item.item_id,  # order item ID for linking
                'product_id': product.product_id,  # product ID for reference
                'name': product.product_name,
                'variation': '',  # Add variation if you have it
                'quantity': item.quantity,
                'price': float(item.price) if hasattr(item, 'price') else float(item.unit_price),
                'originalPrice': float(product.base_price),
                'image': image_path
            })
        # Use order.order_status if it exists, otherwise use status_name from OrderStatus
        if hasattr(order, 'order_status') and order.order_status:
            status_name = order.order_status.lower()
        else:
            status_obj = OrderStatus.query.get(order.status_id)
            status_name = status_obj.status_name.lower() if status_obj and hasattr(status_obj, 'status_name') else 'to pay'
        # Fetch payment method name
        payment_method_name = ''
        payment = Payment.query.filter_by(order_id=order.order_id).first()
        if payment:
            method = PaymentMethod.query.get(payment.payment_method_id)
            if method:
                payment_method_name = method.method_name
        # Set image_path for each item using product_images
        for item in order.items:
            img = None
            if hasattr(item.product, 'images') and item.product.images and len(item.product.images) > 0:
                img = item.product.images[0].image_url
            if not img:
                img = 'pictures/default.png'
            if img and not img.startswith('/static/'):
                img = '/static/' + img.lstrip('/')
            item.image_path = img
        # Map backend status to frontend tab/section and display text
        status_mapping = {
            'to pay': 'to-pay',
            'to ship': 'to-ship',
            'to receive': 'to-receive',
            'completed': 'completed',
            'cancelled': 'cancelled',
            'refunded': 'return-refund',
            'returned': 'return-refund',
            'return/refund': 'return-refund',
            'pending_refund': 'return-refund',
        }
        status_text_mapping = {
            'to pay': 'Pending Payment',
            'to ship': 'Seller is preparing your order',
            'to receive': 'Out for delivery',
            'completed': 'Parcel has been delivered',
            'cancelled': 'Cancelled by you',
            'refunded': 'REFUND COMPLETED',
            'returned': 'RETURNED',
            'return/refund': 'Return/Refund in Progress',
            'pending_refund': 'Pending Refund',
        }
        formatted_orders.append({
            'id': order.order_id,
            'status': status_mapping.get(status_name, 'to-pay'),
            'statusText': status_text_mapping.get(status_name, status_name.capitalize()),
            'products': order_items,
            'total': float(order.total_amount),
            'deliveryDate': '',  # Add delivery date if you have it
            'paymentMethod': payment_method_name
        })
    print('[DEBUG] formatted_orders:', formatted_orders)
    cancellation_reasons = CancellationReason.query.all()
    return render_template('orders.html', orders=formatted_orders, user=current_user, cancellation_reasons=cancellation_reasons)

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
        # Fetch the "user" role
        user_role = Role.query.filter_by(role_name='user').first()
        if not user_role:
            return jsonify({'success': False, 'message': 'Default user role not found. Please contact support.'}), 500
        new_user = User(
            username=first_name,  # Use first name as username
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=generate_password_hash(password, method='pbkdf2:sha256'),
            role_id=user_role.role_id
        )
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
        
        # Check if this is from product details
        from_param = request.args.get('from')
        product_id = request.args.get('product_id')
        product_type = request.args.get('product_type')
        variant_id = request.args.get('variant_id')
        quantity = request.args.get('quantity')
        
        if from_param == 'product' and product_id:
            if product_type:
                redirect_url = f'/{product_type}-productdetails?product_id={product_id}'
                if variant_id:
                    redirect_url += f'&variant_id={variant_id}'
                if quantity:
                    redirect_url += f'&quantity={quantity}'
            else:
                redirect_url = f'/transaction?product_id={product_id}'
                if variant_id:
                    redirect_url += f'&variant_id={variant_id}'
                if quantity:
                    redirect_url += f'&quantity={quantity}'
            return jsonify({
                'success': True, 
                'message': 'Address saved successfully!',
                'redirect': redirect_url
            })
            
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
            'id': addr.address_id,
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

@auth.route('/api/cancel-order', methods=['GET', 'POST'])
@login_required
def cancel_order():
    if request.method == 'GET':
        order_id = request.args.get('order_id')
        if not order_id:
            return redirect(url_for('auth.orders'))
        order = Order.query.filter_by(order_id=order_id, user_id=current_user.user_id).first()
        if not order:
            flash('Order not found', 'error')
            return redirect(url_for('auth.orders'))
        # Fetch all cancellation reasons
        cancellation_reasons = CancellationReason.query.all()
        return render_template('cancel_order_details.html', order=order, cancellation_reasons=cancellation_reasons)
    # POST request for cancellation
    data = request.get_json()
    order_id = data.get('order_id')
    cancellation_id = data.get('cancellation_id')
    other_reason = data.get('other_reason', '').strip()
    if not order_id or not cancellation_id:
        return jsonify({'success': False, 'message': 'Order ID and cancellation reason are required.'}), 400
    order = Order.query.filter_by(order_id=order_id, user_id=current_user.user_id).first()
    if not order:
        return jsonify({'success': False, 'message': 'Order not found.'}), 404
    # Check if already cancelled by status_id
    status_obj = OrderStatus.query.get(order.status_id)
    if status_obj and status_obj.status_name.lower() == 'cancelled':
        return jsonify({'success': False, 'message': 'Order is already cancelled.'}), 400
    try:
        # 1. Create a new OrderCancellation record, storing other_reason if provided
        order_cancellation = OrderCancellation(
            order_id=order.order_id,
            cancellation_reason_id=cancellation_id,
            cancelled_at=datetime.utcnow(),
            other_reason=other_reason if other_reason else None
        )
        db.session.add(order_cancellation)
        db.session.flush()  # get the new cancellation_id
        # 2. Update the order
        updated_status = False
        if hasattr(order, 'order_status'):
            order.order_status = 'pending_refund'
            order.updated_at = datetime.utcnow()
            print(f"[DEBUG] Set order.order_status to: {order.order_status}")
            updated_status = True
        else:
            pending_refund_status = OrderStatus.query.filter(OrderStatus.status_name.ilike('pending_refund')).first()
            if pending_refund_status:
                order.status_id = pending_refund_status.status_id
                order.updated_at = datetime.utcnow()
                print(f"[DEBUG] Set order.status_id to: {order.status_id} (pending_refund)")
                updated_status = True
        if not updated_status:
            print(f"[DEBUG] Could not set pending_refund status!")
        db.session.commit()
        print(f"[DEBUG] Order status after commit: order_status={getattr(order, 'order_status', None)}, status_id={getattr(order, 'status_id', None)}")

        # Send email notification
        msg = Message(
            "New Refund Request",
            sender="tanchingcojbr@gmail.com",
            recipients=["tanchingcojbr@gmail.com"]
        )
        msg.body = f"""
        New refund request received:
        Order ID: {order_id}
        Reason: {other_reason}
        """
        mail.send(msg)

        db.session.commit()
        return jsonify({'success': True, 'message': 'Order cancelled successfully.'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth.route('/trackorder/<int:order_id>')
@login_required
def trackorder(order_id):
    # Get the order for the current user
    order = Order.query.filter_by(order_id=order_id, user_id=current_user.user_id).first()
    if not order:
        flash('Order not found', 'error')
        return redirect(url_for('auth.orders'))

    # Get the status name from OrderStatus
    status_obj = OrderStatus.query.get(order.status_id)
    status_name = status_obj.status_name.lower() if status_obj and hasattr(status_obj, 'status_name') else 'to pay'

    # Fetch tracking and tracking status from tracking table with join
    from .models import Tracking, TrackingStatus
    tracking = db.session.query(Tracking, TrackingStatus)\
        .join(TrackingStatus, Tracking.status_id == TrackingStatus.status_id)\
        .filter(Tracking.order_id == order.order_id)\
        .first()

    # Mapping of order status to allowed tracking status_ids and default
    status_map = {
        'to pay':    ([1, 2], 1),
        'to ship':   ([3, 4], 3),
        'to receive':([5, 6], 5),
        'completed': ([7, 8], 7),
        'return/refund': ([9, 11, 12], 9),
        'cancelled': ([10], 10)
    }
    allowed_ids, default_id = status_map.get(status_name, ([1], 1))

    # If tracking exists and status_id is not in allowed set, update it
    if tracking and tracking[0].status_id not in allowed_ids:
        tracking_record = tracking[0]
        tracking_record.status_id = default_id
        db.session.commit()
        # Re-fetch the tracking and status after update
        tracking = db.session.query(Tracking, TrackingStatus)\
            .join(TrackingStatus, Tracking.status_id == TrackingStatus.status_id)\
            .filter(Tracking.order_id == order.order_id)\
            .first()

    # If tracking exists, always show its status name (never 'Not assigned' if status_id=1)
    if tracking:
        current_tracking_status = tracking[1].status_name
        courier = tracking[0].courier if tracking[0].courier else 'Not assigned'
    else:
        current_tracking_status = 'Not assigned'
        courier = 'Not assigned'

    # Calculate estimated delivery date (3-5 days from shipping)
    estimated_delivery = None
    if status_name == 'to ship':
        shipping_date = order.updated_at
        estimated_delivery = shipping_date + timedelta(days=3)
    elif status_name == 'completed':
        estimated_delivery = order.updated_at

    # Format tracking status based on order status
    tracking_statuses = []
    # (No longer append 'Order Confirmed' by default)
    if status_name in ['to ship', 'to receive', 'completed']:
        packed_date = order.created_at + timedelta(hours=2)
        tracking_statuses.append({
            'title': 'Packed',
            'date': packed_date.strftime('%B %d, %Y - %I:%M %p'),
            'description': 'Your order has been packed and is ready for pickup.',
            'icon': 'fas fa-box',
            'completed': True,
            'active': False
        })
    if status_name in ['to receive', 'completed']:
        shipped_date = order.created_at + timedelta(days=1)
        tracking_statuses.append({
            'title': 'Shipped',
            'date': shipped_date.strftime('%B %d, %Y - %I:%M %p'),
            'description': 'Your package has been picked up by J&T Express.',
            'icon': 'fas fa-shipping-fast',
            'completed': True,
            'active': False
        })
    if status_name == 'to receive':
        delivery_date = order.updated_at
        tracking_statuses.append({
            'title': 'Out for Delivery',
            'date': delivery_date.strftime('%B %d, %Y - %I:%M %p'),
            'description': 'Your package is out for delivery today.',
            'icon': 'fas fa-truck',
            'completed': False,
            'active': True,
            'driver_info': {
                'name': 'Marco Santos',
                'contact': '+63 917-555-1234',
                'image': url_for('static', filename='pictures/driver-icon.png')
            }
        })
    if status_name == 'completed':
        tracking_statuses.append({
            'title': 'Delivered',
            'date': order.updated_at.strftime('%B %d, %Y - %I:%M %p'),
            'description': 'Your package has been delivered to the shipping address.',
            'icon': 'fas fa-home',
            'completed': True,
            'active': False
        })

    # Fetch customer info
    customer = order.user
    address = Address.query.get(order.address_id)

    # Fetch tracking number from Tracking table
    tracking_number = tracking[0].tracking_number if tracking else None

    # Fetch payment and payment method
    payment = Payment.query.filter_by(order_id=order.order_id).first()
    payment_method_name = ''
    if payment:
        method = PaymentMethod.query.get(payment.payment_method_id)
        if method:
            payment_method_name = method.method_name

    # Build order_items list with correct prices
    order_items = []
    for item in order.items:
        product = Product.query.get(item.product_id)
        # Robust image path logic
        img = None
        if hasattr(product, 'images') and product.images and len(product.images) > 0:
            img = product.images[0].image_url
        if not img:
            from .views import get_product_image_url
            img = get_product_image_url(product.product_name)
        # Ensure image URL starts with /static/
        if img and not img.startswith('/static/'):
            img = '/static/' + img.lstrip('/')
        image_path = img
        order_items.append({
            'id': item.item_id,  # order item ID for linking
            'product_id': product.product_id,  # product ID for reference
            'name': product.product_name,
            'variation': '',  # Add variation if you have it
            'quantity': item.quantity,
            'price': float(item.unit_price),  # Discounted price from DB
            'originalPrice': float(product.base_price),  # Original price from DB
            'image': image_path
        })

    order_data = {
        'order_id': order.order_id,
        'estimated_delivery': estimated_delivery.strftime('%B %d, %Y') if estimated_delivery else 'Not available',
        'shipping_address': address.complete_address if address else '',
        'courier': courier,
        'tracking_number': tracking_number,
        'tracking_status': tracking_statuses,
        'current_tracking_status': current_tracking_status,
        'estimated_arrival_time': 'Today, 2:30 PM - 5:30 PM' if status_name == 'to receive' else 'Not available',
        'distance': '5.2 km away from your location' if status_name == 'to receive' else 'Not available',
        'estimated_time': 'Approximately 25 minutes' if status_name == 'to receive' else 'Not available',
        'customer_name': f'{customer.first_name} {customer.last_name}' if customer else '',
        'customer_phone': address.phone_number if address else '',
        'address': address,
        'order_items': order_items,
        'subtotal': sum(i['originalPrice'] * i['quantity'] for i in order_items),
        'shipping_fee': 35,  # Replace with actual shipping fee logic if available
        'total_amount': float(order.total_amount),
        'payment_method': payment_method_name,
        'status': status_name
    }

    is_staff_or_admin = getattr(current_user, 'role', None) in ['admin', 'staff']
    return render_template('trackorder.html', order=order_data, is_staff_or_admin=is_staff_or_admin)

@auth.route('/update-tracking-status/<int:order_id>', methods=['POST'])
@login_required
def update_tracking_status(order_id):
    if getattr(current_user, 'role', None) not in ['admin', 'staff']:
        flash('Unauthorized access.', 'error')
        return redirect(url_for('auth.orders'))
    
    new_status = request.form.get('tracking_status')
    if not new_status:
        flash('Tracking status is required.', 'error')
        return redirect(url_for('auth.trackorder', order_id=order_id))
    
    try:
        from .models import Tracking, TrackingStatus
        # Get or create tracking record
        tracking = Tracking.query.filter_by(order_id=order_id).first()
        if not tracking:
            tracking = Tracking(order_id=order_id)
            db.session.add(tracking)
        
        # Get the status ID from tracking_statuses table
        status = TrackingStatus.query.filter_by(status_name=new_status).first()
        if not status:
            flash('Invalid tracking status.', 'error')
            return redirect(url_for('auth.trackorder', order_id=order_id))
        
        # Update tracking status
        tracking.status_id = status.status_id
        tracking.updated_at = datetime.utcnow()
        db.session.commit()
        flash('Tracking status updated successfully.', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Error updating tracking status: {str(e)}', 'error')
    
    return redirect(url_for('auth.trackorder', order_id=order_id))

@auth.route('/update-order-status/<int:order_id>', methods=['POST'])
@login_required
def update_order_status(order_id):
    if getattr(current_user, 'role', None) not in ['admin', 'staff']:
        flash('Unauthorized access.', 'error')
        return redirect(url_for('auth.orders'))
    new_status = request.form.get('order_status')
    from .models import Order
    order = Order.query.filter_by(order_id=order_id).first()
    if not order:
        flash('Order not found.', 'error')
        return redirect(url_for('auth.orders'))
    order.status = new_status
    db.session.commit()
    flash('Order status updated successfully.', 'success')
    return redirect(url_for('auth.trackorder', order_id=order_id))

@auth.route('/api/orders/<int:order_id>/received', methods=['POST'])
@login_required
def mark_order_received(order_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400

        order = Order.query.filter_by(order_id=order_id, user_id=current_user.user_id).first()
        if not order:
            return jsonify({'success': False, 'message': 'Order not found.'}), 404

        # Get the current status
        status_obj = OrderStatus.query.get(order.status_id)
        current_status = status_obj.status_name.lower() if status_obj else None

        # Check if order is in a valid status for marking as received
        valid_statuses = ['shipped', 'to receive', 'to-receive', 'paid']
        if current_status not in valid_statuses:
            return jsonify({'success': False, 'message': 'Order cannot be marked as received in its current status.'}), 400

        # Update order status to completed
        completed_status = OrderStatus.query.filter_by(status_name='Completed').first()
        if completed_status:
            order.status_id = completed_status.status_id
            order.updated_at = datetime.utcnow()
            db.session.commit()
            return jsonify({'success': True, 'message': 'Order marked as received.'})
        else:
            return jsonify({'success': False, 'message': 'Error updating order status.'}), 500

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth.route('/request-management')
@login_required
def request_management():
    return render_template('request_management.html', user=current_user)

@auth.route('/delivery-status')
@login_required
def delivery_status():
    return render_template('delivery_status.html', user=current_user)

@auth.route('/reports')
@login_required
def reports():
    return render_template('reports.html', user=current_user)

@auth.route('/settings')
@login_required
def settings():
    return render_template('settings.html', user=current_user)

@auth.route('/dashboard')
def dashboard():
    return render_template('dashboard.html', user=current_user)

def send_login_notification(user_email):
    msg = Message(
        "Thank you for logging in to JBR Web App!",
        recipients=[user_email]
    )
    msg.body = "You just logged in to JBR Web App. We hope you have a great experience using our platform."
    mail.send(msg)

def generate_otp():
    return ''.join(random.choices('0123456789', k=6))

@auth.route('/verify-email', methods=['POST'])
def verify_email():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    # ...validate code...
    # Retrieve signup data from session
    signup_data = session.get('pending_signup')
    if not signup_data or signup_data['email'] != email:
        return jsonify({'success': False, 'message': 'Session expired or invalid.'}), 400
    # Fetch the "user" role
    user_role = Role.query.filter_by(role_name='user').first()
    if not user_role:
        # Optionally, create the role if it doesn't exist
        user_role = Role(role_name='user', description='Regular user')
        db.session.add(user_role)
        db.session.commit()

    new_user = User(
        username=email.split('@')[0],
        email=email,
        first_name=signup_data['firstname'],
        last_name=signup_data['lastname'],
        password=generate_password_hash(signup_data['password'], method='pbkdf2:sha256'),
        role_id=user_role.role_id
    )
    db.session.add(new_user)
    db.session.commit()
    session.pop('pending_signup', None)
    login_user(new_user, remember=True)
    return jsonify({'success': True, 'message': 'Account created successfully!'})

@auth.route('/orders/<int:order_id>/item/<int:order_item_id>')
@login_required
def order_item_details(order_id, order_item_id):
    order = Order.query.filter_by(order_id=order_id, user_id=current_user.user_id).first_or_404()
    item = OrderItem.query.filter_by(item_id=order_item_id, order_id=order_id).first_or_404()
    product = Product.query.get(item.product_id)
    # Robust image path logic
    img = None
    if hasattr(product, 'images') and product.images and len(product.images) > 0:
        img = product.images[0].image_url
    if not img:
        from .views import get_product_image_url
        img = get_product_image_url(product.product_name)
    # Ensure image URL starts with /static/
    if img and not img.startswith('/static/'):
        img = '/static/' + img.lstrip('/')
    image_path = img
    return render_template('order_item_details.html', order=order, item=item, product=product, image_path=image_path)

@auth.route('/cancel-order-details')
@login_required
def cancel_order_details():
    order_id = request.args.get('order_id')
    order = None
    order_cancellation = None
    cancellation_reason = None
    payment = None
    payment_method = None
    user = None
    if order_id:
        order = Order.query.filter_by(order_id=order_id, user_id=current_user.user_id).first()
        if order and order.cancellation_id:
            from .models import OrderCancellation, CancellationReason, Payment, PaymentMethod, ProductImage
            order_cancellation = OrderCancellation.query.get(order.cancellation_id)
            if order_cancellation:
                cancellation_reason = CancellationReason.query.get(order_cancellation.cancellation_reason_id)
        # Fetch payment and payment method
        if order:
            payment = Payment.query.filter_by(order_id=order.order_id).first()
            if payment:
                payment_method = PaymentMethod.query.get(payment.payment_method_id)
            # Set image_path for each item using product_images table
            for item in order.items:
                product_image = ProductImage.query.filter_by(product_id=item.product_id).first()
                if product_image and product_image.image_url:
                    image_path = product_image.image_url
                    if image_path.startswith('/static/'):
                        image_path = image_path[len('/static/'):]
                    if not image_path.startswith('pictures/'):
                        image_path = 'pictures/' + image_path.lstrip('/')
                    item.image_path = image_path
                else:
                    item.image_path = 'pictures/default.png'
    # Always fetch user from database
    user = User.query.get(current_user.user_id)
    return render_template(
        'cancel_order_details.html',
        order=order,
        order_cancellation=order_cancellation,
        cancellation_reason=cancellation_reason,
        payment=payment,
        payment_method=payment_method,
        user=user
    )

@auth.route('/api/request-refund', methods=['POST'])
@login_required
def request_refund():
    try:
        # Support both JSON and multipart/form-data
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            order_id = request.form.get('order_id')
            items_received = request.form.get('items_received')
            reason = request.form.get('reason')
            damage_type = request.form.get('damage_type')
            solution = request.form.get('solution')
            refund_amount = request.form.get('refund_amount')
            description = request.form.get('description', '')
            proof_files = request.files.getlist('proof_files')
        else:
            data = request.get_json()
            order_id = data.get('order_id')
            items_received = data.get('items_received')
            reason = data.get('reason')
            damage_type = data.get('damage_type')
            solution = data.get('solution')
            refund_amount = data.get('refund_amount')
            description = data.get('description', '')
            proof_files = []

        # Validate required fields
        if not all([order_id, items_received, reason]):
            return jsonify({'success': False, 'message': 'Missing required fields'}), 400

        # Get the order
        order = Order.query.filter_by(order_id=order_id, user_id=current_user.user_id).first()
        if not order:
            return jsonify({'success': False, 'message': 'Order not found'}), 404

        # Check if order is in "to receive" status
        if hasattr(order, 'order_status'):
            order_status = order.order_status
        else:
            # fallback for status_name
            status_obj = OrderStatus.query.get(order.status_id)
            order_status = status_obj.status_name.lower() if status_obj else ''
        if order_status != "to receive":
            return jsonify({'success': False, 'message': 'Refund can only be requested for orders in "To receive" status'}), 400

        # Define reasons that automatically get refund only
        auto_refund_reasons = ['not_delivered', 'empty_parcel']
        # Define reasons that require return and refund
        require_return_reasons = ['damaged', 'defective', 'wrong_item']

        # Validate solution based on reason
        if reason in auto_refund_reasons and solution != 'refund_only':
            return jsonify({'success': False, 'message': 'This reason only allows refund only'}), 400
        if reason in require_return_reasons and solution != 'return_refund':
            return jsonify({'success': False, 'message': 'This reason requires return and refund'}), 400

        # Save proof files if any
        saved_files = []
        for file in proof_files:
            if file and file.filename:
                filename = secure_filename(file.filename)
                ext = filename.rsplit('.', 1)[1].lower()
                unique_filename = f"{uuid.uuid4().hex}.{ext}"
                proof_dir = os.path.join(current_app.root_path, 'static', 'refund_proofs')
                os.makedirs(proof_dir, exist_ok=True)
                file_path = os.path.join(proof_dir, unique_filename)
                file.save(file_path)
                saved_files.append(unique_filename)

        # Create refund record with automatic approval for certain reasons
        refund_status = 'approved' if reason in auto_refund_reasons else 'pending'
        # Combine extra info into description
        extra_info = f"items_received={items_received}; solution={solution}; damage_type={damage_type or ''}; refund_amount={refund_amount or ''}; description={description}"
        refund = Refund(
            order_id=order_id,
            refund_reason=reason,
            refund_status=refund_status,
            proof_of_refund=','.join(saved_files) if saved_files else None
        )
        db.session.add(refund)

        # Create return record only if solution is return and refund
        if solution == 'return_refund':
            return_record = Return(
                order_id=order_id,
                refund_id=refund.refund_id,
                return_reason=reason,
                return_issue=description,
                return_status='pending'
            )
            db.session.add(return_record)

        # Update order status to 'pending_refund' using status_id
        pending_refund_status = OrderStatus.query.filter(OrderStatus.status_name.ilike('pending_refund')).first()
        if pending_refund_status:
            order.status_id = pending_refund_status.status_id
            order.updated_at = datetime.utcnow()
            print(f"[DEBUG] Set order.status_id to: {order.status_id} (pending_refund)")
        else:
            print(f"[DEBUG] Could not set pending_refund status!")
        db.session.commit()
        print(f"[DEBUG] Order status after commit: order_status={getattr(order, 'order_status', None)}, status_id={getattr(order, 'status_id', None)}")

        # Send email notification
        msg = Message(
            "New Refund Request",
            sender="tanchingcojbr@gmail.com",
            recipients=["tanchingcojbr@gmail.com"]
        )
        msg.body = f"""
        New refund request received:
        Order ID: {order_id}
        Reason: {reason}
        Items Received: {items_received}
        Solution: {solution}
        Description: {description}
        """
        mail.send(msg)

        db.session.commit()
        return jsonify({'success': True, 'message': 'Refund request submitted successfully'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth.route('/api/submit-review', methods=['POST'])
@login_required
def submit_review():
    try:
        order_id = request.form.get('order_id')
        product_id = request.form.get('product_id')
        print('RAW order_id:', order_id, 'RAW product_id:', product_id)
        try:
            order_id = int(order_id)
            product_id = int(product_id)
        except Exception as e:
            print('PARSE ERROR:', e)
            return jsonify({'success': False, 'message': 'Invalid product_id or order_id'}), 400
        print('PARSED order_id:', order_id, 'PARSED product_id:', product_id)
        rating = int(request.form.get('rating', 0))
        review = request.form.get('review')
        photo = request.files.get('photo')
        video = request.files.get('video')

        # Validate required fields
        if not order_id or not product_id:
            print('Validation failed: missing order_id or product_id')
            return jsonify({'success': False, 'message': 'Missing product_id or order_id'}), 400

        # Use only the main review as comment
        comment = review or ''

        # Create the Review record first
        print('About to add review:', order_id, product_id)
        review_obj = Review(
            user_id=current_user.user_id,
            order_id=order_id,
            product_id=product_id,
            rating=rating,
            comment=comment
        )
        db.session.add(review_obj)
        db.session.commit()  # Now review_obj.review_id is available
        print('Review committed:', review_obj.review_id)

        # Save photo/video if provided and create ReviewMedia records
        from .models import ReviewMedia  # Import your ReviewMedia model
        if photo:
            photo_filename = secure_filename(photo.filename)
            photo_dir = os.path.join(current_app.root_path, 'static', 'review_photos')
            os.makedirs(photo_dir, exist_ok=True)
            photo.save(os.path.join(photo_dir, photo_filename))
            print('About to add review media (photo):', photo_filename)
            db.session.add(ReviewMedia(review_id=review_obj.review_id, media_type='photo', filename=photo_filename))
            db.session.commit()
            print('Review media committed (photo)')
        if video:
            video_filename = secure_filename(video.filename)
            video_dir = os.path.join(current_app.root_path, 'static', 'review_videos')
            os.makedirs(video_dir, exist_ok=True)
            video.save(os.path.join(video_dir, video_filename))
            print('About to add review media (video):', video_filename)
            db.session.add(ReviewMedia(review_id=review_obj.review_id, media_type='video', filename=video_filename))
            db.session.commit()
            print('Review media committed (video)')

        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        print('Exception in submit_review:', str(e))
        return jsonify({'success': False, 'message': str(e)}), 500
