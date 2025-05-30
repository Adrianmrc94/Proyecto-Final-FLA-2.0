import React, { useState, useEffect } from 'react';
import FavoriteProduct from '../components/FavoriteProduct';

const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://dummyjson.com/products?limit=12'); // Carga 10 productos de ejemplo
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setFavoriteProducts(data.products || []); // La API devuelve un objeto con una propiedad 'products' que es un array
      } catch (err) {
        console.error("Error al cargar productos favoritos:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, []); // para impedir bucle

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

  if (favoriteProducts.length === 0) {
    return (
      <div className="container text-center mt-5">
        <p>Aún no tienes productos favoritos.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Mis Productos Favoritos</h1>
      <div className="row justify-content-center">
        {favoriteProducts.map(product => (
          // Pasamos cada objeto 'product' al componente FavoriteProduct
          // Aseguramos que product no sea undefined antes de renderizar
          product ? <FavoriteProduct key={product.id} product={product} /> : null
        ))}
      </div>
    </div>
  );
};

export default Favorites;