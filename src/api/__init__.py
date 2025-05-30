# api/__init__.py

from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from api.models import db
from api.routes import api

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret-key'

    db.init_app(app)
    JWTManager(app)
    CORS(app)

    app.register_blueprint(api)

    return app
