// src/pages/UserPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Para la validación de tipos de props



// --- Componente PasswordResetForm (MODIFICADO para pedir contraseña actual) ---
const PasswordResetForm = ({ onPasswordChangeSuccess }) => {
    const [currentPassword, setCurrentPassword] = useState(''); 
    const [newPassword, setNewPassword] = useState(''); 
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const userSessionToken = 'YOUR_USER_SESSION_TOKEN_HERE'; // Reemplazar con el token real

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

        const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/['"]/g, "").replace(/\/$/, "");

        try {
            const res = await fetch(`${backendUrl}/api/user/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userSessionToken}`
                },
                body: JSON.stringify({
                    currentPassword: currentPassword, 
                    newPassword: newPassword
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Contraseña actualizada correctamente');
                setCurrentPassword(''); 
                setNewPassword('');   
                setConfirmNewPassword(''); 
                if (onPasswordChangeSuccess) {
                    onPasswordChangeSuccess();
                }
            } else {
                // Aquí el backend debería responder con un error específico si la contraseña actual es incorrecta
                setError(data.error || 'Error al actualizar contraseña. Verifica tu contraseña actual.');
            }
        } catch (err) {
            setError('Error de conexión con el servidor');
            console.error('Error changing password:', err);
        }
    };

    return (
        <div className="card-body">
            <h4 className="card-title mb-4">Cambiar Contraseña</h4>
            <form onSubmit={handleSubmit}>
                {/* Campo para la Contraseña Actual */}
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
                {/* Campo para la Nueva Contraseña */}
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
                {/* Campo para Confirmar Nueva Contraseña */}
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
                <button type="submit" className="btn btn-primary w-100">Actualizar Contraseña</button>
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


const UserPage = () => {
    const [activeTab, setActiveTab] = useState('info');
    const [userData, setUserData] = useState({
        name: 'John', 
        lastName: 'Doe', 
        postalCode: '12345', 
        email: 'john.doe@example.com', 
    });
    const [deletePassword, setDeletePassword] = useState('');
    const [confirmDeletePassword, setConfirmDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Simulación de obtención de datos del usuario
        const fetchUserData = async () => {
         
            // const token = localStorage.getItem('authToken');
            // if (!token) { navigate('/login'); return; }
            // try {
            //     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
            //         headers: { 'Authorization': `Bearer ${token}` }
            //     });
            //     if (response.ok) {
            //         const data = await response.json();
            //         setUserData(data);
            //     } else {
            //         console.error('Failed to fetch user data');
            //         navigate('/login');
            //     }
            // } catch (error) {
            //     console.error('Error fetching user data:', error);
            //     navigate('/login');
            // }
        };

        fetchUserData();
    }, [navigate]);

    const handlePasswordChangeSuccess = () => {
        alert('Contraseña actualizada correctamente.');
    };

    const handleDeleteAccountAttempt = (e) => {
        e.preventDefault();
        setDeleteError('');
        setDeleteMessage('');

        if (deletePassword !== confirmDeletePassword) {
            setDeleteError('Las contraseñas no coinciden');
            return;
        }
        setShowDeleteConfirmation(true);
    };

    const handleDeleteAccountConfirmed = async () => {
        setDeleteError('');
        setDeleteMessage('');

        const userSessionToken = 'YOUR_USER_SESSION_TOKEN_HERE';
        const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/['"]/g, "").replace(/\/$/, "");

        try {
            const res = await fetch(`${backendUrl}/api/user/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userSessionToken}`
                },
                body: JSON.stringify({ password: deletePassword })
            });

            if (res.ok) {
                setDeleteMessage('Tu cuenta ha sido eliminada correctamente.');
                setShowDeleteConfirmation(false);
                setDeletePassword('');
                setConfirmDeletePassword('');
                alert('Tu cuenta ha sido eliminada correctamente.');
                navigate('/login');
            } else {
                const data = await res.json();
                setDeleteError(data.error || 'Error al eliminar la cuenta. Por favor, verifica tu contraseña.');
                setDeleteMessage('');
            }
        } catch (err) {
            setDeleteError('Error de conexión con el servidor al intentar eliminar la cuenta.');
            setDeleteMessage('');
            console.error('Error deleting account:', err);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
        setDeletePassword('');
        setConfirmDeletePassword('');
        setDeleteError('');
        setDeleteMessage('');
    };

    return (
        <div className="container mt-5">
            {/* <Navbar /> */}

            <div className="card shadow-lg p-3 mb-5 bg-white rounded">
                <div className="card-header bg-primary text-white text-center">
                    <h2>Configuración de Usuario</h2>
                </div>
                <div className="card-body">
                    <ul className="nav nav-tabs nav-justified mb-4">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                                onClick={() => setActiveTab('info')}
                            >
                                Información
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'changePassword' ? 'active' : ''}`}
                                onClick={() => setActiveTab('changePassword')}
                            >
                                Cambio de Contraseña
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'deleteAccount' ? 'active' : ''}`}
                                onClick={() => setActiveTab('deleteAccount')}
                            >
                                Eliminar Cuenta
                            </button>
                        </li>
                    </ul>

                    <div className="tab-content">
                        {activeTab === 'info' && (
                            <div className="tab-pane fade show active">
                                <h4 className="mb-3">Información del Usuario</h4>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <strong>Nombre:</strong> {userData.name}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <strong>Apellido:</strong> {userData.lastName}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <strong>Código Postal:</strong> {userData.postalCode}
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
                        )}

                        {/* Pestaña de Cambio de Contraseña con campo de contraseña actual */}
                        {activeTab === 'changePassword' && (
                            <div className="tab-pane fade show active">
                                <PasswordResetForm onPasswordChangeSuccess={handlePasswordChangeSuccess} />
                            </div>
                        )}

                        {activeTab === 'deleteAccount' && (
                            <div className="tab-pane fade show active">
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
                                                    **¡Advertencia!** ¿Estás SEGURO de que quieres eliminar tu cuenta?
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
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;