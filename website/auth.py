from flask import Blueprint, render_template, request, flash, redirect, url_for, session
from .models import User
from . import db
from flask_login import login_user, login_required, logout_user, current_user
import os
from requests_oauthlib import OAuth2Session

auth = Blueprint('auth', __name__)

# Allow OAuth over HTTP for development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# Google OAuth 2.0 credentials
GOOGLE_CLIENT_ID = "240771338078-6lhucfo67thhpdpkcs4d3mihmmdv49e2.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
GOOGLE_CALLBACK_URL = "http://localhost:5000/auth/google-oauth-callback"  # Must match exactly what's in Google Cloud Console

@auth.route('/profile')
@login_required
def profile():
    return render_template('profile.html')

@auth.route('/Cart')
@login_required
def cart():
    return render_template('Cart.html')

@auth.route('/admin', methods=['GET', 'POST'])
@login_required
def admin(): #authenticate admin
    return render_template("admin.html", user=current_user) #this will render the html of admin

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first() #indent is important to align to which you want it connected
        if user:
            if user.password == password:
                flash('Logged in successfully', category='success')
                login_user(user, remember=True)
                if user.role == 'admin':
                    return redirect(url_for('auth.admin', user=current_user))  #if the role is admin, will go to authenticate admin
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