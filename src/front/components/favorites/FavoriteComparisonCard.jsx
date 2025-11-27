import React, { useState } from 'react';
import ComparativeModal3 from '../modales/ComparativeModal3';

const FavoriteComparisonCard = ({ comparison, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(comparison.name);
    const [showComparisonModal, setShowComparisonModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleSave = () => {
        if (newName.trim() && newName !== comparison.name) {
            onUpdate(comparison.id, newName.trim());
        }
        setIsEditing(false);
    };

    const handleViewComparison = () => {
        // Usar el primer producto para abrir el modal comparativo
        if (comparison.products && comparison.products.length > 0) {
            setSelectedProduct(comparison.products[0]);
            setShowComparisonModal(true);
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
                            onClick={handleViewComparison}
                        >
                            <i className="bi bi-eye me-2"></i>
                            Ver Comparativa
                        </button>
                    </div>
                </div>
            </div>

            {showComparisonModal && selectedProduct && (
                <ComparativeModal3
                    isOpen={showComparisonModal}
                    onClose={() => setShowComparisonModal(false)}
                    product={selectedProduct}
                />
            )}
        </>
    );
};

export default FavoriteComparisonCard;
