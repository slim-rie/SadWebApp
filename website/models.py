from . import db
from flask_login import UserMixin

class User(db.Model, UserMixin):
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True)
    first_name = db.Column(db.String(100))
    middle_name = db.Column(db.String(100), nullable=True)
    last_name = db.Column(db.String(100))
    password = db.Column(db.String(225))
    role = db.Column(db.String(100), nullable=False, default='user')

    def get_id(self):
        return str(self.user_id)