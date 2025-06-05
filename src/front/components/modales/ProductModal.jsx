import React, { useEffect, useState } from "react";
import useDarkMode from "../../hooks/useDarkMode";

export default function ProductModal({ product, show, onClose, onRemoveFavorite }) {
  if (!product) return null;
  const { darkMode } = useDarkMode();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Soporte para diferentes fuentes de datos
  const title = product.name || product.title || "Producto sin nombre";
  const price = product.price ?? "N/A";
  const description = product.description || "Sin descripción";
  const imageUrl =
    (product.images && product.images[0]) ||
    product.image ||
    "https://via.placeholder.com/300x300?text=Sin+Imagen";

  // Soporte para rating en diferentes formatos
  const rating =
    typeof product.rating === "object"
      ? product.rating.rate
      : product.rating ?? product.rate ?? 0;
  const ratingCount =
    typeof product.rating === "object" && product.rating.count
      ? product.rating.count
      : product.ratingCount ?? null;

  let tienda = "Desconocida";
  if (product.store_name) tienda = product.store_name;
  else if (product.source === "dummyjson") tienda = "DummyJSON";
  else if (product.source === "fakestore") tienda = "FakeStore";

  // Detectar si el producto ya está en favoritos
  useEffect(() => {
    if (!show || !product) return;
    const checkFavorite = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsFavorite(false);
        setFavoriteId(null);
        return;
      }
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      try {
        const response = await fetch(`${BACKEND_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const found = data.find(fav => fav.product_id === product.id);
          setIsFavorite(!!found);
          setFavoriteId(found ? found.id : null);
        } else {
          setIsFavorite(false);
          setFavoriteId(null);
        }
      } catch (e) {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    };
    checkFavorite();
  }, [show, product]);

  // Función para agregar/quitar favorito
  const handleToggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsProcessing('error');
      setTimeout(() => setIsProcessing(false), 3000);
      return;
    }

    setIsProcessing('loading');
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    try {
      if (isFavorite && favoriteId) {
        // Quitar de favoritos usando el id del favorito
        const response = await fetch(`${BACKEND_URL}/api/favorites/${favoriteId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setIsFavorite(false);
          setFavoriteId(null);
          setIsProcessing('removed');
          
          // Resetear después de 2 segundos
          setTimeout(() => setIsProcessing(false), 2000);
        } else {
          setIsProcessing('error');
          setTimeout(() => setIsProcessing(false), 3000);
        }
      } else {
        // Agregar a favoritos
        const body = {
          product_id: product.id,
          store_id: product.store_id || 1,
          date_ad: new Date().toISOString().slice(0, 10)
        };
        
        const response = await fetch(`${BACKEND_URL}/api/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
        
        if (response.ok) {
          setIsFavorite(true);
          
          // Actualizar el favoriteId después de agregar
          const favs = await fetch(`${BACKEND_URL}/api/favorites`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (favs.ok) {
            const data = await favs.json();
            const found = data.find(fav => fav.product_id === product.id);
            setFavoriteId(found ? found.id : null);
          }
          
          setIsProcessing('added');
          
          // Resetear después de 2 segundos
          setTimeout(() => setIsProcessing(false), 2000);
        } else {
          setIsProcessing('error');
          setTimeout(() => setIsProcessing(false), 3000);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setIsProcessing('error');
      setTimeout(() => setIsProcessing(false), 3000);
    }
  };

  // Detectar clic fuera del modal para cerrarlo
  useEffect(() => {
    if (!show) return;
    const handleClickOutside = (e) => {
      const modalContent = document.querySelector(".modal-content");
      if (modalContent && !modalContent.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  // Función para obtener el contenido del botón según el estado
  const getButtonContent = () => {
    switch (isProcessing) {
      case 'loading':
        return {
          className: "btn btn-secondary me-2 d-flex align-items-center",
          content: (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Procesando...
            </>
          ),
          disabled: true
        };
      case 'added':
        return {
          className: "btn btn-success me-2 d-flex align-items-center",
          content: (
            <>
              <i className="bi bi-check-circle-fill me-2"></i>
              ¡Agregado a favoritos! 💖
            </>
          ),
          disabled: true
        };
      case 'removed':
        return {
          className: "btn btn-warning me-2 d-flex align-items-center",
          content: (
            <>
              <i className="bi bi-check-circle-fill me-2"></i>
              ¡Eliminado de favoritos! 💔
            </>
          ),
          disabled: true
        };
      case 'error':
        return {
          className: "btn btn-danger me-2 d-flex align-items-center",
          content: (
            <>
              <i className="bi bi-x-circle-fill me-2"></i>
              {!localStorage.getItem("token") ? "Inicia sesión" : "Error"}
            </>
          ),
          disabled: true
        };
      default:
        return {
          className: `btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} me-2 d-flex align-items-center`,
          content: (
            <>
              <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"} me-2`}></i>
              <span className="d-none d-md-inline">
                {isFavorite ? 'En Favoritos' : 'Agregar a Favoritos'}
              </span>
              <span className="d-md-none">
                {isFavorite ? 'Favorito' : 'Agregar'}
              </span>
            </>
          ),
          disabled: false
        };
    }
  };

  const buttonConfig = getButtonContent();

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className={`modal-content ${darkMode ? "dark-mode" : "light-mode"}`}>
          <div className="modal-header justify-content-between align-items-center">
            <h5 className="modal-title">{title}</h5>
            <div className="d-flex align-items-center">
              <button
                className={buttonConfig.className}
                onClick={handleToggleFavorite}
                disabled={buttonConfig.disabled}
                title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                style={{ 
                  minWidth: '150px',
                  transition: 'all 0.3s ease'
                }}
              >
                {buttonConfig.content}
              </button>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
          </div>

          <div className="modal-body d-flex flex-column align-items-center">
            <div className="text-center mb-4">
              <img src={imageUrl} alt={title} className="img-fluid rounded" style={{ maxWidth: "300px" }} />
              <div className="text-warning fw-bold mt-2">
                ⭐ {rating}/5 {ratingCount ? `(${ratingCount} votos)` : ""}
              </div>
            </div>

            <div className="w-100 text-center">
              <p className="mb-4">{description}</p>
              <h4 className="text-success">{typeof price === "number" ? `$${price}` : price}</h4>
            </div>
          </div>

          <div className="modal-footer justify-content-center">
            <span className="text-muted">Tienda: {tienda}</span>
          </div>
        </div>
      </div>
    </div>
  );
}