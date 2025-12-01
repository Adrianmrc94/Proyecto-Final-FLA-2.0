import React from 'react';

const CatalogFilters = ({
    searchTerm,
    setSearchTerm,
    selectedMainCategory,
    setSelectedMainCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    selectedStore,
    setSelectedStore,
    sortBy,
    setSortBy,
    mainCategories,
    subcategories,
    stores
}) => {
    return (
        <div className="filters-bar card shadow-sm mb-4 border-0">
            <div className="card-body p-4">
                {/* Primera fila: Búsqueda y ordenar */}
                <div className="row g-3 align-items-center mb-3">
                    {/* Search */}
                    <div className="col-12 col-lg-6">
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-end-0">
                                <i className="bi bi-search"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="col-12 col-lg-6">
                        <select
                            className="form-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="name">Nombre (A-Z)</option>
                            <option value="price-asc">Precio (menor a mayor)</option>
                            <option value="price-desc">Precio (mayor a menor)</option>
                            <option value="rating">Mejor valorados</option>
                        </select>
                    </div>
                </div>

                {/* Segunda fila: Filtros de categoría */}
                <div className="row g-3 align-items-center">
                    {/* Main Category Filter */}
                    <div className="col-12 col-lg-4">
                        <label className="form-label small text-muted mb-1">
                            <i className="bi bi-folder me-1"></i>
                            Categoría Principal
                        </label>
                        <select
                            className="form-select"
                            value={selectedMainCategory}
                            onChange={(e) => {
                                setSelectedMainCategory(e.target.value);
                                setSelectedSubcategory('all'); // Reset subcategoría
                            }}
                        >
                            <option value="all">Todas</option>
                            {mainCategories.map(cat => (
                                <option key={cat.name} value={cat.name}>
                                    {cat.name} ({cat.count})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subcategory Filter */}
                    <div className="col-12 col-lg-4">
                        <label className="form-label small text-muted mb-1">
                            <i className="bi bi-tags me-1"></i>
                            Subcategoría
                        </label>
                        <select
                            className="form-select"
                            value={selectedSubcategory}
                            onChange={(e) => setSelectedSubcategory(e.target.value)}
                            disabled={selectedMainCategory === 'all' || subcategories.length === 0}
                        >
                            <option value="all">Todas</option>
                            {subcategories.map(sub => (
                                <option key={sub.name} value={sub.name}>
                                    {sub.name} ({sub.count})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Store Filter */}
                    <div className="col-12 col-lg-4">
                        <label className="form-label small text-muted mb-1">
                            <i className="bi bi-shop me-1"></i>
                            Tienda
                        </label>
                        <select
                            className="form-select"
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                        >
                            <option value="all">Todas las tiendas</option>
                            {stores.map(store => (
                                <option key={store} value={store}>
                                    {store}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogFilters;
