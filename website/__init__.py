from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
import os

db = SQLAlchemy()
bcrypt = Bcrypt()

def create_database(app):
    with app.app_context():
        db.create_all()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.urandom(24).hex()
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

    db.init_app(app)
    bcrypt.init_app(app)

    from .views import views
    from .auth import auth
    from .models import User, Product, CartItem

    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")
    
    login_manager = LoginManager() 
    login_manager.login_view = 'auth.login' 
    login_manager.init_app(app) 

    @login_manager.user_loader 
    def load_user(user_id): 
        return User.query.get(int(user_id)) 
    
    with app.app_context():
        db.create_all()
        
        # Add some sample products if none exist
        if not Product.query.first():
            sample_products = [
                Product(
                    name='Chiffon Purple',
                    description='High-quality purple chiffon fabric',
                    price=15.99,
                    image_url='Chiffon Purple.jpg',
                    category='Fabric'
                ),
                Product(
                    name='Singer Heavy Duty',
                    description='Professional sewing machine',
                    price=299.99,
                    image_url='Singer Heavy Duty Sewing Machine.jpg',
                    category='Sewing Machines'
                ),
                Product(
                    name='Balance Wheel',
                    description='Replacement balance wheel for sewing machines',
                    price=24.99,
                    image_url='sewing-machine-balance-wheel.jpg',
                    category='Sewing Parts'
                )
            ]
            for product in sample_products:
                db.session.add(product)
            db.session.commit()
    
    return app
