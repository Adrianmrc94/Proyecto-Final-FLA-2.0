import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import useGlobalProducts from "../../hooks/useGlobalProducts";

export default function SearchBar() {
  const { products } = useGlobalProducts();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const [results, setResults] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const formRef = useRef(null);

  // Actualiza la posición del dropdown cuando hay resultados
  useEffect(() => {
    if (results.length > 0 && formRef.current) {
      const rect = formRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [results]);

  // Maneja los cambios en el input de búsqueda
  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);

    // Si la consulta tiene menos de 2 caracteres, limpia los resultados
    if (q.length < 2) {
      setResults([]);
      return;
    }

    let suggestions = [];

    // Buscar en productos por nombre/título
    products.forEach((product) => {
      const name = product.name || product.title || "";
      const category = product.category || "Sin categoría";

      if (name.toLowerCase().includes(q.toLowerCase())) {
        suggestions.push({
          id: product.id,
          name,
          category,
          price: product.price,
          type: "product",
          product: product
        });
      }
    });

    // Buscar por categorías únicas
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    categories.forEach((cat) => {
      if (cat.toLowerCase().includes(q.toLowerCase())) {
        const productCount = products.filter(p => p.category === cat).length;
        suggestions.push({
          name: cat,
          category: `${productCount} productos`,
          type: "category",
          categoryName: cat
        });
      }
    });

    // Limita los resultados a un máximo de 8
    setResults(suggestions.slice(0, 8));
    setActiveIdx(-1);
  };

  // Maneja la selección de un resultado
  const handleSelect = (result) => {
    setQuery("");
    setResults([]);
    setActiveIdx(-1);

    if (result.type === "product") {
      // Calcular en qué página está el producto dentro de su categoría
      const categoryProducts = products
        .filter(p => p.category === result.category)
        .sort((a, b) => a.name.localeCompare(b.name)); // Ordenar igual que en SearchPage

      const productIndex = categoryProducts.findIndex(p => p.id === result.product.id);
      const productsPerPage = 12;
      const pageNumber = Math.floor(productIndex / productsPerPage) + 1;

      // Navegar a búsqueda con categoría, página y producto seleccionado
      navigate("/search", {
        state: {
          applyCategoryFilter: result.category,
          selectedProductForComparison: result.product,
          initialPage: pageNumber
        }
      });
    } else if (result.type === "category") {
      console.log("Navigating with category filter:", result.categoryName); // Debug
      // Navegar a búsqueda y aplicar filtro de categoría
      navigate("/search", {
        state: {
          applyCategoryFilter: result.categoryName
        }
      });
    }
  };

  // Maneja las teclas de navegación (flechas y Enter)
  const handleKeyDown = (e) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) {
        handleSelect(results[activeIdx]);
      } else if (query.trim()) {
        // Si no hay selección específica, hacer búsqueda general
        setQuery("");
        setResults([]);
        navigate("/search", {
          state: {
            searchQuery: query
          }
        });
      }
    } else if (e.key === "Escape") {
      setResults([]);
      setActiveIdx(-1);
      inputRef.current?.blur();
    }
  };

  // Limpia los resultados al perder el foco
  const handleBlur = () => {
    setTimeout(() => {
      setResults([]);
      setActiveIdx(-1);
    }, 150);
  };

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setResults([]);
      navigate("/search", {
        state: {
          searchQuery: query
        }
      });
      setQuery("");
    }
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="position-relative w-100">
        <div className="d-flex">
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder="Buscar productos..."
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="form-control border-end-0"
            aria-label="Buscar productos"
            autoComplete="off"
          />
          <button
            className="btn btn-outline-secondary border-start-0"
            type="submit"
            aria-label="Buscar"
          >
            <i className="bi bi-search"></i>
          </button>
        </div>
      </form>

      {results.length > 0 && createPortal(
        <ul
          className="list-group shadow-lg search-dropdown"
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 10000,
            maxHeight: '400px',
            overflowY: 'auto',
            maxWidth: '600px'
          }}
        >
          {results.map((result, i) => (
            <li
              key={`${result.type}-${result.id || result.categoryName}-${i}`}
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${i === activeIdx ? "active" : ""
                }`}
              style={{ cursor: "pointer" }}
              onMouseDown={() => handleSelect(result)}
              onMouseEnter={() => setActiveIdx(i)}
            >
              <div className="d-flex flex-column">
                <span className="fw-bold">
                  {result.type === "product" && <i className="bi bi-box me-2"></i>}
                  {result.type === "category" && <i className="bi bi-tag me-2"></i>}
                  {result.name}
                </span>
                <small className="text-muted">{result.category}</small>
              </div>
              {result.type === "product" && result.price && (
                <span className="badge bg-success">${result.price}</span>
              )}
            </li>
          ))}
        </ul>,
        document.body
      )}
    </>
  );
}