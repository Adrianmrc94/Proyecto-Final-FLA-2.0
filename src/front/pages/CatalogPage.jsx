import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ApiService from '../services/api';
import useGlobalProducts from '../hooks/useGlobalProducts';
import useMainCategories from '../hooks/useMainCategories';
import useDarkMode from '../hooks/useDarkMode';
import CatalogFilters from '../components/catalog/CatalogFilters';
import ProductCard from '../components/catalog/ProductCard';
import CatalogPagination from '../components/catalog/CatalogPagination';
import ComparativeModal3 from '../components/modales/ComparativeModal3';
import { toast } from 'react-toastify';
import StoreContext from '../context/StoreContext';
import '../styles/CatalogPage.css';

const CatalogPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { darkMode } = useDarkMode();
    const { store } = useContext(StoreContext);
    const { products, loadingProducts } = useGlobalProducts();
    const { mainCategories, subcategories, selectedMainCategory, setSelectedMainCategory } = useMainCategories();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('all');
    const [selectedStore, setSelectedStore] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [searchTerm, setSearchTerm] = useState('');
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [showComparativeModal, setShowComparativeModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const productsPerPage = 12;

    // Detectar parámetros de URL (categoría y búsqueda)
    useEffect(() => {
        const mainCat = searchParams.get('main_category');
        const searchQuery = searchParams.get('search');

        if (mainCat) {
            setSelectedMainCategory(mainCat);
        }

        if (searchQuery) {
            setSearchTerm(searchQuery);
            // Si hay búsqueda, resetear la categoría principal para buscar en todo
            setSelectedMainCategory(null);
            setSelectedSubcategory('all');
        }
    }, [searchParams, setSelectedMainCategory]);

    // Cargar favoritos al montar el componente
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const favorites = await ApiService.fetchFavorites();
                // Filtrar favoritos válidos (que tengan product y product.id)
                setFavoriteIds(new Set(
                    favorites
                        .filter(fav => fav.product && fav.product.id)
                        .map(fav => fav.product.id)
                ));
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };
        loadFavorites();

        // Debug: mostrar estructura de productos al cargar
        if (products.length > 0) {
            console.log('📦 Sample product structure:');
            console.log(products[0]);
            const despensaProducts = products.filter(p => p.main_category === 'Despensa');
            console.log(`Products in Despensa: ${despensaProducts.length}`);
            const lataProducts = products.filter(p => p.category && p.category.toLowerCase().includes('lata'));
            console.log(`Products with 'lata' in category: ${lataProducts.length}`);
            if (lataProducts.length > 0) {
                console.log('Sample lata product:', lataProducts[0]);
            }
        }
    }, []);

    // Obtener tiendas únicas
    const stores = [...new Set(products.map(p => p.store_name).filter(Boolean))];

    // Filtrar y ordenar productos
    useEffect(() => {
        let filtered = [...products];

        console.log('🔍 DEBUG Filtering:');
        console.log('  Total products:', products.length);
        console.log('  Selected main category:', selectedMainCategory);
        console.log('  Selected subcategory:', selectedSubcategory);

        // Filtrar por categoría principal
        if (selectedMainCategory && selectedMainCategory !== 'all') {
            filtered = filtered.filter(p => p.main_category === selectedMainCategory);
            console.log('  After main category filter:', filtered.length);
        }

        // Filtrar por subcategoría (usar includes para búsqueda parcial)
        if (selectedSubcategory && selectedSubcategory !== 'all') {
            const beforeSubcat = filtered.length;
            filtered = filtered.filter(p =>
                p.category && p.category.toLowerCase().includes(selectedSubcategory.toLowerCase())
            );
            console.log(`  After subcategory filter (${selectedSubcategory}):`, filtered.length);
            console.log('  Before:', beforeSubcat, '→ After:', filtered.length);

            // Debug: mostrar algunos productos que pasaron el filtro
            if (filtered.length > 0) {
                console.log('  Sample filtered products:');
                filtered.slice(0, 3).forEach(p => {
                    console.log(`    - ${p.name} | category: "${p.category}" | main: "${p.main_category}"`);
                });
            } else {
                console.log('  ❌ NO PRODUCTS MATCHED!');
                // Mostrar algunos productos antes del filtro de subcategoría
                const sampleBeforeFilter = products
                    .filter(p => selectedMainCategory === 'all' || p.main_category === selectedMainCategory)
                    .slice(0, 5);
                console.log('  Sample products before subcategory filter:');
                sampleBeforeFilter.forEach(p => {
                    console.log(`    - ${p.name} | category: "${p.category}" | main: "${p.main_category}"`);
                });
            }
        }

        // Filtrar por tienda
        if (selectedStore !== 'all') {
            filtered = filtered.filter(p => p.store_name === selectedStore);
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
    }, [products, selectedMainCategory, selectedSubcategory, selectedStore, sortBy, searchTerm]);

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
                    toast.info('Eliminado de favoritos');
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
                toast.success('Agregado a favoritos');
            }
        } catch (error) {
            toast.error('Error al actualizar favoritos');
        }
    };

    const handleViewComparisons = (product) => {
        // Abrir modal de comparativas con el producto seleccionado
        setSelectedProduct(product);
        setShowComparativeModal(true);
    };

    const handleCloseModal = () => {
        setShowComparativeModal(false);
        setSelectedProduct(null);
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

                    {/* Info: Filtrado por código postal */}
                    {store.user && store.user.postal_code && (
                        <div className="alert alert-info d-flex align-items-center justify-content-center mt-3 mx-auto"
                            style={{ maxWidth: '600px' }}
                            role="alert">
                            <i className="bi bi-geo-alt-fill me-2"></i>
                            <div>
                                Mostrando productos disponibles para el código postal <strong>{store.user.postal_code}</strong>
                                <br />
                                <small>
                                    Puedes cambiar tu código postal desde tu <a href="/user" className="alert-link">perfil de usuario</a>
                                </small>
                            </div>
                        </div>
                    )}

                    {/* Warning: Sin código postal */}
                    {store.user && !store.user.postal_code && (
                        <div className="alert alert-warning d-flex align-items-center justify-content-center mt-3 mx-auto"
                            style={{ maxWidth: '600px' }}
                            role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>
                                No has configurado tu código postal
                                <br />
                                <small>
                                    <a href="/user" className="alert-link">Configúralo en tu perfil</a> para ver productos disponibles en tu área
                                </small>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filters Bar */}
                <CatalogFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedMainCategory={selectedMainCategory || 'all'}
                    setSelectedMainCategory={setSelectedMainCategory}
                    selectedSubcategory={selectedSubcategory}
                    setSelectedSubcategory={setSelectedSubcategory}
                    selectedStore={selectedStore}
                    setSelectedStore={setSelectedStore}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    mainCategories={mainCategories}
                    subcategories={subcategories}
                    stores={stores}
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

            {/* Modal de Comparativas */}
            {showComparativeModal && selectedProduct && (
                <ComparativeModal3
                    isOpen={showComparativeModal}
                    onClose={handleCloseModal}
                    product={selectedProduct}
                />
            )}
        </div>
    );
};

export default CatalogPage;
