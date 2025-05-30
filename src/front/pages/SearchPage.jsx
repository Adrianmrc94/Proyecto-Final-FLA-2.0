// pages/SearchPage.jsx
import React, { useState } from "react";
import FeaturedProducts from "../components/FeaturedProducts";
import HowItWorksSection from "../components/HowItWorksSection";
import ModalsManager from "../components/ModalsManager";
import useGlobalProducts from "../hooks/useGlobalProducts";
import useFilters from "../hooks/useFilters";
import usePagination from "../hooks/usePagination";
import { allCategories } from "../hooks/categories";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
    const navigate = useNavigate();
    const { products } = useGlobalProducts();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showComparativeModal, setShowComparativeModal] = useState(false);
    const { filters, setFilters } = useFilters();

    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.filter((product) => {

        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !filters.category || product.category === filters.category;
        const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;
        const matchesRating = !filters.rating || product.rating >= filters.rating;
        const matchesStock = filters.inStock === null ? true : product.stock > 0 === filters.inStock;

        return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
    });

    const itemsPerPage = 9;
    const { currentPage, totalPages, currentItems, goToNextPage, goToPrevPage, goToPage } =
        usePagination({
            items: filteredProducts,
            itemsPerPage
        });

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowComparativeModal(true);
    };

    return (
        <div className="container mt-4">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control"
                />
            </div>

            <div className="row m-3">
                <div className="col-md-3">
                    <h5>Categorías</h5>
                    <div>
                        {allCategories.map((category, index) => (
                            <div key={index} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`category-${index}`}
                                    checked={filters.category === category}
                                    onChange={() =>
                                        setFilters({
                                            category: filters.category === category ? "" : category,
                                        })
                                    }
                                />
                                <label className="form-check-label" htmlFor={`category-${index}`}>
                                    {category.replace("-", " ")}
                                </label>
                            </div>
                        ))}
                    </div>
                    <hr />

                    <h5>Precio</h5>
                    <div>
                        <label>
                            Mínimo:
                            <input
                                type="number"
                                value={filters.minPrice}
                                onChange={(e) =>
                                    setFilters({ minPrice: Number(e.target.value) })
                                }
                                className="form-control form-control-sm"
                            />
                        </label>
                        <label>
                            Máximo:
                            <input
                                type="number"
                                value={filters.maxPrice}
                                onChange={(e) =>
                                    setFilters({ maxPrice: Number(e.target.value) })
                                }
                                className="form-control form-control-sm"
                            />
                        </label>
                    </div>

                    <hr />

                    <h5>Rating</h5>
                    <div>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={filters.rating}
                            onChange={(e) =>
                                setFilters({ rating: Number(e.target.value) })
                            }
                            className="form-control form-control-sm"
                        />
                    </div>
                    <hr />
                    <h5>Disponibilidad</h5>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="inStock"
                            checked={filters.inStock === true}
                            onChange={() =>
                                setFilters({ inStock: filters.inStock === true ? null : true })
                            }
                        />
                        <label className="form-check-label" htmlFor="inStock">
                            Solo disponibles
                        </label>
                    </div>
                </div>


                <div className="col-md-9">
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
                </div>
            </div>

            <ModalsManager
                selectedProduct={selectedProduct}
                showProductModal={false}
                setShowProductModal={() => { }}
                showComparativeModal={showComparativeModal}
                setShowComparativeModal={setShowComparativeModal}
                productToCompare={selectedProduct}
            />
        </div>
    );
}