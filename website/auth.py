from flask import Blueprint, render_template, request, flash 

auth = Blueprint('auth', __name__)

@auth.route('/admin', methods=['GET', 'POST'])
def admin():
    return render_template("admin.html")

@auth.route('/login', methods=['GET', 'POST'])
def login():
    data = request.form
    print(data)
    return render_template("login.html")

@auth.route('/logout')
def logout():
    return render_template("home.html")

@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        first_name = request.form.get('first_name')
        middle_name = request.form.get('middle_name')
        last_name = request.form.get('last_name')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        if len(email) < 4:
            flash('email must be greater than 3 character', category='error')
        elif len(first_name) < 3:
            flash('First name must be greater than 2 character', category='error')
        elif middle_name and len(middle_name) < 2:
            flash('Middle name must be greater than 1 character', category='error')
        elif len(last_name) < 2:
            flash('Last name must be greater than 1 character', category='error')
        elif len(password1 != password2):
            flash('password don\'t match!', category='error')
        else:
            flash('Account  created!', category='success')

    return render_template("sign_up.html")