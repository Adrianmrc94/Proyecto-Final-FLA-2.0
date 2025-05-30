// src/components/FavoriteProduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FavoriteProduct = ({ product }) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    // Comprobación para asegurarnos de que 'product' existe y tiene las propiedades esperadas
    if (!product || !product.id) {
        // Si el producto es inválido, no renderizamos nada o un placeholder
        // console.warn("FavoriteProduct recibió un producto inválido:", product);
        return null;
    }

    // dummyjson.com devuelve un array 'images'. Usaremos la primera.
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150?text=No+Image';
    const productName = product.title || "Nombre no disponible"; // 'title' en lugar de 'name'
    const productRating = product.rating || 0;
    const productDescription = product.description || "Descripción no disponible.";
    const productPrice = product.price || 0; // dummyjson tiene 'price'

    return (
        <div className="col-lg-3 col-md-4 col-sm-6 p-3 d-flex align-items-stretch">
            <div className="card p-3 w-100 d-flex flex-column">
                <div className="text-center">
                    <img
                        src={imageUrl}
                        className="img-fluid rounded mb-3"
                        alt={productName}
                        style={{ maxHeight: '150px', objectFit: 'contain' }} // Estilo para unificar tamaño de imagen
                    />
                    <h5>{productName}</h5> {/* Título del producto */}
                    <h6>Puntuación</h6>
                    <div className="text-warning fs-4 mb-2">
                        {productRating} ⭐ ({product.reviews ? product.reviews.length : 0} reseñas) {/* Ejemplo si tuvieras reviews */}
                    </div>
                </div>
                <div className="mt-auto text-center"> {/* mt-auto para empujar botones abajo */}
                    <button
                        className="btn btn-outline-warning mt-2"
                        onClick={() => setShowModal(true)}
                    >
                        ⭐ Ver Detalles
                    </button>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{productName} - Comparación</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-5 text-center">
                                        <img
                                            src={imageUrl}
                                            className="img-fluid rounded mb-3"
                                            alt={productName}
                                            style={{ maxHeight: '300px' }}
                                        />
                                    </div>
                                    <div className="col-md-7">
                                        <h6>Descripción</h6>
                                        <p className="text-muted">{productDescription}</p>

                                        <h6>Precio Actual</h6>
                                        <div className="border p-2 rounded mb-3">
                                            <p className="fs-4 fw-bold">{productPrice}€</p>
                                            <p><small>Descuento: {product.discountPercentage}%</small></p>
                                        </div>

                                        <h6 className="mt-3">Comparativa de precios</h6>
                                        <div className="d-flex justify-content-around border p-2 rounded">
                                            <div>
                                                <h6>Tienda Online</h6>
                                                <p>{productPrice}€</p>
                                            </div>
                                            <div>
                                                <h6>Tienda Local </h6>
                                                <p>{(productPrice * 1.1).toFixed(2)}€</p>
                                            </div>
                                        </div>

                                        <h6 className="mt-3">Gráfica de Precios (Historial)</h6>
                                        <div className="border p-3 rounded bg-light text-center">
                                            Espacio reservado para una gráfica 📊
                                            <p className="small mt-2">Próximamente: seguimiento de la evolución del precio.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FavoriteProduct;