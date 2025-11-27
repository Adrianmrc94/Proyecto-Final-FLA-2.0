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

            {/* Sección de Catálogo */}
            <div className="mb-5">
                <div className="card border-0 shadow-lg" style={{
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div className="card-body p-5">
                        <div className="row align-items-center">
                            <div className="col-md-8">
                                <h2 className="display-6 fw-bold mb-3">
                                    <i className="bi bi-grid-3x3-gap me-3"></i>
                                    Explora Nuestro Catálogo Completo
                                </h2>
                                <p className="lead text-muted mb-0">
                                    Descubre {products.length} productos de diferentes categorías y tiendas. Filtra, compara y encuentra exactamente lo que buscas.
                                </p>
                                <div className="mt-4">
                                    <div className="d-flex gap-3 flex-wrap">
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <span>Múltiples categorías</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <span>Filtros avanzados</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                                            <span>Comparativas instantáneas</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 text-center mt-4 mt-md-0">
                                <button
                                    className="btn btn-primary btn-lg px-5 py-3 shadow"
                                    onClick={() => navigate('/catalog')}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        border: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <i className="bi bi-box-seam me-2"></i>
                                    Ver Catálogo
                                    <i className="bi bi-arrow-right ms-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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