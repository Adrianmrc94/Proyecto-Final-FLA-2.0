import React from "react";
import useCategories from "../hooks/useCategories";

export default function ProductFilters({ filters, setFilters, products }) {
    console.log(products)
    const categories = useCategories(products);

    if (!categories.length) {
        return <div>Cargando categorías...</div>;
    }

    return (
        <div>
            <h5>Categorías</h5>
            <div className="mb-3">
                <select
                    className="form-select"
                    value={filters.category || ""}
                    onChange={e =>
                        setFilters({ category: e.target.value || "" })
                    }
                >
                    <option value="">Todas las categorías</option>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>
                            {category.replace("-", " ")}
                        </option>
                    ))}
                </select>
            </div>

            <hr />

            <h5>Precio</h5>
            <div>
                <label>
                    Mínimo:
                    <input
                        type="number"
                        value={filters.price_min}
                        onChange={(e) =>
                            setFilters({ ...filters, price_min: e.target.value })
                        }
                        className="form-control form-control-sm"
                    />
                </label>
                <label>
                    Máximo:
                    <input
                        type="number"
                        value={filters.price_max}
                        onChange={(e) =>
                            setFilters({ ...filters, price_max: e.target.value })
                        }
                        className="form-control form-control-sm"
                    />
                </label>
            </div>

            <hr />

            <h5>Rating</h5>
            <div>
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={filters.rating}
                    onChange={(e) =>
                        setFilters({ ...filters, rating: e.target.value })
                    }
                    className="form-control form-control-sm"
                />
            </div>

            <hr />

            <h5>Disponibilidad</h5>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="inStock"
                    checked={filters.inStock === true}
                    onChange={() =>
                        setFilters({ ...filters, inStock: filters.inStock === true ? null : true })
                    }
                />
                <label className="form-check-label" htmlFor="inStock">
                    Solo disponibles
                </label>
            </div>
        </div>
    );
}