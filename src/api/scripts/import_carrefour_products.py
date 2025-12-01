import requests
import json
from api.models import db, Product, Store

# API de Carrefour
CARREFOUR_SEARCH_URL = "https://www.carrefour.es/api/v1/search"

# Headers para simular una petición de navegador
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

# Categorías populares para buscar
CATEGORIES = [
    "leche", "pan", "agua", "aceite", "huevos", "arroz", "pasta",
    "tomate", "lechuga", "pollo", "carne", "pescado", "yogur",
    "queso", "jamón", "café", "azúcar", "sal", "galletas", "chocolate"
]


def fetch_carrefour_products(postal_code="28020", limit_per_category=20):
    """Obtiene productos de Carrefour mediante búsquedas
    
    Args:
        postal_code (str): Código postal (Carrefour usa almacenes por zona)
        limit_per_category (int): Máximo de productos por categoría
    """
    all_products = []
    
    try:
        print(f"🛒 Conectando con Carrefour (CP: {postal_code})...")
        print(f"📦 Buscando en {len(CATEGORIES)} categorías...\n")
        
        for i, category in enumerate(CATEGORIES, 1):
            print(f"   [{i}/{len(CATEGORIES)}] Buscando '{category}'...", end=" ")
            
            try:
                # Payload para la búsqueda
                payload = {
                    "query": category,
                    "rows": limit_per_category,
                    "start": 0,
                    "origin": "default",
                    "postal_code": postal_code
                }
                
                response = requests.post(
                    CARREFOUR_SEARCH_URL,
                    headers=HEADERS,
                    json=payload,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if "content" in data and "docs" in data["content"]:
                        products = data["content"]["docs"]
                        
                        for product in products[:limit_per_category]:
                            # Extraer información del producto
                            product_info = {
                                "name": product.get("display_name", product.get("name", "N/A")),
                                "image": product.get("image_path", ""),
                                "price": float(product.get("price", {}).get("value", 0)),
                                "external_id": str(product.get("id", "")),
                                "category": category.capitalize()
                            }
                            
                            # Solo añadir si tiene información válida
                            if product_info["name"] != "N/A" and product_info["price"] > 0:
                                all_products.append(product_info)
                        
                        print(f"{len(products)} productos")
                    else:
                        print("Sin resultados")
                else:
                    print(f"Error HTTP {response.status_code}")
                    
            except Exception as e:
                print(f"Error: {e}")
                continue
        
        # Eliminar duplicados
        unique_products = {}
        for product in all_products:
            if product["external_id"] and product["external_id"] not in unique_products:
                unique_products[product["external_id"]] = product
        
        final_products = list(unique_products.values())
        print(f"\n✅ Total: {len(final_products)} productos únicos")
        return final_products
    
    except Exception as e:
        print(f"❌ Error general: {e}")
        return []


def import_to_database(products, postal_code="28020"):
    """Importa los productos de Carrefour a la base de datos"""
    try:
        # Buscar o crear la tienda de Carrefour
        store_name = f"Carrefour - {postal_code}"
        carrefour_store = Store.query.filter_by(name=store_name).first()
        
        if not carrefour_store:
            print(f"🏪 Creando tienda {store_name}...")
            carrefour_store = Store(
                name=store_name,
                postal_code=postal_code,
                url="https://www.carrefour.es",
                logo="https://www.carrefour.es/static/version1234567890/frontend/Carrefour/carrefour/es_ES/images/logo.svg"
            )
            db.session.add(carrefour_store)
            db.session.commit()
            print(f"✅ Tienda creada con ID: {carrefour_store.id}")
        else:
            print(f"✅ Tienda encontrada con ID: {carrefour_store.id}")

        imported_count = 0
        updated_count = 0

        print("\n📥 Importando productos a la base de datos...")
        for product_data in products:
            try:
                # Buscar si el producto ya existe
                existing_product = Product.query.filter_by(
                    external_id=str(product_data.get("external_id")),
                    store_id=carrefour_store.id
                ).first()

                if existing_product:
                    # Actualizar información
                    existing_product.price = product_data["price"]
                    existing_product.name = product_data["name"]
                    existing_product.image = product_data["image"]
                    existing_product.category = product_data.get("category", "General")
                    updated_count += 1
                else:
                    # Crear nuevo producto
                    new_product = Product(
                        external_id=str(product_data.get("external_id", "")),
                        name=product_data["name"],
                        price=product_data["price"],
                        image=product_data["image"] if product_data["image"] else None,
                        category=product_data.get("category", "General"),
                        source="carrefour",
                        store_id=carrefour_store.id,
                        stock=True
                    )
                    db.session.add(new_product)
                    imported_count += 1

            except Exception as e:
                print(f"⚠️  Error al procesar producto: {e}")
                continue

        db.session.commit()
        print(f"\n✅ Importación completada:")
        print(f"   - Productos nuevos: {imported_count}")
        print(f"   - Productos actualizados: {updated_count}")
        print(f"   - Total en tienda: {imported_count + updated_count}")

    except Exception as e:
        db.session.rollback()
        print(f"❌ Error en la importación: {e}")


def save_to_json(products, filename="carrefour_products.json"):
    """Guarda los productos en un archivo JSON"""
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        print(f"💾 Productos guardados en {filename}")
    except Exception as e:
        print(f"❌ Error al guardar JSON: {e}")


def import_carrefour_products(postal_code="28020", limit_per_category=20):
    """Función principal para importar productos de Carrefour
    
    Args:
        postal_code (str): Código postal para la búsqueda
        limit_per_category (int): Máximo de productos por categoría
    """
    print("🚀 Iniciando importación de productos de Carrefour\n")
    print(f"📍 Código postal: {postal_code}")
    print(f"📊 Productos por categoría: {limit_per_category}")
    
    # Obtener productos
    products = fetch_carrefour_products(postal_code, limit_per_category)
    
    if products:
        # Guardar en JSON
        save_to_json(products, f"carrefour_products_{postal_code}.json")
        
        # Importar a la base de datos
        import_to_database(products, postal_code)
        
        print("\n🎉 ¡Proceso completado!")
        return True
    else:
        print("\n⚠️  No se pudieron obtener productos")
        return False
