import React from "react";
// productos destacados
export default function FeaturedProducts({ featured, onProductClick }) {
    return (
        <div className="row">
            {featured.map((product, index) => {
                // Usa images[0] si existe, si no usa image, si no un placeholder
                const imgSrc =
                    (product.images && product.images[0]) ||
                    product.image ||
                    "https://via.placeholder.com/200x200?text=Sin+Imagen";
                return (
                    <div
                        className="col-md-4 mb-4"
                        key={index}
                        onClick={() => onProductClick(product)}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="card h-100 shadow-sm">
                            <img
                                src={imgSrc}
                                className="card-img-top"
                                alt={product.title}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.name || product.title || "Producto sin nombre"}</h5>
                                <p className="card-text text-success">${product.price}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}