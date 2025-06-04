import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from api.models import db, Product, Store, Favorite
from app import app

def clear_products_and_stores():
    with app.app_context():
        try:
            # Primero eliminar todos los favoritos que referencian productos
            deleted_favorites = Favorite.query.delete()
            print(f"Favoritos eliminados: {deleted_favorites}")
            
            # Luego eliminar todos los productos
            deleted_products = Product.query.delete()
            print(f"Productos eliminados: {deleted_products}")
            
            # Finalmente eliminar todas las tiendas
            deleted_stores = Store.query.delete()
            print(f"Tiendas eliminadas: {deleted_stores}")
            
            # Confirmar todos los cambios
            db.session.commit()
            print("✅ Limpieza completada exitosamente")
            
        except Exception as e:
            # En caso de error, hacer rollback
            db.session.rollback()
            print(f"❌ Error durante la limpieza: {e}")
            raise

if __name__ == "__main__":
    clear_products_and_stores()