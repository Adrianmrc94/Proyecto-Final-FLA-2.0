import React from 'react';

const CatalogPagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <nav aria-label="Catalog pagination">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        aria-label="Página anterior"
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                </li>

                {/* Mostrar solo páginas cercanas */}
                {(() => {
                    const pages = [];
                    const maxVisible = 5;
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                    if (endPage - startPage < maxVisible - 1) {
                        startPage = Math.max(1, endPage - maxVisible + 1);
                    }

                    // Primera página
                    if (startPage > 1) {
                        pages.push(
                            <li key={1} className="page-item">
                                <button className="page-link" onClick={() => onPageChange(1)}>1</button>
                            </li>
                        );
                        if (startPage > 2) {
                            pages.push(<li key="dots1" className="page-item disabled"><span className="page-link">...</span></li>);
                        }
                    }

                    // Páginas visibles
                    for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                            <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => onPageChange(i)}>{i}</button>
                            </li>
                        );
                    }

                    // Última página
                    if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                            pages.push(<li key="dots2" className="page-item disabled"><span className="page-link">...</span></li>);
                        }
                        pages.push(
                            <li key={totalPages} className="page-item">
                                <button className="page-link" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
                            </li>
                        );
                    }

                    return pages;
                })()}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        aria-label="Página siguiente"
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default CatalogPagination;
