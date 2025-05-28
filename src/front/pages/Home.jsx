import React, { useEffect, useState } from "react";
import ProductModal from "../components/ProductModal";
import ComparativeModal3 from "../components/ComparativeModal3";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showComparativeModal, setShowComparativeModal] = useState(false);
    const [randomProduct, setRandomProduct] = useState(null);

    // Estados para paginación de categorías
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;

    const navigate = useNavigate();

    // Lista completa de categorías de DummyJSON
    const categories = [
        "smartphones",
        "laptops",
        "fragrances",
        "skincare",
        "groceries",
        "home-decoration",
        "furniture",
        "tops",
        "womens-dresses",
        "womens-shoes",
        "mens-shirts",
        "mens-shoes",
        "mens-watches",
        "womens-watches",
        "womens-bags",
        "womens-accessories",
        "mens-accessories",
        "sunglasses",
        "automotive",
        "motorcycle",
        "lighting",
    ];

    const totalPages = Math.ceil(categories.length / itemsPerPage);

    // Funciones de paginación
    const goToNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    // Obtener las categorías que se mostrarán en la página actual
    const currentCategories = categories.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Cargar productos
    useEffect(() => {
        fetch("/data/products.json")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.products);
                const shuffled = [...data.products].sort(() => 0.5 - Math.random());
                setFeatured(shuffled.slice(0, 6));
                setRandomProduct(shuffled[0]);
            })
            .catch((err) => console.error("Error cargando productos:", err));
    }, []);

    const handleCategoryClick = (category) => {
        navigate(`/search?category=${category}`);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    return (
        <div className="container mt-4">
            {/* Productos destacados */}
            <h2 className="mb-4">Productos Destacados</h2>
            <div className="row">
                {featured.map((product, index) => (
                    <div
                        className="col-md-4 mb-4"
                        key={index}
                        onClick={() => handleProductClick(product)}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="card h-100 shadow-sm">
                            <img
                                src={product.images[0]}
                                className="card-img-top"
                                alt={product.title}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.title}</h5>
                                <p className="card-text text-success">${product.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Categorías con paginación */}
            <h2 className="mt-5 mb-4">Categorías</h2>
            <div className="row">
                {currentCategories.map((cat, idx) => (
                    <div className="col-6 col-md-3 mb-3" key={idx}>
                        <button
                            className="btn btn-outline-primary w-100"
                            onClick={() => handleCategoryClick(cat)}
                        >
                            {cat.replace("-", " ")}
                        </button>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            <nav aria-label="Paginación de categorías" className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={goToPrevPage} disabled={currentPage === 0}>
                            Anterior
                        </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <li
                            key={i}
                            className={`page-item ${i === currentPage ? "active" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => goToPage(i)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}

                    <li
                        className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""
                            }`}
                    >
                        <button
                            className="page-link"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages - 1}
                        >
                            Siguiente
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Sección "Cómo funciona" */}
            <div className="text-center mt-5">
                <div className="bg-light p-4 rounded">
                    <h3>COMO FUNCIONA</h3>
                    <p>
                        Compara precios de miles de productos y empieza a ahorrar desde ahora mismo.
                    </p>
                    <button
                        className="btn btn-info"
                        onClick={() => randomProduct && setShowComparativeModal(true)}
                        disabled={!randomProduct}
                    >
                        PRUEBAME
                    </button>
                </div>
            </div>

            {/* Modales */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    show={showProductModal}
                    onClose={() => setShowProductModal(false)}
                    onFavorite={() => { }}
                />
            )}
            {randomProduct && showComparativeModal && (
                <ComparativeModal3
                    isOpen={showComparativeModal}
                    product={randomProduct}
                    onClose={() => setShowComparativeModal(false)}
                />
            )}
        </div>
    );
}