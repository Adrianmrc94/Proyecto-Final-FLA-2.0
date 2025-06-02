import { useMemo } from "react";

export default function useCategories(products) {
    const safeProducts = Array.isArray(products) ? products : [];
    return useMemo(() => {
        return Array.from(
            new Set(
                safeProducts
                    .map((p) => p.category)
                    .filter(Boolean)
            )
        ).sort();
    }, [safeProducts]);
}