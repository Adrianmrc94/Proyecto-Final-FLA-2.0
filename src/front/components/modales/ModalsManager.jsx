import React from "react";
import ProductModal from "./ProductModal";
import ComparativeModal3 from "./ComparativeModal3";

export default function ModalsManager({
    selectedProduct,
    showProductModal,
    setShowProductModal,
    showComparativeModal,
    setShowComparativeModal,
}) {
    return (
        <>
            {/* Modal de producto (desde productos destacados) */}
            {selectedProduct && showProductModal && (
                <ProductModal
                    product={selectedProduct}
                    show={showProductModal}
                    onClose={() => setShowProductModal(false)}
                />
            )}

            {/* Modal comparativo (desde "PRUÉBAME") */}
            {selectedProduct && showComparativeModal && (
                <ComparativeModal3
                    isOpen={showComparativeModal}
                    onClose={() => setShowComparativeModal(false)}
                    product={selectedProduct}
                />
            )}
        </>
    );
}