import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductFilters from "../components/search/ProductFilters";
import ProductResults from "../components/search/ProductResults";
import ComparativeModal3 from "../components/modales/ComparativeModal3";
import useGlobalProducts from "../hooks/useGlobalProducts";
import useMainCategories from "../hooks/useMainCategories";
import useFilters from "../hooks/useFilters";


const filterProducts = (products, filters, searchQuery, mainCategory, subcategory) => {
    return products.filter((product) => {
        // Búsqueda por texto
        const title = (product.name || product.title || "").toLowerCase();
        const matchesSearch = !searchQuery || title.includes(searchQuery.toLowerCase());

        // Filtro por categoría principal
        const matchesMainCategory = !mainCategory || mainCategory === 'all' || product.main_category === mainCategory;

        // Filtro por subcategoría
        const matchesSubcategory = !subcategory || subcategory === 'all' || product.category === subcategory;

        // Filtro por precio
        const price = Number(product.price) || 0;
        const matchesPrice = (!filters.price_min || price >= Number(filters.price_min)) &&
            (!filters.price_max || price <= Number(filters.price_max));


        // Filtro por rating (normalizado)
        const productRating = product.rating?.rate || product.rating || product.rate || 0;
        const matchesRating = !filters.rating || productRating >= Number(filters.rating);


        // Filtro por stock
        const matchesStock = filters.inStock === null || (product.stock > 0);


        return matchesSearch && matchesMainCategory && matchesSubcategory && matchesPrice && matchesRating && matchesStock;
    });
};


export default function SearchPage() {
    const location = useLocation();
    const { products } = useGlobalProducts();
    const { mainCategories, subcategories, selectedMainCategory, setSelectedMainCategory } = useMainCategories();
    const { filters, setFilters } = useFilters();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showComparativeModal, setShowComparativeModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState('all');
    const [hasProcessedState, setHasProcessedState] = useState(false);
    const [initialPage, setInitialPage] = useState(1);


    // Procesar navegación desde navbar
    useEffect(() => {
        if (location.state && !hasProcessedState) {
            const {
                searchQuery: navQuery,
                applyCategoryFilter,
                openProductModal,
                selectedProduct: navProduct,
                selectedProductForComparison,
                initialPage: navInitialPage
            } = location.state;


            if (applyCategoryFilter) {
                setFilters({ ...filters, category: applyCategoryFilter });
                setSearchQuery("");
            } else if (navQuery) {
                setSearchQuery(navQuery);
            }

            // Establecer página inicial si viene de SearchBar
            if (navInitialPage) {
                setInitialPage(navInitialPage);
            }


            if (openProductModal && navProduct) {
                setSelectedProduct(navProduct);
                setShowComparativeModal(true);
            } else if (selectedProductForComparison) {
                // Abrir modal de comparativa con el producto seleccionado desde el catálogo
                setSelectedProduct(selectedProductForComparison);
                setShowComparativeModal(true);
            }


            setHasProcessedState(true);
            window.history.replaceState(null, document.title, window.location.pathname);
        }
    }, [location.state, hasProcessedState, filters, setFilters]);


    // Filtrado simplificado
    const filteredProducts = filterProducts(products, filters, searchQuery, selectedMainCategory, selectedSubcategory);


    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowComparativeModal(true);
    };


    const handleCloseModal = () => {
        setShowComparativeModal(false);
        setSelectedProduct(null);
    };


    return (
        <div className="container-fluid mt-4">
            {/* Header con contador */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h1 className="mb-0">
                        <i className="bi bi-search me-2"></i>
                        Búsqueda de Productos
                    </h1>
                    <span className="badge bg-primary fs-6">
                        {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''}
                    </span>
                </div>


                {/* Barra de búsqueda */}
                <div className="row">
                    <div className="col-md-8 col-lg-6">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="form-control"
                            />
                            <button className="btn btn-outline-secondary" type="button">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Contenido principal */}
            <div className="row">
                <div className="col-md-3">
                    <div className="card shadow-sm mb-3">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="bi bi-funnel me-2"></i>
                                Filtros
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* Filtros de categorías principales */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="bi bi-folder me-1"></i>
                                    Categoría Principal
                                </label>
                                <select
                                    className="form-select form-select-sm"
                                    value={selectedMainCategory || 'all'}
                                    onChange={(e) => {
                                        setSelectedMainCategory(e.target.value);
                                        setSelectedSubcategory('all');
                                    }}
                                >
                                    <option value="all">Todas</option>
                                    {mainCategories.map(cat => (
                                        <option key={cat.name} value={cat.name}>
                                            {cat.name} ({cat.count})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subcategorías */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">
                                    <i className="bi bi-tags me-1"></i>
                                    Subcategoría
                                </label>
                                <select
                                    className="form-select form-select-sm"
                                    value={selectedSubcategory}
                                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                                    disabled={!selectedMainCategory || selectedMainCategory === 'all' || subcategories.length === 0}
                                >
                                    <option value="all">Todas</option>
                                    {subcategories.map(sub => (
                                        <option key={sub.name} value={sub.name}>
                                            {sub.name} ({sub.count})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <hr />

                            {/* Filtros legacy */}
                            <ProductFilters
                                filters={filters}
                                setFilters={setFilters}
                                products={products}
                            />
                        </div>
                    </div>
                </div>


                <div className="col-md-9">
                    <ProductResults
                        filteredProducts={filteredProducts}
                        handleProductClick={handleProductClick}
                        initialPage={initialPage}
                    />
                </div>
            </div>


            {/* Modal comparativo */}
            {showComparativeModal && selectedProduct && (
                <ComparativeModal3
                    isOpen={showComparativeModal}
                    onClose={handleCloseModal}
                    product={selectedProduct}
                />
            )}
        </div>
    );
}