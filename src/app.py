import os
import threading
from datetime import timedelta

from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Importaciones locales
from api.utils import APIException, generate_sitemap
from api.models import db, Product
from api.admin import setup_admin
from api.commands import setup_commands
from extensions import mail
from api.scripts.import_external_products import import_products

# ===== IMPORTACIÓN MODULAR =====

from api_modular.routes import register_modular_blueprints

# Importar sistema legacy (fallback)
#from api.routes import api as legacy_api

# Configuración del entorno
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"


static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')


app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False

# ===== CONFIGURACIÓN DE BASE DE DATOS =====
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    # Usar ruta relativa para SQLite en desarrollo
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(basedir, '..', 'instance', 'database.db')}"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# ===== CONFIGURACIÓN DE EMAIL =====
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'adrianmrc943@gmail.com'
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_DEFAULT_SENDER'] = 'adrianmrc943@gmail.com'

# ===== CONFIGURACIÓN DE JWT =====
app.config['JWT_SECRET_KEY'] = os.getenv(
    'JWT_SECRET_KEY', 'super-secret-key') 
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)

# ===== INICIALIZACIÓN DE EXTENSIONES =====
jwt = JWTManager(app)
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)
mail.init_app(app)

# ===== CONFIGURACIÓN DE ADMIN Y COMANDOS =====
setup_admin(app)
setup_commands(app)

# ===== REGISTRO DE RUTAS API =====
# Determinar qué arquitectura usar
USE_MODULAR_API = True
print("🚀 Usando arquitectura modular de API...")
try:
    register_modular_blueprints(app)
    print("✅ API Modular cargada exitosamente")
except Exception as e:
    print(f"❌ Error crítico en API modular: {e}")
    raise SystemExit("No se pudo cargar la API modular")

""" USE_MODULAR_API = os.getenv('USE_MODULAR_API', 'true').lower() == 'true'
if USE_MODULAR_API:
    print("🚀 Usando arquitectura modular de API...")
    try:
        register_modular_blueprints(app)
        print("✅ API Modular cargada exitosamente")
    except Exception as e:
        print(f"❌ Error al cargar API modular: {e}")
        print("🔄 Fallback a API legacy...")
        app.register_blueprint(legacy_api, url_prefix='/api')
else:
    print("🔄 Usando API legacy...")
    app.register_blueprint(legacy_api, url_prefix='/api') """

# ===== MANEJADORES DE ERRORES =====
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    """Manejador global de errores de API personalizados."""
    return jsonify(error.to_dict()), error.status_code

# ===== RUTAS PRINCIPALES =====
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

# ===== ENDPOINT DE SALUD DE LA API =====
@app.route('/api/health', methods=['GET'])
def api_health():
    api_type = "Modular" if USE_MODULAR_API else "Legacy"
    return jsonify({
        'status': 'OK',
        'message': f'API {api_type} funcionando correctamente',
        'architecture': api_type.lower(),
        'environment': ENV
    }), 200

# ===== IMPORTACIÓN AUTOMÁTICA DE PRODUCTOS =====
products_imported = threading.Event()

@app.before_request
def auto_import_products():
    if not products_imported.is_set():
        try:
            if Product.query.count() == 0:
                print("Base de datos vacía. Importando productos externos...")
                import_products(app)
        except Exception as e:
            # Ignorar errores si las tablas no existen aún (durante migraciones)
            pass
        finally:
            products_imported.set()

# ===== PUNTO DE ENTRADA =====
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)