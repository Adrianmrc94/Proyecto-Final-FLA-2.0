import React from "react";

export default function FeaturedProducts({ featured, onProductClick }) {
    return (
        <div className="row">
            {featured.map((product, index) => (
                <div
                    className="col-md-4 mb-4"
                    key={index}
                    onClick={() => onProductClick(product)}
                    style={{ cursor: "pointer" }}
                >
                    <div className="card h-100 shadow-sm">
                        <img
                            src={product.images[0]}
                            className="card-img-top"
                            alt={product.title}
                        />
                        <div className="card-body">
                            <h5 className="card-title">{product.title}</h5>
                            <p className="card-text text-success">${product.price}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}