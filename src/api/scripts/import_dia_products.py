"""
Script para importar productos de DIA usando su API
Basado en: https://www.dia.es/api/v2/home-insight/initial_analytics
"""
import requests
import json
from collections import defaultdict
import time

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

def fetch_dia_home_products():
    """Obtener productos del home de DIA"""
    print("=" * 80)
    print("Obteniendo productos del home de DIA...")
    print("=" * 80)
    
    try:
        url = "https://www.dia.es/api/v2/home-insight/initial_analytics"
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        
        data = response.json()
        
        all_products = {}
        
        if "carousel_analytics" in data:
            carousels = data["carousel_analytics"]
            print(f"\nCarruseles encontrados: {len(carousels)}")
            
            for carousel_name, products_dict in carousels.items():
                print(f"\n  {carousel_name}: {len(products_dict)} productos")
                
                for product_id, product_data in products_dict.items():
                    # Normalizar datos del producto
                    product_info = {
                        "id": product_data.get("item_id", product_id),
                        "name": product_data.get("item_name", ""),
                        "price": product_data.get("price", 0),
                        "brand": product_data.get("item_brand", ""),
                        "category": product_data.get("item_category", "General"),
                        "category2": product_data.get("item_category2", ""),
                        "stock": product_data.get("stock_availability", True),
                        "coupon": product_data.get("item_coupon", ""),
                        "image": ""  # DIA home analytics no incluye imágenes directamente
                    }
                    
                    # Generar imagen basándose en el ID
                    if product_info["id"]:
                        # Formato típico de imágenes DIA
                        product_info["image"] = f"https://www.dia.es/_next/image?url=https%3A%2F%2Ffront-cms.dia.es%2Fassets%2F{product_info['id']}.jpg&w=640&q=75"
                    
                    if product_info["name"] and product_info["price"] > 0:
                        all_products[product_info["id"]] = product_info
        
        products_list = list(all_products.values())
        print(f"\n Total productos unicos: {len(products_list)}")
        
        return products_list
        
    except Exception as e:
        print(f"Error al obtener productos del home: {e}")
        import traceback
        traceback.print_exc()
        return []


def search_dia_products(search_term, max_products=50):
    """Intentar obtener productos mediante búsqueda en DIA
    
    Nota: Este endpoint puede estar protegido, por ahora retorna lista vacía
    """
    print(f"\nBuscando productos con termino: '{search_term}'...")
    
    try:
        # Probar diferentes endpoints de búsqueda
        search_urls = [
            f"https://www.dia.es/api/v1/search-insight?q={search_term}",
            f"https://www.dia.es/api/v1/search-back?q={search_term}",
        ]
        
        for url in search_urls:
            try:
                response = requests.get(url, headers=HEADERS, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    # Procesar respuesta si tiene éxito
                    if 'products' in data:
                        print(f"  Encontrados {len(data['products'])} productos")
                        return data['products'][:max_products]
            except:
                continue
        
        print(f"  No se pudieron obtener resultados de busqueda")
        return []
        
    except Exception as e:
        print(f"  Error en busqueda: {e}")
        return []


def generate_dia_categories_urls():
    """Generar URLs de categorías conocidas de DIA"""
    categories = [
        ("Lácteos y huevos", "lacteos-y-huevos"),
        ("Panadería", "panaderia-y-pasteleria"),
        ("Bebidas", "bebidas"),
        ("Carne y charcutería", "carne-y-charcuteria"),
        ("Pescado", "pescado-y-marisco"),
        ("Frutas y verduras", "frutas-y-verduras"),
        ("Congelados", "congelados"),
        ("Despensa", "despensa"),
        ("Limpieza", "limpieza"),
        ("Higiene y belleza", "higiene-y-belleza"),
        ("Bebé", "bebe"),
        ("Mascotas", "mascotas"),
    ]
    
    return categories


def import_to_database(products, postal_code="28020"):
    """Importa los productos de DIA a la base de datos"""
    if not IN_FLASK:
        print("\n No se puede importar a BD (no está en contexto Flask)")
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


def save_to_json(products, filename="dia_products.json"):
    """Guardar productos en JSON"""
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        print(f"\nProductos guardados en {filename}")
    except Exception as e:
        print(f"Error al guardar JSON: {e}")


def scrape_and_import_dia(postal_code="28020"):
    """Función principal para scraping e importación de DIA"""
    print("\n")
    print("=" * 80)
    print("IMPORTACION DE PRODUCTOS DE DIA")
    print("=" * 80)
    print(f"Codigo postal: {postal_code}")
    print()
    
    # Obtener productos del home
    products = fetch_dia_home_products()
    
    if not products:
        print("\nNo se pudieron obtener productos de DIA")
        return False
    
    # Guardar en JSON
    save_to_json(products, f"dia_products_{postal_code}.json")
    
    # Importar a BD si estamos en Flask
    if IN_FLASK:
        import_to_database(products, postal_code)
    
    print("\n" + "=" * 80)
    print("Proceso completado")
    print("=" * 80)
    return True


if __name__ == "__main__":
    # Modo standalone (sin Flask)
    products = fetch_dia_home_products()
    if products:
        save_to_json(products)
        print(f"\nEjemplo de producto:")
        print(json.dumps(products[0], indent=2, ensure_ascii=False))
