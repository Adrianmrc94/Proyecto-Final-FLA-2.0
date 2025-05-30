import { useState } from "react";

export default function usePagination({ items = [], itemsPerPage = 8 }) {
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const currentItems = items.slice(
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