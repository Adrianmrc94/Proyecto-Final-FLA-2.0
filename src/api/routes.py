from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User, Product, Favorite
from flask_cors import CORS
import bcrypt
import random
from sqlalchemy.orm import joinedload
from sqlalchemy import or_
import requests
import secrets


api = Blueprint('api', __name__)

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'msg': 'Email y contraseña requeridos'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    if not user.is_active:
        return jsonify({'msg': 'Usuario desactivado'}), 403
    try:
        if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            return jsonify({'msg': 'Contraseña incorrecta'}), 401
    except ValueError:
        return jsonify({'msg': 'Error al verificar contraseña'}), 500

    token = create_access_token(identity=str(user.id))
    return jsonify({'msg': 'Login exitoso', 'token': token, 'user': user.serialize()}), 200

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    postal_code = data.get('postal_code')

    if not name or not last_name or not email or not password:
        return jsonify({'msg': 'Todos los campos obligatorios deben estar completos'}), 400
    if len(password) < 6:
        return jsonify({'msg': 'La contraseña debe tener al menos 6 caracteres'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'El correo ya está registrado'}), 409

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = User(name=name, last_name=last_name, email=email, password=hashed_password, postal_code=postal_code, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    token = create_access_token(identity=str(new_user.id))
    return jsonify({'msg': 'Registro exitoso', 'token': token, 'user': new_user.serialize()}), 201

@api.route('/products', methods=['GET'])
def get_products():
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    category = request.args.get('category')

    query = Product.query.options(joinedload(Product.store))
    if price_min is not None:
        query = query.filter(Product.price >= price_min)
    if price_max is not None:
        query = query.filter(Product.price <= price_max)
    if category:
        query = query.filter(Product.category.ilike(f'%{category}%'))

    products = query.order_by(Product.rate.desc()).all()
    return jsonify([p.serialize() for p in products]), 200

@api.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'msg': 'Producto no encontrado'}), 404
    return jsonify(product.serialize()), 200

@api.route('/categories', methods=['GET'])
def get_categories():
    categories = db.session.query(Product.category).distinct().all()
    category_list = [c[0] for c in categories if c[0]]
    return jsonify(category_list), 200

@api.route('/products/category/<string:category>', methods=['GET'])
def get_products_by_category(category):
    normalized = category.replace("-", " ").strip().lower()
    products = Product.query.options(joinedload(Product.store)).filter(
        Product.category.ilike(f'%{normalized}%')
    ).all()
    return jsonify([p.serialize() for p in products]), 200

@api.route('/products/compare', methods=['POST'])
def compare_products():
    data = request.get_json()
    product_ids = data.get('product_ids', [])
    if not product_ids or not isinstance(product_ids, list):
        return jsonify({'msg': 'Debes enviar una lista de IDs de productos'}), 400

    products = Product.query.options(joinedload(Product.store)).filter(Product.id.in_(product_ids)).all()
    return jsonify([p.serialize() for p in products]), 200

api.route('/search', methods=['GET'])
def search_products():
    query = request.args.get('query', '')
    products = Product.query.options(joinedload(Product.store)).filter(
        or_(
            Product.name.ilike(f'%{query}%'),
            Product.description.ilike(f'%{query}%'),
            Product.category.ilike(f'%{query}%')
        )
    ).all()
    return jsonify([p.serialize() for p in products]), 200

@api.route('/random-product', methods=['GET'])
def get_random_product():
    products = Product.query.options(joinedload(Product.store)).all()
    if not products:
        return jsonify({'msg': 'No hay productos disponibles'}), 404
    product = random.choice(products)
    return jsonify(product.serialize()), 200


@api.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('product_id')
    store_id = data.get('store_id')
    date_ad = data.get('date_ad')

    if not product_id or not store_id:
        return jsonify({'msg': 'Faltan datos: se requiere product_id y store_id'}), 400

    product = Product.query.get(product_id)
    if not product:
        return jsonify({'msg': 'Producto no encontrado'}), 404

    from api.models import Store  
    store = Store.query.get(store_id)
    if not store:
        return jsonify({'msg': 'Tienda no encontrada'}), 404

    favorite = Favorite(
        user_id=user_id,
        product_id=product_id,
        store_id=store_id,
        date_ad=date_ad
    )

    db.session.add(favorite)
    db.session.commit()

    return jsonify({'msg': 'Producto agregado a favoritos'}), 201

@api.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([f.serialize() for f in favorites]), 200

@api.route('/favorites/<int:favorite_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(favorite_id):
    user_id = get_jwt_identity()
    favorite = Favorite.query.filter_by(id=favorite_id, user_id=user_id).first()

    if not favorite:
        return jsonify({'msg': 'Favorito no encontrado'}), 404

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({'msg': 'Favorito eliminado'}), 200


@api.route('/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    return jsonify(user.serialize()), 200

@api.route('/user/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    data = request.get_json()
    user.name = data.get('name', user.name)
    user.last_name = data.get('last_name', user.last_name)
    user.email = data.get('email', user.email)
    user.postal_code = data.get('postal_code', user.postal_code)
    db.session.commit()
    return jsonify({'msg': 'Perfil actualizado', 'user': user.serialize()}), 200

@api.route('/user/change-password', methods=['POST'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    data = request.get_json()
    old_password = data.get('old_password')
    new_password = data.get('new_password')

    if not old_password or not new_password:
        return jsonify({'msg': 'Faltan datos'}), 400

    if not bcrypt.checkpw(old_password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({'msg': 'Contraseña actual incorrecta'}), 401

    if len(new_password) < 6:
        return jsonify({'msg': 'La nueva contraseña debe tener al menos 6 caracteres'}), 400

    user.password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db.session.commit()
    return jsonify({'msg': 'Contraseña actualizada'}), 200

@api.route('/user/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    data = request.get_json()
    password = data.get('password')
    if not password:
        return jsonify({'msg': 'Debes proporcionar la contraseña'}), 400

    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({'msg': 'Contraseña incorrecta'}), 401

    user.is_active = False
    db.session.commit()
    return jsonify({'msg': 'Cuenta eliminada correctamente'}), 200



""" reset_tokens = {}
@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    # Genera un token simple (en producción usa JWT o similar)
    token = secrets.token_urlsafe(32)
    reset_tokens[token] = user.id

    # Aquí deberías enviar el token por email al usuario
    # Por ahora, solo lo devolvemos para pruebas
    return jsonify({'msg': 'Token de recuperación generado', 'token': token}), 200

@api.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    user_id = reset_tokens.get(token)
    if not user_id:
        return jsonify({'msg': 'Token inválido o expirado'}), 400

    data = request.get_json()
    new_password = data.get('new_password')
    if not new_password or len(new_password) < 6:
        return jsonify({'msg': 'La nueva contraseña debe tener al menos 6 caracteres'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    user.password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db.session.commit()
    # Elimina el token usado
    del reset_tokens[token]
    return jsonify({'msg': 'Contraseña restablecida correctamente'}), 200
 """