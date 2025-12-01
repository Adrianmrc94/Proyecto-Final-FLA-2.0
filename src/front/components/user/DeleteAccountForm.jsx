import React from "react";

export default function DeleteAccountForm({
    deletePassword,
    confirmDeletePassword,
    deleteError,
    deleteMessage,
    showDeleteConfirmation,
    setDeletePassword,
    setConfirmDeletePassword,
    handleDeleteAccountAttempt,
    handleDeleteAccountConfirmed,
    handleCancelDelete
}) {
    return (
        <div className="delete-account-container">
            <div className="danger-zone-header">
                <i className="fas fa-exclamation-triangle me-2"></i>
                <h4>Zona Peligrosa</h4>
            </div>

            <div className="alert alert-danger border-danger">
                <h5 className="alert-heading">
                    <i className="fas fa-shield-alt me-2"></i>
                    Eliminar Cuenta Permanentemente
                </h5>
                <p className="mb-0">
                    Esta acción es <strong>irreversible</strong>. Una vez eliminada tu cuenta,
                    se borrarán todos tus datos, favoritos y comparaciones guardadas de forma permanente.
                </p>
            </div>

            {!showDeleteConfirmation ? (
                <form onSubmit={handleDeleteAccountAttempt}>
                    <div className="warning-info mb-4">
                        <h6><i className="fas fa-info-circle me-2"></i>¿Qué se eliminará?</h6>
                        <ul className="delete-list">
                            <li><i className="fas fa-times-circle text-danger me-2"></i>Tu información personal</li>
                            <li><i className="fas fa-times-circle text-danger me-2"></i>Todos tus productos favoritos</li>
                            <li><i className="fas fa-times-circle text-danger me-2"></i>Todas tus comparaciones guardadas</li>
                            <li><i className="fas fa-times-circle text-danger me-2"></i>Tu historial de actividad</li>
                        </ul>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="deletePassword" className="form-label">
                            <i className="fas fa-lock me-2"></i>
                            Contraseña Actual
                        </label>
                        <input
                            type="password"
                            id="deletePassword"
                            placeholder="Introduce tu contraseña actual"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmDeletePassword" className="form-label">
                            <i className="fas fa-check-double me-2"></i>
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            id="confirmDeletePassword"
                            placeholder="Confirma tu contraseña"
                            value={confirmDeletePassword}
                            onChange={(e) => setConfirmDeletePassword(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>

                    {deleteError && (
                        <div className="alert alert-danger d-flex align-items-center">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            {deleteError}
                        </div>
                    )}
                    {deleteMessage && (
                        <div className="alert alert-success d-flex align-items-center">
                            <i className="fas fa-check-circle me-2"></i>
                            {deleteMessage}
                        </div>
                    )}

                    <button type="submit" className="btn btn-danger w-100 btn-lg">
                        <i className="fas fa-trash-alt me-2"></i>
                        Eliminar Mi Cuenta Permanentemente
                    </button>
                </form>
            ) : (
                <div className="confirmation-modal">
                    <div className="confirmation-icon">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <h4 className="mb-3">¿Estás absolutamente seguro?</h4>
                    <p className="text-muted mb-4">
                        Esta acción <strong>NO SE PUEDE DESHACER</strong>.
                        Se eliminarán permanentemente todos tus datos.
                    </p>
                    <div className="d-grid gap-2">
                        <button
                            type="button"
                            className="btn btn-danger btn-lg"
                            onClick={handleDeleteAccountConfirmed}
                        >
                            <i className="fas fa-check me-2"></i>
                            Sí, eliminar mi cuenta ahora
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-lg"
                            onClick={handleCancelDelete}
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            No, mantener mi cuenta
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}