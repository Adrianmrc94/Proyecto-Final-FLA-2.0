import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FavoriteProduct = ({ product, onRemoveFavorite }) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);

    if (!product || !product.id) return null;

    // Usa la estructura real de tu backend
    const imageUrl = product.image || (product.images && product.images[0]) || 'https://placehold.co/150x150?text=No+Image';
    const productName = product.name || product.title || "Nombre no disponible";
    const productRating = product.rate || product.rating || 0;
    const productDescription = product.description || "Descripción no disponible.";
    const productPrice = product.price || 0;

    // Detectar si el producto ya está en favoritos
    useEffect(() => {
        if (!showModal || !product) return;
        const checkFavorite = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsFavorite(false);
                setFavoriteId(null);
                return;
            }
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            try {
                const response = await fetch(`${BACKEND_URL}/api/favorites`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    const found = data.find(fav => fav.product_id === product.id);
                    setIsFavorite(!!found);
                    setFavoriteId(found ? found.id : null);
                } else {
                    setIsFavorite(false);
                    setFavoriteId(null);
                }
            } catch (e) {
                setIsFavorite(false);
                setFavoriteId(null);
            }
        };
        checkFavorite();
    }, [showModal, product]);

    // Función para agregar/quitar favorito
    const handleToggleFavorite = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Debes iniciar sesión para gestionar favoritos.");
            return;
        }
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

        if (isFavorite && favoriteId) {
            // Quitar de favoritos usando el id del favorito
            const response = await fetch(`${BACKEND_URL}/api/favorites/${favoriteId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                setIsFavorite(false);
                setFavoriteId(null);
                alert("Producto eliminado de favoritos");
                if (onRemoveFavorite) onRemoveFavorite(favoriteId); // Notifica al padre
                setShowModal(false); // Cierra el modal automáticamente
            } else {
                alert("No se pudo eliminar de favoritos");
            }
        } else {
            // Agregar a favoritos
            const body = {
                product_id: product.id,
                store_id: product.store_id,
                date_ad: new Date().toISOString().slice(0, 10)
            };
            const response = await fetch(`${BACKEND_URL}/api/favorites`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                setIsFavorite(true);
                // Actualiza el favoriteId después de agregar
                const favs = await fetch(`${BACKEND_URL}/api/favorites`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (favs.ok) {
                    const data = await favs.json();
                    const found = data.find(fav => fav.product_id === product.id);
                    setFavoriteId(found ? found.id : null);
                }
                alert("Producto agregado a favoritos");
            } else {
                alert("No se pudo agregar a favoritos");
            }
        }
    };

    return (
        <div className="col-lg-3 col-md-4 col-sm-6 p-3 d-flex align-items-stretch">
            <div className="card shadow-lg p-3 w-100 d-flex flex-column">
                <div className="text-center">
                    <img
                        src={imageUrl}
                        className="img-fluid rounded mb-3"
                        alt={productName}
                        style={{ maxHeight: '150px', objectFit: 'contain' }}
                    />
                    <h5>{productName}</h5>
                    <h6>Puntuación</h6>
                    <div className="text-warning fs-4 mb-2">
                        {productRating} ⭐
                    </div>
                </div>
                <div className="mt-auto text-center">
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
                <div className="modal show shadow-lg d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{productName} - Comparación</h5>
                                <div className="d-flex align-items-center">
                                    <button
                                        className="btn btn-outline-danger me-2"
                                        onClick={handleToggleFavorite}
                                        title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                                        style={{ fontSize: "1.5rem" }}
                                    >
                                        <i className={isFavorite ? "bi bi-heart-fill" : "bi bi-heart"} style={{ fontSize: "2rem" }}></i>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
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