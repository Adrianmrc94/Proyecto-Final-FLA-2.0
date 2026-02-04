from flask import request, jsonify, Blueprint
from api.models import db, Product, User, Store
from sqlalchemy.orm import joinedload
from sqlalchemy import or_
import random
from api.category_mapping import get_main_category, get_all_main_categories, get_subcategories_for_main
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request

products_bp = Blueprint('products', __name__)

recent_random_products = []
MAX_RECENT_PRODUCTS = 5

@products_bp.route('/products', methods=['GET'])
def get_products():
    price_min = request.args.get('price_min', type=float)
    price_max = request.args.get('price_max', type=float)
    category = request.args.get('category')
    main_category = request.args.get('main_category')
    store_id = request.args.get('store_id', type=int)

    query = Product.query.options(joinedload(Product.store))
    
    # Filtrar por código postal del usuario (si está autenticado)
    try:
        verify_jwt_in_request(optional=True)
        current_user_id = get_jwt_identity()
        print(f"🔍 Usuario autenticado: {current_user_id}")
        
        if current_user_id:
            user = User.query.get(current_user_id)
            print(f"👤 Usuario encontrado: {user.email if user else 'None'}")
            print(f"📮 Código postal del usuario: {user.postal_code if user else 'None'}")
            
            if user and user.postal_code:
                # Filtrar productos de tiendas que sirvan al código postal del usuario
                available_stores = Store.query.filter_by(postal_code=user.postal_code, is_active=True).all()
                print(f"🏪 Tiendas disponibles para CP {user.postal_code}: {len(available_stores)}")
                
                if available_stores:
                    store_ids = [store.id for store in available_stores]
                    print(f"🆔 IDs de tiendas: {store_ids}")
                    query = query.filter(Product.store_id.in_(store_ids))
                else:
                    print(f"⚠️ No hay tiendas para el código postal {user.postal_code}")
        else:
            print("👻 Usuario no autenticado - mostrando todos los productos")
    except Exception as e:
        # Si no está autenticado o hay error, mostrar todos los productos
        print(f"❌ Error en verificación JWT: {str(e)}")
        pass
    
    # Aplicar filtros
    if price_min is not None:
        query = query.filter(Product.price >= price_min)
    if price_max is not None:
        query = query.filter(Product.price <= price_max)
    if category:
        query = query.filter(Product.category.ilike(f'%{category}%'))
    if store_id:
        query = query.filter(Product.store_id == store_id)
    
    # Filtro por categoría principal
    if main_category:
        main_cat = main_category.replace("-", " ").strip()
        if main_cat == "Otros":
            # Filtrar productos sin categoría mapeada
            all_products = query.all()
            products = [p for p in all_products if get_main_category(p.category) == "Otros"]
            return jsonify([p.serialize() for p in products]), 200
        else:
            # Obtener subcategorías del grupo
            subcats = get_subcategories_for_main(main_cat)
            filters = [Product.category.ilike(f'%{subcat}%') for subcat in subcats]
            query = query.filter(or_(*filters)) if filters else query

    products = query.order_by(Product.rate.desc()).all()
    return jsonify([p.serialize() for p in products]), 200

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'msg': 'Producto no encontrado'}), 404
    return jsonify(product.serialize()), 200

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Devuelve todas las subcategorías únicas"""
    categories = db.session.query(Product.category).distinct().all()
    category_list = [c[0] for c in categories if c[0]]
    return jsonify(sorted(category_list)), 200

@products_bp.route('/main-categories', methods=['GET'])
def get_main_categories():
    """Devuelve las categorías principales agrupadas"""
    main_cats = get_all_main_categories()
    
    # Contar productos por categoría principal
    result = []
    for main_cat in main_cats:
        # Contar productos que pertenecen a esta main_category considerando sus nombres
        all_products = Product.query.all()
        count = sum(1 for p in all_products if get_main_category(p.category, p.name) == main_cat)
        
        if count > 0:  # Solo incluir categorías con productos
            result.append({
                "name": main_cat,
                "count": count
            })
    
    return jsonify(sorted(result, key=lambda x: x['count'], reverse=True)), 200

@products_bp.route('/main-categories/<string:main_category>/subcategories', methods=['GET'])
def get_subcategories_by_main(main_category):
    """Devuelve las categorías reales de BD para una categoría principal"""
    # Normalizar nombre
    main_cat = main_category.replace("-", " ").strip()
    
    # Obtener tiendas disponibles según el código postal del usuario
    store_ids = []
    try:
        verify_jwt_in_request(optional=True)
        current_user_id = get_jwt_identity()
        
        if current_user_id:
            user = User.query.get(current_user_id)
            if user and user.postal_code:
                stores = Store.query.filter_by(postal_code=user.postal_code).all()
                store_ids = [s.id for s in stores]
    except:
        pass
    
    # Obtener todas las categorías únicas de la BD
    all_categories = db.session.query(Product.category).distinct().all()
    
    result = []
    for cat_tuple in all_categories:
        category = cat_tuple[0]
        if not category:
            continue
        
        # Obtener productos de esta categoría
        query = Product.query.filter(Product.category == category)
        if store_ids:
            query = query.filter(Product.store_id.in_(store_ids))
        
        products_in_category = query.all()
        
        # Contar cuántos productos de esta categoría pertenecen a la main_category buscada
        count = 0
        for product in products_in_category:
            product_main_cat = get_main_category(category, product.name)
            if main_cat == "Otros":
                if product_main_cat == "Otros":
                    count += 1
            else:
                if product_main_cat == main_cat:
                    count += 1
        
        if count > 0:
            result.append({"name": category, "count": count})
    
    return jsonify(sorted(result, key=lambda x: x['count'], reverse=True)), 200

@products_bp.route('/products/category/<string:category>', methods=['GET'])
def get_products_by_category(category):
    normalized = category.replace("-", " ").strip().lower()
    products = Product.query.options(joinedload(Product.store)).filter(
        Product.category.ilike(f'%{normalized}%')
    ).all()
    return jsonify([p.serialize() for p in products]), 200

@products_bp.route('/products/compare', methods=['POST'])
def compare_products():
    data = request.get_json()
    product_ids = data.get('product_ids', [])
    
    if not product_ids or not isinstance(product_ids, list):
        return jsonify({'msg': 'Debes enviar una lista de IDs de productos'}), 400

    # Aplicar filtro por código postal si el usuario está autenticado
    query = Product.query.options(joinedload(Product.store)).filter(Product.id.in_(product_ids))
    
    verify_jwt_in_request(optional=True)
    current_user_id = get_jwt_identity()
    
    if current_user_id:
        user = User.query.get(current_user_id)
        if user and user.postal_code:
            print(f"🔍 Comparación - Usuario: {user.email}, CP: {user.postal_code}")
            available_stores = Store.query.filter_by(postal_code=user.postal_code, is_active=True).all()
            store_ids = [s.id for s in available_stores]
            print(f"🏪 Tiendas disponibles: {[s.name for s in available_stores]}")
            if store_ids:
                query = query.filter(Product.store_id.in_(store_ids))
            else:
                print(f"⚠️ No hay tiendas para CP {user.postal_code} - devolviendo lista vacía")
                return jsonify([]), 200
    
    products = query.all()
    return jsonify([p.serialize() for p in products]), 200

@products_bp.route('/search', methods=['GET'])
def search_products():
    query = request.args.get('query', '')
    category = request.args.get('category', '')
    filters = []

    if query:
        filters.append(or_(
            Product.name.ilike(f'%{query}%'),
            Product.description.ilike(f'%{query}%'),
            Product.category.ilike(f'%{query}%')
        ))

    if category:
        normalized = category.replace("-", " ").strip().lower()
        filters.append(Product.category.ilike(f'%{normalized}%'))

    query_builder = Product.query.options(joinedload(Product.store)).filter(*filters) if filters else Product.query.options(joinedload(Product.store))
    
    # Aplicar filtro por código postal si el usuario está autenticado
    verify_jwt_in_request(optional=True)
    current_user_id = get_jwt_identity()
    
    if current_user_id:
        user = User.query.get(current_user_id)
        if user and user.postal_code:
            print(f"🔍 Búsqueda - Usuario: {user.email}, CP: {user.postal_code}")
            available_stores = Store.query.filter_by(postal_code=user.postal_code, is_active=True).all()
            store_ids = [s.id for s in available_stores]
            if store_ids:
                query_builder = query_builder.filter(Product.store_id.in_(store_ids))
    
    products = query_builder.all()
    return jsonify([p.serialize() for p in products]), 200

@products_bp.route('/random-product', methods=['GET'])
def get_random_product():
    global recent_random_products
    
    exclude_ids = request.args.getlist('exclude_ids', type=int)
    all_exclude_ids = set(exclude_ids + recent_random_products)
    
    query = Product.query.options(joinedload(Product.store))
    
    # Aplicar filtro por código postal si el usuario está autenticado
    verify_jwt_in_request(optional=True)
    current_user_id = get_jwt_identity()
    
    if current_user_id:
        user = User.query.get(current_user_id)
        if user and user.postal_code:
            available_stores = Store.query.filter_by(postal_code=user.postal_code, is_active=True).all()
            store_ids = [s.id for s in available_stores]
            if store_ids:
                query = query.filter(Product.store_id.in_(store_ids))
    
    if all_exclude_ids:
        query = query.filter(~Product.id.in_(all_exclude_ids))
    
    products = query.all()
    
    # Si no hay productos disponibles, limpiar historial
    if not products:
        recent_random_products = []
        products = Product.query.options(joinedload(Product.store)).all()
        if not products:
            return jsonify({'msg': 'No hay productos disponibles'}), 404
    
    product = random.choice(products)
    
    # Actualizar historial
    recent_random_products.append(product.id)
    if len(recent_random_products) > MAX_RECENT_PRODUCTS:
        recent_random_products.pop(0)
    
    return jsonify(product.serialize()), 200