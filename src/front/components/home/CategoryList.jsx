import React from "react";

// Mapa de iconos para categorías
const categoryIcons = {
    'electronics': 'bi-laptop',
    'jewelery': 'bi-gem',
    'men\'s clothing': 'bi-person',
    'women\'s clothing': 'bi-person-dress',
    'beauty': 'bi-palette',
    'home-decoration': 'bi-house',
    'groceries': 'bi-basket',
    'furniture': 'bi-house-door',
    'fragrances': 'bi-spray-can',
    'skincare': 'bi-droplet',
    'laptops': 'bi-laptop',
    'smartphones': 'bi-phone',
    'automotive': 'bi-car-front',
    'motorcycle': 'bi-bicycle',
    'lighting': 'bi-lightbulb'
};

// Función para obtener icono de categoría
const getCategoryIcon = (category) => {
    const normalizedCategory = category.toLowerCase().replace(/[^a-z\s-]/g, '');
    return categoryIcons[normalizedCategory] || 'bi-tag';
};

export default function CategoryList({
    categories,
    currentPage,
    totalPages,
    onCategoryClick,
    goToNextPage,
    goToPrevPage,
    goToPage,
    loading = false
}) {
    // Loading state
    if (loading) {
        return (
            <div className="mt-5">
                <h2 className="text-center mb-4">Categorías</h2>
                <div className="row">
                    {[...Array(8)].map((_, idx) => (
                        <div className="col-6 col-md-3 mb-3" key={idx}>
                            <div className="placeholder-glow">
                                <button className="btn btn-outline-secondary w-100 placeholder" style={{ height: '60px' }}>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (!categories || categories.length === 0) {
        return (
            <div className="mt-5 text-center">
                <h2 className="mb-4">Categorías</h2>
                <div className="text-muted">
                    <i className="bi bi-tags display-4 mb-3 d-block"></i>
                    <p>No hay categorías disponibles</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-5">
            <div className="text-center mb-4">
                <h2 className="display-6">Explora por Categorías</h2>
                <p className="text-muted">Encuentra productos específicos navegando por categoría</p>
            </div>
            
            <div className="row">
                {categories.map((category, idx) => {
                    const icon = getCategoryIcon(category);
                    const displayName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    
                    return (
                        <div className="col-6 col-md-3 mb-3" key={idx}>
                            <button
                                className="btn btn-outline-primary w-100 category-card d-flex flex-column align-items-center justify-content-center"
                                onClick={() => onCategoryClick(category)}
                                style={{ 
                                    height: '80px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <i className={`bi ${icon} fs-4 mb-1`}></i>
                                <span className="text-uppercase fw-bold" style={{ fontSize: '0.8rem' }}>
                                    {displayName}
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <nav aria-label="Paginación de categorías" className="d-flex justify-content-center mt-4">
                    <ul className="pagination">
                        <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={goToPrevPage}
                                disabled={currentPage === 0}
                                aria-label="Página anterior"
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                        </li>
                        
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li
                                key={i}
                                className={`page-item ${i === currentPage ? "active" : ""}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => goToPage(i)}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        ))}
                        
                        <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages - 1}
                                aria-label="Página siguiente"
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
            
            <div className="text-center mt-3">
                <small className="text-muted">
                    Mostrando {currentPage * 8 + 1} - {Math.min((currentPage + 1) * 8, categories.length)} de {categories.length} categorías
                </small>
            </div>
        </div>
    );
}