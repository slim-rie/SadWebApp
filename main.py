from website import create_app
import os

app = create_app()

if __name__ == '__main__':
    app.secret_key = os.urandom(24).hex()  # Generate a secure random key
<<<<<<< HEAD
    app.run(debug=True)
=======
    app.run(debug=True, port=5001)
>>>>>>> 2f84426b954e3df8f8de3624525eb3285576594b
