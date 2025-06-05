from flask import request, jsonify, Blueprint
from api.models import db, Product
from sqlalchemy.orm import joinedload
from sqlalchemy import or_
import random

products_bp = Blueprint('products', __name__)

recent_random_products = []
MAX_RECENT_PRODUCTS = 5

@products_bp.route('/products', methods=['GET'])
def get_products():
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    category = request.args.get('category')

    query = Product.query.options(joinedload(Product.store))
    
    # Aplicar filtros
    if price_min is not None:
        query = query.filter(Product.price >= price_min)
    if price_max is not None:
        query = query.filter(Product.price <= price_max)
    if category:
        query = query.filter(Product.category.ilike(f'%{category}%'))

    products = query.order_by(Product.rate.desc()).all()
    return jsonify([p.serialize() for p in products]), 200

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'msg': 'Producto no encontrado'}), 404
    return jsonify(product.serialize()), 200

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(Product.category).distinct().all()
    category_list = [c[0] for c in categories if c[0]]
    return jsonify(category_list), 200

@products_bp.route('/products/category/<string:category>', methods=['GET'])
def get_products_by_category(category):
    normalized = category.replace("-", " ").strip().lower()
    products = Product.query.options(joinedload(Product.store)).filter(
        Product.category.ilike(f'%{normalized}%')
    ).all()
    return jsonify([p.serialize() for p in products]), 200

@products_bp.route('/products/compare', methods=['POST'])
def compare_products():
    data = request.get_json()
    product_ids = data.get('product_ids', [])
    
    if not product_ids or not isinstance(product_ids, list):
        return jsonify({'msg': 'Debes enviar una lista de IDs de productos'}), 400

    products = Product.query.options(joinedload(Product.store)).filter(
        Product.id.in_(product_ids)
    ).all()
    return jsonify([p.serialize() for p in products]), 200

@products_bp.route('/search', methods=['GET'])
def search_products():
    query = request.args.get('query', '')
    category = request.args.get('category', '')
    filters = []

    if query:
        filters.append(or_(
            Product.name.ilike(f'%{query}%'),
            Product.description.ilike(f'%{query}%'),
            Product.category.ilike(f'%{query}%')
        ))

    if category:
        normalized = category.replace("-", " ").strip().lower()
        filters.append(Product.category.ilike(f'%{normalized}%'))

    products = Product.query.options(joinedload(Product.store)).filter(*filters).all()
    return jsonify([p.serialize() for p in products]), 200

@products_bp.route('/random-product', methods=['GET'])
def get_random_product():
    global recent_random_products
    
    exclude_ids = request.args.getlist('exclude_ids', type=int)
    all_exclude_ids = set(exclude_ids + recent_random_products)
    
    query = Product.query.options(joinedload(Product.store))
    
    if all_exclude_ids:
        query = query.filter(~Product.id.in_(all_exclude_ids))
    
    products = query.all()
    
    # Si no hay productos disponibles, limpiar historial
    if not products:
        recent_random_products = []
        products = Product.query.options(joinedload(Product.store)).all()
        if not products:
            return jsonify({'msg': 'No hay productos disponibles'}), 404
    
    product = random.choice(products)
    
    # Actualizar historial
    recent_random_products.append(product.id)
    if len(recent_random_products) > MAX_RECENT_PRODUCTS:
        recent_random_products.pop(0)
    
    return jsonify(product.serialize()), 200