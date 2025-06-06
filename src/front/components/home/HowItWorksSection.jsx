import React from "react";

export default function HowItWorksSection({ onTryMeClick, disabled }) {
    return (
        <div className="how-it rounded text-center m-5">
            <div className="shadow-lg p-4">
                <h3>¿CÓMO FUNCIONA?</h3>
                <p>
                    Compara precios de miles de productos y empieza a ahorrar desde ahora mismo.
                </p>
                <button
                    className="btn btn-success shadow-lg"
                    onClick={onTryMeClick}
                    disabled={disabled}
                >
                    PRUEBAME
                </button>
            </div>
        </div>
    );
}