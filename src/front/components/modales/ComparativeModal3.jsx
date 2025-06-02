import React, { useEffect, useState } from "react";

const ComparativeModal3 = ({ isOpen, onClose, product }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !product) return;

    const fetchComparison = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://glowing-engine-g47g9q94v665hpwq5-3001.app.github.dev/";

        // Buscar productos similares (por nombre o categoría)
        const searchRes = await fetch(
          `${BACKEND_URL}/api/search?query=${encodeURIComponent(product.name || product.title)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        let similar = null;
        if (searchRes.ok) {
          const found = await searchRes.json();
          similar = found.find(
            p => p.id !== product.id && (
              (p.name && product.name && p.name.toLowerCase().includes(product.name.toLowerCase().split(" ")[0])) ||
              (p.category && product.category && p.category === product.category)
            )
          );
        }

        // Si no hay similar, elige uno aleatorio distinto
        if (!similar) {
          const randomRes = await fetch(`${BACKEND_URL}/api/random-product`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (randomRes.ok) {
            const randomProduct = await randomRes.json();
            if (randomProduct.id !== product.id) similar = randomProduct;
          }
        }

        // Si no hay ningún otro producto, muestra solo el base
        if (!similar) {
          setProducts([product]);
          setLoading(false);
          return;
        }

        // Llama al endpoint de comparación con ambos IDs
        const compareRes = await fetch(`${BACKEND_URL}/api/products/compare`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ product_ids: [product.id, similar.id] })
        });
        if (compareRes.ok) {
          const data = await compareRes.json();
          setProducts(data);
        } else {
          setProducts([product, similar]);
        }
      } catch (e) {
        setProducts([product]);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Renderiza la comparación si hay dos productos, o un mensaje si solo hay uno
  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Comparativa de Productos</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="text-center">Cargando...</div>
            ) : products.length === 2 ? (
              <div>
                Comparativa entre <strong>{products[0].name || products[0].title}</strong> y <strong>{products[1].name || products[1].title}</strong>
              </div>
            ) : products.length === 1 ? (
              <div className="text-center text-muted">
                No se encontró otro producto similar para comparar.<br />
                Solo hay un producto disponible.
              </div>
            ) : (
              <div className="text-center text-muted">
                No hay productos para comparar.
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer justify-content-center">
        </div>
      </div>
    </div>
  );
};

export default ComparativeModal3;