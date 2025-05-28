import React from 'react';
import ResetPassword from './ResetPassword'; 

export default function ResetPasswordTest() {
    return (
        <div style={{ padding: '2rem' }}>
            <h2 className="mb-4">Vista previa de Restablecer Contraseña</h2>
            <p className="text-muted mb-4">
                Esta es una versión de prueba para ver cómo se muestra la página sin necesidad de un token real.
            </p>
            <ResetPassword />
        </div>
    );
}