import React, { useState } from "react";
import ProductModal from "./ProductModal";

const FavoriteProduct = ({ product, favoriteId, onRemoveFavorite }) => {
    const [showModal, setShowModal] = useState(false);

    if (!product?.id) return null;

    const imageUrl = product.image || 'https://placehold.co/150x150?text=No+Image';
    const productName = product.name || product.title || "Sin nombre";
    const productPrice = product.price || 0;
    const productRating = product.rate || product.rating || 0;

    // ✅ Función para manejar cuando se elimina desde el modal
    const handleFavoriteRemovedFromModal = (removedFavoriteId) => {
        setShowModal(false);
        
        if (onRemoveFavorite) {
            onRemoveFavorite(removedFavoriteId);
        }
    };

    return (
        <>
            {/* Card simple */}
            <div className="col-lg-3 col-md-4 col-sm-6 p-3">
                <div className="card h-100">
                    <img src={imageUrl} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{productName}</h5>
                        <div className="text-center mb-3">
                            <div className="text-warning">⭐ {productRating}/5</div>
                            <div className="fs-5 fw-bold">${productPrice}</div>
                        </div>
                        <div className="mt-auto">
                            <button className="btn btn-primary w-100" onClick={() => setShowModal(true)}>
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal con callback de eliminación */}
            <ProductModal
                product={product}
                show={showModal}
                onClose={() => setShowModal(false)}
                mode="favorite"
                onFavoriteRemoved={handleFavoriteRemovedFromModal}
            />
        </>
    );
};

export default FavoriteProduct;