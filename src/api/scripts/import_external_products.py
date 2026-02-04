import os
import sys
import json
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from api.models import db, Product, Store


def load_products_from_json(filename):
    """Carga productos desde un archivo JSON"""
    try:
        json_path = os.path.join(os.path.dirname(__file__), '../../../', filename)
        if not os.path.exists(json_path):
            print(f"⚠️  Archivo no encontrado: {json_path}")
            return []
        
        with open(json_path, 'r', encoding='utf-8') as f:
            products = json.load(f)
            print(f"✅ Cargados {len(products)} productos desde {filename}")
            return products
    except Exception as e:
        print(f"❌ Error al cargar {filename}: {e}")
        return []


def import_products(app):
    """Importa productos desde archivos JSON de Mercadona"""
    with app.app_context():
        print("🛒 Iniciando importación de productos de Mercadona...")
        
        # Cargar productos de Mercadona desde JSON
        mercadona_products = load_products_from_json('mercadona_products_28020.json')
        
        if not mercadona_products:
            print("⚠️  No se encontraron productos de Mercadona, intentando archivo alternativo...")
            mercadona_products = load_products_from_json('mercadona_products.json')
        
        if not mercadona_products:
            print("❌ No se pudieron cargar productos. Verifica que existan los archivos JSON.")
            return
        
        # Crear/obtener tienda de Mercadona
        store_name = "Mercadona - 28020"
        mercadona_store = Store.query.filter_by(name=store_name).first()
        
        if not mercadona_store:
            print(f"🏪 Creando tienda: {store_name}")
            mercadona_store = Store(
                name=store_name,
                postal_code="28020",
                url="https://tienda.mercadona.es",
                logo="https://www.mercadona.es/images/logo.svg"
            )
            db.session.add(mercadona_store)
            db.session.flush()
        
        imported_count = 0
        skipped_count = 0
        
        # Importar productos de Mercadona
        for p in mercadona_products:
            try:
                external_id = f"mercadona-{p.get('external_id')}"
                
                # Verificar si ya existe
                if Product.query.filter_by(external_id=external_id).first():
                    skipped_count += 1
                    continue
                
                name = p.get("name", "")
                if len(name) > 120:
                    name = name[:120]
                
                # Normalizar URL de imagen (eliminar duplicaciones)
                image_raw = p.get("image", "")
                if image_raw and image_raw.startswith("http"):
                    import re
                    # Buscar SIEMPRE la primera URL válida de Mercadona (con hash alfanumérico case-insensitive)
                    match = re.search(r'https://prod-mercadona\.imgix\.net/images/([a-fA-F0-9]+)\.jpg(?:\?fit=crop&h=300&w=300)?', image_raw)
                    if match:
                        # Reconstruir URL limpia con parámetros estándar
                        image_url = f"https://prod-mercadona.imgix.net/images/{match.group(1)}.jpg?fit=crop&h=300&w=300"
                    else:
                        # Si no matchea el patrón esperado, usar tal cual
                        image_url = image_raw
                else:
                    # Es solo un hash/ID, construir URL completa
                    image_url = f"https://prod-mercadona.imgix.net/images/{image_raw}.jpg?fit=crop&h=300&w=300" if image_raw else ""
                
                product = Product(
                    external_id=external_id,
                    name=name,
                    price=float(p.get("price", 0)),
                    image=image_url,
                    category=p.get("category", "General"),
                    rate=4.5,  # Rating por defecto para Mercadona
                    stock=100,
                    created_at=datetime.now(),
                    source="mercadona",
                    store_id=mercadona_store.id
                )
                db.session.add(product)
                imported_count += 1
                
                # Commit cada 100 productos
                if imported_count % 100 == 0:
                    db.session.commit()
                    print(f"   📦 {imported_count} productos importados...")
                
            except Exception as e:
                print(f"⚠️  Error importando producto {p.get('name')}: {e}")
                continue
        
        db.session.commit()
        print(f"\n✅ Importación completada:")
        print(f"   - Productos nuevos: {imported_count}")
        print(f"   - Productos omitidos: {skipped_count}")
        print(f"   - Total en BD: {Product.query.count()}")


if __name__ == "__main__":
    from app import app
    import_products(app)