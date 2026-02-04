from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, User, Store
import bcrypt

users_bp = Blueprint('users', __name__)

@users_bp.route('/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    return jsonify(user.serialize()), 200

@users_bp.route('/user/profile', methods=['PUT'])
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

@users_bp.route('/user/change-password', methods=['POST'])
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

    # Verificar contraseña actual
    if not bcrypt.checkpw(old_password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({'msg': 'Contraseña actual incorrecta'}), 401

    if len(new_password) < 6:
        return jsonify({'msg': 'La nueva contraseña debe tener al menos 6 caracteres'}), 400

    # Actualizar contraseña
    user.password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db.session.commit()
    return jsonify({'msg': 'Contraseña actualizada'}), 200

@users_bp.route('/user/update-postal-code', methods=['PUT'])
@jwt_required()
def update_postal_code():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    data = request.get_json()
    postal_code = data.get('postal_code')

    if not postal_code:
        return jsonify({'error': 'El código postal es obligatorio'}), 400

    # Validar formato de código postal (5 dígitos)
    if not postal_code.isdigit() or len(postal_code) != 5:
        return jsonify({'error': 'El código postal debe tener 5 dígitos'}), 400

    # Actualizar código postal
    user.postal_code = postal_code
    db.session.commit()
    
    return jsonify({
        'msg': 'Código postal actualizado correctamente',
        'postal_code': postal_code
    }), 200

@users_bp.route('/user/delete-account', methods=['DELETE'])
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

    # Verificar contraseña
    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({'msg': 'Contraseña incorrecta'}), 401

    # Soft delete
    user.is_active = False
    db.session.commit()
    return jsonify({'msg': 'Cuenta eliminada correctamente'}), 200


@users_bp.route('/user/scrape-postal-code', methods=['POST'])
@jwt_required()
def scrape_postal_code():
    """
    Ejecuta scraping SÍNCRONO de Mercadona (sin threads)
    """
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404

    data = request.get_json()
    postal_code = data.get('postal_code')

    if not postal_code:
        return jsonify({'error': 'El código postal es obligatorio'}), 400

    # Validar formato
    if not postal_code.isdigit() or len(postal_code) != 5:
        return jsonify({'error': 'El código postal debe tener 5 dígitos'}), 400

    # Verificar si ya existe una tienda de Mercadona para este CP
    existing_store = Store.query.filter_by(
        postal_code=postal_code
    ).filter(
        Store.name.like('%Mercadona%')
    ).first()

    if existing_store:
        return jsonify({
            'needs_scraping': False,
            'message': f'Ya existe tienda Mercadona para CP {postal_code}',
            'store_id': existing_store.id
        }), 200

    # Verificar límite de tiendas Mercadona (máximo 3)
    mercadona_stores = Store.query.filter(
        Store.name.like('%Mercadona%'),
        Store.is_active == True
    ).order_by(Store.id.asc()).all()

    if len(mercadona_stores) >= 3:
        # Eliminar la más antigua
        oldest_store = mercadona_stores[0]
        print(f"🗑️  Eliminando tienda antigua: {oldest_store.name}")
        
        # Eliminar productos asociados
        from api.models import Product
        Product.query.filter_by(store_id=oldest_store.id).delete()
        db.session.delete(oldest_store)
        db.session.commit()

    # SCRAPING SÍNCRONO (sin threads)
    try:
        from api.scripts.scrape_mercadona import scrape_mercadona_sync
        result = scrape_mercadona_sync(postal_code)
        
        return jsonify({
            'needs_scraping': True,
            'message': f'Scraping completado para CP {postal_code}',
            'store_id': result['store_id'],
            'products_imported': result['imported'],
            'products_skipped': result['skipped']
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Error en scraping',
            'details': str(e)
        }), 500