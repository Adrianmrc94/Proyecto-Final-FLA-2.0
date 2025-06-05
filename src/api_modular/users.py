from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, User
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