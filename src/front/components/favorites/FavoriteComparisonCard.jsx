import React, { useState, useEffect } from 'react';
import useDarkMode from '../../hooks/useDarkMode';
import ApiService from '../../services/api';

const FavoriteComparisonCard = ({ comparison, onDelete, onUpdate }) => {
    const { darkMode } = useDarkMode();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(comparison.name);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

    // Cargar favoritos al montar el componente
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const favorites = await ApiService.fetchFavorites();
                const ids = new Set(favorites.map(fav => fav.product.id));
                setFavoriteIds(ids);
            } catch (error) {
                console.error('Error loading favorites:', error);
            } finally {
                setIsLoadingFavorites(false);
            }
        };
        loadFavorites();
    }, []);

    const isFavorite = (productId) => {
        return favoriteIds.has(productId);
    };

    const handleSave = () => {
        if (newName.trim() && newName !== comparison.name) {
            onUpdate(comparison.id, newName.trim());
        }
        setIsEditing(false);
    };

    const handleToggleFavorite = async (product) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Debes iniciar sesión');
                return;
            }

            if (isFavorite(product.id)) {
                // Buscar el favoriteId para eliminarlo
                const favorites = await ApiService.fetchFavorites();
                const found = favorites.find(fav => fav.product.id === product.id);
                if (found) {
                    await ApiService.removeFavorite(found.id);
                    setFavoriteIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(product.id);
                        return newSet;
                    });
                }
            } else {
                // Agregar a favoritos
                const favoriteData = {
                    product_id: product.id,
                    store_id: product.store_id || 1,
                    date_ad: new Date().toISOString().slice(0, 10)
                };
                await ApiService.addFavorite(favoriteData);
                setFavoriteIds(prev => new Set([...prev, product.id]));
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            alert('Error al actualizar favoritos');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha desconocida';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return 'Fecha desconocida';
        }
    };

    return (
        <>
            <div className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                    <div className="card-body">
                        {isEditing ? (
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                                    autoFocus
                                />
                                <div className="mt-2">
                                    <button className="btn btn-sm btn-success me-2" onClick={handleSave}>
                                        <i className="bi bi-check-lg"></i> Guardar
                                    </button>
                                    <button className="btn btn-sm btn-secondary" onClick={() => {
                                        setNewName(comparison.name);
                                        setIsEditing(false);
                                    }}>
                                        <i className="bi bi-x-lg"></i> Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h5 className="card-title mb-0">
                                    <i className="bi bi-bar-chart-fill text-primary me-2"></i>
                                    {comparison.name}
                                </h5>
                                <div className="btn-group btn-group-sm">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => setIsEditing(true)}
                                        title="Editar nombre"
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button
                                        className="btn btn-outline-danger"
                                        onClick={() => onDelete(comparison.id)}
                                        title="Eliminar comparativa"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        <p className="text-muted small mb-3">
                            <i className="bi bi-calendar3 me-1"></i>
                            Guardada el {formatDate(comparison.created_at)}
                        </p>

                        <div className="mb-3">
                            <h6 className="text-muted small mb-2">
                                <i className="bi bi-box-seam me-1"></i>
                                Productos ({comparison.products?.length || 0})
                            </h6>
                            <div className="row g-2">
                                {comparison.products?.slice(0, 4).map((product, idx) => (
                                    <div key={product.id} className="col-6">
                                        <div className="d-flex align-items-center gap-2">
                                            <img
                                                src={product.image || 'https://via.placeholder.com/40'}
                                                alt={product.name}
                                                className="rounded"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                <p className="mb-0 small text-truncate" title={product.name}>
                                                    {product.name}
                                                </p>
                                                <p className="mb-0 small text-success fw-bold">
                                                    ${product.price}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {comparison.products?.length > 4 && (
                                <p className="text-muted small mt-2 mb-0">
                                    +{comparison.products.length - 4} producto(s) más
                                </p>
                            )}
                        </div>

                        <button
                            className="btn btn-primary w-100"
                            onClick={() => setShowDetailsModal(true)}
                        >
                            <i className="bi bi-eye me-2"></i>
                            Ver Comparativa
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal con comparativa completa de productos guardados */}
            {showDetailsModal && comparison.products && comparison.products.length >= 2 && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className={`modal-content ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
                            <div className="modal-header border-0">
                                <h4 className="modal-title fw-bold">
                                    <i className="bi bi-bar-chart-fill me-2 text-primary"></i>
                                    {comparison.name}
                                </h4>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDetailsModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body px-4">
                                {/* Mostrar los primeros 2 productos */}
                                {(() => {
                                    const [p1, p2] = comparison.products;
                                    return (
                                        <>
                                            {/* Sección de productos con imágenes y botón de favoritos */}
                                            <div className="row mb-4">
                                                <div className="col-md-5">
                                                    <div className={`card ${darkMode ? 'bg-secondary text-light' : 'bg-white'} shadow-sm h-100 position-relative`}>
                                                        {/* Botón de favoritos */}
                                                        <button
                                                            className={`btn btn-sm position-absolute top-0 end-0 m-2 ${isFavorite(p1.id) ? 'btn-danger' : 'btn-outline-danger'
                                                                }`}
                                                            onClick={() => handleToggleFavorite(p1)}
                                                            style={{ zIndex: 10 }}
                                                        >
                                                            <i className={`bi ${isFavorite(p1.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                                                        </button>
                                                        <div className="card-body text-center">
                                                            <div className="mb-3">
                                                                <img
                                                                    src={p1.image || p1.img || "https://via.placeholder.com/200"}
                                                                    alt={p1.name}
                                                                    className="img-fluid rounded shadow-sm"
                                                                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                                                                />
                                                            </div>
                                                            <h6 className="card-title fw-bold text-primary mb-2">{p1.name}</h6>
                                                            <p className="text-muted small mb-0">
                                                                <i className="bi bi-shop me-1"></i>
                                                                {p1.store_name || "Tienda no especificada"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-2 d-flex align-items-center justify-content-center">
                                                    <div className="text-center">
                                                        <i className="bi bi-arrows-collapse text-primary fs-2"></i>
                                                        <p className="text-muted small mt-2 mb-0">VS</p>
                                                    </div>
                                                </div>

                                                <div className="col-md-5">
                                                    <div className={`card ${darkMode ? 'bg-secondary text-light' : 'bg-white'} shadow-sm h-100 position-relative`}>
                                                        {/* Botón de favoritos */}
                                                        <button
                                                            className={`btn btn-sm position-absolute top-0 end-0 m-2 ${isFavorite(p2.id) ? 'btn-danger' : 'btn-outline-danger'
                                                                }`}
                                                            onClick={() => handleToggleFavorite(p2)}
                                                            style={{ zIndex: 10 }}
                                                        >
                                                            <i className={`bi ${isFavorite(p2.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                                                        </button>
                                                        <div className="card-body text-center">
                                                            <div className="mb-3">
                                                                <img
                                                                    src={p2.image || p2.img || "https://via.placeholder.com/200"}
                                                                    alt={p2.name}
                                                                    className="img-fluid rounded shadow-sm"
                                                                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                                                                />
                                                            </div>
                                                            <h6 className="card-title fw-bold text-primary mb-2">{p2.name}</h6>
                                                            <p className="text-muted small mb-0">
                                                                <i className="bi bi-shop me-1"></i>
                                                                {p2.store_name || "Tienda no especificada"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Descripciones */}
                                            <div className="row mb-4">
                                                <div className="col-12">
                                                    <div className={`card ${darkMode ? 'bg-secondary text-light' : 'bg-white'} shadow-sm`}>
                                                        <div className="card-body">
                                                            <h6 className="card-title text-center mb-3">
                                                                <i className="bi bi-info-circle me-2"></i>
                                                                Descripciones
                                                            </h6>
                                                            <div className="row">
                                                                <div className="col-md-6">
                                                                    <div className="border-start border-primary border-3 ps-3">
                                                                        <h6 className="text-primary mb-2">{p1.name}</h6>
                                                                        <p className="text-muted small mb-0" style={{ minHeight: "60px" }}>
                                                                            {p1.description || "No hay descripción disponible"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <div className="border-start border-success border-3 ps-3">
                                                                        <h6 className="text-success mb-2">{p2.name}</h6>
                                                                        <p className="text-muted small mb-0" style={{ minHeight: "60px" }}>
                                                                            {p2.description || "No hay descripción disponible"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tabla comparativa */}
                                            <div className="table-responsive">
                                                <table className={`table table-striped table-hover ${darkMode ? 'table-dark' : ''}`}>
                                                    <thead className="table-primary">
                                                        <tr>
                                                            <th scope="col" className="text-center">
                                                                <i className="bi bi-list-ul me-2"></i>
                                                                Atributo
                                                            </th>
                                                            <th scope="col" className="text-center">{p1.name}</th>
                                                            <th scope="col" className="text-center">{p2.name}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <th scope="row" className="text-center">
                                                                <i className="bi bi-shop me-2"></i>
                                                                Tienda
                                                            </th>
                                                            <td className="text-center">{p1.store_name || "N/A"}</td>
                                                            <td className="text-center">{p2.store_name || "N/A"}</td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" className="text-center">
                                                                <i className="bi bi-tag me-2"></i>
                                                                Categoría
                                                            </th>
                                                            <td className="text-center">
                                                                <span className="badge bg-primary">{p1.category}</span>
                                                            </td>
                                                            <td className="text-center">
                                                                <span className="badge bg-success">{p2.category}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" className="text-center">
                                                                <i className="bi bi-currency-dollar me-2"></i>
                                                                Precio
                                                            </th>
                                                            <td className="text-center">
                                                                <span className={`fw-bold ${p1.price < p2.price ? 'text-success' : ''}`}>
                                                                    ${p1.price}
                                                                </span>
                                                            </td>
                                                            <td className="text-center">
                                                                <span className={`fw-bold ${p2.price < p1.price ? 'text-success' : ''}`}>
                                                                    ${p2.price}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th scope="row" className="text-center">
                                                                <i className="bi bi-star-fill me-2"></i>
                                                                Calificación
                                                            </th>
                                                            <td className="text-center">
                                                                <span className={`fw-bold ${p1.rate > p2.rate ? 'text-warning' : ''}`}>
                                                                    {p1.rate ? `${p1.rate} ⭐` : "N/A"}
                                                                </span>
                                                            </td>
                                                            <td className="text-center">
                                                                <span className={`fw-bold ${p2.rate > p1.rate ? 'text-warning' : ''}`}>
                                                                    {p2.rate ? `${p2.rate} ⭐` : "N/A"}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="modal-footer border-0">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    <i className="bi bi-x-circle me-2"></i>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FavoriteComparisonCard;