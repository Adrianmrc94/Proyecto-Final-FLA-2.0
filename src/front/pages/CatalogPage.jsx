import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import useGlobalProducts from '../hooks/useGlobalProducts';
import useDarkMode from '../hooks/useDarkMode';
import { toast } from 'react-toastify';
import '../styles/CatalogPage.css';

const CatalogPage = () => {
    const navigate = useNavigate();
    const { darkMode } = useDarkMode();
    const { products, loadingProducts } = useGlobalProducts();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [searchTerm, setSearchTerm] = useState('');
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // Cargar favoritos al montar el componente
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const favorites = await ApiService.fetchFavorites();
                setFavoriteIds(new Set(favorites.map(fav => fav.product.id)));
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };
        loadFavorites();
    }, []);

    // Obtener categorías únicas
    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

    // Filtrar y ordenar productos
    useEffect(() => {
        let filtered = [...products];

        // Filtrar por categoría
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Ordenar
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                default:
                    return 0;
            }
        });

        setFilteredProducts(filtered);
        setCurrentPage(1);
    }, [products, selectedCategory, sortBy, searchTerm]);

    // Paginación
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleToggleFavorite = async (product) => {
        try {
            if (favoriteIds.has(product.id)) {
                // Buscar el favorite_id correcto
                const favorites = await ApiService.fetchFavorites();
                const favoriteToRemove = favorites.find(fav => fav.product_id === product.id);

                if (favoriteToRemove) {
                    await ApiService.removeFavorite(favoriteToRemove.id);
                    setFavoriteIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(product.id);
                        return newSet;
                    });
                    toast.info('Eliminado de favoritos', { autoClose: 2000 });
                }
            } else {
                // Formato YYYY-MM-DD para el backend
                const today = new Date();
                const dateAd = today.getFullYear() + '-' +
                    String(today.getMonth() + 1).padStart(2, '0') + '-' +
                    String(today.getDate()).padStart(2, '0');

                await ApiService.addFavorite({
                    product_id: product.id,
                    store_id: product.store_id || 1,
                    date_ad: dateAd
                });
                setFavoriteIds(prev => new Set(prev).add(product.id));
                toast.success('Agregado a favoritos', { autoClose: 2000 });
            }
        } catch (error) {
            toast.error('Error al actualizar favoritos', { autoClose: 2000 });
        }
    };

    const handleViewComparisons = (product) => {
        navigate('/search', {
            state: {
                applyCategoryFilter: product.category,
                selectedProductForComparison: product
            }
        });
    };

    if (loadingProducts) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`catalog-page ${darkMode ? 'dark-mode' : ''}`}>
            <div className="container py-5">
                {/* Header */}
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold gradient-title mb-3">
                        <i className="bi bi-grid-3x3-gap me-3"></i>
                        Catálogo de Productos
                    </h1>
                    <p className="lead text-muted">
                        Explora nuestra colección de {products.length} productos
                    </p>
                </div>

                {/* Filters Bar */}
                <div className="filters-bar card shadow-sm mb-4 border-0">
                    <div className="card-body p-4">
                        <div className="row g-3 align-items-center">
                            {/* Search */}
                            <div className="col-12 col-md-4">
                                <div className="input-group">
                                    <span className="input-group-text bg-transparent border-end-0">
                                        <i className="bi bi-search"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Buscar productos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="col-12 col-md-4">
                                <select
                                    className="form-select"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="all">Todas las categorías</option>
                                    {categories.filter(c => c !== 'all').map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort */}
                            <div className="col-12 col-md-4">
                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="name">Nombre (A-Z)</option>
                                    <option value="price-asc">Precio (menor a mayor)</option>
                                    <option value="price-desc">Precio (mayor a menor)</option>
                                    <option value="rating">Mejor valorados</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-3">
                    <p className="text-muted">
                        Mostrando {currentProducts.length} de {filteredProducts.length} productos
                    </p>
                </div>

                {/* Products Grid */}
                <div className="row g-4 mb-5">
                    {currentProducts.map(product => (
                        <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="product-catalog-card card h-100 border-0 shadow-sm">
                                {/* Favorite Button */}
                                <button
                                    className={`btn btn-sm favorite-btn ${favoriteIds.has(product.id) ? 'active' : ''}`}
                                    onClick={() => handleToggleFavorite(product)}
                                >
                                    <i className={`bi ${favoriteIds.has(product.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                                </button>

                                {/* Product Image */}
                                <div className="product-image-wrapper">
                                    <img
                                        src={product.image || product.img || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="card-img-top"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="card-body d-flex flex-column">
                                    <h6 className="card-title text-truncate mb-2" title={product.name}>
                                        {product.name}
                                    </h6>

                                    <div className="mb-2">
                                        <span className="badge bg-light text-dark">
                                            {product.category}
                                        </span>
                                    </div>

                                    {product.rating && (
                                        <div className="mb-2">
                                            <span className="text-warning">
                                                {'★'.repeat(Math.floor(product.rating))}
                                                {'☆'.repeat(5 - Math.floor(product.rating))}
                                            </span>
                                            <small className="text-muted ms-1">({product.rating})</small>
                                        </div>
                                    )}

                                    <div className="mt-auto">
                                        <p className="h5 text-primary mb-3">
                                            ${product.price?.toFixed(2)}
                                        </p>

                                        <button
                                            className="btn btn-outline-primary w-100"
                                            onClick={() => handleViewComparisons(product)}
                                        >
                                            <i className="bi bi-arrow-left-right me-2"></i>
                                            Ver Comparativas
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <nav aria-label="Catalog pagination">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                >
                                    Anterior
                                </button>
                            </li>

                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                >
                                    Siguiente
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-5">
                        <i className="bi bi-inbox display-1 text-muted mb-3"></i>
                        <h3 className="text-muted">No se encontraron productos</h3>
                        <p className="text-muted">Intenta con otros filtros o búsqueda</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatalogPage;
