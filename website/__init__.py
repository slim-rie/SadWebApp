from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate

db = SQLAlchemy()
login_manager = LoginManager()
migrate = Migrate()

from flask import Flask, redirect, url_for, request, flash
from flask_login import current_user
from flask_cors import CORS
from os import path
from functools import wraps
from .config import Config

def create_app(config_class=Config):
    from .auth import auth as auth_blueprint
    from .views import views

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
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    # Import models after extensions and blueprints are set up, to avoid circular imports
    with app.app_context():
        from .models import User
        db.create_all()

        @login_manager.user_loader
        def load_user(id):
            return User.query.get(int(id))

    return app