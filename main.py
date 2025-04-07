from website import create_app
import os
from flask_migrate import Migrate
from website import db

app = create_app()
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.secret_key = os.urandom(24).hex()  # Generate a secure random key
    app.run(debug=True)