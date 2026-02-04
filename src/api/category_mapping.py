"""
Sistema de mapeo de categorías a grupos principales
Agrupa las 413+ subcategorías en categorías principales para mejor navegación
ACTUALIZADO V2: Mapeo mejorado con matching prioritario y categorías ampliadas
"""

CATEGORY_GROUPS = {
    "Frutas y Verduras": [
        # Frutas
        "Fruta", "Manzana", "Plátano", "Naranja", "Limón", "Uva", "Pera", "Fresa", 
        "Melón", "Sandía", "Aguacate", "Kiwi", "Piña", "Melocotón", "Nectarina", 
        "Ciruela", "Cereza", "Albaricoque", "Mandarina", "Pomelo", "Mango",
        # Verduras y hortalizas
        "Verdura", "Tomate", "Lechuga", "Patata", "Cebolla", "Zanahoria",
        "Calabacín", "Berenjena", "Pimiento", "Pepino", "Champiñón", "Seta",
        "Brócoli", "Coliflor", "Espinaca", "Acelga", "Judía verde", "Guisante",
        "Alcachofa", "Espárrago", "Apio", "Puerro", "Nabo", "Remolacha",
        "Col", "Calabaza", "Rábano", "Endibia", "Canónigos", "Rúcula",
        "Otras verduras y hortalizas", "Ajo y ajos preparados", "Ensalada preparada",
        "Ensalada", "IV Gama"
    ],
    
    "Carnes y Pescados": [
        # Carnes
        "Carne", "Pollo", "Cerdo", "Ternera", "Cordero", "Pavo", "Conejo",
        "Picada", "Hamburguesa", "Hamburguesas", "Salchicha", "Chorizo", 
        "Jamón", "Bacon", "Jamón serrano", "Jamón cocido", "Salchichón", 
        "Paté", "Pavo y otros", "Lomo", "Costilla", "Solomillo", "Filete",
        "Embutido", "Morcilla", "Butifarra", "Fuet", "Mortadela",
        # Pescados
        "Pescado", "Merluza", "Salmón", "Bacalao", "Atún", "Dorada", "Lubina",
        "Pescadilla", "Lenguado", "Rape", "Rodaballo", "Sardina", "Boquerón",
        "Anchoa", "Ahumados", "Pescado rebozado", "Surimi",
        # Mariscos
        "Marisco", "Gamba", "Langostino", "Calamar", "Pulpo", "Mejillón",
        "Sepia", "Almeja", "Berberecho", "Navajas"
    ],
    
    "Lácteos y Huevos": [
        # Leche
        "Leche", "Leche entera", "Leche desnatada", "Leche semidesnatada", 
        "Leche condensada", "Leche en polvo", "Leche Infantil", "Bebida vegetal",
        "Bebidas vegetales", "Leche sin lactosa",
        # Yogures
        "Yogur", "Yogures desnatados", "Yogures líquidos", "Yogures y postres",
        "Yogur griego", "Yogur natural", "Yogur sabores",
        # Quesos
        "Queso", "Queso fresco", "Queso curado", "Queso semicurado", "Queso rallado",
        "Requesón", "Crema de queso", "Mozzarella", "Parmesano", "Gouda",
        "Queso lonchas", "Queso en porciones", "Queso azul", "Queso de cabra",
        "Queso tierno", "Queso manchego", "Queso brie", "Queso emmental",
        # Otros lácteos
        "Mantequilla", "Margarina", "Nata", "Batido", "Cuajada", 
        "Natillas", "Flan", "Otros postres", "Chocolate con leche",
        # Huevos
        "Huevo", "Huevos"
    ],
    
    "Panadería y Pastelería": [
        # Pan
        "Pan", "Pan de molde", "Pan de bocadillo", "Pan de hamburguesa", 
        "Pan integral", "Pan tostado", "Tostada", "Biscote", "Picos",
        # Bollería
        "Bollería", "Bollería dulce", "Bollería envasada", "Croissant", 
        "Napolitana", "Palmera", "Donut", "Ensaimada", "Magdalena", "Bizcocho",
        # Galletas y cereales
        "Galleta", "Galletas desayuno", "Con chocolate y rellenas",
        "Cereales", "Cereales integrales", "Muesli", "Barrita",
        # Masas y pastelería
        "Pasta quebrada", "Hojaldre", "Pizza", "Pizzas refrigeradas",
        "Pastel", "Tortita", "Wrap", "Snack dulce"
    ],
    
    "Despensa": [
        # Pasta y arroz
        "Arroz", "Pasta", "Macarrones", "Espagueti", "Pajaritas", "Hélices",
        "Fideos", "Tallarines", "Lasaña", "Ravioli", "Ñoquis",
        # Legumbres
        "Legumbre", "Lenteja", "Garbanzo", "Alubia", "Alubias", "Judía",
        # Básicos
        "Harina", "Azúcar", "Sal", "Levadura", "Preparado repostería",
        # Aceites y condimentos
        "Aceite", "Aceite de oliva", "Vinagre", "Especias", "Condimento",
        "Otras especias",
        # Conservas
        "Conserva", "Lata", "Conservas verdura", "Tomate frito", 
        "Tomate triturado", "Sofrito", "Platos de cuchara",
        "Aceitunas verdes", "Aceitunas negras", "Pepinillos", "Encurtidos",
        "Cremas y puré", "Crema de verduras", "Puré",
        # Salsas
        "Salsa", "Mayonesa", "Ketchup", "Mostaza", "Allioli", "Otras salsas",
        # Caldos
        "Caldo", "Caldo de pollo", "Caldo de verduras", "Caldo de pescado",
        # Infusiones y café
        "Café", "Café molido", "Café soluble", "Cápsulas compatibles",
        "Té", "Infusión", "Cola cao", "Cacao",
        # Dulces para untar
        "Miel", "Mermelada", "Nocilla", "Crema de cacao", "Confitura"
    ],
    
    "Bebidas": [
        # Agua
        "Agua", "Agua con gas", "Agua sin gas", "Agua mineral",
        # Refrescos
        "Refresco", "Cola", "Cola zero", "Limón", "Naranja gas",
        # Zumos
        "Zumo", "Néctar", "Zumo natural", "Zumo concentrado",
        # Bebidas especiales
        "Bebida isotónica", "Bebida energética", "Isotónico", "Energético",
        "Horchata", "Tinto de verano", "Sangría",
        # Alcohol
        "Cerveza", "Cerveza lata", "Cerveza botella", "Cerveza botellín",
        "Vino", "Vino tinto", "Vino blanco", "Vino rosado", "Cava",
        "Licor", "Ginebra", "Ron", "Vodka", "Whisky", "Anís", "Vermut"
    ],
    
    "Congelados": [
        # Preparados
        "Congelado", "Pizza congelada", "Lasaña congelada", "Croqueta",
        "Empanadilla", "Nugget", "San jacobo", "Varitas", "Fingers",
        "Canelones de carne", "Lasaña", "Lasaña boloñesa", "Lasaña de atún",
        "Pasta con pollo", "ultracongelada", "ultracongelado",
        # Ingredientes
        "Verdura congelada", "Pescado congelado", "Marisco congelado",
        "Patata congelada", "Fruta congelada",
        # Postres
        "Helado", "Postre helado", "Tarrina", "Polo", "Sorbete"
    ],
    
    "Snacks y Dulces": [
        # Snacks salados
        "Patata chip", "Patata frita", "Patatas fritas", "Snack", "Aperitivo", 
        "Corteza", "Gusanitos", "Palomitas", "Nachos", "Doritos",
        # Frutos secos
        "Fruto seco", "Frutos secos", "Almendra", "Nuez", "Pistacho", 
        "Cacahuete", "Anacardo", "Avellana", "Pipas",
        # Dulces
        "Caramelo", "Chicle", "Piruleta", "Regaliz", "Gominola", "Golosinas",
        # Chocolate
        "Chocolatina", "Chocolatinas", "Chocolate negro", "Chocolate blanco",
        "Con chocolate", "Bombones",
        # Dulces navideños
        "Turrón", "Turrones", "Polvorón", "Polvorones", "Mazapán"
    ],
    
    "Bebé": [
        # Alimentación
        "Alimentación bebé", "Papilla", "Potito", "Galleta bebé", 
        "Cereales bebé", "Leche infantil", "Biberón",
        # Higiene
        "Pañal", "Toallita bebé", "Toallitas", "Colonia bebé", 
        "Gel bebé", "Champú bebé", "Crema bebé", "Crema pañal"
    ],
    
    "Mascotas": [
        # Alimentación
        "Alimentación seca", "Alimentación húmeda", "Snack mascotas",
        "Comida perro", "Comida gato", "Pienso",
        # Accesorios
        "Arena gatos", "Higiene mascotas", "Antiparasitario", 
        "Juguete mascotas", "Collar", "Correa"
    ],
    
    "Limpieza": [
        # Limpieza general
        "Limpiador", "Fregasuelos", "Limpiahogar", "Multiusos",
        "Lavavajillas", "Detergente", "Suavizante", "Lejía", "Amoníaco", 
        "Salfumán", "Quitamanchas", "Limpiahornos", "Limpiacristales", 
        "Desengrasante", "Desatascador", "Antihumedad", "Absorbeolores",
        "Limpieza baño", "Antical lavadora", "Activador", "WC",
        # Utensilios
        "Bayeta", "Estropajo", "Guante", "Recambio", "Fregona", "Escoba",
        # Papel
        "Bolsa basura", "Papel cocina", "Papel higiénico", "Pañuelo", 
        "Servilleta", "Papel", "Rollo cocina",
        # Vajilla desechable
        "Cubiertos", "Vajilla", "Mantel", "Vaso desechable", "Plato desechable"
    ],
    
    "Higiene y Belleza": [
        # Higiene corporal
        "Gel", "Gel de baño", "Jabón", "Champú", "Acondicionador", 
        "Mascarilla capilar", "Espuma y laca", "Tinte", "Coloración",
        "Rubio", "Castaño", "Rojo", "Cobre", "Negro",
        # Desodorantes
        "Desodorante", "Desodorante Spray", "Desodorante roll on", "Stick",
        # Cremas y cuidado
        "Crema", "Crema corporal", "Crema facial", "Crema de cara",
        "Loción", "Aceite corporal", "Hidratante", "Sérum",
        "Protección solar", "Bronceador", "After sun",
        # Higiene bucal
        "Pasta dental", "Pasta de dientes", "Cepillo dental", 
        "Hilo dental", "Enjuague", "Colutorio",
        # Afeitado
        "Maquinilla", "Espuma afeitar", "After shave", "Cuchilla",
        # Perfumería
        "Colonia", "Perfume", "Perfume y colonia mujer", 
        "Perfume y colonia hombre", "Perfume mujer", "Perfume hombre",
        # Maquillaje
        "Pintalabios", "Maquillaje fluido", "Sombra de ojos", 
        "Perfilador de ojos", "Correctores", "Laca de uñas",
        "Brillos", "Mate", "Prebase", "Base", "Rímel", "Máscara",
        "Desmaquillante", "Limpieza de cara", "Mascarilla facial",
        "Colorete", "Blush",
        # Higiene femenina
        "Compresas", "Tampón", "Salvaslip", "Protegeslips",
        # Accesorios
        "Algodón", "Disco desmaquillante", "Bastoncillo", "Pañuelo papel",
        # Salud
        "Botiquín", "Fitoterapia", "Vendas", "Tiritas", "Analgésico"
    ],
    
    "Hogar": [
        # Ambientadores
        "Ambientador", "Ambientador spray", "Ambientador eléctrico", 
        "Ambientador automático", "Ambientador decorativo", "Ambientador coche",
        "Vela", "Mikado",
        # Insecticidas
        "Insecticida", "Repelente", "Antimosquitos", "Raticida",
        "Mata cucarachas", "Trampa insectos",
        # Varios hogar
        "Pila", "Bombilla", "Mechero", "Cerilla", "Linterna",
        "Papel aluminio", "Film", "Papel horno", "Papel parafinado",
        "Pinza", "Arreglos", "Costura", "Pegamento"
    ]
}

# Lista de coincidencias exactas prioritarias (se buscan primero)
EXACT_MATCHES = {
    "Ensalada preparada": "Frutas y Verduras",
    "Arroz con leche": "Despensa",  # Evitar que vaya a Lácteos
    "Chocolate con leche": "Lácteos y Huevos",
    "Pan de molde": "Panadería y Pastelería",
    "Papel higiénico": "Limpieza",
    "Pasta de dientes": "Higiene y Belleza",
    "Patatas fritas": "Snacks y Dulces",
    "Frutos secos": "Snacks y Dulces",
    "Bebidas vegetales": "Lácteos y Huevos",
    "Colorete": "Higiene y Belleza",
    "Cremas y puré": "Despensa",
    "Cremas": "Despensa",
    "Cremas de untar": "Despensa",
    "Gel": "Higiene y Belleza",
    "Carne congelada": "Congelados",
    "Empanados y rebozados congelados": "Congelados",
    "Pasta": "Despensa",  # Por defecto Despensa, a menos que sea ultracongelado
    "Arroz": "Despensa",  # Por defecto Despensa, a menos que sea ultracongelado
}

def get_main_category(subcategory, product_name=None):
    """
    Devuelve la categoría principal para una subcategoría dada
    Usa matching prioritario: primero coincidencias exactas, luego substring
    Con lógica mejorada para productos ambiguos usando el nombre del producto
    
    Args:
        subcategory: Nombre de la subcategoría
        product_name: Nombre del producto (opcional, para resolución de ambigüedad)
        
    Returns:
        Nombre de la categoría principal o "Otros" si no se encuentra
    """
    if not subcategory:
        return "Otros"
    
    subcategory_normalized = subcategory.strip()
    subcategory_lower = subcategory_normalized.lower()
    
    # 1. PRIORIDAD MÁXIMA: Lógica especial para productos ultracongelados (antes de EXACT_MATCHES)
    if product_name:
        product_name_lower = product_name.lower()
        
        # Si la subcategoría es "Pasta" o "Arroz" y el producto está ultracongelado
        if subcategory_lower in ['pasta', 'arroz']:
            if 'ultracongelad' in product_name_lower or 'congelad' in product_name_lower:
                return "Congelados"
        
        # Si la subcategoría es genérica pero el producto tiene palabras clave de congelados
        congelado_keywords = ['ultracongelad', 'congelad', 'helad']
        if any(keyword in product_name_lower for keyword in congelado_keywords):
            # Verificar si no hay ya una categoría más específica de congelados
            if subcategory_lower not in ['helado', 'tarrina', 'polo', 'sorbete', 
                                         'empanados y rebozados congelados',
                                         'verdura congelada', 'pescado congelado',
                                         'marisco congelado', 'pasta de dientes']:
                return "Congelados"
    
    # 2. Buscar coincidencia exacta (case insensitive)
    for exact_key, main_cat in EXACT_MATCHES.items():
        if subcategory_lower == exact_key.lower():
            return main_cat
    
    # 3. Buscar por substring (orden prioritario: coincidencias más específicas primero)
    subcategory_lower = subcategory_normalized.lower()
    
    # Crear lista de coincidencias con longitud de la subcategoría mapeada
    matches = []
    for main_category, subcategories in CATEGORY_GROUPS.items():
        for sub in subcategories:
            sub_lower = sub.lower()
            
            # Evitar falsos positivos: "gel" no debe matchear "congelada"
            # Solo matchear si:
            # 1. La subcategoría contiene la palabra completa del mapping
            # 2. O es una coincidencia exacta (ya manejada arriba)
            
            # Coincidencia bidireccional con palabras completas
            if sub_lower in subcategory_lower:
                # Verificar que sea palabra completa o parte de una frase
                # "gel" no debe matchear dentro de "congelada"
                if sub_lower == subcategory_lower or ' ' + sub_lower in ' ' + subcategory_lower + ' ' or subcategory_lower.startswith(sub_lower + ' ') or subcategory_lower.endswith(' ' + sub_lower):
                    matches.append((main_category, len(sub)))
            elif subcategory_lower in sub_lower:
                # La subcategoría está contenida en el mapping
                if subcategory_lower == sub_lower or ' ' + subcategory_lower in ' ' + sub_lower + ' ' or sub_lower.startswith(subcategory_lower + ' ') or sub_lower.endswith(' ' + subcategory_lower):
                    matches.append((main_category, len(sub)))
    
    # Si hay coincidencias, devolver la que tiene la subcategoría más larga (más específica)
    if matches:
        matches.sort(key=lambda x: x[1], reverse=True)
        return matches[0][0]
    
    return "Otros"

def get_all_main_categories():
    """Devuelve la lista de todas las categorías principales"""
    return list(CATEGORY_GROUPS.keys()) + ["Otros"]

def get_subcategories_for_main(main_category):
    """
    Devuelve las subcategorías para una categoría principal
    
    Args:
        main_category: Nombre de la categoría principal
        
    Returns:
        Lista de subcategorías
    """
    return CATEGORY_GROUPS.get(main_category, [])
