import React from "react";
import { allCategories } from "../hooks/categories";

export default function ProductFilters({ filters, setFilters }) {
    return (
        <div>
            <h5>Categorías</h5>
            <div>
                {allCategories.map((category, index) => (
                    <div key={index} className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={`category-${index}`}
                            checked={filters.category === category}
                            onChange={() =>
                                setFilters({
                                    category: filters.category === category ? "" : category,
                                })
                            }
                        />
                        <label className="form-check-label" htmlFor={`category-${index}`}>
                            {category.replace("-", " ")}
                        </label>
                    </div>
                ))}
            </div>

            <hr />

            <h5>Precio</h5>
            <div>
                <label>
                    Mínimo:
                    <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) =>
                            setFilters({ minPrice: Number(e.target.value) })
                        }
                        className="form-control form-control-sm"
                    />
                </label>
                <label>
                    Máximo:
                    <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) =>
                            setFilters({ maxPrice: Number(e.target.value) })
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
                        setFilters({ rating: Number(e.target.value) })
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
                        setFilters({ inStock: filters.inStock === true ? null : true })
                    }
                />
                <label className="form-check-label" htmlFor="inStock">
                    Solo disponibles
                </label>
            </div>
        </div>
    );
}