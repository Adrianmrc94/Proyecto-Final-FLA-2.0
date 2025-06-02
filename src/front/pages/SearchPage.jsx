import React, { useState } from "react";
import ProductFilters from "../components/search/ProductFilters";
import ProductResults from "../components/search/ProductResults";
import ModalsManager from "../components/modales/ModalsManager";
import useGlobalProducts from "../hooks/useGlobalProducts";
import useFilters from "../hooks/useFilters";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
    const navigate = useNavigate();
    const { products } = useGlobalProducts();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showComparativeModal, setShowComparativeModal] = useState(false);
    const { filters, setFilters } = useFilters();

    const [searchQuery, setSearchQuery] = useState("");

    // Filtrado de productos
    const filteredProducts = products.filter((product) => {
        // Normaliza campos
        const title = (product.name || product.title || "").toLowerCase();
        const description = (product.description || "").toLowerCase();
        const category = (product.category || "").toLowerCase();

        // Filtro de búsqueda
        const matchesSearch =
            !searchQuery ||
            title.includes(searchQuery.toLowerCase()) ||
            description.includes(searchQuery.toLowerCase()) ||
            category.includes(searchQuery.toLowerCase());

        // Filtro de categoría
        const matchesCategory = !filters.category || product.category === filters.category;

        // Filtro de precio
        const price = Number(product.price) || 0;
        const matchesPrice =
            (!filters.price_min || price >= Number(filters.price_min)) &&
            (!filters.price_max || price <= Number(filters.price_max));

        // Filtro de rating
        let productRating = 0;
        if (typeof product.rating === "object" && product.rating !== null && typeof product.rating.rate === "number") {
            productRating = product.rating.rate;
        } else if (typeof product.rating === "number") {
            productRating = product.rating;
        } else if (typeof product.rate === "number") {
            productRating = product.rate;
        }
        const matchesRating = !filters.rating || productRating >= Number(filters.rating);

        // Filtro de stock
        const matchesStock = filters.inStock === null ? true : (product.stock ? product.stock > 0 : false);

        return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
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
                    <ProductFilters filters={filters} setFilters={setFilters} products={products} />
                </div>

                <div className="col-md-9">
                    <ProductResults
                        filteredProducts={filteredProducts}
                        handleProductClick={handleProductClick}
                    />
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