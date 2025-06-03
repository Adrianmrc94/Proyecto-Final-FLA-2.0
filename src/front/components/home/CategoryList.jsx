export default function CategoryList({
    categories,
    currentPage,
    totalPages,
    onCategoryClick,
    goToNextPage,
    goToPrevPage,
    goToPage,
}) {
    return (
        <>
            <h2 className="mt-5 text-center mb-4">Categorías</h2>
            <div className="row">
                {categories.map((cat, idx) => (
                    <div className="col-6 col-md-3 mb-3" key={idx}>
                        <button
                            className="text-uppercase btn btn-outline-primary w-100"
                            onClick={() => onCategoryClick(cat)}
                        >
                            {cat.replace("-", " ")}
                        </button>
                    </div>
                ))}
            </div>
            <nav aria-label="Paginación de categorías" className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={goToPrevPage}
                            disabled={currentPage === 0}
                        >
                            Anterior
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li
                            key={i}
                            className={`page-item ${i === currentPage ? "active" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => goToPage(i)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li
                        className={`page-item ${
                            currentPage === totalPages - 1 ? "disabled" : ""
                        }`}
                    >
                        <button
                            className="page-link"
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages - 1}
                        >
                            Siguiente
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    );
}