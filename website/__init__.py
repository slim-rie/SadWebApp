from flask import Flask, redirect, url_for, request, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, current_user
from os import path
from functools import wraps

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'SADPROJECT'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@localhost/SADprojectdb'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_POOL_SIZE'] = 20
    app.config['SQLALCHEMY_POOL_RECYCLE'] = 3600
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_pre_ping': True,
        'pool_timeout': 30,
        'connect_args': {
            'connect_timeout': 30
        }
    }

    # Initialize database
    db.init_app(app)

    # Add explicit redirect for the root URL
    @app.route('/')
    def root_redirect():
        return redirect(url_for('auth.login'))

    from .views import views
    from .auth import auth

    # Standard blueprint registration
    app.register_blueprint(views, url_prefix='/') # Views now handles /home, /add-to-cart etc.
    app.register_blueprint(auth, url_prefix='/auth')

    from .models import User

    create_database(app)

    # Configure Login Manager (basic setup)
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login' # Endpoint name for login view

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    return app

def create_database(app):
    if not path.exists('website/' + 'SADprojectdb'):
        with app.app_context():
            db.create_all()
        print('Created Database!')

