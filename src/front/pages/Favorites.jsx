import React, { useState, useEffect } from 'react';
import FavoriteProduct from '../components/modales/FavoriteProduct';
import FavoriteComparisonCard from '../components/favorites/FavoriteComparisonCard';
import ApiService from '../services/api';
import useComparativeFavorites from '../hooks/useComparativeFavorites';

const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products'); // 'products' o 'comparisons'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const {
    comparisons,
    isLoading: comparisonsLoading,
    fetchComparisons,
    deleteComparison,
    updateComparison
  } = useComparativeFavorites();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await ApiService.fetchFavorites();

        if (data && Array.isArray(data)) {
          setFavoriteProducts(data);
        } else if (data && data.favorites && Array.isArray(data.favorites)) {
          setFavoriteProducts(data.favorites);
        } else {
          setFavoriteProducts([]);
        }
      } catch (err) {
        setError(err.message || 'Error al cargar favoritos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
    fetchComparisons(); // Cargar también las comparativas
  }, []);

  const handleRemoveFavorite = (favoriteId) => {
    setFavoriteProducts(prev => prev.filter(fav => fav.id !== favoriteId));
  };

  // Paginación para productos
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = favoriteProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(favoriteProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteComparison = async (comparisonId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta comparativa?')) {
      await deleteComparison(comparisonId);
    }
  };

  const handleUpdateComparison = async (comparisonId, newName) => {
    await updateComparison(comparisonId, newName);
  };

  if (isLoading || comparisonsLoading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Cargando favoritos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger">
          <h4>Error al cargar favoritos</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const hasNoFavorites = (!favoriteProducts || favoriteProducts.length === 0) &&
    (!comparisons || comparisons.length === 0);

  if (hasNoFavorites) {
    return (
      <div className="container text-center mt-5">
        <div className="card shadow-sm">
          <div className="card-body p-5">
            <i className="bi bi-heart display-1 text-muted mb-3"></i>
            <h3>Aún no tienes favoritos</h3>
            <p className="text-muted">Explora productos y agrega tus favoritos para verlos aquí</p>
            <a href="/home" className="btn btn-primary">
              Explorar Productos
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="bi bi-heart-fill text-danger me-2"></i>
          Mis Favoritos
        </h1>
      </div>

      {/* Pestañas para alternar entre productos y comparativas */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => { setActiveTab('products'); setCurrentPage(1); }}
          >
            <i className="bi bi-bag-heart me-2"></i>
            Productos
            <span className="badge bg-primary ms-2">{favoriteProducts.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'comparisons' ? 'active' : ''}`}
            onClick={() => { setActiveTab('comparisons'); setCurrentPage(1); }}
          >
            <i className="bi bi-bar-chart-fill me-2"></i>
            Comparativas
            <span className="badge bg-success ms-2">{comparisons.length}</span>
          </button>
        </li>
      </ul>

      {/* Contenido de la pestaña activa */}
      {activeTab === 'products' ? (
        <div className="row">
          {favoriteProducts.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                No tienes productos favoritos guardados
              </div>
            </div>
          ) : (
            <>
              {currentProducts.map((favorite, index) => (
                <FavoriteProduct
                  key={`favorite-${favorite.id}-${index}`}
                  product={favorite.product || favorite}
                  favoriteId={favorite.id}
                  onRemoveFavorite={handleRemoveFavorite}
                />
              ))}
              
              {/* Paginación */}
              {totalPages > 1 && (
                <div className="col-12">
                  <nav aria-label="Paginación de favoritos" className="d-flex justify-content-center mt-4">
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Anterior
                        </button>
                      </li>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Siguiente
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="row">
          {comparisons.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                No tienes comparativas favoritas guardadas.
                Abre una comparativa de productos y haz clic en "Guardar Comparativa".
              </div>
            </div>
          ) : (
            comparisons.map((comparison) => (
              <FavoriteComparisonCard
                key={comparison.id}
                comparison={comparison}
                onDelete={handleDeleteComparison}
                onUpdate={handleUpdateComparison}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Favorites;