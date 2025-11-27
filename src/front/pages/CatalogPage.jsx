import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import useGlobalProducts from '../hooks/useGlobalProducts';
import useDarkMode from '../hooks/useDarkMode';
import CatalogFilters from '../components/catalog/CatalogFilters';
import ProductCard from '../components/catalog/ProductCard';
import CatalogPagination from '../components/catalog/CatalogPagination';
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
                <CatalogFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    categories={categories}
                />

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
                            <ProductCard
                                product={product}
                                isFavorite={favoriteIds.has(product.id)}
                                onToggleFavorite={handleToggleFavorite}
                                onViewComparisons={handleViewComparisons}
                            />
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <CatalogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

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
