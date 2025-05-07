from flask import Blueprint, render_template, request, flash, redirect, url_for, session, current_app, jsonify
from .models import User, CartItem, Product, Address
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

auth = Blueprint('auth', __name__)

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
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
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
            return render_template('change_password.html')
        
        if new_password != confirm_password:
            message = 'New passwords do not match'
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 400
            flash(message, 'error')
            return render_template('change_password.html')
        
        is_valid, message = validate_password(new_password)
        if not is_valid:
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 400
            flash(message, 'error')
            return render_template('change_password.html')
        
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
    
    return render_template('change_password.html')

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
    total_amount = sum(item.quantity * item.product.price for item in cart_items)
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
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        
        # Validation
        if not all([username, email, password, confirm_password]):
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
        
        # Check if username or email already exists
        if User.query.filter_by(username=username).first():
            message = 'Username already exists'
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 400
            flash(message, 'error')
            return render_template('signup.html')
        
        if User.query.filter_by(email=email).first():
            message = 'Email already exists'
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 400
            flash(message, 'error')
            return render_template('signup.html')
        
        # Create new user
        new_user = User(
            username=username,
            email=email,
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
            db.session.rollback()
            message = 'An error occurred while creating your account'
            if request.is_json:
                return jsonify({'success': False, 'message': message}), 500
            flash(message, 'error')
    
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
    try:
        print('\n=== Google OAuth Callback Started ===')
        print(f'Request args: {request.args}')
        print(f'Session data: {dict(session)}')
        
        # Verify state
        state = session.get('oauth_state')
        request_state = request.args.get('state')
        print(f'State verification - Session state: {state}, Request state: {request_state}')
        
        if not state or state != request_state:
            print('[Google OAuth] Invalid state')
            flash('Invalid state parameter', category='error')
            return redirect(url_for('auth.login'))

        # Get authorization code
        code = request.args.get('code')
        print(f'Authorization code received: {code[:10]}...' if code else 'No code received')
        
        if not code:
            print('[Google OAuth] No code received')
            flash('No authorization code received', category='error')
            return redirect(url_for('auth.login'))

        # Exchange code for token
        token_data = {
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'code': code,
            'redirect_uri': GOOGLE_CALLBACK_URL,
            'grant_type': 'authorization_code'
        }
        
        print('Attempting to exchange code for token...')
        token_response = requests.post(GOOGLE_TOKEN_URL, data=token_data)
        print(f'Token response status: {token_response.status_code}')
        
        if not token_response.ok:
            print(f"[Google OAuth] Token Error: {token_response.text}")
            flash('Failed to get access token', category='error')
            return redirect(url_for('auth.login'))

        access_token = token_response.json().get('access_token')
        print(f'Access token received: {access_token[:10]}...')
        
        # Get user info
        headers = {'Authorization': f'Bearer {access_token}'}
        print('Fetching user info from Google...')
        userinfo_response = requests.get(GOOGLE_USERINFO_URL, headers=headers)
        print(f'Userinfo response status: {userinfo_response.status_code}')
        
        if not userinfo_response.ok:
            print(f"[Google OAuth] Userinfo Error: {userinfo_response.text}")
            flash('Failed to get user info', category='error')
            return redirect(url_for('auth.login'))

        userinfo = userinfo_response.json()
        print(f'User info received: {userinfo}')
        
        email = userinfo.get('email')
        print(f'Email from userinfo: {email}')
        
        if not email:
            print('[Google OAuth] No email in userinfo')
            flash('Could not get email from Google', category='error')
            return redirect(url_for('auth.login'))

        # Create or get user
        user = User.query.filter_by(email=email).first()
        print(f'Existing user found: {user is not None}')
        
        if not user:
            print('Creating new user...')
            username = email.split('@')[0] + str(uuid.uuid4())[:8]
            profile_image_url = userinfo.get('picture', None)
            user = User(
                email=email,
                username=username,
                first_name=userinfo.get('given_name', ''),
                middle_name='',
                last_name=userinfo.get('family_name', ''),
                role='customer',
                address='Please update your address',
                profile_image=profile_image_url
            )
            user._password = None
            db.session.add(user)
            db.session.commit()
            print(f'New user created: {user.email}, id={user.user_id}, role={user.role}')
            # Re-fetch user to ensure session attachment
            user = User.query.filter_by(email=email).first()
            print(f'Re-fetched user: {user.email}, id={user.user_id}, role={user.role}')
        else:
            print(f'Existing user: {user.email}, id={user.user_id}, role={user.role}')

        print('Attempting to log in user...')
        login_user(user, remember=False)
        print(f'User logged in: is_authenticated={user.is_authenticated}, id={user.user_id}, role={user.role}')
        print(f'Current user after login: {current_user.is_authenticated if current_user else None}')

        flash('Successfully signed in with Google!', category='success')
        redirect_url = url_for('views.home' if user.role != 'admin' else 'auth.admin')
        print(f'Redirecting to: {redirect_url}')
        return redirect(redirect_url)

    except Exception as e:
        import traceback
        print(f"\n=== Google OAuth Error ===")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        print(f"Traceback:\n{traceback.format_exc()}")
        flash(f'Failed to sign in with Google: {str(e)}', category='error')
        return redirect(url_for('auth.login'))

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
        # Get form data
        first_name = request.form.get('fullName')
        email = request.form.get('email')
        phone = request.form.get('phone')
        gender = request.form.get('gender')
        day = request.form.get('day')
        month = request.form.get('month')
        year = request.form.get('year')

        # Update user fields
        current_user.first_name = first_name
        current_user.email = email
        current_user.phone = phone
        current_user.gender = gender
        # Handle date of birth
        if day and month and year:
            try:
                current_user.date_of_birth = datetime(int(year), int(month), int(day))
            except Exception:
                pass
        # Handle profile image upload
        if 'profile_image' in request.files:
            file = request.files['profile_image']
            if file and file.filename:
                filename = secure_filename(file.filename)
                ext = filename.rsplit('.', 1)[1].lower()
                new_filename = f"{current_user.user_id}_{int(datetime.utcnow().timestamp())}.{ext}"
                save_path = os.path.join('SadWebApp/website/static/profile_images', new_filename)
                file.save(save_path)
                current_user.profile_image = new_filename
        db.session.commit()
        flash('Profile updated successfully!', 'success')
        return redirect(url_for('auth.my_account'))
    return render_template('my_account.html', user=current_user)

@auth.route('/orders')
@login_required
def orders():
    return render_template('orders.html')

@auth.route('/chat')
@login_required
def chat():
    return render_template('chat.html')

@auth.route('/api/sign-up', methods=['POST'])
def api_sign_up():
    data = request.get_json()
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([firstname, lastname, username, email, password]):
        return jsonify({'success': False, 'message': 'All fields are required'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'success': False, 'message': 'Username already exists'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'Email already exists'}), 400

    try:
        new_user = User(
            username=username,
            email=email,
            first_name=firstname,
            last_name=lastname
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
    return render_template('privacysettings.html')

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