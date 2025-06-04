import React, { useState, useEffect } from 'react';
import FavoriteProduct from '../components/productos/FavoriteProduct';

const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/api/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setFavoriteProducts(data); // El backend devuelve un array de favoritos
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, []); // para impedir bucle

    // Nueva función para eliminar favorito del estado
  const handleRemoveFavorite = (favoriteId) => {
    setFavoriteProducts(prev => prev.filter(fav => fav.id !== favoriteId));
    setProducts(prev => prev.filter(prod => {
      // Busca el favorito eliminado para obtener el product_id
      const fav = favoriteProducts.find(f => f.id === favoriteId);
      return fav ? prod.id !== fav.product_id : true;
    }));
  };

  useEffect(() => {
    if (favoriteProducts.length === 0) return;
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const productDetails = await Promise.all(
          favoriteProducts.map(async (fav) => {
            const res = await fetch(`${BACKEND_URL}/api/products/${fav.product_id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) return null;
            return await res.json();
          })
        );
        setProducts(productDetails.filter(Boolean));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProducts();
  }, [favoriteProducts]);

  if (isLoading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando productos favoritos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        <p className="text-danger">Error al cargar productos: {error}</p>
        <p>Por favor, inténtalo de nuevo más tarde.</p>
      </div>
    );
  }

  const uniqueProducts = products.filter(
    (prod, idx, arr) => prod && arr.findIndex(p => p && p.id === prod.id) === idx
  );

  return (
    uniqueProducts.length === 0 ? (
      <div className="container text-center mt-5">
        <p>Aún no tienes productos favoritos.</p>
      </div>
    ) : (
      <div className="container mt-4">
        <h1 className="mb-4 text-center">Mis Productos Favoritos</h1>
        <div className="row justify-content-center">
          {uniqueProducts.map(product =>
            product ? (
              <FavoriteProduct
                key={product.id}
                product={product}
                onRemoveFavorite={handleRemoveFavorite}
              />
            ) : null
          )}
        </div>
      </div>
    )
  )
};

export default Favorites;