import React from "react";

export default function FeaturedProducts({ featured, onProductClick, loading = false }) {
    if (loading) {
        return (
            <div className="row">
                {[...Array(8)].map((_, index) => (
                    <div className="col-md-3 mb-3" key={index}>
                        <div className="card h-100 shadow">
                            <div className="placeholder-glow">
                                <div
                                    className="placeholder card-img-top"
                                    style={{ height: '200px', backgroundColor: '#e9ecef' }}
                                ></div>
                            </div>
                            <div className="card-body">
                                <h5 className="placeholder-glow">
                                    <span className="placeholder col-8"></span>
                                </h5>
                                <p className="placeholder-glow">
                                    <span className="placeholder col-6"></span>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!featured || featured.length === 0) {
        return (
            <div className="text-center py-5">
                <i className="bi bi-box-seam display-1 text-muted mb-3"></i>
                <h4 className="text-muted">No hay productos destacados disponibles</h4>
                <p className="text-muted">Intenta recargar la página</p>
            </div>
        );
    }

    return (

        <div className="row">
            {featured.map((product, index) => {
                //  Normalización de datos
                const imageUrl =
                    (product.images && product.images[0]) ||
                    product.image ||
                    "https://via.placeholder.com/200x200?text=Sin+Imagen";

                const productName = product.name || product.title || "Producto sin nombre";
                const productPrice = product.price || 0;

                return (
                    <div
                        className="featured-products col-md-3 mb-3"
                        key={product.id || index}
                        onClick={() => onProductClick(product)}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="card h-100 shadow-sm product-card">
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

                                {/* Overlay al hacer hover */}
                                <div className="product-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                                    <button className="btn btn-primary btn-sm">
                                        <i className="bi bi-eye me-1"></i>
                                        Ver detalles
                                    </button>
                                </div>
                            </div>

                            <div className="card-body d-flex flex-column">
                                <h5
                                    className="card-title"
                                    title={productName}
                                    style={{
                                        fontSize: '1rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        lineHeight: '1.2',
                                        height: '2.4em',
                                        margin: '0 0 0.5rem 0'
                                    }}
                                >
                                    {productName}
                                </h5>

                                {/* Rating si existe */}
                                {(product.rate || product.rating) && (
                                    <div className="text-warning mb-2">
                                        ⭐ {product.rate || product.rating}/5
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
                );
            })}
        </div>
    );
}