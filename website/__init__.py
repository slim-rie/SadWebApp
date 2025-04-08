from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager


db = SQLAlchemy()

def create_database(app):
    with app.app_context():
        # Get database engine
        engine = db.get_engine()
        
        # Use a connection context
        with engine.connect() as conn:
            # Drop and recreate database
            conn.execute(db.text('DROP DATABASE IF EXISTS SADprojectdb;'))
            conn.execute(db.text('CREATE DATABASE SADprojectdb;'))
            conn.execute(db.text('USE SADprojectdb;'))
            conn.commit()
            
            # Create all tables
            db.create_all()
            
            # Initialize sample data
            from .migrations import init_db
            init_db()

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

    db.init_app(app)


    from .views import views
    from .auth import auth
    from .models import User


    app.register_blueprint(views, url_prefix="/")
    app.register_blueprint(auth, url_prefix="/")
    
    create_database(app)
   

    login_manager = LoginManager() #this create a librarian
    login_manager.login_view = 'auth.login' #this is the main login
    login_manager.init_app(app) #helps with the app(flask app)

    @login_manager.user_loader #this will go to a specific user 
    def load_user(user_id): #where to get the specific
        return User.query.get(int(user_id)) #this is when they get the id and will give it to you
    

    return app

