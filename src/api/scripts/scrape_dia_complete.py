"""
Scraper completo para DIA usando las APIs PLP descubiertas
Basado en: https://www.dia.es/api/v1/plp-insight/initial_analytics/l1/{category_id}

ACTUALIZADO: Incluye todas las subcategorías (L1xx + L2xxx)
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

# TODAS las categorías de DIA (principales + subcategorías)
DIA_ALL_CATEGORIES = [
    # Freidora de aire - Airfryer (L125)
    ("L125", "Freidora de aire - Airfryer"), ("L2231", "Patatas Airfryer"), ("L2232", "Rebozados Airfryer"),
    ("L2233", "Verduras Airfryer"), ("L2234", "Pescados y mariscos Airfryer"), ("L2235", "Carne Airfryer"),
    ("L2236", "Comida preparada Airfryer"), ("L2237", "Accesorios Airfryer"),
    # Sin gluten (L126)
    ("L126", "Sin gluten"), ("L2240", "Desayunos sin gluten"), ("L2241", "Panadería sin gluten"),
    ("L2242", "Repostería sin gluten"), ("L2243", "Platos sin gluten"), ("L2244", "Bebidas sin gluten"),
    ("L2245", "Productos infantiles sin gluten"),
    # Frutas (L105)
    ("L105", "Frutas"), ("L2033", "Plátanos y bananas"), ("L2032", "Manzanas y peras"),
    ("L2196", "Naranjas, mandarinas y limones"), ("L2267", "Melón y sandía"), ("L2035", "Uvas"),
    ("L2039", "Frutas tropicales"), ("L2038", "Frutos rojos y del bosque"), ("L2268", "Frutas congeladas"),
    # Verduras (L104)
    ("L104", "Verduras"), ("L2027", "Lechugas y hojas verdes"), ("L2023", "Tomates, pimientos y pepinos"),
    ("L2022", "Ajos, cebollas y puerros"), ("L2181", "Calabacín, calabaza y berenjena"), ("L2028", "Patatas y zanahorias"),
    ("L2024", "Brócoli, coliflor y judías verdes"), ("L2029", "Setas y champiñones"), ("L2031", "Hierbas aromáticas"),
    ("L2030", "Ensaladas y verduras preparadas"), ("L2025", "Verduras congeladas y al vapor"), ("L2026", "Conservas de verduras"),
    # Carnes (L102)
    ("L102", "Carnes"), ("L2202", "Pollo"), ("L2013", "Vacuno"), ("L2014", "Cerdo"), ("L2015", "Pavo"),
    ("L2016", "Conejo"), ("L2017", "Hamburguesas, carne picada y albóndigas"), ("L2265", "Empanados y elaborados"),
    ("L2266", "Arreglos y despieces"),
    # Pescados y mariscos (L103)
    ("L103", "Pescados y mariscos"), ("L2019", "Pescados y mariscos frescos"), ("L2249", "Merluza y bacalao congelados"),
    ("L2250", "Salmón, atún y pescado blanco congelados"), ("L2204", "Calamar y sepia congelados"),
    ("L2251", "Pescados rebozados"), ("L2252", "Marisco de concha congelado"), ("L2253", "Gambas y langostinos congelados"),
    ("L2020", "Ahumados y salazones"), ("L2021", "Surimi y otros elaborados"),
    # Charcutería y quesos (L101)
    ("L101", "Charcutería y quesos"), ("L2001", "Jamón cocido, pavo y pollo"), ("L2004", "Jamón curado y paleta"),
    ("L2005", "Lomo, chorizo, fuet y salchichón"), ("L2206", "Salchichas y bacon"), ("L2259", "Chopped y mortadela"),
    ("L2012", "Paté, foie y sobrasada"), ("L2007", "Queso curado, semi y tierno"), ("L2205", "Quesos en lonchas y rallado"),
    ("L2010", "Quesos untables y fundidos"), ("L2008", "Queso fresco"), ("L2009", "Queso azul, roquefort y cabra"),
    ("L2011", "Quesos internacionales"), ("L2260", "Quesos altos en proteínas"),
    # Huevos, leche y mantequilla (L108)
    ("L108", "Huevos, leche y mantequilla"), ("L2055", "Huevos"), ("L2051", "Leche"),
    ("L2261", "Leche sin lactosa y enriquecidas"), ("L2052", "Bebidas vegetales"), ("L2262", "Leche infantil"),
    ("L2053", "Batidos, cafés fríos y horchatas"), ("L2263", "Batidos altos en proteínas"),
    ("L2264", "Leche condensada y evaporada"), ("L2056", "Mantequilla y margarina"), ("L2054", "Nata"),
    # Panadería (L112)
    ("L112", "Panadería"), ("L2070", "Pan recién horneado"), ("L2069", "Pan de molde y especiales"),
    ("L2073", "Pan para hamburguesas y perritos"), ("L2074", "Tortillas de trigo y pitas"), ("L2200", "Pan sin gluten"),
    ("L2072", "Pan tostado, rallado y picatostes"), ("L2071", "Picos y crackers"), ("L2076", "Masas y hojaldres"),
    ("L2075", "Harinas y levaduras"),
    # Yogures y postres (L113)
    ("L113", "Yogures y postres"), ("L2079", "Yogures naturales y desnatados"), ("L2081", "Yogures de sabores y frutas"),
    ("L2082", "Yogures griegos"), ("L2248", "Yogures líquidos"), ("L2078", "Yogures bífidus y colesterol"),
    ("L2085", "Kéfir y fermentados"), ("L2229", "Postres proteicos y vegetales"), ("L2083", "Yogures y postres infantiles"),
    ("L2087", "Postres tradicionales"), ("L2088", "Natillas, flan y arroz con leche"), ("L2089", "Gelatinas y cuajadas"),
    # Congelados (L119)
    ("L119", "Congelados"), ("L2130", "Helados y hielo"), ("L2131", "Pizzas, bases y masas"),
    ("L2132", "Pescado y marisco"), ("L2133", "Carne y pollo"), ("L2210", "Verduras, hortalizas y salteados"),
    ("L2213", "Patatas fritas"), ("L2135", "Croquetas y rebozados"), ("L2136", "Churros y postres"),
    ("L2137", "Lasañas y pasta"),
    # Arroz, pastas y legumbres (L106)
    ("L106", "Arroz, pastas y legumbres"), ("L2042", "Arroz"), ("L2270", "Fideos"),
    ("L2044", "Macarrones, espaguetis y pastas secas"), ("L2271", "Pastas rellenas"), ("L2272", "Lasaña y canelones"),
    ("L2273", "Noodles"), ("L2274", "Pastas sin gluten"), ("L2191", "Garbanzos y alubias"), ("L2193", "Lentejas"),
    ("L2043", "Quinoa, couscous y soja"),
    # Aceites, salsas y especias (L107)
    ("L107", "Aceites, salsas y especias"), ("L2046", "Aceites"), ("L2047", "Vinagres y aliños"),
    ("L2208", "Tomate"), ("L2050", "Mayonesa, ketchup y otras salsas"), ("L2048", "Sal y especias"),
    # Conservas, caldos y cremas (L114)
    ("L114", "Conservas, caldos y cremas"), ("L2179", "Atún, bonito y caballa"), ("L2180", "Berberechos"),
    ("L2195", "Mejillones"), ("L2207", "Sardinas y sardinillas"), ("L2197", "Otras conservas de pescado"),
    ("L2092", "Conservas vegetales"), ("L2093", "Sopas, caldos y purés deshidratados"),
    ("L2094", "Cremas y caldos líquidos"),
    # Azúcar, chocolates y caramelos (L110)
    ("L110", "Azúcar, chocolates y caramelos"), ("L2060", "Azúcar y edulcorantes"), ("L2061", "Miel"),
    ("L2062", "Mermeladas y frutas en almibar"), ("L2228", "Cremas de cacao"), ("L2077", "Preparados para postres"),
    ("L2063", "Chocolates y bombones"), ("L2064", "Caramelos, chicles y golosinas"),
    # Café, cacao e infusiones (L109)
    ("L109", "Café, cacao e infusiones"), ("L2057", "Cápsulas compatibles Nespresso"),
    ("L2275", "Cápsulas compatibles Dolce Gusto"), ("L2276", "Otras cápsulas compatibles"), ("L2277", "Café molido"),
    ("L2278", "Café soluble"), ("L2279", "Café en grano"), ("L2280", "Cafés fríos"),
    ("L2058", "Cacao y chocolate a la taza"), ("L2059", "Infusiones"), ("L2281", "Té"),
    # Galletas, bollos y cereales (L111)
    ("L111", "Galletas, bollos y cereales"), ("L2065", "Galletas"), ("L2066", "Galletas saladas"),
    ("L2067", "Bollería"), ("L2068", "Cereales"), ("L2216", "Tortitas"),
    # Platos preparados y pizzas (L116)
    ("L116", "Platos preparados y pizzas"), ("L2102", "Listos para comer"), ("L2105", "Tortillas y empanadas"),
    ("L2101", "Pizzas refrigeradas"), ("L2246", "Pizzas congeladas"), ("L2104", "Sándwiches, hamburguesas y horno"),
    ("L2247", "Platos precocinados"), ("L2103", "Comida internacional"), ("L2106", "Gazpachos y salmorejos"),
    ("L2269", "Hummus y guacamoles"),
    # Aperitivos y frutos secos (L115)
    ("L115", "Aperitivos y frutos secos"), ("L2098", "Patatas fritas"), ("L2282", "Snacks salados"),
    ("L2097", "Frutos secos"), ("L2283", "Mix de frutos secos"), ("L2096", "Aceitunas"), ("L2284", "Encurtidos"),
    ("L2285", "Snacks vegetales"), ("L2041", "Frutas deshidratadas"),
    # Agua, refrescos y zumos (L117)
    ("L117", "Agua, refrescos y zumos"), ("L2107", "Agua"), ("L2108", "Cola"), ("L2212", "Naranja"),
    ("L2109", "Limón, lima limón"), ("L2111", "Tés fríos, cafés frios"), ("L2112", "Tónicas"), ("L2192", "Gaseosa"),
    ("L2217", "Bebidas energéticas"), ("L2114", "Bebidas isotónicas"), ("L2113", "Zumos"), ("L2110", "Otras bebidas"),
    # Cervezas, vinos y bebidas con alcohol (L118)
    ("L118", "Cervezas, vinos y bebidas con alcohol"), ("L2115", "Cervezas"), ("L2117", "Cervezas especiales"),
    ("L2182", "Cervezas con limón"), ("L2118", "Cervezas sin alcohol"), ("L2119", "Tinto de verano y sangría"),
    ("L2120", "Vino tinto"), ("L2121", "Vino blanco"), ("L2124", "Vino rosado"), ("L2122", "Cavas y sidra"),
    ("L2125", "Ginebra y vodka"), ("L2128", "Ron y whisky"), ("L2127", "Vermouth"), ("L2129", "Cremas y licores"),
    ("L2126", "Brandy"),
    # Limpieza y hogar (L122)
    ("L122", "Limpieza y hogar"), ("L2170", "Cuidado de la ropa"), ("L2167", "Lavavajillas"),
    ("L2168", "Papel higiénico, de cocina, servilletas"), ("L2159", "Utensilios de limpieza"), ("L2160", "Bolsas de basura"),
    ("L2161", "Lejía y otros químicos"), ("L2162", "Cristales y suelos"), ("L2163", "Limpia muebles y multiusos"),
    ("L2164", "Limpieza baño y WC"), ("L2166", "Limpieza cocina y vitrocerámica"),
    ("L2169", "Papel de aluminio, horno y film"), ("L2173", "Insecticidas"), ("L2226", "Ambientadores"),
    ("L2171", "Calzado"), ("L2209", "Útiles del hogar, pilas, bombillas"),
    # Perfumería, higiene, salud (L121)
    ("L121", "Perfumería, higiene, salud"), ("L2153", "Hidratación corporal"), ("L2211", "Gel de ducha y esponjas"),
    ("L2151", "Cuidado bucal"), ("L2154", "Desodorantes"), ("L2144", "Champú"),
    ("L2145", "Acondicionadores y mascarillas"), ("L2146", "Espumas y fijadores"), ("L2147", "Tintes"),
    ("L2148", "Limpieza facial, crema facial"), ("L2186", "Quitaesmalte"), ("L2150", "Afeitado"),
    ("L2188", "Depilación"), ("L2155", "Colonias"), ("L2156", "Jabón de manos"), ("L2227", "Cremas solares"),
    ("L2158", "Compresas y cuidado íntimo"), ("L2183", "Complementos nutricionales"), ("L2184", "Parafarmacia"),
    # Bebé (L120)
    ("L120", "Bebé"), ("L2138", "Papilla"), ("L2139", "Leche para bebés"), ("L2141", "Potitos y tarritos"),
    ("L2140", "Yogures, bolsitas de frutas y snacks"), ("L2142", "Pañales y toallitas"), ("L2143", "Cuidado del bebé"),
    # Mascotas (L123)
    ("L123", "Mascotas"), ("L2174", "Perros"), ("L2175", "Gatos"), ("L2176", "Otros animales"),
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
    
    # Navegar solo por categorías principales (las subcategorías ya están incluidas en las respuestas)
    # Las categorías principales (L1xx) contienen las subcategorías (L2xxx) en sus respuestas
    main_categories = [cat for cat in DIA_ALL_CATEGORIES if cat[0].startswith('L1')]
    print(f"\n2. Navegando por {len(main_categories)} categorias principales...\n")
    print("   (Las subcategorias estan incluidas automaticamente en cada respuesta)\n")
    
    for i, (cat_id, cat_name) in enumerate(main_categories, 1):
        print(f"\n[{i}/{len(main_categories)}] {cat_name} - ID: {cat_id}")
        try:
            category_products = fetch_dia_category_products(cat_id, cat_name)
            
            # Agregar productos únicos
            for product in category_products:
                if product["id"] not in all_products:
                    all_products[product["id"]] = product
            
            print(f"   Subtotal categoria: {len(category_products)} productos")
            print(f"   Total acumulado: {len(all_products)} productos unicos")
            
            # Delay entre categorías para evitar rate limiting
            if i < len(main_categories):
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
