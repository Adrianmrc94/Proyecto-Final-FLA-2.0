import React from 'react';

const ProductCard = ({ product, isFavorite, onToggleFavorite, onViewComparisons }) => {
    return (
        <div className="product-catalog-card card h-100 border-0 shadow-sm">
            {/* Favorite Button */}
            <button
                className={`btn btn-sm favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={() => onToggleFavorite(product)}
            >
                <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
            </button>

            {/* Product Image */}
            <div className="product-image-wrapper">
                <img
                    src={product.image || product.img || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="card-img-top"
                />
            </div>

            {/* Product Info */}
            <div className="card-body d-flex flex-column">
                <h6 className="card-title text-truncate mb-2" title={product.name}>
                    {product.name}
                </h6>

                <div className="mb-2">
                    <span className="badge bg-light text-dark">
                        {product.category}
                    </span>
                </div>

                {product.rating && (
                    <div className="mb-2">
                        <span className="text-warning">
                            {'★'.repeat(Math.floor(product.rating))}
                            {'☆'.repeat(5 - Math.floor(product.rating))}
                        </span>
                        <small className="text-muted ms-1">({product.rating})</small>
                    </div>
                )}

                <div className="mt-auto">
                    <p className="h5 text-primary mb-3">
                        ${product.price?.toFixed(2)}
                    </p>

                    <button
                        className="btn btn-outline-primary w-100"
                        onClick={() => onViewComparisons(product)}
                    >
                        <i className="bi bi-arrow-left-right me-2"></i>
                        Ver Comparativas
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
