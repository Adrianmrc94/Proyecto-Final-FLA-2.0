"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token 
from api.models import db, User 
from flask_cors import CORS
import bcrypt 

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

    return jsonify({
        'msg': 'Login exitoso',
        'token': token,
        'user': user.serialize()
    }), 200

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    name = data.get('name')
    lastname = data.get('lastname')
    email = data.get('email')
    password = data.get('password')
    postal_code = data.get('postal_code')

    if not name or not lastname or not email or not password:
        return jsonify({'msg': 'Todos los campos obligatorios deben estar completos'}), 400

    if len(password) < 6:
        return jsonify({'msg': 'La contraseña debe tener al menos 6 caracteres'}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'msg': 'El correo ya está registrado'}), 409

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    new_user = User(
        name=name,
        lastname=lastname,
        email=email,
        password=hashed_password,
        postal_code=postal_code,
        is_active=True
    )

    db.session.add(new_user)
    db.session.commit()

    token = create_access_token(identity=str(new_user.id))

    return jsonify({
        'msg': 'Registro exitoso',
        'token': token,
        'user': new_user.serialize()
    }), 201
