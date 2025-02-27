from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from os import path
from flask_login import LoginManager

db = SQLAlchemy()
migrate = Migrate()

def create_database(app):
        with app.app_context():
            db.create_all()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'SADPROJECT'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@localhost/sadDb'
    db.init_app(app)
    migrate.init_app(app, db)

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
    def load_user(id): #where to get the specific
        return User.query.get(int(id)) #this is when they get the id and will give it to you

    return app