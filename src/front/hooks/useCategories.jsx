import { useMemo } from "react";

/* Hook para extraer y gestionar categorías únicas de productos.
Extrae categorías únicas de una lista de productos, las filtra y ordena
alfabéticamente. Optimizado con useMemo para evitar recálculos innecesarios. */

export default function useCategories(products) {
    const safeProducts = Array.isArray(products) ? products : [];
    return useMemo(() => {
        return Array.from(
            new Set(
                safeProducts
                    .map((product) => product.category)
                    .filter(Boolean) // Remover null, undefined, ""
                    .map(category => category.trim()) // Limpiar espacios
            )
        ).sort((a, b) => a.localeCompare(b));
    }, [safeProducts]);
}