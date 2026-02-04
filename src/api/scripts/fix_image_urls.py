"""
Script para corregir URLs de imágenes duplicadas en la base de datos
"""
import os
import sys
import re

# Añadir el directorio padre al path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

from src.api.models import db, Product
from src.app import app

def fix_image_urls():
    """Corrige URLs de imágenes duplicadas"""
    with app.app_context():
        print("🔧 Iniciando corrección de URLs de imágenes...")
        
        # Obtener todos los productos
        products = Product.query.all()
        total = len(products)
        fixed = 0
        
        print(f"📊 Total de productos a revisar: {total}")
        
        for product in products:
            if product.image:
                original_url = product.image
                
                # Buscar múltiples ocurrencias de la URL base
                matches = list(re.finditer(r'https://prod-mercadona\.imgix\.net/images/([a-fA-F0-9]+)\.jpg(?:\?fit=crop&h=300&w=300)?', original_url))
                
                if len(matches) > 1:
                    # Hay duplicación, usar solo la primera coincidencia
                    clean_url = f"https://prod-mercadona.imgix.net/images/{matches[0].group(1)}.jpg?fit=crop&h=300&w=300"
                    product.image = clean_url
                    fixed += 1
                    
                    if fixed % 100 == 0:
                        print(f"   ✅ Corregidas {fixed} imágenes...")
        
        if fixed > 0:
            db.session.commit()
            print(f"\n✅ Corrección completada: {fixed} imágenes corregidas de {total} productos")
        else:
            print(f"\n✅ No se encontraron imágenes duplicadas ({total} productos revisados)")

if __name__ == "__main__":
    fix_image_urls()
