"""
Módulo de Comparativas Favoritas - Rutas para guardar, listar y gestionar comparativas de productos favoritas.
"""
from flask import request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, Product, FavoriteComparison

comparisons_bp = Blueprint('comparisons', __name__)


@comparisons_bp.route('/favorite-comparisons', methods=['POST'])
@jwt_required()
def add_favorite_comparison():
    """Guardar una comparativa de productos como favorita"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        name = data.get('name')
        product_ids = data.get('product_ids', [])
        
        if not name:
            return jsonify({'msg': 'El nombre de la comparativa es requerido'}), 400
        
        if not product_ids or len(product_ids) < 2:
            return jsonify({'msg': 'Se requieren al menos 2 productos para crear una comparativa'}), 400
        
        # Verificar que los productos existen
        products = Product.query.filter(Product.id.in_(product_ids)).all()
        if len(products) != len(product_ids):
            return jsonify({'msg': 'Uno o más productos no fueron encontrados'}), 404
        
        # Crear la comparativa favorita
        comparison = FavoriteComparison(
            user_id=user_id,
            name=name
        )
        
        # Agregar los productos a la comparativa
        comparison.products = products
        
        db.session.add(comparison)
        db.session.commit()
        
        return jsonify({
            'msg': 'Comparativa guardada en favoritos',
            'comparison': comparison.serialize()
        }), 201
        
    except Exception as e:
        print(f"❌ ERROR in add_favorite_comparison: {str(e)}")
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@comparisons_bp.route('/favorite-comparisons', methods=['GET'])
@jwt_required()
def get_favorite_comparisons():
    """Obtener todas las comparativas favoritas del usuario"""
    try:
        user_id = get_jwt_identity()
        
        comparisons = FavoriteComparison.query.filter_by(user_id=user_id).all()
        
        return jsonify([comp.serialize() for comp in comparisons]), 200
        
    except Exception as e:
        print(f"❌ ERROR in get_favorite_comparisons: {str(e)}")
        return jsonify({'error': str(e)}), 500


@comparisons_bp.route('/favorite-comparisons/<int:comparison_id>', methods=['GET'])
@jwt_required()
def get_favorite_comparison(comparison_id):
    """Obtener una comparativa favorita específica"""
    try:
        user_id = get_jwt_identity()
        
        comparison = FavoriteComparison.query.filter_by(
            id=comparison_id,
            user_id=user_id
        ).first()
        
        if not comparison:
            return jsonify({'msg': 'Comparativa no encontrada'}), 404
        
        return jsonify(comparison.serialize()), 200
        
    except Exception as e:
        print(f"❌ ERROR in get_favorite_comparison: {str(e)}")
        return jsonify({'error': str(e)}), 500


@comparisons_bp.route('/favorite-comparisons/<int:comparison_id>', methods=['PUT'])
@jwt_required()
def update_favorite_comparison(comparison_id):
    """Actualizar el nombre de una comparativa favorita"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        comparison = FavoriteComparison.query.filter_by(
            id=comparison_id,
            user_id=user_id
        ).first()
        
        if not comparison:
            return jsonify({'msg': 'Comparativa no encontrada'}), 404
        
        name = data.get('name')
        if name:
            comparison.name = name
        
        db.session.commit()
        
        return jsonify({
            'msg': 'Comparativa actualizada',
            'comparison': comparison.serialize()
        }), 200
        
    except Exception as e:
        print(f"❌ ERROR in update_favorite_comparison: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@comparisons_bp.route('/favorite-comparisons/<int:comparison_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite_comparison(comparison_id):
    """Eliminar una comparativa favorita"""
    try:
        user_id = get_jwt_identity()
        
        comparison = FavoriteComparison.query.filter_by(
            id=comparison_id,
            user_id=user_id
        ).first()
        
        if not comparison:
            return jsonify({'msg': 'Comparativa no encontrada'}), 404
        
        db.session.delete(comparison)
        db.session.commit()
        
        return jsonify({'msg': 'Comparativa eliminada de favoritos'}), 200
        
    except Exception as e:
        print(f"❌ ERROR in delete_favorite_comparison: {str(e)}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
