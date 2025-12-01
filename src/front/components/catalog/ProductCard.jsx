import React from 'react';

const ProductCard = ({ product, isFavorite, onToggleFavorite, onViewComparisons }) => {
    // Construir URL de imagen completa para el proxy
    const getImageUrl = (image) => {
        if (!image) return 'https://via.placeholder.com/300';

        // Si la imagen es una ruta relativa (del proxy), agregarle el backend URL
        if (image.startsWith('/api/image-proxy')) {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
            // Asegurarse de que backendUrl no termine con /
            const cleanUrl = backendUrl.replace(/\/$/, '');
            return `${cleanUrl}${image}`;
        }

        // Si es una URL completa, devolverla tal cual
        return image;
    };

    const imageUrl = getImageUrl(product.image || product.img);

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
                    src={imageUrl}
                    alt={product.name}
                    className="card-img-top"
                    onError={(e) => {
                        console.error('❌ Error loading image:', imageUrl);
                        e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                    }}
                />
            </div>

            {/* Product Info */}
            <div className="card-body d-flex flex-column">
                <h6 className="card-title text-truncate mb-2" title={product.name}>
                    {product.name}
                </h6>

                <div className="mb-2 d-flex flex-wrap gap-1">
                    {product.main_category && (
                        <span className="badge bg-success" style={{ fontSize: '0.7rem' }}>
                            <i className="bi bi-grid-3x3-gap me-1"></i>
                            {product.main_category}
                        </span>
                    )}
                    <span className="badge bg-light text-dark" style={{ fontSize: '0.7rem' }}>
                        <i className="bi bi-tag me-1"></i>
                        {product.category || 'General'}
                    </span>
                </div>

                {product.store_name && (
                    <div className="mb-2 d-flex align-items-center">
                        <i className="bi bi-shop me-1 text-muted" style={{ fontSize: '0.75rem' }}></i>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {product.store_name}
                        </small>
                        {product.source === 'mercadona' && (
                            <span className="badge bg-success ms-2" style={{ fontSize: '0.65rem' }}>
                                Real
                            </span>
                        )}
                    </div>
                )}

                {product.rate && (
                    <div className="mb-2">
                        <span className="text-warning">
                            {'★'.repeat(Math.floor(product.rate))}
                            {'☆'.repeat(5 - Math.floor(product.rate))}
                        </span>
                        <small className="text-muted ms-1">({product.rate})</small>
                    </div>
                )}

                <div className="mt-auto">
                    <p className="h5 text-primary mb-3 text-center">
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
