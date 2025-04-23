from website import create_app
import os

app = create_app()

if __name__ == '__main__':
    app.secret_key = os.urandom(24).hex()  # Generate a secure random key
    app.run(debug=True, port=5001)