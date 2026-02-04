"""
Scraper de Mercadona - VERSIÓN SÍNCRONA (sin threads)
"""
import os
import sys
import json
import requests
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from api.models import db, Product, Store


def scrape_mercadona_sync(postal_code):
    """
    Scraping SÍNCRONO de Mercadona (sin threads, sin job manager)
    
    Args:
        postal_code: Código postal para el scraping
        
    Returns:
        dict con {store_id, imported, skipped}
    """
    print(f"🛒 Scraping SÍNCRONO Mercadona CP: {postal_code}")
    
    # SCRAPING REAL de la API de Mercadona
    products_data = []
    
    try:
        print(f"📡 Obteniendo categorías de Mercadona para CP {postal_code}...")
        url = f"https://tienda.mercadona.es/api/categories/{postal_code}"
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        categories = data.get('results', [])
        
        print(f"✅ {len(categories)} categorías obtenidas de API real")
        
        for category in categories:
            cat_products = category.get('products', [])
            for product in cat_products:
                products_data.append({
                    'external_id': product.get('id'),
                    'name': product.get('display_name', 'Sin nombre'),
                    'price': product.get('price_instructions', {}).get('unit_price', 0),
                    'image': product.get('thumbnail', ''),
                    'category': category.get('name', 'General')
                })
        
        print(f"✅ {len(products_data)} productos obtenidos de API real")
        
    except Exception as e:
        print(f"⚠️  Error en scraping real: {e}")
        print(f"⚠️  Usando fallback con archivo JSON local...")
        
        # Fallback a JSON - buscar en raíz del proyecto
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../'))
        json_path = os.path.join(project_root, f'mercadona_products_{postal_code}.json')
        
        if not os.path.exists(json_path):
            print(f"⚠️  Archivo mercadona_products_{postal_code}.json no encontrado, usando genérico...")
            json_path = os.path.join(project_root, 'mercadona_products_28020.json')
        
        if not os.path.exists(json_path):
            raise Exception(f"No se encontró archivo JSON de fallback en {json_path}")
        
        with open(json_path, 'r', encoding='utf-8') as f:
            products_data = json.load(f)
        
        print(f"✅ Cargados {len(products_data)} productos desde {os.path.basename(json_path)}")
    
    if not products_data:
        raise Exception("No se encontraron productos para importar")
    
    # Crear/obtener tienda
    store_name = f"Mercadona - {postal_code}"
    mercadona_store = Store.query.filter_by(name=store_name, postal_code=postal_code).first()
    
    if not mercadona_store:
        print(f"🏪 Creando tienda: {store_name}")
        mercadona_store = Store(
            name=store_name,
            postal_code=postal_code,
            url="https://tienda.mercadona.es",
            logo="https://www.mercadona.es/images/logo.svg",
            is_active=True
        )
        db.session.add(mercadona_store)
        db.session.commit()
        print(f"✅ Tienda creada con ID: {mercadona_store.id}")
    else:
        print(f"✅ Tienda existente con ID: {mercadona_store.id}")
    
    # Importar productos
    imported_count = 0
    skipped_count = 0
    
    for p in products_data:
        external_id = f"mercadona-{postal_code}-{p.get('external_id')}"
        
        existing = Product.query.filter_by(external_id=external_id).first()
        if existing:
            skipped_count += 1
            continue
        
        name = p.get("name", "")
        if len(name) > 120:
            name = name[:120]
        
        # Normalizar URL de imagen
        image_raw = p.get("image", "")
        if image_raw:
            import re
            # Si ya es una URL completa (contiene https://), extraer solo la primera URL válida
            if image_raw.startswith("http"):
                # Buscar SIEMPRE la primera URL válida de Mercadona (con hash alfanumérico case-insensitive)
                # Buscar múltiples ocurrencias para detectar duplicación
                matches = list(re.finditer(r'https://prod-mercadona\.imgix\.net/images/([a-fA-F0-9]+)\.jpg(?:\?fit=crop&h=300&w=300)?', image_raw))
                if matches:
                    # Usar solo la primera coincidencia para evitar duplicación
                    image_url = f"https://prod-mercadona.imgix.net/images/{matches[0].group(1)}.jpg?fit=crop&h=300&w=300"
                else:
                    # Si no matchea el patrón esperado, usar tal cual
                    image_url = image_raw
            else:
                # Es solo un hash/ID, construir URL completa
                image_url = f"https://prod-mercadona.imgix.net/images/{image_raw}.jpg?fit=crop&h=300&w=300"
        else:
            image_url = ""
        
        new_product = Product(
            external_id=external_id,
            name=name,
            price=float(p.get("price", 0)),
            image=image_url,
            category=p.get("category", "General"),
            rate=p.get("rate", 0.0),
            stock=p.get("stock", 100),
            store_id=mercadona_store.id
        )
        db.session.add(new_product)
        imported_count += 1
        
        # Commit cada 100 productos
        if imported_count % 100 == 0:
            db.session.commit()
            print(f"   💾 {imported_count} productos guardados...")
    
    # Commit final
    db.session.commit()
    
    print(f"✅ Scraping completado:")
    print(f"   - Tienda ID: {mercadona_store.id}")
    print(f"   - Productos nuevos: {imported_count}")
    print(f"   - Productos omitidos: {skipped_count}")
    
    return {
        'store_id': mercadona_store.id,
        'imported': imported_count,
        'skipped': skipped_count
    }


def scrape_mercadona_products(postal_code, job_id=None, app=None):
    """
    Scrape productos de Mercadona para un código postal específico
    
    Args:
        postal_code: Código postal para el scraping
        job_id: ID del trabajo para actualizar progreso (opcional)
        app: Instancia de Flask app para contexto de DB
        
    Returns:
        dict con {success, total_products, store_id, error}
    """
    from api.scraping_manager import get_job
    
    def update_progress(current, total, message=None):
        """Helper para actualizar progreso del job"""
        if job_id:
            job = get_job(job_id)
            if job:
                job.update_progress(current, total, message)
    
    try:
        if not app:
            from app import app as flask_app
            app = flask_app
            
        with app.app_context():
            # Marcar como running
            if job_id:
                job = get_job(job_id)
                if job:
                    job.set_running()
            
            print(f"🛒 Iniciando scraping de Mercadona para CP: {postal_code}")
            update_progress(0, 100, f"Iniciando scraping para CP {postal_code}...")
            
            # SCRAPING REAL de la API de Mercadona
            products_data = []
            
            try:
                update_progress(5, 100, "Conectando con API de Mercadona...")
                
                # Endpoint de categorías de Mercadona
                categories_url = f"https://tienda.mercadona.es/api/categories/{postal_code}"
                
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                }
                
                print(f"📡 Obteniendo categorías de Mercadona para CP {postal_code}...")
                response = requests.get(categories_url, headers=headers, timeout=10)
                
                if response.status_code != 200:
                    raise Exception(f"Error al obtener categorías: HTTP {response.status_code}")
                
                categories = response.json().get('results', [])
                print(f"✅ Encontradas {len(categories)} categorías")
                
                # Obtener productos de cada categoría
                for cat_idx, category in enumerate(categories):
                    cat_id = category.get('id')
                    cat_name = category.get('name', 'Sin nombre')
                    
                    # Actualizar progreso
                    progress = 10 + int((cat_idx / max(len(categories), 1)) * 20)
                    update_progress(progress, 100, f"Scraping categoría: {cat_name}...")
                    print(f"   📂 Procesando categoría: {cat_name} (ID: {cat_id})")
                    
                    # Obtener productos de la categoría
                    products_url = f"https://tienda.mercadona.es/api/categories/{cat_id}"
                    prod_response = requests.get(products_url, headers=headers, timeout=10)
                    
                    if prod_response.status_code == 200:
                        cat_data = prod_response.json()
                        
                        # Extraer productos de todas las subcategorías
                        for subcat in cat_data.get('categories', []):
                            for product in subcat.get('products', []):
                                products_data.append({
                                    'external_id': product.get('id'),
                                    'name': product.get('display_name', product.get('name', 'Sin nombre')),
                                    'price': product.get('price_instructions', {}).get('unit_price', 0),
                                    'image': product.get('thumbnail', ''),
                                    'category': subcat.get('name', cat_name)
                                })
                
                print(f"✅ Scraping API completado: {len(products_data)} productos obtenidos")
                
            except Exception as e:
                print(f"⚠️  Error en scraping real: {e}")
                print(f"⚠️  Usando fallback con archivo JSON local...")
                
                # Fallback: usar archivo JSON local si existe
                json_filename = f'mercadona_products_{postal_code}.json'
                json_path = os.path.join(os.path.dirname(__file__), '../../../', json_filename)
                
                if not os.path.exists(json_path):
                    print(f"⚠️  Archivo {json_filename} no encontrado, usando genérico...")
                    json_path = os.path.join(os.path.dirname(__file__), '../../../', 'mercadona_products_28020.json')
                
                if not os.path.exists(json_path):
                    raise Exception("No se pudo scrapear la API ni encontrar archivo de productos")
                
                update_progress(10, 100, "Cargando datos desde archivo local...")
                
                with open(json_path, 'r', encoding='utf-8') as f:
                    products_data = json.load(f)
                
                print(f"✅ Cargados {len(products_data)} productos desde archivo local")
            
            total_products = len(products_data)
            if total_products == 0:
                raise Exception("No se encontraron productos para importar")
            
            update_progress(20, 100, f"Procesando {total_products} productos...")
            
            # Crear/obtener tienda de Mercadona para este CP
            store_name = f"Mercadona - {postal_code}"
            
            # Primero, verificar con SQL raw si existe
            raw_check = db.session.execute(
                db.text("SELECT id FROM store WHERE name = :name AND postal_code = :cp"),
                {"name": store_name, "cp": postal_code}
            ).fetchone()
            
            if raw_check:
                # Existe en la BD
                store_id = raw_check[0]
                print(f"✅ Tienda existente encontrada con ID: {store_id}")
                mercadona_store = Store.query.get(store_id)
            else:
                # No existe, crear nueva
                print(f"🏪 Creando tienda: {store_name}")
                mercadona_store = Store(
                    name=store_name,
                    postal_code=postal_code,
                    url="https://tienda.mercadona.es",
                    logo="https://www.mercadona.es/images/logo.svg",
                    is_active=True
                )
                db.session.add(mercadona_store)
                db.session.flush()
                store_id_temp = mercadona_store.id
                
                # Commit inmediato
                try:
                    db.session.commit()
                    print(f"🔄 Commit ejecutado para tienda ID: {store_id_temp}")
                except Exception as e:
                    print(f"❌ Error en commit: {e}")
                    db.session.rollback()
                    raise
                
                # Verificar con SQL raw que se persistió
                verify = db.session.execute(
                    db.text("SELECT id FROM store WHERE name = :name AND postal_code = :cp"),
                    {"name": store_name, "cp": postal_code}
                ).fetchone()
                
                if verify:
                    store_id = verify[0]
                    print(f"✅ Tienda persistida correctamente con ID: {store_id}")
                    mercadona_store = Store.query.get(store_id)
                else:
                    raise Exception(f"❌ FALLO CRÍTICO: Tienda no se persistió después de commit (esperaba ID: {store_id_temp})")
            
            update_progress(30, 100, f"Tienda {store_name} lista")
            
            # Importar productos
            imported_count = 0
            skipped_count = 0
            
            for idx, p in enumerate(products_data):
                try:
                    external_id = f"mercadona-{postal_code}-{p.get('external_id')}"
                    
                    # Verificar si ya existe
                    existing = Product.query.filter_by(external_id=external_id).first()
                    if existing:
                        skipped_count += 1
                        continue
                    
                    name = p.get("name", "")
                    if len(name) > 120:
                        name = name[:120]
                    
                    product = Product(
                        external_id=external_id,
                        name=name,
                        price=float(p.get("price", 0)),
                        image=p.get("image", ""),
                        category=p.get("category", "General"),
                        rate=4.5,
                        stock=100,
                        created_at=datetime.now(),
                        source="mercadona",
                        store_id=mercadona_store.id
                    )
                    db.session.add(product)
                    imported_count += 1
                    
                    # Commit cada 100 productos para mejorar rendimiento
                    if imported_count % 100 == 0:
                        try:
                            db.session.commit()
                        except Exception as commit_error:
                            print(f"⚠️  Error en commit parcial: {commit_error}")
                            db.session.rollback()
                        progress = 30 + int((idx / total_products) * 60)
                        update_progress(progress, 100, f"{imported_count}/{total_products} productos importados...")
                        print(f"   📦 {imported_count} productos importados...")
                
                except Exception as e:
                    print(f"⚠️  Error importando producto {p.get('name')}: {e}")
                    continue
            
            # Commit final
            try:
                db.session.commit()
                print(f"✅ Commit final exitoso")
            except Exception as commit_error:
                print(f"❌ Error en commit final: {commit_error}")
                db.session.rollback()
                raise
            
            update_progress(95, 100, "Finalizando...")
            
            print(f"\n✅ Scraping completado:")
            print(f"   - CP: {postal_code}")
            print(f"   - Tienda ID: {mercadona_store.id}")
            print(f"   - Productos nuevos: {imported_count}")
            print(f"   - Productos omitidos: {skipped_count}")
            
            # Marcar como completado
            if job_id:
                job = get_job(job_id)
                if job:
                    job.set_completed(imported_count)
            
            return {
                'success': True,
                'total_products': imported_count,
                'store_id': mercadona_store.id,
                'postal_code': postal_code
            }
            
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Error en scraping: {error_msg}")
        
        # Marcar como error
        if job_id:
            job = get_job(job_id)
            if job:
                job.set_error(error_msg)
        
        return {
            'success': False,
            'error': error_msg
        }


if __name__ == "__main__":
    from app import app
    result = scrape_mercadona_products("28020", app=app)
    print(f"\nResultado: {result}")
