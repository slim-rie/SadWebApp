from flask import Flask, redirect, url_for, request, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, current_user
from os import path
from functools import wraps
from flask_migrate import Migrate
from flask_cors import CORS
from .config import Config

db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    CORS(app)
    
    # Configure login manager
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Please log in to access this page.'
    login_manager.login_message_category = 'info'
    
    # Register blueprints
    from .views import views
    from .auth import auth
    
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

def create_database(app):
    with app.app_context():
        # Create migrations directory if it doesn't exist
        if not path.exists('website/migrations'):
            from flask_migrate import init, migrate, upgrade
            init()
            migrate()
            upgrade()
        print('Database initialized with migrations!')

