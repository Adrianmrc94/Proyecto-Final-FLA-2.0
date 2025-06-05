import React, { useState, useEffect } from 'react';
import FavoriteProduct from '../components/modales/FavoriteProduct';
import ApiService from '../services/api';

const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  const handleRemoveFavorite = (favoriteId) => {
    setFavoriteProducts(prev => prev.filter(fav => fav.id !== favoriteId));
  };

  if (isLoading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Cargando productos favoritos...</p>
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

  if (!favoriteProducts || favoriteProducts.length === 0) {
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
        <span className="badge bg-primary fs-6">
          {favoriteProducts.length} producto{favoriteProducts.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="row">
        {favoriteProducts.map((favorite, index) => (
          <FavoriteProduct
            key={`favorite-${favorite.id}-${index}`}
            product={favorite.product || favorite}
            favoriteId={favorite.id}
            onRemoveFavorite={handleRemoveFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorites;