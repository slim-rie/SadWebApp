import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Google OAuth 2.0 credentials
# To get these credentials:
# 1. Go to https://console.cloud.google.com/
# 2. Create a new project or select existing one
# 3. Enable Google OAuth2 API
# 4. Go to Credentials > Create Credentials > OAuth client ID
# 5. Set authorized redirect URI to: http://localhost:5000/auth/google-oauth-callback
# 6. Copy the Client ID and Client Secret below

GOOGLE_CLIENT_ID = "240771338078-q8muqloo8866iugeatrd8cojmvu9set1.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "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"
import os
GOOGLE_CALLBACK_URL = os.environ.get("GOOGLE_CALLBACK_URL", "http://localhost:5000/google-oauth-callback")

from datetime import timedelta

class Config:
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'SADPROJECT'
    
    # Database settings
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'mysql+pymysql://root:password@localhost/sadprojectdb'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_POOL_SIZE = 20
    SQLALCHEMY_POOL_RECYCLE = 3600
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_timeout': 30,
        'connect_args': {
            'connect_timeout': 30
        }
    }
    
    # Session settings
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    # CORS settings
    CORS_HEADERS = 'Content-Type'
    
    # File upload settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
    
    # Ensure upload folder exists
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    
    # Mail settings
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'tanchingcojbr@gmail.com')
    MAIL_MAX_EMAILS = 10
    MAIL_ASCII_ATTACHMENTS = False
    MAIL_SUPPRESS_SEND = False 