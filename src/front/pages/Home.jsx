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
        loadingProducts,
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
        navigate(`/search`, { 
            state: { 
                applyCategoryFilter: category,
                fromHome: true 
            } 
        });
    };

    const handleTryMeClick = async () => {
        if (!randomProduct) return;
        setSelectedProduct(randomProduct);
        setShowComparativeModal(true);
        setShowProductModal(false);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
        setShowComparativeModal(false);
    };

    return (
        <div className="container mt-4">
            {/* Header mejorado */}
            <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary mb-3">
                    Bienvenido a tu Comparador de Precios
                </h1>
                <p className="lead text-muted">
                    Encuentra los mejores productos al mejor precio
                </p>
            </div>

            {/* Productos destacados */}
            <div className="mb-5">
                <div className="text-center mb-4">
                    <h2 className="display-6">Productos Destacados</h2>
                    <p className="text-muted">Los productos más populares de la semana</p>
                </div>
                
                <FeaturedProducts
                    featured={featured}
                    onProductClick={handleProductClick}
                    loading={loadingProducts}
                />
            </div>

            {/* Categorías */}
            <CategoryList
                categories={currentCategories}
                currentPage={currentPage}
                totalPages={totalPages}
                onCategoryClick={handleCategoryClick}
                goToNextPage={goToNextPage}
                goToPrevPage={goToPrevPage}
                goToPage={goToPage}
                loading={loadingProducts}
            />

            {/* Sección "Cómo funciona" */}
            <HowItWorksSection
                onTryMeClick={handleTryMeClick}
                disabled={!randomProduct || loadingProducts}
            />

            {/* Gestor de modales */}
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