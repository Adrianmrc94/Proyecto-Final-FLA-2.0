import { useState } from "react";

export default function usePagination({ items = [], itemsPerPage = 8 }) {
    const [currentPage, setCurrentPage] = useState(0);

    // Asegura que items siempre sea un array
    const safeItems = Array.isArray(items) ? items : [];

    const totalPages = Math.ceil(safeItems.length / itemsPerPage);

    const currentItems = safeItems.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const goToPrevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    return {
        currentPage,
        totalPages,
        currentItems,
        goToNextPage,
        goToPrevPage,
        goToPage,
    };
}