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
        <div className="card-body">
            <h4 className="card-title mb-4 text-danger">Eliminar Cuenta</h4>
            <p className="text-muted">
                Para eliminar tu cuenta, por favor, introduce tu contraseña actual.
                Esta acción no se puede deshacer.
            </p>
            <form onSubmit={handleDeleteAccountAttempt}>
                <div className="mb-3">
                    <label htmlFor="deletePassword" className="form-label">Contraseña Actual</label>
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
                    <label htmlFor="confirmDeletePassword" className="form-label">Confirmar Contraseña</label>
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
                {deleteError && <div className="alert alert-danger">{deleteError}</div>}
                {deleteMessage && <div className="alert alert-success">{deleteMessage}</div>}

                {showDeleteConfirmation ? (
                    <div className="alert alert-warning text-center mt-4">
                        <p className="mb-3">
                            <strong>¡Advertencia!</strong> ¿Estás SEGURO de que quieres eliminar tu cuenta?
                            Esta acción es irreversible y eliminará todos tus datos permanentemente.
                        </p>
                        <button
                            type="button"
                            className="btn btn-success me-2"
                            onClick={handleDeleteAccountConfirmed}
                        >
                            Sí, eliminar cuenta
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleCancelDelete}
                        >
                            No, volver
                        </button>
                    </div>
                ) : (
                    <button type="submit" className="btn btn-danger w-100">
                        Eliminar Mi Cuenta
                    </button>
                )}
            </form>
        </div>
    );
}