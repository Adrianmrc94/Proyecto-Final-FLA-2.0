import React, { useEffect } from "react";

export default function ProductModal({ product, show, onClose, onFavorite }) {
  if (!product) return null;

  const { title, price, description, images, rating } = product;

  // Detectar clic fuera del modal
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
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header justify-content-between align-items-center">
            <h5 className="modal-title">{title}</h5>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-danger me-2"
                onClick={() => onFavorite(product)}
                title="Agregar a favoritos"
                style={{ fontSize: "1.5rem" }}
              >
                ❤️
              </button>
              {/* Quitar el botón de cierre X */}
            </div>
          </div>

          <div className="modal-body d-flex flex-column align-items-center">
            <div className="text-center mb-4">
              <img
                src={images[0]}
                alt={title}
                className="img-fluid rounded"
                style={{ maxWidth: "300px" }}
              />
              <div className="text-warning fw-bold mt-2">⭐ {rating}/5</div>
            </div>

            <div className="w-100 text-center">
              <p className="mb-4">{description}</p>
              <h4 className="text-success">${price}</h4>
            </div>
          </div>

          <div className="modal-footer justify-content-center">
            <span className="text-muted">Tienda: dummyjson</span>
          </div>
        </div>
      </div>
    </div>
  );
}