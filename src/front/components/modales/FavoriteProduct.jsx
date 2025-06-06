import React, { useState } from "react";
import ProductModal from "./ProductModal";

const FavoriteProduct = ({ product, favoriteId, onRemoveFavorite }) => {
    const [showModal, setShowModal] = useState(false);

    if (!product?.id) return null;

    // Normalización de datos
    const imageUrl = 
        (product.images && product.images[0]) ||
        product.image ||
        "https://via.placeholder.com/200x200?text=Sin+Imagen";
    
    const productName = product.name || product.title || "Sin nombre";
    const productPrice = product.price || 0;
    const productRating = product.rate || product.rating || 0;

    //Función para manejar cuando se elimina desde el modal
    const handleFavoriteRemovedFromModal = (removedFavoriteId) => {
        setShowModal(false);
        if (onRemoveFavorite) {
            onRemoveFavorite(removedFavoriteId);
        }
    };

    return (
        <>
            <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div
                    className="card h-100 shadow-sm product-card"
                    onClick={() => setShowModal(true)}
                    style={{ cursor: "pointer" }}
                >
                    {/* Contenedor de imagen con overlay */}
                    <div className="position-relative overflow-hidden">
                        <img
                            src={imageUrl}
                            className="card-img-top product-image"
                            alt={productName}
                            style={{ 
                                height: '200px', 
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                            }}
                            loading="lazy"
                        />
                        
                        <div className="product-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                            <button className="btn btn-primary btn-sm">
                                <i className="bi bi-eye me-1"></i>
                                Ver detalles
                            </button>
                        </div>
                        
                        <div className="position-absolute top-0 start-0 m-2">
                            <span className="badge bg-danger d-flex align-items-center">
                                <i className="bi bi-heart-fill me-1"></i>
                                Favorito
                            </span>
                        </div>
                    </div>

                    <div className="card-body d-flex flex-column">
                        <h5 
                            className="card-title text-truncate" 
                            title={productName}
                            style={{ fontSize: '1rem' }}
                        >
                            {productName}
                        </h5>
                        
                        {/* Rating si existe */}
                        {productRating > 0 && (
                            <div className="text-warning mb-2">
                                ⭐ {productRating}/5
                            </div>
                        )}
                        
                        <p className="card-text mt-auto text-center">
                            <span className="fs-5 fw-bold text-success">
                                ${productPrice}
                            </span>
                        </p>
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