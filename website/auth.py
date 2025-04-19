from flask import Blueprint, render_template, request, flash, redirect, url_for, session, current_app
from .models import User, CartItem, Product
from . import db
from flask_login import login_user, login_required, logout_user, current_user
import os
import requests
import json
from requests_oauthlib import OAuth2Session
from werkzeug.utils import secure_filename
import uuid

auth = Blueprint('auth', __name__)

# Allow OAuth over HTTP for development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
# Skip HTTPS verification for localhost
os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'

try:
    from .config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
except ImportError:
    GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID"
    GOOGLE_CLIENT_SECRET = "YOUR_CLIENT_SECRET"

# Google OAuth endpoints
GOOGLE_CALLBACK_URL = "http://127.0.0.1:5000/auth/google-oauth-callback"
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

@auth.route('/change-password', methods=['GET', 'POST'])
@login_required
def change_password():
    if request.method == 'POST':
        current_password = request.form.get('current_password')
        new_password = request.form.get('new_password')
        confirm_password = request.form.get('confirm_new_password')  

        # Verify current password
        if not current_user.verify_password(current_password):
            flash('Current password is incorrect!', category='error')
            return render_template('change_password.html')

        # Validate new password
        if len(new_password) < 7:
            flash('New password must be at least 7 characters long!', category='error')
            return render_template('change_password.html')

        if new_password != confirm_password:
            flash('New passwords don\'t match!', category='error')
            return render_template('change_password.html')

        # Update password in database
        current_user.password = new_password
        db.session.commit()
        flash('Password updated successfully!', category='success')
        return redirect(url_for('auth.profile'))

    return render_template('change_password.html')

@auth.route('/add-item')
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
def admin(): #authenticate admin
    return render_template("admin.html", user=current_user) #this will render the html of admin

@auth.route('/staff', methods=['GET', 'POST'])
@login_required
def staff(): #authenticate admin
    return render_template("staff.html", user=current_user)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first() #indent is important to align to which you want it connected
        if user:
            if user.verify_password(password):
                flash('Logged in successfully', category='success')
                login_user(user, remember=True)
                if user.role == 'admin':
                    return redirect(url_for('auth.admin', user=current_user))  #if the role is admin, will go to authenticate admin
                if user.role == 'staff':
                    return redirect(url_for('auth.staff', user=current_user)) #if the role is staff, will go to authenticate staff
                if user.role == 'supplier':
                    return redirect(url_for('auth.supplier', user=current_user)) #if the role is staff, will go to authenticate supplier
                else: 
                    return redirect(url_for('views.home', user=current_user)) #if only user, will go views.home which is default page of user
            else:
                flash('Incorrect password!', category='error') 
        else:
            flash('Email does not exist', category='error')

    return render_template("login.html", user=current_user)

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.login'))

@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        username = request.form.get('username')
        first_name = request.form.get('first_name')
        middle_name = request.form.get('middle_name')
        last_name = request.form.get('last_name')
        address = request.form.get('address')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')
        role = request.form.get('role', 'user')

        # Check if email or username already exists
        email_exists = User.query.filter_by(email=email).first()
        username_exists = User.query.filter_by(username=username).first()

        if email_exists:
            flash('Email already exists', category='error')
        elif username_exists:
            flash('Username already taken', category='error')
        elif len(email) < 4:
            flash('Email must be greater than 3 characters', category='error')
        elif len(username) < 3:
            flash('Username must be at least 3 characters', category='error')
        elif len(first_name) < 2:
            flash('First name must be greater than 1 character', category='error')
        elif middle_name and len(middle_name) < 2:
            flash('Middle name must be greater than 1 character', category='error')
        elif len(last_name) < 2:
            flash('Last name must be greater than 1 character', category='error')
        elif len(address.strip()) < 5:
            flash('Please enter a valid address', category='error')
        elif len(password1) < 7:
            flash('Password must be at least 7 characters', category='error')
        elif password1 != password2:
            flash('Passwords don\'t match!', category='error')
        else:
            new_user = User(
                email=email,
                username=username,
                first_name=first_name,
                middle_name=middle_name,
                last_name=last_name,
                address=address,
                password=password1,
                role=role
            )
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            flash('Account created successfully!', category='success')
            return redirect(url_for('views.home'))

    return render_template("sign_up.html", user=current_user)

@auth.route('/auth/google-oauth-login')
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
        return redirect(auth_url)
    except Exception as e:
        print(f"Login Error: {str(e)}")
        flash('Failed to initiate Google login', category='error')
        return redirect(url_for('auth.login'))

@auth.route('/auth/google-oauth-callback')
def google_oauth_callback():
    try:
        # Verify state
        state = session.get('oauth_state')
        if not state or state != request.args.get('state'):
            flash('Invalid state parameter', category='error')
            return redirect(url_for('auth.login'))

        # Get authorization code
        code = request.args.get('code')
        if not code:
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
        
        token_response = requests.post(GOOGLE_TOKEN_URL, data=token_data)
        if not token_response.ok:
            print(f"Token Error: {token_response.text}")
            flash('Failed to get access token', category='error')
            return redirect(url_for('auth.login'))

        access_token = token_response.json().get('access_token')
        
        # Get user info
        headers = {'Authorization': f'Bearer {access_token}'}
        userinfo_response = requests.get(GOOGLE_USERINFO_URL, headers=headers)
        
        if not userinfo_response.ok:
            print(f"Userinfo Error: {userinfo_response.text}")
            flash('Failed to get user info', category='error')
            return redirect(url_for('auth.login'))

        userinfo = userinfo_response.json()
        email = userinfo.get('email')
        
        if not email:
            flash('Could not get email from Google', category='error')
            return redirect(url_for('auth.login'))

        # Create or get user
        user = User.query.filter_by(email=email).first()
        if not user:
            username = email.split('@')[0] + str(uuid.uuid4())[:8]
            # Create user instance without setting password
            user = User(
                email=email,
                username=username,
                first_name=userinfo.get('given_name', ''),
                middle_name='',
                last_name=userinfo.get('family_name', ''),
                role='user',
                address='Please update your address'
            )
            # Set password field directly to avoid hashing None
            user._password = None
            db.session.add(user)
            db.session.commit()

        login_user(user, remember=True)
        flash('Successfully signed in with Google!', category='success')
        return redirect(url_for('views.home' if user.role != 'admin' else 'auth.admin'))

    except Exception as e:
        import traceback
        print(f"Callback Error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
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