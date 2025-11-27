import React, { useEffect, useState } from "react";
import useDarkMode from "../../hooks/useDarkMode"; // Importamos el hook de modo oscuro
import useComparativeFavorites from "../../hooks/useComparativeFavorites";
import ApiService from "../../services/api";
import { toast } from 'react-toastify';

const ComparativeModal3 = ({ isOpen, onClose, product }) => {
  const { darkMode } = useDarkMode(); // Accedemos al estado del modo oscuro
  const { addComparison } = useComparativeFavorites();
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [comparisonName, setComparisonName] = useState("");
  const [saving, setSaving] = useState(false);

  // Cargar favoritos al abrir el modal
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favorites = await ApiService.fetchFavorites();
        setFavoriteIds(new Set(favorites.map(fav => fav.product.id)));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    if (isOpen) {
      loadFavorites();
    }
  }, [isOpen]);

  // Función para verificar si un producto es favorito
  const isFavorite = (productId) => favoriteIds.has(productId);

  // Función para agregar/quitar favoritos
  const handleToggleFavorite = async (productToToggle) => {
    try {
      if (isFavorite(productToToggle.id)) {
        await ApiService.removeFavorite(productToToggle.id);
        setFavoriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(productToToggle.id);
          return newSet;
        });
      } else {
        await ApiService.addFavorite({
          product_id: productToToggle.id,
          store_id: productToToggle.store_id || 1 // Usar store_id del producto o 1 por defecto
        });
        setFavoriteIds(prev => new Set(prev).add(productToToggle.id));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    if (!isOpen || !product) return;

    const fetchComparison = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


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

                  similar = keywordFiltered[0];
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
            }
          }
        }

        if (!similar) {
          setProducts([product]);
          setLoading(false);
          return;
        }

        const compareRes = await fetch(`${BACKEND_URL}/api/products/compare`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_ids: [product.id, similar.id] }),
        });
        if (compareRes.ok) {
          const data = await compareRes.json();
          setProducts(data);
        } else {
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

  const handleSaveComparison = async () => {
    if (!comparisonName.trim()) {
      toast.warning('Por favor ingresa un nombre para la comparativa', {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setSaving(true);
      const productIds = products.map(p => p.id);
      await addComparison(comparisonName, productIds, (msg, type) => {
        if (type === 'success') {
          setShowSaveModal(false);
          setComparisonName("");
          toast.success('🎉 ' + msg, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error(msg, {
            position: "top-right",
            autoClose: 4000,
          });
        }
      });
    } catch (error) {
      console.error('Error saving comparison:', error);
      toast.error('Error al guardar la comparativa', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !product) return null;


  const modalDisplayClass = isOpen ? "d-block" : "d-none";
  const modalTheme = darkMode ? "bg-dark text-light" : "bg-light text-dark";
  const cardTheme = darkMode ? "bg-secondary text-light" : "bg-white";
  const tableTheme = darkMode ? "table-dark" : "";

  if (loading) {
    return (
      <div className={`modal fade show ${modalDisplayClass}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className={`modal-content ${modalTheme}`}>
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">
                <i className="fas fa-chart-line me-2"></i>
                Comparativa de Productos
              </h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Buscando productos similares...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (products.length < 2) {
    return (
      <div className={`modal fade show ${modalDisplayClass}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className={`modal-content ${modalTheme}`}>
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">
                <i className="fas fa-chart-line me-2"></i>
                Comparativa de Productos
              </h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>
            <div className="modal-body text-center py-5">
              <i className="fas fa-exclamation-triangle text-warning fs-1 mb-3"></i>
              <h6 className="text-muted">No se encontró otro producto similar para comparar</h6>
              <p className="text-muted small">Solo hay un producto disponible en esta categoría</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [p1, p2] = products;

  return (
    <div className={`modal fade show ${modalDisplayClass}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className={`modal-content ${modalTheme}`}>
          {/* Header mejorado */}
          <div className="modal-header border-0 pb-0">
            <h4 className="modal-title fw-bold d-flex align-items-center">
              <i className="fas fa-chart-line me-2 text-primary"></i>
              Comparativa de Productos
            </h4>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>

          <div className="modal-body px-4">
            {/* Sección de productos con imágenes y nombres */}
            <div className="row mb-4">
              <div className="col-md-5">
                <div className={`card ${cardTheme} shadow-sm h-100 position-relative`}>
                  {/* Botón de favoritos */}
                  <button
                    className={`btn btn-sm position-absolute top-0 end-0 m-2 ${isFavorite(p1.id) ? 'btn-danger' : 'btn-outline-danger'
                      }`}
                    onClick={() => handleToggleFavorite(p1)}
                    style={{ zIndex: 10 }}
                    title={isFavorite(p1.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <i className={`bi ${isFavorite(p1.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  </button>
                  <div className="card-body text-center">
                    <div className="mb-3">
                      <img
                        src={p1.image || p1.img || "https://via.placeholder.com/200x200?text=No+Image"}
                        alt={p1.name}
                        className="img-fluid rounded shadow-sm"
                        style={{ width: "200px", height: "200px", objectFit: "contain", padding: "10px" }}
                      />
                    </div>
                    <h6 className="card-title fw-bold text-primary mb-2">{p1.name}</h6>
                    <p className="text-muted small mb-0">
                      <i className="fas fa-store me-1"></i>
                      {p1.store_name || "Tienda no especificada"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-2 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <i className="fas fa-balance-scale text-primary fs-2"></i>
                  <p className="text-muted small mt-2 mb-0">VS</p>
                </div>
              </div>

              <div className="col-md-5">
                <div className={`card ${cardTheme} shadow-sm h-100 position-relative`}>
                  {/* Botón de favoritos */}
                  <button
                    className={`btn btn-sm position-absolute top-0 end-0 m-2 ${isFavorite(p2.id) ? 'btn-danger' : 'btn-outline-danger'
                      }`}
                    onClick={() => handleToggleFavorite(p2)}
                    style={{ zIndex: 10 }}
                    title={isFavorite(p2.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <i className={`bi ${isFavorite(p2.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                  </button>
                  <div className="card-body text-center">
                    <div className="mb-3">
                      <img
                        src={p2.image || p2.img || "https://via.placeholder.com/200x200?text=No+Image"}
                        alt={p2.name}
                        className="img-fluid rounded shadow-sm"
                        style={{ width: "200px", height: "200px", objectFit: "contain", padding: "10px" }}
                      />
                    </div>
                    <h6 className="card-title fw-bold text-primary mb-2">{p2.name}</h6>
                    <p className="text-muted small mb-0">
                      <i className="fas fa-store me-1"></i>
                      {p2.store_name || "Tienda no especificada"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Descripciones */}
            <div className="row mb-4">
              <div className="col-12">
                <div className={`card ${cardTheme} shadow-sm`}>
                  <div className="card-body">
                    <h6 className="card-title text-center mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      Descripciones
                    </h6>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="border-start border-primary border-3 ps-3">
                          <h6 className="text-primary mb-2">{p1.name}</h6>
                          <p className="text-muted small mb-0" style={{ minHeight: "60px" }}>
                            {p1.description || "No hay descripción disponible"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="border-start border-success border-3 ps-3">
                          <h6 className="text-success mb-2">{p2.name}</h6>
                          <p className="text-muted small mb-0" style={{ minHeight: "60px" }}>
                            {p2.description || "No hay descripción disponible"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de especificaciones */}
            <div className="table-responsive">
              <table className={`table table-striped table-hover ${tableTheme}`}>
                <thead className="table-primary">
                  <tr>
                    <th scope="col" className="text-center">
                      <i className="fas fa-list-ul me-2"></i>
                      Atributo
                    </th>
                    <th scope="col" className="text-center">{p1.name}</th>
                    <th scope="col" className="text-center">{p2.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className="text-center">
                      <i className="fas fa-store me-2"></i>
                      Tienda
                    </th>
                    <td className="text-center">{p1.store_name || "N/A"}</td>
                    <td className="text-center">{p2.store_name || "N/A"}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="text-center">
                      <i className="fas fa-tag me-2"></i>
                      Categoría
                    </th>
                    <td className="text-center">
                      <span className="badge bg-primary">{p1.category}</span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-success">{p2.category}</span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="text-center">
                      <i className="fas fa-dollar-sign me-2"></i>
                      Precio
                    </th>
                    <td className="text-center">
                      <span className={`fw-bold ${p1.price < p2.price ? 'text-success' : ''}`}>
                        ${p1.price}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`fw-bold ${p2.price < p1.price ? 'text-success' : ''}`}>
                        ${p2.price}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="text-center">
                      <i className="fas fa-star me-2"></i>
                      Calificación
                    </th>
                    <td className="text-center">
                      <span className={`fw-bold ${p1.rate > p2.rate ? 'text-warning' : ''}`}>
                        {p1.rate ? `${p1.rate} ⭐` : "N/A"}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`fw-bold ${p2.rate > p1.rate ? 'text-warning' : ''}`}>
                        {p2.rate ? `${p2.rate} ⭐` : "N/A"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer opcional */}
          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-success"
              onClick={() => setShowSaveModal(true)}
              disabled={products.length < 2}
            >
              <i className="fas fa-save me-2"></i>
              Guardar Comparativa
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              <i className="fas fa-times me-2"></i>
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Mini-modal para guardar comparativa */}
      {showSaveModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className={`modal-content ${modalTheme}`}>
              <div className="modal-header border-0">
                <h6 className="modal-title">
                  <i className="fas fa-save me-2"></i>
                  Guardar Comparativa
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowSaveModal(false);
                    setComparisonName("");
                  }}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <label className="form-label small">Nombre de la comparativa:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Comparativa de laptops"
                  value={comparisonName}
                  onChange={(e) => setComparisonName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSaveComparison()}
                  autoFocus
                />
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={handleSaveComparison}
                  disabled={saving || !comparisonName.trim()}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check me-2"></i>
                      Guardar
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    setShowSaveModal(false);
                    setComparisonName("");
                  }}
                  disabled={saving}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparativeModal3;