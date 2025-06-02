import React from "react";
import ProductModal from "./ProductModal";
import ComparativeModal3 from "./ComparativeModal3";

export default function ModalsManager({
    selectedProduct,
    showProductModal,
    setShowProductModal,
    productToCompare,
    showComparativeModal,
    setShowComparativeModal,
}) {
    return (
        <>
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    show={showProductModal}
                    onClose={() => setShowProductModal(false)}
                    onFavorite={() => { }}
                />
            )}

            {showComparativeModal && selectedProduct && (
                <ComparativeModal3
                    isOpen={showComparativeModal}
                    onClose={() => setShowComparativeModal(false)}
                    product={selectedProduct}
                />
            )}
        </>
    );
}