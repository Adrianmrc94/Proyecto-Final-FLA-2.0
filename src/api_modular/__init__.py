"""
API Modular - Arquitectura escalable para la API REST.
Organiza endpoints por funcionalidad específica en módulos separados.

Módulos disponibles:
- auth: Autenticación y recuperación de contraseñas
- products: Gestión de productos y búsqueda
- users: Gestión de perfiles de usuario
- favorites: Sistema de favoritos
"""

# Importar blueprints para facilitar el acceso desde otros módulos
from .auth import auth_bp
from .products import products_bp
from .users import users_bp
from .favorites import favorites_bp

# Lista de todos los blueprints disponibles
__all__ = ['auth_bp', 'products_bp', 'users_bp', 'favorites_bp']

# Información del módulo
__version__ = '1.0.0'
__author__ = 'Proyecto Final FLA'