import React from "react";

export default function HowItWorksSection({ onTryMeClick, disabled }) {
    return (
        <div className="text-center mt-5">
            <div className="bg-light p-4 rounded">
                <h3>¿CÓMO FUNCIONA?</h3>
                <p>
                    Compara precios de miles de productos y empieza a ahorrar desde ahora mismo.
                </p>
                <button
                    className="btn btn-info"
                    onClick={onTryMeClick}
                    disabled={disabled}
                >
                    PRUEBAME
                </button>
            </div>
        </div>
    );
}