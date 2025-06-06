
from .auth import auth_bp
from .products import products_bp
from .users import users_bp
from .favorites import favorites_bp

# Lista de todos los blueprints disponibles
__all__ = ['auth_bp', 'products_bp', 'users_bp', 'favorites_bp']
