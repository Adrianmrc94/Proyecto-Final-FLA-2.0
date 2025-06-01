import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from api.models import db, Product, Store
from app import app

def clear_products_and_stores():
    with app.app_context():
        # Borra todos los productos primero (por la relación con Store)
        deleted_products = Product.query.delete()
        # Borra todas las tiendas
        deleted_stores = Store.query.delete()
        db.session.commit()
        print(f"Productos eliminados: {deleted_products}")
        print(f"Tiendas eliminadas: {deleted_stores}")

if __name__ == "__main__":
    clear_products_and_stores()