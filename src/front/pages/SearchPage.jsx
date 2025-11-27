import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductFilters from "../components/search/ProductFilters";
import ProductResults from "../components/search/ProductResults";
import ComparativeModal3 from "../components/modales/ComparativeModal3";
import useGlobalProducts from "../hooks/useGlobalProducts";
import useFilters from "../hooks/useFilters";


const filterProducts = (products, filters, searchQuery) => {
    return products.filter((product) => {
        // Búsqueda por texto
        const title = (product.name || product.title || "").toLowerCase();
        const matchesSearch = !searchQuery || title.includes(searchQuery.toLowerCase());


        // Filtro por categoría
        const matchesCategory = !filters.category || product.category === filters.category;


        // Filtro por precio
        const price = Number(product.price) || 0;
        const matchesPrice = (!filters.price_min || price >= Number(filters.price_min)) &&
            (!filters.price_max || price <= Number(filters.price_max));


        // Filtro por rating (normalizado)
        const productRating = product.rating?.rate || product.rating || product.rate || 0;
        const matchesRating = !filters.rating || productRating >= Number(filters.rating);


        // Filtro por stock
        const matchesStock = filters.inStock === null || (product.stock > 0);


        return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
    });
};


export default function SearchPage() {
    const location = useLocation();
    const { products } = useGlobalProducts();
    const { filters, setFilters } = useFilters();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showComparativeModal, setShowComparativeModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
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
    const filteredProducts = filterProducts(products, filters, searchQuery);


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
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="bi bi-funnel me-2"></i>
                                Filtros
                            </h5>
                        </div>
                        <div className="card-body">
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