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

        console.log("Initial product for comparison:", product);

        let normalizedCategory = product.category;
        if (normalizedCategory) {
          normalizedCategory = normalizedCategory.replace(/-/g, " ").trim().toLowerCase();
        }

        // Estrategia de múltiples búsquedas para encontrar productos similares
        let similar = null;

        // 1. Buscar por categoría exacta
        const searchRes = await fetch(
          `${BACKEND_URL}/api/search?query=&category=${encodeURIComponent(normalizedCategory)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (searchRes.ok) {
          const found = await searchRes.json();
          console.log(`API search returned for '${normalizedCategory}':`, found);

          const otherProductsInCategory = found.filter(p => {
            if (p.id === product.id) {
              return false;
            }
            let pNormalizedCategory = p.category;
            if (pNormalizedCategory) {
              pNormalizedCategory = pNormalizedCategory.replace(/-/g, " ").trim().toLowerCase();
            }
            return pNormalizedCategory === normalizedCategory;
          });

          if (otherProductsInCategory.length > 0) {
            similar = otherProductsInCategory[Math.floor(Math.random() * otherProductsInCategory.length)];
            console.log("Found similar product by exact category:", similar);
          }
        }

        // 2. Si no se encontró, buscar por palabras clave de la categoría
        if (!similar && normalizedCategory) {
          const categoryWords = normalizedCategory.split(" ");
          
          // Priorizar palabras más específicas (como "shoes", "bags", etc.)
          const prioritizedWords = categoryWords.filter(word => 
            word.length > 3 && !['womens', 'mens'].includes(word)
          );
          
          // Si no hay palabras específicas, usar todas las palabras válidas
          const searchWords = prioritizedWords.length > 0 ? prioritizedWords : categoryWords;

          for (const word of searchWords) {
            if (word.length > 2) { // Solo palabras de más de 2 caracteres
              const keywordSearchRes = await fetch(
                `${BACKEND_URL}/api/search?query=${encodeURIComponent(word)}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (keywordSearchRes.ok) {
                const keywordFound = await keywordSearchRes.json();
                console.log(`Keyword search for '${word}' returned:`, keywordFound);

                // Priorizar productos de la misma subcategoría
                const keywordFiltered = keywordFound.filter(p => {
                  if (p.id === product.id) return false;
                  
                  const pCategory = p.category?.toLowerCase() || '';
                  const productCategory = normalizedCategory || '';
                  
                  // Buscar coincidencias más específicas primero
                  if (pCategory.includes(word) && pCategory !== productCategory) {
                    // Si ambos productos comparten palabras específicas pero no son exactamente iguales
                    const pCategoryWords = pCategory.split(/[\s-]+/);
                    const productCategoryWords = productCategory.split(/[\s-]+/);
                    
                    // Contar palabras en común excluyendo términos genéricos
                    const commonSpecificWords = pCategoryWords.filter(w => 
                      productCategoryWords.includes(w) && 
                      w.length > 3 && 
                      !['womens', 'mens', 'for', 'the', 'and'].includes(w)
                    );
                    
                    return commonSpecificWords.length > 0;
                  }
                  
                  // Como fallback, buscar en nombre también
                  return p.name?.toLowerCase().includes(word);
                });

                if (keywordFiltered.length > 0) {
                  // Priorizar productos con más palabras en común con la categoría original
                  keywordFiltered.sort((a, b) => {
                    const aCategory = a.category?.toLowerCase() || '';
                    const bCategory = b.category?.toLowerCase() || '';
                    const productWords = normalizedCategory.split(/[\s-]+/);
                    
                    const aCommonWords = productWords.filter(w => aCategory.includes(w)).length;
                    const bCommonWords = productWords.filter(w => bCategory.includes(w)).length;
                    
                    return bCommonWords - aCommonWords;
                  });
                  
                  similar = keywordFiltered[0]; // Tomar el más relevante
                  console.log(`Found similar product by keyword '${word}':`, similar);
                  break;
                }
              }
            }
          }
        }

        // 3. Si aún no se encontró, buscar productos generales y elegir uno al azar
        if (!similar) {
          const generalSearchRes = await fetch(
            `${BACKEND_URL}/api/search?query=`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (generalSearchRes.ok) {
            const allProducts = await generalSearchRes.json();
            const otherProducts = allProducts.filter(p => p.id !== product.id);

            if (otherProducts.length > 0) {
              similar = otherProducts[Math.floor(Math.random() * otherProducts.length)];
              console.log("Found random product for comparison:", similar);
            }
          }
        }

        if (!similar) {
          console.log("No similar product found, using only initial product:", [product]);
          setProducts([product]);
          setLoading(false);
          return;
        }

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
          console.log("Data from /api/products/compare:", data);
          setProducts(data);
        } else {
          console.log("Comparison API call failed, using initial and similar product:", [product, similar]);
          setProducts([product, similar]);
        }
      } catch (e) {
        console.error("Error fetching comparison:", e);
        setProducts([product]);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const modalDisplayClass = isOpen ? "d-block" : "d-none";

  if (loading) {
    return (
      <div className={`modal fade show ${modalDisplayClass}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Comparativa de Productos</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body text-center">
              Cargando...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length < 2) {
    return (
      <div className={`modal fade show ${modalDisplayClass}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Comparativa de Productos</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body text-center text-muted">
              No se encontró otro producto similar para comparar.<br />
              Solo hay un producto disponible.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [p1, p2] = products;

  return (
    <div className={`modal fade show ${modalDisplayClass}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
      <div className="modal-dialog modal-dialog-centered modal-xl"> {/* modal-xl for wider content */}
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Comparativa de Productos</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row justify-content-center align-items-start g-4 mb-3">
              {/* Imagen 1 */}
              <div className="col-md-3 text-center">
                <img
                  src={p1.image || p1.img || "https://via.placeholder.com/180"}
                  alt={p1.name}
                  className="img-fluid rounded border bg-light"
                  style={{ width: "180px", height: "180px", objectFit: "contain" }}
                />
              </div>
              {/* Comparativas centrales */}
              <div className="col-md-4 d-flex flex-column gap-3 align-items-center justify-content-center">
                <div className="card shadow-sm p-3 text-center w-100">
                  <div className="fw-bold mb-1">Precio</div>
                  <div>
                    <span className={p1.price < p2.price ? "text-success fw-bold" : ""}>${p1.price}</span> vs{" "}
                    <span className={p2.price < p1.price ? "text-success fw-bold" : ""}>${p2.price}</span>
                  </div>
                </div>
                <div className="card shadow-sm p-3 text-center w-100">
                  <div className="fw-bold mb-1">Calificación</div>
                  <div>
                    <span className={p1.rate > p2.rate ? "text-success fw-bold" : ""}>{p1.rate ?? "N/A"}</span> vs{" "}
                    <span className={p2.rate > p1.rate ? "text-success fw-bold" : ""}>{p2.rate ?? "N/A"}</span>
                  </div>
                </div>
              </div>
              {/* Imagen 2 */}
              <div className="col-md-3 text-center">
                <img
                  src={p2.image || p2.img || "https://via.placeholder.com/180"}
                  alt={p2.name}
                  className="img-fluid rounded border bg-light"
                  style={{ width: "180px", height: "180px", objectFit: "contain" }}
                />
              </div>
            </div>
            {/* Descripciones */}
            <div className="row justify-content-center g-4 mb-2">
              <div className="col-md-5">
                <div className="bg-light rounded border p-2" style={{ minHeight: "60px", fontSize: "0.9rem" }}>{p1.description}</div>
              </div>
              <div className="col-md-5">
                <div className="bg-light rounded border p-2" style={{ minHeight: "60px", fontSize: "0.9rem" }}>{p2.description}</div>
              </div>
            </div>
            {/* Calificaciones individuales */}
            <div className="row justify-content-center g-4 mb-3">
              <div className="col-md-5">
                <div className="border rounded p-2 text-center">Calificación: <span className="text-success fw-bold">{p1.rate ?? "N/A"}</span></div>
              </div>
              <div className="col-md-5">
                <div className="border rounded p-2 text-center">Calificación: <span className="text-success fw-bold">{p2.rate ?? "N/A"}</span></div>
              </div>
            </div>
            {/* Scroll horizontal para specs extra */}
            <div className="table-responsive mt-3">
              <table className="table table-bordered text-center">
                <thead className="table-light">
                  <tr>
                    <th>Atributo</th>
                    <th>{p1.name}</th>
                    <th>{p2.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Tienda</th>
                    <td>{p1.store_name || "N/A"}</td>
                    <td>{p2.store_name || "N/A"}</td>
                  </tr>
                  <tr>
                    <th scope="row">Categoría</th>
                    <td>{p1.category}</td>
                    <td>{p2.category}</td>
                  </tr>
                  {/* Agrega más filas si quieres comparar otros atributos */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparativeModal3;