"""
Script para actualizar las URLs de imágenes de productos DIA
"""
import os
import sys
import json

# Añadir el directorio src al path
sys.path.insert(0, os.path.abspath('src'))

from api.models import db, Product, Store
from app import app

def update_dia_images():
    """Actualiza las URLs de imágenes de productos DIA"""
    
    with app.app_context():
        print("=" * 80)
        print("ACTUALIZANDO IMÁGENES DE PRODUCTOS DIA")
        print("=" * 80)
        
        # Cargar productos del JSON
        with open('dia_products_complete.json', 'r', encoding='utf-8') as f:
            products = json.load(f)
        
        print(f"\nProductos en JSON: {len(products)}")
        
        # Buscar tienda DIA
        dia_store = Store.query.filter_by(name="DIA").first()
        
        if not dia_store:
            print("❌ Tienda DIA no encontrada en la base de datos")
            return
        
        print(f"Tienda DIA encontrada: ID {dia_store.id}\n")
        
        updated = 0
        not_found = 0
        
        print("Actualizando imágenes...")
        for product_data in products:
            external_id = str(product_data.get("id", ""))
            new_image = product_data.get("image", "")
            
            if not external_id or not new_image:
                continue
            
            # Buscar producto en BD
            product = Product.query.filter_by(
                external_id=external_id,
                store_id=dia_store.id
            ).first()
            
            if product:
                old_image = product.image
                if old_image != new_image:
                    product.image = new_image
                    updated += 1
                    if updated % 100 == 0:
                        print(f"  Actualizados: {updated}")
            else:
                not_found += 1
        
        # Commit final
        db.session.commit()
        
        print("\n" + "=" * 80)
        print(f"✅ Imágenes actualizadas: {updated}")
        print(f"⚠️  Productos no encontrados: {not_found}")
        print("=" * 80)

if __name__ == "__main__":
    update_dia_images()
