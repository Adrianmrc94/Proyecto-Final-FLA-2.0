import React from "react";

export default function UserInfo({ userData }) {
    return (
        <div className="tab-pane fade show active">
            <h4 className="mb-3">Información del Usuario</h4>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <strong>Nombre:</strong> {userData.name}
                </div>
                <div className="col-md-6 mb-3">
                    <strong>Apellido:</strong> {userData.last_name}
                </div>
                <div className="col-md-6 mb-3">
                    <strong>Código Postal:</strong> {userData.postal_code}
                </div>
                <div className="col-md-6 mb-3">
                    <strong>Email:</strong> {userData.email}
                </div>
            </div>
            <hr />
            <p className="text-muted">
                Aquí puedes ver tu información personal. Para realizar cambios, contacta al soporte.
            </p>
        </div>
    );
}