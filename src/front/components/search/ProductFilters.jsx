import useCategories from "../../hooks/useCategories";


export default function ProductFilters({ filters, setFilters, products }) {
    const categories = useCategories(products);


    if (!categories.length) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary mb-2"></div>
                <div className="small text-muted">Cargando filtros...</div>
            </div>
        );
    }


    //  Helper para actualizar filtros
    const updateFilter = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };


    //  Reset de filtros
    const resetFilters = () => {
        setFilters({
            price_min: 0,
            price_max: 100000,
            rating: 0,
            inStock: null,
        });
    };


    return (
        <div className="d-flex flex-column gap-4">
            {/* Reset de filtros */}
            <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">Filtros activos</small>
                <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={resetFilters}
                >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Reset
                </button>
            </div>

            {/* Precio */}
            <div>
                <label className="form-label fw-bold">
                    <i className="bi bi-currency-dollar me-2"></i>
                    Rango de Precio
                </label>
                <div className="row g-2">
                    <div className="col-6">
                        <input
                            type="number"
                            placeholder="Mín"
                            value={filters.price_min || ""}
                            onChange={(e) => updateFilter('price_min', e.target.value)}
                            className="form-control form-control-sm"
                            min="0"
                        />
                    </div>
                    <div className="col-6">
                        <input
                            type="number"
                            placeholder="Máx"
                            value={filters.price_max || ""}
                            onChange={(e) => updateFilter('price_max', e.target.value)}
                            className="form-control form-control-sm"
                            min="0"
                        />
                    </div>
                </div>
                <div className="form-text">
                    ${filters.price_min || 0} - ${filters.price_max || "∞"}
                </div>
            </div>


            {/* Rating */}
            <div>
                <label className="form-label fw-bold">
                    <i className="bi bi-star me-2"></i>
                    Calificación mínima
                </label>
                <select
                    className="form-select"
                    value={filters.rating || ""}
                    onChange={(e) => updateFilter('rating', e.target.value)}
                >
                    <option value="">Cualquier calificación</option>
                    <option value="1">⭐ 1+ estrella</option>
                    <option value="2">⭐ 2+ estrellas</option>
                    <option value="3">⭐ 3+ estrellas</option>
                    <option value="4">⭐ 4+ estrellas</option>
                    <option value="5">⭐ 5 estrellas</option>
                </select>
            </div>


            {/* Disponibilidad */}
            <div>
                <label className="form-label fw-bold">
                    <i className="bi bi-box-seam me-2"></i>
                    Disponibilidad
                </label>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="inStock"
                        checked={filters.inStock === true}
                        onChange={() => updateFilter('inStock', filters.inStock === true ? null : true)}
                    />
                    <label className="form-check-label" htmlFor="inStock">
                        Solo productos disponibles
                    </label>
                </div>
            </div>
        </div>
    );
}