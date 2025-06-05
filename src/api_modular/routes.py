"""
Registrador de blueprints modulares.
Centraliza la importación y registro de todos los módulos de la API.
"""
from flask import Blueprint, jsonify

# Importar todos los blueprints modulares
from api_modular.auth import auth_bp
from api_modular.products import products_bp
from api_modular.users import users_bp
from api_modular.favorites import favorites_bp

def register_modular_blueprints(app):
    """
    Registra todos los blueprints modulares en la aplicación Flask.
    
    Esta función centraliza el registro de rutas y permite una
    arquitectura limpia y escalable para la API.
    
    Args:
        app: Instancia de la aplicación Flask
    """
    print("🔗 Registrando blueprints modulares...")
    
    try:
        # Registrar cada módulo con su prefijo correspondiente
        app.register_blueprint(auth_bp, url_prefix='/api')
        app.register_blueprint(products_bp, url_prefix='/api') 
        app.register_blueprint(users_bp, url_prefix='/api')
        app.register_blueprint(favorites_bp, url_prefix='/api')
        
        print("✅ Blueprints modulares registrados exitosamente")
        print("📋 Módulos disponibles:")
        print("   🔐 Auth: /api/login, /api/register, /api/forgot-password, /api/reset-password")
        print("   📦 Products: /api/products, /api/categories, /api/search, /api/random-product")
        print("   👤 Users: /api/user/profile, /api/user/change-password, /api/user/delete-account")
        print("   ❤️  Favorites: /api/favorites")
        
        return True
        
    except Exception as e:
        print(f"❌ Error registrando blueprints modulares: {e}")
        return False

# Blueprint adicional para endpoints de información del sistema modular
info_bp = Blueprint('modular_info', __name__)

@info_bp.route('/api/modular/info', methods=['GET'])
def modular_info():
    """Información sobre la arquitectura modular."""
    return jsonify({
        'status': 'active',
        'architecture': 'modular',
        'version': '1.0.0',
        'modules': {
            'auth': 'Autenticación y recuperación de contraseñas',
            'products': 'Gestión de productos y búsqueda',
            'users': 'Gestión de perfiles de usuario',
            'favorites': 'Sistema de favoritos'
        },
        'endpoints_count': {
            'auth': 4,
            'products': 7,
            'users': 4,
            'favorites': 3
        }
    }), 200

def register_info_blueprint(app):
    """Registra el blueprint de información del sistema modular."""
    app.register_blueprint(info_bp)