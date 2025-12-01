"""
Módulo de Favoritos - Rutas para agregar, listar y eliminar productos favoritos del usuario.
"""
from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, Product, Favorite, Store, FavoriteComparison
from datetime import datetime

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/favorites', methods=['POST'])
@jwt_required()
def add_favorite():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        print(f"🔍 DEBUG - User ID: {user_id}")
        print(f"🔍 DEBUG - Data received: {data}")
        
        product_id = data.get('product_id')
        store_id = data.get('store_id')
        date_ad = data.get('date_ad')

        if not product_id or not store_id:
            print("❌ DEBUG - Missing product_id or store_id")
            return jsonify({'msg': 'Faltan datos: se requiere product_id y store_id'}), 400

        # Verificar que el producto existe
        product = Product.query.get(product_id)
        if not product:
            print(f"❌ DEBUG - Product {product_id} not found")
            return jsonify({'msg': 'Producto no encontrado'}), 404

        # Verificar que la tienda existe
        store = Store.query.get(store_id)
        if not store:
            print(f"❌ DEBUG - Store {store_id} not found")
            return jsonify({'msg': 'Tienda no encontrada'}), 404

        # Verificar si ya existe el favorito
        existing_favorite = Favorite.query.filter_by(
            user_id=user_id,
            product_id=product_id
        ).first()

        if existing_favorite:
            print(f"⚠️ DEBUG - Favorite already exists")
            return jsonify({'msg': 'El producto ya está en favoritos'}), 409

        # Convertir la fecha de string a objeto date de Python
        if isinstance(date_ad, str):
            try:
                date_ad = datetime.strptime(date_ad, '%Y-%m-%d').date()
                print(f"✅ DEBUG - Date converted: {date_ad}")
            except ValueError as e:
                print(f"❌ DEBUG - Invalid date format: {date_ad}")
                return jsonify({'msg': 'Formato de fecha inválido. Use YYYY-MM-DD'}), 400

        favorite = Favorite(
            user_id=user_id,
            product_id=product_id,
            store_id=store_id,
            date_ad=date_ad
        )

        db.session.add(favorite)
        db.session.commit()
        
        print(f"✅ DEBUG - Favorite added successfully with ID: {favorite.id}")
        return jsonify({'msg': 'Producto agregado a favoritos', 'favorite_id': favorite.id}), 201
        
    except Exception as e:
        print(f"❌ ERROR in add_favorite: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


# ✅ CORREGIR ESTA FUNCIÓN - Usaba @app en lugar de @favorites_bp
@favorites_bp.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    try:
        user_id = get_jwt_identity()

        # Obtener favoritos del usuario
        favorites = Favorite.query.filter_by(user_id=user_id).all()

        # Usar el método serialize() que incluye store_name, category, main_category
        result = [favorite.serialize() for favorite in favorites]

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