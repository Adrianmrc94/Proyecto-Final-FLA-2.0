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
                    >
                        Anterior
                    </button>
                </li>

                {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    >
                        Siguiente
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default CatalogPagination;
