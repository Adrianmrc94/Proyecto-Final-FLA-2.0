import React, { useState } from "react";
import FeaturedProducts from "../components/FeaturedProducts";
import CategoryList from "../components/CategoryList";
import HowItWorksSection from "../components/HowItWorksSection";
import ModalsManager from "../components/ModalsManager";
import usePagination from "../hooks/usePagination";
import useGlobalProducts from "../hooks/useGlobalProducts";
import useCategories from "../hooks/useCategories";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const {
        products,
        featuredProducts: featured,
        randomProduct,
        setFilters
    } = useGlobalProducts();

    const categories = useCategories(products);

    const {
        currentPage,
        totalPages,
        goToNextPage,
        goToPrevPage,
        goToPage,
        currentItems: currentCategories,
    } = usePagination({
        items: categories,
        itemsPerPage: 8,
    });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showComparativeModal, setShowComparativeModal] = useState(false);

    const handleCategoryClick = (category) => {
        setFilters({ category });
        navigate(`/search`);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Productos Destacados</h2>
            <FeaturedProducts
                featured={featured}
                onProductClick={handleProductClick}
            />
            <CategoryList
                categories={currentCategories}
                currentPage={currentPage}
                totalPages={totalPages}
                onCategoryClick={handleCategoryClick}
                goToNextPage={goToNextPage}
                goToPrevPage={goToPrevPage}
                goToPage={goToPage}
            />

            <HowItWorksSection
                onTryMeClick={() => setShowComparativeModal(true)}
                disabled={!randomProduct}
            />

            <ModalsManager
                selectedProduct={selectedProduct}
                showProductModal={showProductModal}
                setShowProductModal={setShowProductModal}
                productToCompare={randomProduct}
                showComparativeModal={showComparativeModal}
                setShowComparativeModal={setShowComparativeModal}
            />
        </div>
    );
}