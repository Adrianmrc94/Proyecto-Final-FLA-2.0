import React, { useState } from "react";
import ProductFilters from "../components/search/ProductFilters";
import ProductResults from "../components/search/ProductResults";
import ComparativeModal3 from "../components/modales/ComparativeModal3";
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

    // Filtrado de productos SOLO por nombre/título
    const filteredProducts = products.filter((product) => {
        const title = (product.name || product.title || "").toLowerCase();
        const matchesSearch =
            !searchQuery ||
            title.includes(searchQuery.toLowerCase());

        const matchesCategory = !filters.category || product.category === filters.category;

        const price = Number(product.price) || 0;
        const matchesPrice =
            (!filters.price_min || price >= Number(filters.price_min)) &&
            (!filters.price_max || price <= Number(filters.price_max));

        let productRating = 0;
        if (typeof product.rating === "object" && product.rating !== null && typeof product.rating.rate === "number") {
            productRating = product.rating.rate;
        } else if (typeof product.rating === "number") {
            productRating = product.rating;
        } else if (typeof product.rate === "number") {
            productRating = product.rate;
        }
        const matchesRating = !filters.rating || productRating >= Number(filters.rating);

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

            {showComparativeModal && selectedProduct && (
                <ComparativeModal3
                    isOpen={showComparativeModal}
                    onClose={() => setShowComparativeModal(false)}
                    product={selectedProduct}
                />
            )}
        </div>
    );
}