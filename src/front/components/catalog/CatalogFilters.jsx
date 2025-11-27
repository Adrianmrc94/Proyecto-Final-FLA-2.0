import React from 'react';

const CatalogFilters = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    categories
}) => {
    return (
        <div className="filters-bar card shadow-sm mb-4 border-0">
            <div className="card-body p-4">
                <div className="row g-3 align-items-center">
                    {/* Search */}
                    <div className="col-12 col-md-4">
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

                    {/* Category Filter */}
                    <div className="col-12 col-md-4">
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">Todas las categorías</option>
                            {categories.filter(c => c !== 'all').map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort */}
                    <div className="col-12 col-md-4">
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
            </div>
        </div>
    );
};

export default CatalogFilters;
