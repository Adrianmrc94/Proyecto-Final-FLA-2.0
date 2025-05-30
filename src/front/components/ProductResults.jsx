import React from "react";
import FeaturedProducts from "./FeaturedProducts";
import usePagination from "../hooks/usePagination";

export default function ProductResults({ filteredProducts, handleProductClick }) {
    const itemsPerPage = 9;

    const { currentPage, totalPages, currentItems, goToNextPage, goToPrevPage, goToPage } =
        usePagination({
            items: filteredProducts,
            itemsPerPage,
        });

    return (
        <>
            <h2>Resultados de búsqueda</h2>
            {currentItems.length > 0 ? (
                <>
                    <FeaturedProducts
                        featured={currentItems}
                        onProductClick={handleProductClick}
                    />

                    <nav aria-label="Paginación de resultados" className="mt-4 d-flex justify-content-center">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={goToPrevPage}>
                                    Anterior
                                </button>
                            </li>

                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i} className={`page-item ${i === currentPage ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => goToPage(i)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={goToNextPage}>
                                    Siguiente
                                </button>
                            </li>
                        </ul>
                    </nav>
                </>
            ) : (
                <p>No se encontraron productos.</p>
            )}
        </>
    );
}