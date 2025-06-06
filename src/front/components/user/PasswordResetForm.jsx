import React, { useState } from "react";
import PropTypes from "prop-types";
import ApiService from '../../services/api';

const PasswordResetForm = ({ onPasswordChangeSuccess }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmNewPassword) {
            setError('Las nuevas contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 6) {
            setError('La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            await ApiService.changePassword(currentPassword, newPassword);
            setMessage('Contraseña actualizada correctamente');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            if (onPasswordChangeSuccess) {
                onPasswordChangeSuccess();
            }
        } catch (error) {
            setError(error.message || 'Error al actualizar contraseña. Verifica tu contraseña actual.');
        }
    };

    return (
        <div className="card-body">
            <h4 className="card-title mb-4">Cambiar Contraseña</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Contraseña Actual</label>
                    <input
                        type="password"
                        id="currentPassword"
                        placeholder="Introduce tu contraseña actual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">Nueva Contraseña</label>
                    <input
                        type="password"
                        id="newPassword"
                        placeholder="Nueva contraseña"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmNewPassword" className="form-label">Confirmar Nueva Contraseña</label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        placeholder="Confirmar nueva contraseña"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {message && <div className="alert alert-success">{message}</div>}
                <button type="submit" className="btn btn-success w-100">Actualizar Contraseña</button>
            </form>
            <div className="mt-3">
                <small className="text-muted">
                    Tu nueva contraseña debe tener al menos 6 caracteres y combinar letras, números y símbolos.
                </small>
            </div>
        </div>
    );
};

PasswordResetForm.propTypes = {
    onPasswordChangeSuccess: PropTypes.func,
};

export default PasswordResetForm;