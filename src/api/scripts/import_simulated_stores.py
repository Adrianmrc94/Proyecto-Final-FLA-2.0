"""
Script para importar productos simulados de diferentes supermercados
basándose en los productos reales de Mercadona con variaciones de precio
"""
import random
from api.models import db, Product, Store

# Configuración de supermercados a simular
STORES_CONFIG = [
    {
        "name": "DIA",
        "postal_code": "28020",
        "url": "https://www.dia.es",
        "logo": "https://www.dia.es/compra-online/images/logo.svg",
        "price_variation": (-0.10, 0.05),  # -10% a +5% respecto a Mercadona
        "availability": 0.75  # 75% de los productos disponibles
    },
    {
        "name": "Carrefour",
        "postal_code": "28020",
        "url": "https://www.carrefour.es",
        "logo": "https://www.carrefour.es/supermercado/images/logo.svg",
        "price_variation": (-0.05, 0.15),  # -5% a +15% respecto a Mercadona
        "availability": 0.85  # 85% de los productos disponibles
    },
    {
        "name": "Alcampo",
        "postal_code": "28020",
        "url": "https://www.alcampo.es",
        "logo": "https://www.alcampo.es/images/logo.svg",
        "price_variation": (-0.08, 0.12),  # -8% a +12% respecto a Mercadona
        "availability": 0.70  # 70% de los productos disponibles
    }
]


def create_simulated_store(store_config):
    """Crea o encuentra una tienda simulada"""
    store_name = f"{store_config['name']} - {store_config['postal_code']}"
    
    store = Store.query.filter_by(
        name=store_name,
        postal_code=store_config['postal_code']
    ).first()
    
    if not store:
        print(f"🏪 Creando tienda {store_name}...")
        store = Store(
            name=store_name,
            postal_code=store_config['postal_code'],
            url=store_config['url'],
            logo=store_config['logo']
        )
        db.session.add(store)
        db.session.commit()
        print(f"✅ Tienda creada con ID: {store.id}")
    else:
        print(f"✅ Tienda encontrada con ID: {store.id}")
    
    return store


def generate_simulated_products(postal_code="28020"):
    """Genera productos simulados para todas las tiendas configuradas"""
    
    print(f"🚀 Iniciando generación de productos simulados\n")
    print(f"📍 Código postal: {postal_code}")
    print(f"🏪 Supermercados a simular: {len(STORES_CONFIG)}\n")
    
    # Obtener todos los productos de Mercadona como base
    mercadona_store = Store.query.filter_by(
        postal_code=postal_code
    ).filter(Store.name.like(f"%Mercadona%")).first()
    
    if not mercadona_store:
        print("❌ No se encontraron productos de Mercadona en la base de datos")
        print("   Por favor, ejecuta primero: flask import-mercadona")
        return
    
    mercadona_products = Product.query.filter_by(store_id=mercadona_store.id).all()
    print(f"📦 Productos base de Mercadona: {len(mercadona_products)}\n")
    
    if len(mercadona_products) == 0:
        print("⚠️  No hay productos de Mercadona para simular")
        return
    
    total_created = 0
    total_updated = 0
    
    # Generar productos para cada tienda
    for store_config in STORES_CONFIG:
        print(f"\n{'='*60}")
        print(f"🏪 Procesando {store_config['name']}")
        print(f"{'='*60}\n")
        
        # Crear o encontrar la tienda
        store = create_simulated_store(store_config)
        
        # Determinar qué productos estarán disponibles
        available_count = int(len(mercadona_products) * store_config['availability'])
        available_products = random.sample(mercadona_products, available_count)
        
        print(f"📊 Productos a simular: {len(available_products)} ({store_config['availability']*100:.0f}% del catálogo)")
        print(f"💰 Variación de precio: {store_config['price_variation'][0]*100:.0f}% a {store_config['price_variation'][1]*100:.0f}%\n")
        
        created = 0
        updated = 0
        
        for base_product in available_products:
            # Calcular precio variado
            variation = random.uniform(
                store_config['price_variation'][0],
                store_config['price_variation'][1]
            )
            new_price = round(base_product.price * (1 + variation), 2)
            
            # Evitar precios negativos o muy bajos
            if new_price < 0.10:
                new_price = 0.10
            
            # Buscar si ya existe el producto
            existing_product = Product.query.filter_by(
                external_id=base_product.external_id,
                store_id=store.id
            ).first()
            
            if existing_product:
                # Actualizar precio y otros datos
                existing_product.name = base_product.name
                existing_product.price = new_price
                existing_product.image = base_product.image
                existing_product.category = base_product.category
                existing_product.description = base_product.description
                existing_product.stock = base_product.stock
                existing_product.source = store_config['name'].lower()
                updated += 1
            else:
                # Crear nuevo producto
                new_product = Product(
                    external_id=base_product.external_id,
                    name=base_product.name,
                    price=new_price,
                    image=base_product.image,
                    rate=base_product.rate,
                    category=base_product.category,
                    stock=base_product.stock,
                    description=base_product.description,
                    source=store_config['name'].lower(),
                    store_id=store.id
                )
                db.session.add(new_product)
                created += 1
            
            # Commit cada 100 productos
            if (created + updated) % 100 == 0:
                db.session.commit()
        
        # Commit final
        db.session.commit()
        
        print(f"✅ Importación completada:")
        print(f"   - Productos nuevos: {created}")
        print(f"   - Productos actualizados: {updated}")
        print(f"   - Total en tienda: {created + updated}")
        
        total_created += created
        total_updated += updated
    
    # Resumen final
    print(f"\n{'='*60}")
    print(f"🎉 ¡Proceso completado!")
    print(f"{'='*60}\n")
    print(f"📊 Resumen total:")
    print(f"   - Tiendas procesadas: {len(STORES_CONFIG)}")
    print(f"   - Productos nuevos: {total_created}")
    print(f"   - Productos actualizados: {total_updated}")
    print(f"   - Total: {total_created + total_updated}")
    print()


if __name__ == "__main__":
    generate_simulated_products()
