"""
Módulo de Autenticación - Rutas de login, registro y recuperación de contraseña.
"""
from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from api.models import db, User
import bcrypt
from datetime import timedelta
from extensions import mail
from flask_mail import Message
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Endpoint para login de usuarios con email y contraseña."""
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

@auth_bp.route('/register', methods=['POST'])
def register():
    """Endpoint para registro de nuevos usuarios."""
    data = request.get_json()
    name = data.get('name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    postal_code = data.get('postal_code')

    # Validaciones
    if not name or not last_name or not email or not password:
        return jsonify({'msg': 'Todos los campos obligatorios deben estar completos'}), 400
    if len(password) < 6:
        return jsonify({'msg': 'La contraseña debe tener al menos 6 caracteres'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'El correo ya está registrado'}), 409

    # Crear usuario
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = User(
        name=name, 
        last_name=last_name, 
        email=email,
        password=hashed_password, 
        postal_code=postal_code, 
        is_active=True
    )
    db.session.add(new_user)
    db.session.commit()

    token = create_access_token(identity=str(new_user.id))
    return jsonify({'msg': 'Registro exitoso', 'token': token, 'user': new_user.serialize()}), 201

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """Envía email para recuperación de contraseña."""
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'msg': 'Email requerido'}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'msg': 'El correo ingresado no está registrado en la aplicación, crea una cuenta o contacta con administración'}), 404
    
    # Crear token temporal
    claims = {'fogot_password': True, 'email': email}
    reset_token = create_access_token(
        identity=str(user.id), 
        expires_delta=timedelta(minutes=15), 
        additional_claims=claims
    )

    try:
        frontend_url = os.getenv('VITE_FRONTEND_URL', 'https://glowing-engine-g47g9q94v665hpwq5-3000.app.github.dev/')
        frontend_url = frontend_url.rstrip('/')
        reset_link = f"{frontend_url}/reset-password?token={reset_token}"

        msg = Message(
            'Reestablece tú contraseña',
            recipients=[email],
            body=f"Sigue este enlace para restablecer tu contraseña: {reset_link}"
        )

        mail.send(msg)
        return jsonify({'msg': 'Se ha enviado un correo para restablecer la contraseña'}), 200
        
    except Exception as e:
        return jsonify({'msg': 'Error en el servidor', 'error': str(e)}), 500

@auth_bp.route('/reset-password', methods=['POST'])
@jwt_required()
def reset_password():
    """Restablece la contraseña usando el token de recuperación."""
    data = request.get_json()
    new_password = data.get('new_password')
    
    if not new_password or len(new_password) < 6:
        return jsonify({'msg': 'La nueva contraseña debe tener al menos 6 caracteres'}), 400
    
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({'msg': 'Usuario no encontrado'}), 404
            
        # Verificar claims del token
        claims = get_jwt()
        if claims.get('fogot_password') and claims.get('email') == user.email:
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user.password = hashed_password
            db.session.commit()
            return jsonify({'msg': 'Contraseña restablecida correctamente'}), 200
        else: 
            return jsonify({'msg': 'Error en la validación de datos, contacte con administración'}), 401
            
    except Exception as e:
        return jsonify({'msg': 'Error en el servidor', 'error': str(e)}), 500