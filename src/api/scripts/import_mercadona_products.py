import requests
import json
from api.models import db, Product, Store

# API endpoints de Mercadona
MERCADONA_HOME_URL = "https://tienda.mercadona.es/api/home/?lang=es&wh=mad1&postal_code={postal_code}"
MERCADONA_CATEGORIES_URL = "https://tienda.mercadona.es/api/categories/?lang=es&wh=mad1"
MERCADONA_CATEGORY_PRODUCTS_URL = "https://tienda.mercadona.es/api/categories/{category_id}/?lang=es&wh=mad1"

# Headers para simular una petición de navegador
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Accept-Language": "es-ES,es;q=0.9",
    "Referer": "https://tienda.mercadona.es/"
}

def fetch_mercadona_categories():
    """Obtiene las SUB-categorías procesables de Mercadona (las que tienen endpoint propio)"""
    try:
        print("📂 Obteniendo categorías de Mercadona...")
        response = requests.get(MERCADONA_CATEGORIES_URL, headers=HEADERS)
        response.raise_for_status()
        data = response.json()
        
        subcategories = []
        if "results" in data:
            for main_category in data["results"]:
                main_name = main_category.get("name")
                # Las categorías principales tienen sub-categorías
                if "categories" in main_category:
                    for subcat in main_category["categories"]:
                        subcategories.append({
                            "id": subcat.get("id"),
                            "name": subcat.get("name"),
                            "parent": main_name
                        })
        
        print(f"✅ Se encontraron {len(subcategories)} sub-categorías procesables")
        return subcategories
    
    except Exception as e:
        print(f"⚠️  Error al obtener categorías: {e}")
        return []


def fetch_products_from_category(category_id, category_name, level=1):
    """Obtiene productos de una categoría específica recursivamente (hasta 4 niveles de profundidad)"""
    products = []
    indent = "   " * level
    
    try:
        url = MERCADONA_CATEGORY_PRODUCTS_URL.format(category_id=category_id)
        print(f"{indent}🔍 Nivel {level}: Consultando {category_name} (ID: {category_id})...")
        response = requests.get(url, headers=HEADERS, timeout=10)
        
        print(f"{indent}📡 Status: {response.status_code}")
        
        response.raise_for_status()
        data = response.json()
        
        # Si tiene sub-categorías, procesarlas TODAS directamente del JSON (sin nuevas peticiones)
        if "categories" in data and data["categories"]:
            if level <= 2:  # Solo imprimir para primeros 2 niveles
                print(f"{indent}📂 {category_name}: {len(data['categories'])} sub-categorías encontradas")
            
            for subcat in data["categories"]:
                subcat_id = subcat.get("id")
                subcat_name = subcat.get("name", f"Subcategoría {subcat_id}")
                
                # Los productos están directamente en las subcategorías del JSON
                if "products" in subcat and subcat["products"]:
                    print(f"{indent}  ✅ {subcat_name}: {len(subcat['products'])} productos")
                    
                    for product in subcat["products"]:
                        try:
                            product_info = {
                                "name": product.get("display_name", ""),
                                "image": f"https://prod-mercadona.imgix.net/images/{product.get('thumbnail')}.jpg?fit=crop&h=300&w=300" if product.get("thumbnail") else "",
                                "price": float(product.get("price_instructions", {}).get("unit_price", 0)),
                                "external_id": str(product.get("id", "")),
                                "category": subcat_name
                            }
                            if product_info["name"] and product_info["price"] > 0:
                                products.append(product_info)
                        except:
                            continue
                
                # Si hay nivel 3 de categorías
                if "categories" in subcat:
                    for subsubcat in subcat["categories"]:
                        if "products" in subsubcat and subsubcat["products"]:
                            subsubcat_name = subsubcat.get("name", f"Nivel3-{subsubcat.get('id')}")
                            print(f"{indent}    ✅ {subsubcat_name}: {len(subsubcat['products'])} productos")
                            
                            for product in subsubcat["products"]:
                                try:
                                    product_info = {
                                        "name": product.get("display_name", ""),
                                        "image": f"https://prod-mercadona.imgix.net/images/{product.get('thumbnail')}.jpg?fit=crop&h=300&w=300" if product.get("thumbnail") else "",
                                        "price": float(product.get("price_instructions", {}).get("unit_price", 0)),
                                        "external_id": str(product.get("id", "")),
                                        "category": subsubcat_name
                                    }
                                    if product_info["name"] and product_info["price"] > 0:
                                        products.append(product_info)
                                except:
                                    continue
        
        # Productos directamente en la categoría actual (caso base)
        if "products" in data and data["products"]:
            print(f"{indent}✅ {category_name}: {len(data['products'])} productos encontrados")
            
            for product in data["products"]:
                try:
                    product_info = {
                        "name": product.get("display_name", ""),
                        "image": f"https://prod-mercadona.imgix.net/images/{product.get('thumbnail')}.jpg?fit=crop&h=300&w=300" if product.get("thumbnail") else "",
                        "price": float(product.get("price_instructions", {}).get("unit_price", 0)),
                        "external_id": str(product.get("id", "")),
                        "category": category_name
                    }
                    if product_info["name"] and product_info["price"] > 0:
                        products.append(product_info)
                except Exception as e:
                    print(f"{indent}⚠️  Error procesando producto: {e}")
                    continue
        
        return products
    
    except requests.exceptions.HTTPError as e:
        print(f"{indent}❌ HTTP Error {e.response.status_code} en {category_name}")
        return []
    except Exception as e:
        print(f"{indent}❌ Error en {category_name}: {e}")
        import traceback
        traceback.print_exc()
        return []


def fetch_mercadona_products(postal_code="28020", limit_categories=None):
    """Obtiene los productos de Mercadona de todas las categorías
    
    Args:
        postal_code (str): Código postal para la búsqueda
        limit_categories (int): Límite de categorías a procesar (None = todas)
    """
    all_products = []
    
    try:
        print(f"🛒 Conectando con la API de Mercadona (CP: {postal_code})...")
        
        # Primero obtener productos de la home (destacados)
        home_url = MERCADONA_HOME_URL.format(postal_code=postal_code)
        response = requests.get(home_url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        json_data = response.json()

        if "sections" in json_data:
            print("📦 Extrayendo productos destacados de la home...")
            for section in json_data["sections"]:
                if section["layout"] in ["carousel", "grid"] and "items" in section["content"]:
                    for item in section["content"]["items"]:
                        if "display_name" in item and "thumbnail" in item and "price_instructions" in item:
                            try:
                                product_info = {
                                    "name": item.get("display_name", "N/A"),
                                    "image": item.get("thumbnail", ""),  # Ya viene con URL completa
                                    "price": float(item["price_instructions"].get("unit_price", 0)),
                                    "external_id": str(item.get("id", "")),
                                    "category": section.get("title", "Destacados")
                                }
                                if product_info["price"] > 0:
                                    all_products.append(product_info)
                            except Exception as e:
                                continue
        
        # Ahora obtener productos por categorías
        categories = fetch_mercadona_categories()
        
        if limit_categories:
            categories = categories[:limit_categories]
        
        print(f"\n📁 Procesando {len(categories)} categorías principales...")
        for i, category in enumerate(categories, 1):
            print(f"\n[{i}/{len(categories)}] {category['name']}:")
            cat_products = fetch_products_from_category(category["id"], category["name"])
            all_products.extend(cat_products)
            if cat_products:
                print(f"   ✅ Total en categoría: {len(cat_products)} productos")
        
        # Eliminar duplicados basándose en external_id
        unique_products = {}
        for product in all_products:
            ext_id = product.get("external_id")
            if ext_id and ext_id not in unique_products:
                unique_products[ext_id] = product
        
        final_products = list(unique_products.values())
        print(f"\n✅ Total: {len(final_products)} productos únicos (de {len(all_products)} encontrados)")
        return final_products

    except requests.exceptions.RequestException as e:
        print(f"❌ Error al obtener datos de la API: {e}")
        return []
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return []


def import_to_database(products, postal_code="28020"):
    """Importa los productos de Mercadona a la base de datos
    
    Args:
        products (list): Lista de productos a importar
        postal_code (str): Código postal de la tienda
    """
    try:
        # Buscar o crear la tienda de Mercadona para este código postal
        store_name = f"Mercadona - {postal_code}"
        mercadona_store = Store.query.filter_by(name=store_name, postal_code=postal_code).first()
        
        if not mercadona_store:
            print(f"🏪 Creando tienda {store_name}...")
            mercadona_store = Store(
                name=store_name,
                postal_code=postal_code,
                url="https://tienda.mercadona.es",
                logo="https://www.mercadona.es/images/logo.svg"
            )
            db.session.add(mercadona_store)
            db.session.commit()
            print(f"✅ Tienda creada con ID: {mercadona_store.id}")
        else:
            print(f"✅ Tienda encontrada con ID: {mercadona_store.id}")

        imported_count = 0
        updated_count = 0
        skipped_count = 0

        print("\n📥 Importando productos a la base de datos...")
        for product_data in products:
            try:
                external_id = str(product_data.get("external_id", ""))
                
                if not external_id:
                    skipped_count += 1
                    continue
                
                # Buscar si el producto ya existe EN ESTA TIENDA específica
                existing_product = Product.query.filter_by(
                    external_id=external_id,
                    store_id=mercadona_store.id
                ).first()

                if existing_product:
                    # Actualizar precio y otros datos
                    existing_product.price = product_data["price"]
                    existing_product.name = product_data["name"]
                    existing_product.image = product_data["image"]
                    existing_product.category = product_data.get("category", "General")
                    updated_count += 1
                else:
                    # Crear nuevo producto
                    new_product = Product(
                        external_id=external_id,
                        name=product_data["name"],
                        price=product_data["price"],
                        image=product_data["image"],
                        category=product_data.get("category", "General"),
                        source="mercadona",
                        store_id=mercadona_store.id,
                        stock=True
                    )
                    db.session.add(new_product)
                    imported_count += 1
                
                # Commit cada 50 productos para evitar problemas
                if (imported_count + updated_count) % 50 == 0:
                    db.session.commit()

            except Exception as e:
                print(f"⚠️  Error al procesar producto {product_data.get('name')}: {e}")
                db.session.rollback()
                skipped_count += 1
                continue

        db.session.commit()
        print(f"\n✅ Importación completada:")
        print(f"   - Productos nuevos: {imported_count}")
        print(f"   - Productos actualizados: {updated_count}")
        print(f"   - Productos omitidos: {skipped_count}")
        print(f"   - Total en tienda: {imported_count + updated_count}")

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error en la importación: {e}")


def save_to_json(products, filename="mercadona_products.json"):
    """Guarda los productos en un archivo JSON"""
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        print(f"💾 Productos guardados en {filename}")
    except Exception as e:
        print(f"❌ Error al guardar JSON: {e}")


def import_mercadona_products(postal_code="28020", limit_categories=None):
    """Función principal para importar productos de Mercadona
    
    Args:
        postal_code (str): Código postal para la búsqueda (default: 28020 Madrid)
        limit_categories (int): Límite de categorías a procesar (None = todas, recomendado: 5-10 para pruebas)
    """
    print("🚀 Iniciando importación de productos de Mercadona\n")
    print(f"📍 Código postal: {postal_code}")
    if limit_categories:
        print(f"📊 Límite de categorías: {limit_categories}")
    
    # Obtener productos de la API
    products = fetch_mercadona_products(postal_code, limit_categories)
    
    if products:
        # Guardar en JSON (opcional)
        save_to_json(products, f"mercadona_products_{postal_code}.json")
        
        # Importar a la base de datos
        import_to_database(products, postal_code)
        
        print("\n🎉 ¡Proceso completado!")
        return True
    else:
        print("\n⚠️  No se pudieron obtener productos")
        return False
