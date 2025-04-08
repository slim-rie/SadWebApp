from flask import Blueprint, render_template, request, flash, redirect, url_for, session
from .models import User, CartItem, Product
from . import db
from flask_login import login_user, login_required, logout_user, current_user
import os
from requests_oauthlib import OAuth2Session
from datetime import datetime
from werkzeug.utils import secure_filename
import uuid

auth = Blueprint('auth', __name__)

# Allow OAuth over HTTP for development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# Google OAuth 2.0 credentials
GOOGLE_CLIENT_ID = "240771338078-6lhucfo67thhpdpkcs4d3mihmmdv49e2.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
GOOGLE_CALLBACK_URL = "http://localhost:5000/auth/google-oauth-callback"  # Must match exactly what's in Google Cloud Console

# File upload settings
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create upload folder if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_profile_picture(file):
    if file and file.filename:
        # Generate unique filename
        filename = secure_filename(file.filename)
        ext = filename.rsplit('.', 1)[1].lower()
        new_filename = f"profile_{uuid.uuid4().hex}.{ext}"
        
        # Save file
        file_path = os.path.join(UPLOAD_FOLDER, new_filename)
        file.save(file_path)
        
        # Return relative path for database
        return f'uploads/{new_filename}'
    return None

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

@auth.route('/Contact-Seller')
@login_required
def contact_seller():
    return render_template('contact_seller.html')

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

@auth.route('/add-to-cart/<int:product_id>', methods=['POST'])
@login_required
def add_to_cart(product_id):
    # Check if user has address
    if not current_user.has_address():
        flash('Please add your address in profile before making a purchase.', 'error')
        return redirect(url_for('views.home'))

    product = Product.query.get_or_404(product_id)
    
    # Check if item already in cart
    cart_item = CartItem.query.filter_by(user_id=current_user.user_id, product_id=product_id).first()
    
    if cart_item:
        cart_item.quantity += 1
    else:
        cart_item = CartItem(user_id=current_user.user_id, product_id=product_id)
        db.session.add(cart_item)
    
    db.session.commit()
    flash('Item added to cart successfully!', 'success')
    return redirect(url_for('views.home'))

@auth.route('/update-cart-quantity/<int:item_id>', methods=['POST'])
@login_required
def update_cart_quantity(item_id):
    cart_item = CartItem.query.get_or_404(item_id)
    if cart_item.user_id != current_user.user_id:
        flash('Unauthorized access', 'error')
        return redirect(url_for('auth.cart'))
    
    action = request.form.get('action')
    if action == 'increase':
        cart_item.quantity += 1
    elif action == 'decrease':
        if cart_item.quantity > 1:
            cart_item.quantity -= 1
        else:
            db.session.delete(cart_item)
    
    db.session.commit()
    return redirect(url_for('auth.cart'))

@auth.route('/remove-from-cart/<int:item_id>', methods=['POST'])
@login_required
def remove_from_cart(item_id):
    cart_item = CartItem.query.get_or_404(item_id)
    if cart_item.user_id != current_user.user_id:
        flash('Unauthorized access', 'error')
        return redirect(url_for('auth.cart'))
    
    db.session.delete(cart_item)
    db.session.commit()
    flash('Item removed from cart', 'success')
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
        first_name = request.form.get('first_name')
        middle_name = request.form.get('middle_name')
        last_name = request.form.get('last_name')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')
        role = request.form.get('role', 'user')


        user = User.query.filter_by(email=email).first()
        if user:
            flash('Email already exist', category='error')
        elif len(email) < 4:
            flash('email must be greater than 3 characters.', category='error')
        elif len(first_name) < 3:
            flash('First name must be greater than 2 characters.', category='error')
        elif middle_name and len(middle_name) < 2:
            flash('Middle name must be greater than 1 character.', category='error')
        elif len(last_name) < 2:
            flash('Last name must be greater than 1 character.', category='error')
        elif len(password1) < 7:
            flash('password must be greater than 6 characters.', category='error')
        elif password1 != password2:
            flash('password don\'t match!', category='error')
        else:
            new_user = User(email=email, 
                            first_name=first_name, 
                            middle_name=middle_name, 
                            last_name=last_name, 
                            password=password1,
                            role = role)
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            flash('Account  created!', category='success')
            return redirect(url_for('views.home'))
        db.session.commit()
        
    return render_template("sign_up.html", user=current_user) 

@auth.route('/auth/google-oauth-login')
def google_oauth_login():
    oauth = OAuth2Session(
        GOOGLE_CLIENT_ID,
        redirect_uri=GOOGLE_CALLBACK_URL,
        scope=['openid', 'email', 'profile']
    )
    authorization_url, state = oauth.authorization_url("https://accounts.google.com/o/oauth2/v2/auth")
    session['oauth_state'] = state
    return redirect(authorization_url)

@auth.route('/auth/google-oauth-callback')
def google_oauth_callback():
    try:
        oauth = OAuth2Session(
            GOOGLE_CLIENT_ID,
            redirect_uri=GOOGLE_CALLBACK_URL,
            state=session.get('oauth_state')
        )
        token = oauth.fetch_token(
            "https://oauth2.googleapis.com/token",
            client_secret=GOOGLE_CLIENT_SECRET,
            authorization_response=request.url
        )
        
        userinfo = oauth.get('https://www.googleapis.com/oauth2/v3/userinfo').json()
        email = userinfo['email']
        first_name = userinfo.get('given_name', '')
        last_name = userinfo.get('family_name', '')
        
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(
                email=email,
                first_name=first_name,
                middle_name='',
                last_name=last_name,
                password=None,
                role='user'
            )
            db.session.add(user)
            db.session.commit()
        
        login_user(user, remember=True)
        flash('Successfully signed in with Google!', category='success')
        return redirect(url_for('views.home' if user.role != 'admin' else 'auth.admin'))
        
    except Exception as e:
        flash(f'Failed to sign in with Google: {str(e)}', category='error')
        return redirect(url_for('auth.login'))

@auth.route('/update-profile', methods=['POST'])
@login_required
def update_profile():
    if request.method == 'POST':
        try:
            # Get form data
            username = request.form.get('username')
            email = request.form.get('email')
            number = request.form.get('number')
            date_of_birth = request.form.get('date_of_birth')
            address = request.form.get('address')
            
            # Validate username
            if not username:
                flash('Username is required', 'error')
                return redirect(url_for('auth.profile'))
            
            # Check if username is taken by another user
            existing_user = User.query.filter(User.username == username, User.user_id != current_user.user_id).first()
            if existing_user:
                flash('Username is already taken', 'error')
                return redirect(url_for('auth.profile'))
            
            # Handle profile picture upload
            if 'profile' in request.files:
                file = request.files['profile']
                if file and file.filename:
                    profile_path = save_profile_picture(file)
                    if profile_path:
                        current_user.profile_picture = profile_path
            
            # Update user information
            current_user.username = username
            current_user.email = email
            current_user.number = number
            
            # Handle date of birth
            if date_of_birth:
                try:
                    current_user.date_of_birth = datetime.strptime(date_of_birth, '%Y-%m-%d').date()
                except ValueError:
                    flash('Invalid date format', 'error')
                    return redirect(url_for('auth.profile'))
            
            # Update address
            current_user.address = address
            
            # Save changes to database
            db.session.commit()
            
            flash('Profile updated successfully!', 'success')
            return redirect(url_for('auth.profile'))
            
        except Exception as e:
            db.session.rollback()
            flash('An error occurred while updating your profile', 'error')
            print(f"Error updating profile: {str(e)}")
            return redirect(url_for('auth.profile'))
    
    return redirect(url_for('auth.profile'))