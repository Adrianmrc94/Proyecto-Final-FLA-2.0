import React, { useState } from "react";
import ProductFilters from "../components/ProductFilters";
import ProductResults from "../components/ProductResults";
import ModalsManager from "../components/ModalsManager";
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
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !filters.category || product.category === filters.category;
        const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;

        // Soporte para rating como número o como objeto
        let productRating = 0;
        if (typeof product.rating === "object" && product.rating !== null) {
            productRating = product.rating.rate;
        } else {
            productRating = product.rating;
        }
        const matchesRating = !filters.rating || productRating >= filters.rating;

        // Soporte para stock (puede ser undefined en fakestoreapi)
        const matchesStock = filters.inStock === null ? true : (product.stock ? product.stock > 0 : true) === filters.inStock;

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
                    <ProductFilters filters={filters} setFilters={setFilters} products={products}/>
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