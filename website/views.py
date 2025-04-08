from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user
from .models import Product
from . import db

views = Blueprint('views', __name__)

@views.route('/')
@login_required
def home():
    products = Product.query.all()
    categories = list(set(product.category for product in products if product.category))
    return render_template("home.html", products=products, categories=categories)

@views.route('/get-cart-count')
@login_required
def get_cart_count():
    if not current_user.is_authenticated:
        return jsonify({'count': 0})
    return jsonify({'count': sum(item.quantity for item in current_user.cart_items)})