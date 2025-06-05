import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FavoriteProduct = ({ product, onRemoveFavorite }) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

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
const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    
    const token = localStorage.getItem("token");
    if (!token) {
        setIsProcessing('error');
        setTimeout(() => setIsProcessing(false), 3000);
        return;
    }

    console.log('Procesando...'); // Debug
    setIsProcessing('loading');
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    try {
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
                setIsProcessing('removed');

                // PRIMERO mostrar el mensaje, DESPUÉS notificar al padre
                setTimeout(() => {
                    console.log('Reseteando estado...'); // Debug
                    setIsProcessing(false);
                    
                    // Notificar al padre DESPUÉS de mostrar el mensaje
                    if (onRemoveFavorite) {
                        onRemoveFavorite(favoriteId);
                    }
                }, 1000);
            } else {
                setIsProcessing('error');
                setTimeout(() => setIsProcessing(false), 3000);
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

                setIsProcessing('added');
                setTimeout(() => setIsProcessing(false), 3000);
            } else {
                setIsProcessing('error');
                setTimeout(() => setIsProcessing(false), 3000);
            }
        }
    } catch (error) {
        setIsProcessing('error');
        setTimeout(() => setIsProcessing(false), 3000);
    }
};

    // Prevenir cierre del modal al hacer click en el botón
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    // Función para obtener el contenido del botón según el estado
    const getButtonContent = () => {
        switch (isProcessing) {
            case 'loading':
                return {
                    className: "btn btn-secondary me-2",
                    content: (
                        <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <span className="d-none d-md-inline">Procesando...</span>
                        </>
                    ),
                    disabled: true
                };
            case 'added':
                return {
                    className: "btn btn-success me-2",
                    content: (
                        <>
                            <i className="bi bi-check-circle-fill me-2"></i>
                            <span className="d-none d-md-inline">¡Agregado! 💖</span>
                            <span className="d-md-none">💖</span>
                        </>
                    ),
                    disabled: true
                };
            case 'removed':
                return {
                    className: "btn btn-warning me-2",
                    content: (
                        <>
                            <i className="bi bi-check-circle-fill me-2"></i>
                            <span className="d-none d-md-inline">¡Eliminado! 💔</span>
                            <span className="d-md-none">💔</span>
                        </>
                    ),
                    disabled: true
                };
            case 'error':
                return {
                    className: "btn btn-danger me-2",
                    content: (
                        <>
                            <i className="bi bi-x-circle-fill me-2"></i>
                            <span className="d-none d-md-inline">
                                {!localStorage.getItem("token") ? "Inicia sesión" : "Error"}
                            </span>
                            <span className="d-md-none">❌</span>
                        </>
                    ),
                    disabled: true
                };
            default:
                return {
                    className: "btn btn-outline-danger me-2",
                    content: (
                        <>
                            <i className={isFavorite ? "bi bi-heart-fill" : "bi bi-heart"} style={{ fontSize: "2rem" }}></i>
                        </>
                    ),
                    disabled: false
                };
        }
    };

    const buttonConfig = getButtonContent();

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

            {showModal && (
                <div 
                    className="modal show shadow-lg d-block" 
                    tabIndex="-1" 
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                    onClick={() => setShowModal(false)} // Solo cerrar si se hace click en el backdrop
                >
                    <div 
                        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
                        onClick={handleModalClick} // Prevenir cierre al hacer click en el modal
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{productName} - Comparación</h5>
                                <div className="d-flex align-items-center">
                                    <button
                                        className={buttonConfig.className}
                                        onClick={handleToggleFavorite}
                                        disabled={buttonConfig.disabled}
                                        title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                                        style={{
                                            fontSize: "1.5rem",
                                            minWidth: '60px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {buttonConfig.content}
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
                                                <h6>Tienda Local</h6>
                                                <p>{(productPrice * 1.1).toFixed(2)}€</p>
                                            </div>
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