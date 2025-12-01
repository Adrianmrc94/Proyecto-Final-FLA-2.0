import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryStats({ products }) {
    const navigate = useNavigate();

    const categoryStats = useMemo(() => {
        if (!products || products.length === 0) return [];

        const stats = {};

        products.forEach(product => {
            const mainCat = product.main_category || "Otros";
            if (!stats[mainCat]) {
                stats[mainCat] = {
                    count: 0,
                    totalPrice: 0,
                    avgPrice: 0,
                    icon: getCategoryIcon(mainCat)
                };
            }
            stats[mainCat].count++;
            stats[mainCat].totalPrice += product.price || 0;
        });

        // Calcular promedios y ordenar por cantidad
        const statsList = Object.entries(stats).map(([name, data]) => ({
            name,
            count: data.count,
            avgPrice: (data.totalPrice / data.count).toFixed(2),
            icon: data.icon
        }));

        return statsList.sort((a, b) => b.count - a.count).slice(0, 6);
    }, [products]);

    const getCategoryIcon = (category) => {
        const icons = {
            "Frutas y Verduras": "🥬",
            "Carnes y Pescados": "🥩",
            "Lácteos y Huevos": "🥛",
            "Panadería y Pastelería": "🥖",
            "Despensa": "🥫",
            "Bebidas": "🥤",
            "Congelados": "🧊",
            "Snacks y Dulces": "🍫",
            "Bebé": "🍼",
            "Mascotas": "🐾",
            "Limpieza": "🧹",
            "Higiene y Belleza": "💄",
            "Hogar": "🏠",
            "Otros": "📦"
        };
        return icons[category] || "📦";
    };

    const handleCategoryClick = (categoryName) => {
        navigate(`/catalog?main_category=${encodeURIComponent(categoryName)}`);
    };

    if (!categoryStats.length) {
        return null;
    }

    return (
        <section className="category-stats mb-5">
            <div className="container">
                <h2 className="text-center mb-4">
                    <i className="bi bi-pie-chart-fill me-2"></i>
                    Categorías Principales
                </h2>
                <div className="row g-3">
                    {categoryStats.map((stat, index) => (
                        <div
                            key={stat.name}
                            className="col-md-4 col-lg-2"
                            onClick={() => handleCategoryClick(stat.name)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card h-100 text-center shadow-sm hover-lift">
                                <div className="card-body">
                                    <div className="display-4 mb-2">{stat.icon}</div>
                                    <h6 className="card-title mb-2" style={{ fontSize: '0.9rem' }}>
                                        {stat.name}
                                    </h6>
                                    <p className="card-text mb-1">
                                        <span className="badge bg-primary rounded-pill">
                                            {stat.count} productos
                                        </span>
                                    </p>
                                    <small className="text-muted">
                                        Promedio: ${stat.avgPrice}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .hover-lift {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                }
            `}</style>
        </section>
    );
}
