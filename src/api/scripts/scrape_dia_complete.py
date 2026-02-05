"""
Scraper completo para DIA usando las APIs PLP descubiertas
Basado en: https://www.dia.es/api/v1/plp-insight/initial_analytics/l1/{category_id}
"""
import requests
import json
import time
from collections import defaultdict

# Importar solo si se ejecuta desde Flask
try:
    import sys
    sys.path.insert(0, '.')
    from api.models import db, Product, Store
    IN_FLASK = True
except:
    IN_FLASK = False

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "es-ES,es;q=0.9",
    "Referer": "https://www.dia.es/"
}

# Categorías principales de DIA (Level 1)
DIA_MAIN_CATEGORIES = [
    ("L101", "Charcutería y quesos"),
    ("L102", "Carnes"),
    ("L103", "Pescados y mariscos"),
    ("L104", "Verduras"),
    ("L105", "Frutas"),
    ("L106", "Arroz pastas y legumbres"),
    ("L107", "Aceites salsas y especias"),
    ("L108", "Huevos leche y mantequilla"),
    ("L109", "Café cacao e infusiones"),
    ("L110", "Azúcar chocolates y caramelos"),
    ("L111", "Galletas bollos y cereales"),
    ("L112", "Panadería"),
    ("L113", "Yogures y postres"),
    ("L114", "Conservas caldos y cremas"),
    ("L115", "Aperitivos y frutos secos"),
    ("L116", "Platos preparados y pizzas"),
    ("L117", "Agua refrescos y zumos"),
    ("L118", "Cervezas vinos y bebidas con alcohol"),
    ("L119", "Congelados"),
    ("L120", "Bebé"),
    ("L121", "Perfumería higiene salud"),
    ("L122", "Limpieza y hogar"),
    ("L123", "Mascotas"),
]


def fetch_dia_category_products(category_id, category_name="", level=1):
    """
    Obtiene productos de una categoría de DIA
    
    Args:
        category_id: ID de la categoría (ej: L115, L116)
        category_name: Nombre de la categoría
        level: Nivel de profundidad (para indentación)
    
    Returns:
        list: Lista de productos encontrados
    """
    indent = "  " * level
    products = []
    
    try:
        # Construir URL de la API
        url = f"https://www.dia.es/api/v1/plp-insight/initial_analytics/l1/{category_id}"
        
        print(f"{indent}Consultando {category_name} ({category_id})...")
        
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        
        data = response.json()
        
        # Los productos están en page_product_analytics
        if 'page_product_analytics' in data:
            ppa = data['page_product_analytics']
            
            # Iterar sobre cada clave (subcategorías con productos)
            for cat_key, cat_data in ppa.items():
                if isinstance(cat_data, dict) and 'products' in cat_data:
                    # Productos dentro de esta subcategoría
                    cat_products = cat_data['products']
                    if cat_products:
                        cat_list_name = cat_data.get('item_list_name', cat_key)
                        print(f"{indent}  {cat_list_name}: {len(cat_products)} productos")
                        
                        for product_id, product_data in cat_products.items():
                            try:
                                product_info = {
                                    "id": product_data.get("item_id", product_id),
                                    "name": product_data.get("item_name", ""),
                                    "price": product_data.get("price", 0),
                                    "brand": product_data.get("item_brand", ""),
                                    "category": product_data.get("item_category", category_name),
                                    "category2": product_data.get("item_category2", ""),
                                    "stock": product_data.get("stock_availability", True),
                                    "image": ""
                                }
                                
                                # Generar URL de imagen
                                if product_info["id"]:
                                    product_info["image"] = f"https://www.dia.es/_next/image?url=https%3A%2F%2Ffront-cms.dia.es%2Fassets%2F{product_info['id']}.jpg&w=640&q=75"
                                
                                if product_info["name"] and product_info["price"] > 0:
                                    products.append(product_info)
                                    
                            except Exception as e:
                                continue
        
        return products
        
    except requests.exceptions.HTTPError as e:
        print(f"{indent}Error HTTP {e.response.status_code}")
        return []
    except Exception as e:
        print(f"{indent}Error: {e}")
        return []


def fetch_all_dia_products():
    """Obtiene todos los productos de DIA navegando por categorías"""
    print("=" * 80)
    print("SCRAPING DE PRODUCTOS DE DIA - USANDO API PLP")
    print("=" * 80)
    
    all_products = {}
    
    # Primero obtener productos del home (como antes)
    try:
        print("\n1. Obteniendo productos del home...")
        home_url = "https://www.dia.es/api/v2/home-insight/initial_analytics"
        response = requests.get(home_url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        
        data = response.json()
        
        if "carousel_analytics" in data:
            for carousel_name, products_dict in data["carousel_analytics"].items():
                for product_id, product_data in products_dict.items():
                    product_info = {
                        "id": product_data.get("item_id", product_id),
                        "name": product_data.get("item_name", ""),
                        "price": product_data.get("price", 0),
                        "brand": product_data.get("item_brand", ""),
                        "category": product_data.get("item_category", "General"),
                        "category2": product_data.get("item_category2", ""),
                        "stock": product_data.get("stock_availability", True),
                        "image": f"https://www.dia.es/_next/image?url=https%3A%2F%2Ffront-cms.dia.es%2Fassets%2F{product_data.get('item_id', '')}.jpg&w=640&q=75"
                    }
                    
                    if product_info["name"] and product_info["price"] > 0:
                        all_products[product_info["id"]] = product_info
        
        print(f"   Productos del home: {len(all_products)}")
    except Exception as e:
        print(f"   Error en home: {e}")
    
    # Ahora navegar por categorías principales
    print(f"\n2. Navegando por {len(DIA_MAIN_CATEGORIES)} categorias principales...\n")
    
    for i, (cat_id, cat_name) in enumerate(DIA_MAIN_CATEGORIES, 1):
        print(f"\n[{i}/{len(DIA_MAIN_CATEGORIES)}] {cat_name} - ID: {cat_id}")
        try:
            category_products = fetch_dia_category_products(cat_id, cat_name)
            
            # Agregar productos únicos
            for product in category_products:
                if product["id"] not in all_products:
                    all_products[product["id"]] = product
            
            print(f"   Subtotal categoria: {len(category_products)} productos")
            print(f"   Total acumulado: {len(all_products)} productos unicos")
            
            # Delay entre categorías para evitar rate limiting
            if i < len(DIA_MAIN_CATEGORIES):
                time.sleep(2)  # 2 segundos entre categorías
            
        except Exception as e:
            print(f"   Error en categoria {cat_name}: {e}")
            continue
    
    final_products = list(all_products.values())
    print(f"\n" + "=" * 80)
    print(f"TOTAL PRODUCTOS UNICOS: {len(final_products)}")
    print("=" * 80)
    
    return final_products


def import_to_database(products, postal_code="28020"):
    """Importa los productos de DIA a la base de datos"""
    if not IN_FLASK:
        print("\nNo se puede importar a BD (no esta en contexto Flask)")
        return
    
    try:
        # Buscar o crear tienda DIA
        store_name = f"DIA - {postal_code}"
        dia_store = Store.query.filter_by(name=store_name, postal_code=postal_code).first()
        
        if not dia_store:
            print(f"\nCreando tienda {store_name}...")
            dia_store = Store(
                name=store_name,
                postal_code=postal_code,
                url="https://www.dia.es",
                logo="https://www.dia.es/favicon.ico"
            )
            db.session.add(dia_store)
            db.session.commit()
            print(f"Tienda creada con ID: {dia_store.id}")
        else:
            print(f"\nTienda encontrada con ID: {dia_store.id}")

        imported_count = 0
        updated_count = 0
        skipped_count = 0

        print("\nImportando productos a la base de datos...")
        for product_data in products:
            try:
                external_id = str(product_data.get("id", ""))
                
                if not external_id or not product_data.get("name"):
                    skipped_count += 1
                    continue
                
                # Buscar si existe
                existing_product = Product.query.filter_by(
                    external_id=external_id,
                    store_id=dia_store.id
                ).first()

                if existing_product:
                    # Actualizar
                    existing_product.price = product_data["price"]
                    existing_product.name = product_data["name"]
                    existing_product.image = product_data.get("image", "")
                    existing_product.category = product_data.get("category", "General")
                    existing_product.stock = product_data.get("stock", True)
                    updated_count += 1
                else:
                    # Crear nuevo
                    new_product = Product(
                        external_id=external_id,
                        name=product_data["name"],
                        price=product_data["price"],
                        image=product_data.get("image", ""),
                        category=product_data.get("category", "General"),
                        source="dia",
                        store_id=dia_store.id,
                        stock=product_data.get("stock", True)
                    )
                    db.session.add(new_product)
                    imported_count += 1
                
                # Commit cada 50
                if (imported_count + updated_count) % 50 == 0:
                    db.session.commit()

            except Exception as e:
                print(f"Error al procesar producto {product_data.get('name')}: {e}")
                db.session.rollback()
                skipped_count += 1
                continue

        db.session.commit()
        print(f"\nImportacion completada:")
        print(f"   - Productos nuevos: {imported_count}")
        print(f"   - Productos actualizados: {updated_count}")
        print(f"   - Productos omitidos: {skipped_count}")

    except Exception as e:
        db.session.rollback()
        print(f"Error en la importacion: {e}")


def save_to_json(products, filename="dia_products_complete.json"):
    """Guardar productos en JSON"""
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        print(f"\nProductos guardados en {filename}")
    except Exception as e:
        print(f"Error al guardar JSON: {e}")


def scrape_and_import_dia_complete(postal_code="28020"):
    """Función principal completa para DIA"""
    products = fetch_all_dia_products()
    
    if products:
        # Guardar en JSON
        save_to_json(products, f"dia_products_complete_{postal_code}.json")
        
        # Importar a BD si estamos en Flask
        if IN_FLASK:
            import_to_database(products, postal_code)
        
        return True
    else:
        print("\nNo se pudieron obtener productos")
        return False


if __name__ == "__main__":
    # Modo standalone
    products = fetch_all_dia_products()
    if products:
        save_to_json(products)
        print(f"\nEjemplos de productos:")
        for i, product in enumerate(products[:3], 1):
            print(f"\n{i}. {product['name']}")
            print(f"   Precio: {product['price']} EUR")
            print(f"   Categoria: {product['category']}")
