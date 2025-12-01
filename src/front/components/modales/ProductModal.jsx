import React, { useState } from "react";
import useDarkMode from "../../hooks/useDarkMode";
import useProductFavorites from "../../hooks/useProductFavorites";
import Toast from "../Toast";
import { getProductImageUrl } from "../../utils/imageUtils";

export default function ProductModal({ product, show, onClose, mode = "view", onFavoriteRemoved }) {
  if (!product) return null;

  const { darkMode } = useDarkMode();
  const [toast, setToast] = useState(null);

  // Debug logging
  if (mode === "favorite") {
    console.log("🔍 ProductModal - Producto recibido:", product);
    console.log("   store_name:", product.store_name);
    console.log("   category:", product.category);
    console.log("   main_category:", product.main_category);
  }

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
  const imageUrl = getProductImageUrl(product);
  const rating = product.rate || product.rating || 0;
  const storeName = product.store_name || "Tienda no especificada";
  const category = product.category || "Sin categoría";
  const mainCategory = product.main_category || null;

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
                  <img
                    src={imageUrl}
                    alt={title}
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: "300px" }}
                    onError={(e) => e.target.src = "https://placehold.co/150x150?text=No+Image"}
                  />
                  {rating > 0 && (
                    <div className="text-warning mt-3">
                      <i className="bi bi-star-fill me-1"></i>
                      {rating}/5
                    </div>
                  )}
                </div>
                <div className="col-md-7">
                  {/* Tienda y Categoría */}
                  <div className="mb-3 d-flex flex-wrap gap-2">
                    <span className="badge bg-primary fs-6">
                      <i className="bi bi-shop me-1"></i>
                      {storeName}
                    </span>
                    {mainCategory && (
                      <span className="badge bg-success fs-6">
                        <i className="bi bi-grid-3x3-gap me-1"></i>
                        {mainCategory}
                      </span>
                    )}
                    <span className="badge bg-secondary fs-6">
                      <i className="bi bi-tag me-1"></i>
                      {category}
                    </span>
                  </div>

                  {/* Precio destacado */}
                  <div className="alert alert-success border-0 shadow-sm mb-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <small className="text-muted d-block">Precio</small>
                        <div className="fs-3 fw-bold text-success">${price}</div>
                      </div>
                      <i className="bi bi-currency-dollar fs-1 text-success opacity-25"></i>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">
                      <i className="bi bi-info-circle me-2"></i>
                      Descripción
                    </h6>
                    <p className="text-justify">{description}</p>
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