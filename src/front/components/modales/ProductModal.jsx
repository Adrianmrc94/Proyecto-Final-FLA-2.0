import React, { useEffect, useState } from "react";
import useDarkMode from "../../hooks/useDarkMode"; // Importamos el hook de modo oscuro

export default function ProductModal({ product, show, onClose, onRemoveFavorite }) {
  if (!product) return null;
  const { darkMode } = useDarkMode(); // Accedemos al estado del modo oscuro
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

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

  


  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className={`modal-content ${darkMode ? "dark-mode" : "light-mode"}`}>
          <div className="modal-header justify-content-between align-items-center">
            <h5 className="modal-title">{title}</h5>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-danger me-2"
                title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                style={{ fontSize: "1.5rem" }}
              >
                <i className={isFavorite ? "bi bi-heart-fill" : "bi bi-heart"} style={{ fontSize: "2rem" }}></i>
              </button>
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