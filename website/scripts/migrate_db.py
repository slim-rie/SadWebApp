from flask import Flask
from flask_migrate import Migrate, upgrade
from .. import db, create_app

def run_migrations():
    app = create_app()
    migrate = Migrate(app, db)
    
    with app.app_context():
        # Run migrations
        upgrade()
        print("Database migrations completed successfully!")

if __name__ == '__main__':
    run_migrations() 