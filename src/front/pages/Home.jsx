import React, { useState, useEffect } from "react";
import FeaturedProducts from "../components/home/FeaturedProducts";
import CategoryList from "../components/home/CategoryList";
import HowItWorksSection from "../components/home/HowItWorksSection";
import usePagination from "../hooks/usePagination";
import useGlobalProducts from "../hooks/useGlobalProducts";
import useCategories from "../hooks/useCategories";
import ModalsManager from "../components/modales/ModalsManager";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

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

    // Al hacer click en "PRUÉBAME" - abre modal comparativo
    const handleTryMeClick = async () => {
        if (!randomProduct) return;
        setSelectedProduct(randomProduct);
        setShowComparativeModal(true);
        setShowProductModal(false);
    };

    // Al hacer click en un producto destacado - abre modal de producto
    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
        setShowComparativeModal(false);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Productos Destacados</h2>
            
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
                onTryMeClick={handleTryMeClick}
                disabled={!randomProduct}
            />

            <ModalsManager
                selectedProduct={selectedProduct}
                showProductModal={showProductModal}
                setShowProductModal={setShowProductModal}
                showComparativeModal={showComparativeModal}
                setShowComparativeModal={setShowComparativeModal}
            />
        </div>
    );
}