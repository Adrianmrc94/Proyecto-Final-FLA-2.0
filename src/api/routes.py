"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token #genera el token del incio de sesion
from api.models import db, User #importa los modelos de usuario y la base de datos
from flask_cors import CORS
import bcrypt #compara contraseñas que estan hasheadas

api = Blueprint('api', __name__) #se crea el blueprint para registrar las rutas

@api.route('/login', methods=['POST'])
def login():  
    data = request.get_json()  #cogemos los datos que nos llegan del frontend en formato json
    email = data.get('email')  #cogemos el correo y contraseña de la peticion 
    password = data.get('password')

    if not email or not password: #revisa que los dos campos tienen algo escrito(si no lo tienen muestra el mensaje)
        return jsonify({'msg': 'Email y contraseña requeridos'}), 400
    
    user = User.query.filter_by(email=email).first()  #busca en la base de datos un usuario con ese correo

    if not user:  #mensaje que muestra si el correo no esta registrado
        return jsonify({'msg': 'Usuario no encontrado'}), 404

        #compara la contraseña escrita en el campo "password" con la contraseña de la base de datos. Si no coincide muestra el mensaje
    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):         return jsonify({'msg': 'Contraseña incorrecta'}), 401

    token = create_access_token(identity=str(user.id))  #si coinciden las contraseñas del campo "password" con la de la base de datos crea el token con el id del usuario

    return jsonify({ #nos devuelve los datos del usuario del serialize del usuario creado en el archivo "models.py" sin la contraseña por seguridad
        'msg': 'Login exitoso',
        'token': token,
        'user': user.serialize()
    }), 200
