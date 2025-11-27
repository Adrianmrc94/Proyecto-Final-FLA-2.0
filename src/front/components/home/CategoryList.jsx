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
            <div className="text-center mb-5">
                <h2 className="display-6 mb-2">
                    <i className="bi bi-grid-3x3-gap-fill text-primary me-2"></i>
                    Explora por Categorías
                </h2>
                <p className="text-muted">Descubre productos organizados por categoría</p>
            </div>

            <div className="row g-4">
                {categories.map((category, idx) => {
                    const icon = getCategoryIcon(category);
                    const displayName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                    // Colores variados para cada categoría
                    const gradients = [
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
                        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
                    ];

                    const gradient = gradients[idx % gradients.length];

                    return (
                        <div className="col-6 col-md-3 col-lg-3" key={idx}>
                            <div
                                className="category-card-modern h-100"
                                onClick={() => onCategoryClick(category)}
                                style={{
                                    background: gradient,
                                    borderRadius: '20px',
                                    padding: '30px 20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div className="text-center position-relative" style={{ zIndex: 2 }}>
                                    <div
                                        className="category-icon-wrapper mb-3 mx-auto"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            background: 'rgba(255, 255, 255, 0.3)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        <i className={`bi ${icon} text-white`} style={{ fontSize: '1.8rem' }}></i>
                                    </div>
                                    <h6 className="text-white fw-bold mb-0" style={{ fontSize: '0.9rem', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                        {displayName}
                                    </h6>
                                </div>

                                {/* Decoración de fondo */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '-20px',
                                        right: '-20px',
                                        width: '100px',
                                        height: '100px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '50%',
                                        zIndex: 1
                                    }}
                                ></div>
                            </div>
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