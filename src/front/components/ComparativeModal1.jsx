const ComparativeModal1 = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Comparación del Producto</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="row">
                <div className="col-md-6 text-center">

                  <img src="https://productoscalima.com/wp-content/uploads/2024/02/fosforito-productos-calima.png" className="img-fluid rounded mb-3" alt="Producto" />
                  <h6>Puntuación</h6>
                  <div className="text-warning fs-4">
                    &#9733; &#9733; &#9733; &#9733; &#9734;
                  </div>
                  <button className="btn btn-outline-warning mt-2">⭐ Favorito</button>

                </div>

                <div className="col-md-6 text-center">
                  <h6>Descripción</h6>
                  <p className="text-muted">Breve descripción del producto con características clave.</p>
                  <h6>Comparativa de precios</h6>
                  <div className="d-flex justify-content-around border p-2 rounded">
                    <div>
                      <h6>Tienda 1</h6>
                      <p>€99.99</p>
                    </div>
                    <div>
                      <h6>Tienda 2</h6>
                      <p>€89.99</p>
                    </div>
                  </div>
                  <h6 className="mt-3">Gráfica</h6>
                  <div className="border p-3 rounded bg-light">
                    Espacio reservado para una gráfica 📊
                  </div>
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

export default ComparativeModal1;