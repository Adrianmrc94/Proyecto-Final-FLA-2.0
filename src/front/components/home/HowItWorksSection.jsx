import React from "react";
import '../../styles/HowItWorksSection.css';

export default function HowItWorksSection({ onTryMeClick, disabled }) {
    return (
        <div className="how-it-works-section my-5 py-5">
            {/* Header con gradiente y animación */}
            <div className="text-center mb-5 pb-4">
                <h2 className="fw-bold display-4 gradient-text mb-3">¿Cómo Funciona?</h2>
                <p className="lead text-muted">Encuentra las mejores ofertas en 3 simples pasos</p>
            </div>

            {/* Steps con cards animadas */}
            <div className="row g-4 mb-5 px-3 px-md-5">
                <div className="col-12 col-md-4">
                    <div className="step-card card border-0 shadow-lg h-100 hover-lift">
                        <div className="card-body text-center p-4">
                            <div className="step-icon-wrapper mb-4">
                                <div className="step-number-circle bg-gradient-primary">
                                    <span className="fw-bold">1</span>
                                </div>
                                <i className="bi bi-search step-icon text-primary"></i>
                            </div>
                            <h4 className="fw-bold mb-3">Busca</h4>
                            <p className="text-muted mb-0">
                                Explora miles de productos de diferentes tiendas en un solo lugar
                            </p>
                        </div>
                        <div className="card-footer border-0 bg-transparent">
                            <div className="progress" style={{ height: '4px' }}>
                                <div className="progress-bar bg-primary" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="step-card card border-0 shadow-lg h-100 hover-lift">
                        <div className="card-body text-center p-4">
                            <div className="step-icon-wrapper mb-4">
                                <div className="step-number-circle bg-gradient-success">
                                    <span className="fw-bold">2</span>
                                </div>
                                <i className="bi bi-arrow-left-right step-icon text-success"></i>
                            </div>
                            <h4 className="fw-bold mb-3">Compara</h4>
                            <p className="text-muted mb-0">
                                Analiza precios, características y opiniones lado a lado
                            </p>
                        </div>
                        <div className="card-footer border-0 bg-transparent">
                            <div className="progress" style={{ height: '4px' }}>
                                <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="step-card card border-0 shadow-lg h-100 hover-lift">
                        <div className="card-body text-center p-4">
                            <div className="step-icon-wrapper mb-4">
                                <div className="step-number-circle bg-gradient-warning">
                                    <span className="fw-bold">3</span>
                                </div>
                                <i className="bi bi-piggy-bank step-icon text-warning"></i>
                            </div>
                            <h4 className="fw-bold mb-3">Ahorra</h4>
                            <p className="text-muted mb-0">
                                Compra inteligente y ahorra hasta un 40% en tus productos favoritos
                            </p>
                        </div>
                        <div className="card-footer border-0 bg-transparent">
                            <div className="progress" style={{ height: '4px' }}>
                                <div className="progress-bar bg-warning" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA con efecto shimmer */}
            <div className="text-center pt-4">
                <button
                    className="btn btn-primary btn-lg px-5 py-3 shadow-lg cta-button"
                    onClick={onTryMeClick}
                    disabled={disabled}
                >
                    <i className="bi bi-rocket-takeoff me-2"></i>
                    Comienza Ahora
                    <i className="bi bi-arrow-right ms-2"></i>
                </button>
                <p className="text-muted mt-3 small">
                    <i className="bi bi-shield-check me-1"></i>
                    100% gratis, sin tarjeta de crédito
                </p>
            </div>
        </div>
    );
}