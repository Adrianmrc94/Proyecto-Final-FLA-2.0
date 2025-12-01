import React from "react";

export default function UserInfo({ userData }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="user-info-container">
            <h4 className="section-title">
                <i className="fas fa-id-card me-2"></i>
                Información Personal
            </h4>

            <div className="info-grid">
                <div className="info-card">
                    <div className="info-icon">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="info-content">
                        <label>Nombre</label>
                        <p>{userData.name || 'No especificado'}</p>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-icon">
                        <i className="fas fa-user-tag"></i>
                    </div>
                    <div className="info-content">
                        <label>Apellido</label>
                        <p>{userData.last_name || 'No especificado'}</p>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-icon">
                        <i className="fas fa-envelope"></i>
                    </div>
                    <div className="info-content">
                        <label>Email</label>
                        <p>{userData.email || 'No especificado'}</p>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-icon">
                        <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="info-content">
                        <label>Código Postal</label>
                        <p>{userData.postal_code || 'No especificado'}</p>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-icon">
                        <i className="fas fa-calendar-alt"></i>
                    </div>
                    <div className="info-content">
                        <label>Miembro desde</label>
                        <p>{formatDate(userData.created_at)}</p>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="info-content">
                        <label>Estado</label>
                        <p><span className="badge bg-success">Activo</span></p>
                    </div>
                </div>
            </div>

            <div className="alert alert-info mt-4">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Nota:</strong> Para modificar tu información personal, por favor contacta con el soporte técnico.
            </div>
        </div>
    );
}