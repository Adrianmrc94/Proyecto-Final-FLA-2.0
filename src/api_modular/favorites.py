"""
Módulo de Favoritos - Rutas para agregar, listar y eliminar productos favoritos del usuario.
"""
from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, Product, Favorite, Store

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    data = request.get_json()
    product_id = data.get('product_id')
    store_id = data.get('store_id')
    date_ad = data.get('date_ad')

    if not product_id or not store_id:
        return jsonify({'msg': 'Faltan datos: se requiere product_id y store_id'}), 400

    # Verificar que el producto existe
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'msg': 'Producto no encontrado'}), 404

    # Verificar que la tienda existe
    store = Store.query.get(store_id)
    if not store:
        return jsonify({'msg': 'Tienda no encontrada'}), 404

    # Verificar si ya existe el favorito
    existing_favorite = Favorite.query.filter_by(
        user_id=user_id,
        product_id=product_id
    ).first()

    if existing_favorite:
        return jsonify({'msg': 'El producto ya está en favoritos'}), 409

    favorite = Favorite(
        user_id=user_id,
        product_id=product_id,
        store_id=store_id,
        date_ad=date_ad
    )

    db.session.add(favorite)
    db.session.commit()
    return jsonify({'msg': 'Producto agregado a favoritos', 'favorite_id': favorite.id}), 201


# ✅ CORREGIR ESTA FUNCIÓN - Usaba @app en lugar de @favorites_bp
@favorites_bp.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    try:
        user_id = get_jwt_identity()

        # JOIN para incluir datos del producto
        favorites = db.session.query(Favorite, Product).join(
            Product, Favorite.product_id == Product.id
        ).filter(Favorite.user_id == user_id).all()

        result = []
        for favorite, product in favorites:
            # ✅ Usar getattr() para manejar campos que pueden no existir
            result.append({
                'id': favorite.id,
                'date_ad': favorite.date_ad,
                'product': {
                    'id': product.id,
                    'name': getattr(product, 'name', None),
                    'title': getattr(product, 'title', getattr(product, 'name', 'Sin nombre')),  # Fallback
                    'price': getattr(product, 'price', 0),
                    'image': getattr(product, 'image', None),
                    'description': getattr(product, 'description', 'Sin descripción'),
                    'rating': getattr(product, 'rating', 0),
                    'rate': getattr(product, 'rate', getattr(product, 'rating', 0))  # Fallback
                }
            })

        return jsonify(result), 200

    except Exception as e:
        print(f"❌ Error in get_favorites: {str(e)}")  # Debug
        return jsonify({'error': str(e)}), 500


@favorites_bp.route('/favorites/<int:favorite_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite(favorite_id):
    user_id = get_jwt_identity()
    favorite = Favorite.query.filter_by(
        id=favorite_id, user_id=user_id).first()

    if not favorite:
        return jsonify({'msg': 'Favorito no encontrado'}), 404

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({'msg': 'Favorito eliminado'}), 200


@favorites_bp.route('/favorites/product/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite_by_product(product_id):
    user_id = get_jwt_identity()
    favorite = Favorite.query.filter_by(
        product_id=product_id, user_id=user_id).first()

    if not favorite:
        return jsonify({'msg': 'Favorito no encontrado'}), 404

    db.session.delete(favorite)
    db.session.commit()
    return jsonify({'msg': 'Favorito eliminado'}), 200