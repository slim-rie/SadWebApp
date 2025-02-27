from flask import Blueprint, render_template, request, flash, redirect, url_for
from .models import User
from . import db
from flask_login import login_user, login_required, logout_user, current_user


auth = Blueprint('auth', __name__)

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
        elif middle_name is not None and len(middle_name) < 2:
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
            login_user(user, remember=True)
            flash('Account  created!', category='success')
            return redirect(url_for('views.home'))

    return render_template("sign_up.html", user=current_user)