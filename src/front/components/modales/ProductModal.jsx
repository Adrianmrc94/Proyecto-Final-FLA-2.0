import React, { useState } from "react";
import useDarkMode from "../../hooks/useDarkMode";
import useProductFavorites from "../../hooks/useProductFavorites";
import Toast from "../Toast";

export default function ProductModal({ product, show, onClose, mode = "view", onFavoriteRemoved }) {
  if (!product) return null;

  const { darkMode } = useDarkMode();
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const {
    isFavorite,
    isProcessing,
    handleToggleFavorite,
    buttonConfig
  } = useProductFavorites(product, show, onFavoriteRemoved, showToast);

  // Normalización de datos
  const title = product.name || product.title || "Producto sin nombre";
  const price = product.price ?? "N/A";
  const description = product.description || "Sin descripción";
  const imageUrl = product.image || product.images?.[0] || "https://placehold.co/150x150?text=No+Image";
  const rating = product.rate || product.rating || 0;

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className={`modal fade ${show ? "show d-block" : ""}`} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className={`modal-content ${darkMode ? "dark-mode" : "light-mode"}`}>

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                {mode === "favorite" && <i className="bi bi-heart-fill text-danger me-2"></i>}
                {title}
              </h5>
              <div className="d-flex align-items-center">
                <button
                  className={buttonConfig.className}
                  onClick={handleToggleFavorite}
                  disabled={buttonConfig.disabled}
                  title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  {buttonConfig.content}
                </button>
                <button className="btn-close ms-2" onClick={onClose}></button>
              </div>
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="row">
                <div className="col-md-5 text-center">
                  <img src={imageUrl} alt={title} className="img-fluid rounded" style={{ maxHeight: "300px" }} />
                  <div className="text-warning mt-2">⭐ {rating}/5</div>
                </div>
                <div className="col-md-7">
                  <h6>Descripción</h6>
                  <p>{description}</p>
                  <h6>Precio</h6>
                  <div className="alert alert-info">
                    <div className="fs-4 fw-bold">${price}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}