import React from "react";

export default function HowItWorksSection({ onTryMeClick, disabled }) {
    return (
        <div className="my-5 py-5">
            {/* Header minimalista con más espacio */}
            <div className="text-center mb-5 pb-4">
                <h2 className="fw-light display-5">Así de simple</h2>
                <div className="mx-auto mt-3" style={{ width: '60px', height: '2px', backgroundColor: '#dee2e6' }}></div>
            </div>

            {/* Steps en línea horizontal más espaciados */}
            <div className="d-flex align-items-center justify-content-center mb-5 pb-4 flex-wrap" style={{ minHeight: '120px' }}>
                <div className="text-center mx-5 mb-3">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mb-3" style={{ width: '60px', height: '60px' }}>
                        <span className="fw-bold fs-5">1</span>
                    </div>
                    <div className="small text-muted fw-medium">Busca</div>
                </div>
                
                <div className="text-muted mx-4 d-none d-md-block" style={{ fontSize: '1.5rem' }}>→</div>
                
                <div className="text-center mx-5 mb-3">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success text-white mb-3" style={{ width: '60px', height: '60px' }}>
                        <span className="fw-bold fs-5">2</span>
                    </div>
                    <div className="small text-muted fw-medium">Compara</div>
                </div>
                
                <div className="text-muted mx-4 d-none d-md-block" style={{ fontSize: '1.5rem' }}>→</div>
                
                <div className="text-center mx-5 mb-3">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-warning text-white mb-3" style={{ width: '60px', height: '60px' }}>
                        <span className="fw-bold fs-5">3</span>
                    </div>
                    <div className="small text-muted fw-medium">Ahorra</div>
                </div>
            </div>

            {/* CTA minimalista con más espacio */}
            <div className="text-center pt-4">
                <button
                    className="btn btn-outline-primary btn-lg px-5 py-3"
                    onClick={onTryMeClick}
                    disabled={disabled}
                    style={{ minWidth: '200px' }}
                >
                    Prueba ahora
                </button>
            </div>
        </div>
    );
}