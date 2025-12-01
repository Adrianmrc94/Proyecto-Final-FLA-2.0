import React, { useState } from "react";
import PropTypes from "prop-types";
import ApiService from '../../services/api';

const PasswordResetForm = ({ onPasswordChangeSuccess }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });

    const calculatePasswordStrength = (password) => {
        if (!password) return { score: 0, text: '', color: '' };

        let score = 0;

        // Longitud
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;

        // Complejidad
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score <= 2) return { score: 33, text: 'Débil', color: 'danger' };
        if (score <= 4) return { score: 66, text: 'Media', color: 'warning' };
        return { score: 100, text: 'Fuerte', color: 'success' };
    };

    const handleNewPasswordChange = (value) => {
        setNewPassword(value);
        setPasswordStrength(calculatePasswordStrength(value));
    };

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
        <div className="password-form-container">
            <h4 className="section-title">
                <i className="fas fa-key me-2"></i>
                Cambiar Contraseña
            </h4>

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="currentPassword" className="form-label">
                        <i className="fas fa-lock me-2"></i>
                        Contraseña Actual
                    </label>
                    <div className="password-input-wrapper">
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="currentPassword"
                            placeholder="Introduce tu contraseña actual"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="form-control"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                            <i className={`fas ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="newPassword" className="form-label">
                        <i className="fas fa-key me-2"></i>
                        Nueva Contraseña
                    </label>
                    <div className="password-input-wrapper">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            placeholder="Nueva contraseña"
                            value={newPassword}
                            onChange={(e) => handleNewPasswordChange(e.target.value)}
                            className="form-control"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>

                    {newPassword && (
                        <div className="password-strength-container mt-2">
                            <div className="password-strength-bar">
                                <div
                                    className={`password-strength-fill bg-${passwordStrength.color}`}
                                    style={{ width: `${passwordStrength.score}%` }}
                                ></div>
                            </div>
                            <small className={`text-${passwordStrength.color}`}>
                                Fortaleza: <strong>{passwordStrength.text}</strong>
                            </small>
                        </div>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmNewPassword" className="form-label">
                        <i className="fas fa-check-double me-2"></i>
                        Confirmar Nueva Contraseña
                    </label>
                    <div className="password-input-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmNewPassword"
                            placeholder="Confirmar nueva contraseña"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="form-control"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                    {confirmNewPassword && newPassword !== confirmNewPassword && (
                        <small className="text-danger">
                            <i className="fas fa-exclamation-circle me-1"></i>
                            Las contraseñas no coinciden
                        </small>
                    )}
                </div>

                {error && (
                    <div className="alert alert-danger d-flex align-items-center">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                )}
                {message && (
                    <div className="alert alert-success d-flex align-items-center">
                        <i className="fas fa-check-circle me-2"></i>
                        {message}
                    </div>
                )}

                <button type="submit" className="btn btn-primary w-100 btn-lg">
                    <i className="fas fa-save me-2"></i>
                    Actualizar Contraseña
                </button>
            </form>

            <div className="password-requirements mt-4">
                <h6><i className="fas fa-shield-alt me-2"></i>Requisitos de la contraseña:</h6>
                <ul>
                    <li className={newPassword.length >= 6 ? 'text-success' : ''}>
                        <i className={`fas ${newPassword.length >= 6 ? 'fa-check-circle' : 'fa-circle'} me-2`}></i>
                        Al menos 6 caracteres
                    </li>
                    <li className={/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? 'text-success' : ''}>
                        <i className={`fas ${/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? 'fa-check-circle' : 'fa-circle'} me-2`}></i>
                        Mayúsculas y minúsculas
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? 'text-success' : ''}>
                        <i className={`fas ${/[0-9]/.test(newPassword) ? 'fa-check-circle' : 'fa-circle'} me-2`}></i>
                        Al menos un número
                    </li>
                    <li className={/[^a-zA-Z0-9]/.test(newPassword) ? 'text-success' : ''}>
                        <i className={`fas ${/[^a-zA-Z0-9]/.test(newPassword) ? 'fa-check-circle' : 'fa-circle'} me-2`}></i>
                        Caracteres especiales (recomendado)
                    </li>
                </ul>
            </div>
        </div>
    );
};

PasswordResetForm.propTypes = {
    onPasswordChangeSuccess: PropTypes.func,
};

export default PasswordResetForm;