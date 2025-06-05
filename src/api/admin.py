"""
Configuración del panel de administración Flask-Admin.
Proporciona una interfaz web para gestionar modelos de la base de datos.
"""
import os
from flask_admin import Admin
from .models import db, User, Product
from flask_admin.contrib.sqla import ModelView

class SecureModelView(ModelView):
    page_size = 20
    can_view_details = True
    can_export = True
    
    # Configuraciones de edición
    can_edit = True
    can_create = True
    can_delete = False
    
    def is_accessible(self):
        return True

class UserAdminView(SecureModelView):
    column_list = ['id', 'name', 'last_name', 'email', 'postal_code', 'is_active']
    column_searchable_list = ['name', 'last_name', 'email']
    column_filters = ['is_active', 'postal_code']
    form_excluded_columns = ['password', 'favorites']
    
    column_labels = {
        'name': 'Nombre',
        'last_name': 'Apellido',
        'email': 'Correo Electrónico',
        'postal_code': 'Código Postal',
        'is_active': 'Activo'
    }

class ProductAdminView(SecureModelView):

    column_list = ['id', 'name', 'price', 'category', 'rate', 'stock', 'source']
    column_searchable_list = ['name', 'category', 'description']
    column_filters = ['category', 'source', 'stock']
    
    # Configurar display
    column_formatters = {
        'price': lambda v, c, m, p: f"${m.price:.2f}" if m.price else "N/A",
        'rate': lambda v, c, m, p: f"⭐ {m.rate}" if m.rate else "Sin rating"
    }
    
    column_labels = {
        'name': 'Producto',
        'price': 'Precio',
        'category': 'Categoría',
        'rate': 'Rating',
        'stock': 'Stock',
        'source': 'Fuente'
    }

def setup_admin(app):

    # Configuración básica del admin
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    
    # Inicializar Flask-Admin
    admin = Admin(
        app, 
        name='🚀 Proyecto Final FLA - Admin', 
        template_mode='bootstrap3',
        index_view=None,
        base_template='admin/custom_base.html' if os.path.exists('templates/admin/custom_base.html') else None
    )

    # Agregar vistas personalizadas para cada modelo
    admin.add_view(UserAdminView(User, db.session, name='Usuarios', category='👥 Gestión'))
    admin.add_view(ProductAdminView(Product, db.session, name='Productos', category='📦 Catálogo'))

    
    print("✅ Panel de administración configurado")
    print("🔗 Acceso en: /admin/")
    print("📊 Modelos disponibles: Users, Products")