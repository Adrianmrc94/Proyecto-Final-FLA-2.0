import React from 'react';
import { useNavigate } from 'react-router-dom';

const CatalogAccessSection = ({ totalProducts }) => {
    const navigate = useNavigate();

    return (
        <div className="mb-5">
            <div className="card border-0 shadow-lg" style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                backdropFilter: 'blur(10px)'
            }}>
                <div className="card-body p-5">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h2 className="display-6 fw-bold mb-3">
                                <i className="bi bi-grid-3x3-gap me-3"></i>
                                Explora Nuestro Catálogo Completo
                            </h2>
                            <p className="lead text-muted mb-0">
                                Descubre {totalProducts} productos de diferentes categorías y tiendas. Filtra, compara y encuentra exactamente lo que buscas.
                            </p>
                            <div className="mt-4">
                                <div className="d-flex gap-3 flex-wrap">
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span>Múltiples categorías</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span>Filtros avanzados</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span>Comparativas instantáneas</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 text-center mt-4 mt-md-0">
                            <button
                                className="btn btn-primary btn-lg px-5 py-3 shadow"
                                onClick={() => navigate('/catalog')}
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    border: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <i className="bi bi-box-seam me-2"></i>
                                Ver Catálogo
                                <i className="bi bi-arrow-right ms-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogAccessSection;
