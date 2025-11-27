import React from "react";
import FeaturedProducts from "../home/FeaturedProducts";
import usePagination from "../../hooks/usePagination";

export default function ProductResults({ filteredProducts, handleProductClick, initialPage = 1 }) {
    const itemsPerPage = 12; // Mismo que CatalogPage

    const { currentPage, totalPages, currentItems, goToNextPage, goToPrevPage, goToPage } =
        usePagination({
            items: filteredProducts,
            itemsPerPage,
            initialPage: initialPage - 1 // usePagination usa índice 0
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

                    <nav aria-label="Paginación" className="d-flex justify-content-center mt-4">
                        <ul className="pagination">
                            <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={goToPrevPage} disabled={currentPage === 0}>
                                    Anterior
                                </button>
                            </li>
                            <li className="page-item active">
                                <span className="page-link">
                                    {currentPage + 1} / {totalPages}
                                </span>
                            </li>
                            <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
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