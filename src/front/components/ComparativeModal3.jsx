const ComparativeModal3 = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Comparativa del Producto</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="row">
                <div className="col-md-4 text-center">
                  <img src="https://productoscalima.com/wp-content/uploads/2024/02/fosforito-productos-calima.png" className="img-fluid rounded mb-3" alt="Producto" />
                  <h6 className="mt-3">Descripción</h6>
                  <p className="text-muted">Detalles breves sobre el producto.</p>
                  <h6>Puntuación</h6>
                  <div className="text-warning fs-4">
                    &#9733; &#9733; &#9733; &#9733; &#9734;
                  </div>
                  <button className="btn btn-outline-warning mt-2">⭐ Favorito</button>
                </div>

                <div className="col-md-4 text-center">
                  <h6 className="mb-3">Comparativas</h6>
                  <button className="btn btn-primary w-100 mb-2">Comparativa Precio</button>
                  <button className="btn btn-info w-100 mb-2">Comparativa Distancia</button>
                  <button className="btn btn-success w-100 mb-2">Comparativa Calificación</button>
                </div>

                <div className="col-md-4 text-center">
                  <img src="https://productoscalima.com/wp-content/uploads/2024/02/fosforito-productos-calima.png" className="img-fluid rounded mb-3" alt="Producto" />
                  <h6 className="mt-3">Descripción</h6>
                  <p className="text-muted">Detalles breves sobre el producto.</p>
                  <h6>Puntuación</h6>
                  <div className="text-warning fs-4">
                    &#9733; &#9733; &#9733; &#9733; &#9734;
                  </div>
                  <button className="btn btn-outline-warning mt-2">⭐ Favorito</button>
                </div>
              </div>
            </div>
          </div>

          
          <div className="modal-footer justify-content-center">
            <button className="btn btn-outline-secondary">
              Scroll →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparativeModal3;