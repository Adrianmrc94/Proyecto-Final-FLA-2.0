import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordResetForm from '../components/user/PasswordResetForm';
import UserInfo from '../components/user/UserInfo';
import DeleteAccountForm from '../components/user/DeleteAccountForm';

const UserPage = () => {
    const [activeTab, setActiveTab] = useState('info');
    const [userData, setUserData] = useState({});
    const [deletePassword, setDeletePassword] = useState('');
    const [confirmDeletePassword, setConfirmDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    console.error('Failed to fetch user data');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
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

        const token = localStorage.getItem('token');
        const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/['"]/g, "").replace(/\/$/, "");

        try {
            const res = await fetch(`${backendUrl}/api/user/delete-account`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password: deletePassword })
            });

            if (res.ok) {
                setDeleteMessage('Tu cuenta ha sido eliminada correctamente.');
                setShowDeleteConfirmation(false);
                setDeletePassword('');
                setConfirmDeletePassword('');
                alert('Tu cuenta ha sido eliminada correctamente.');
                localStorage.clear();
                navigate('/login');
            } else {
                const data = await res.json();
                setDeleteError(data.msg || 'Error al eliminar la cuenta. Por favor, verifica tu contraseña.');
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
                        {activeTab === 'info' && <UserInfo userData={userData} />}
                        {activeTab === 'changePassword' && (
                            <PasswordResetForm onPasswordChangeSuccess={handlePasswordChangeSuccess} />
                        )}
                        {activeTab === 'deleteAccount' && (
                            <DeleteAccountForm
                                deletePassword={deletePassword}
                                confirmDeletePassword={confirmDeletePassword}
                                deleteError={deleteError}
                                deleteMessage={deleteMessage}
                                showDeleteConfirmation={showDeleteConfirmation}
                                setDeletePassword={setDeletePassword}
                                setConfirmDeletePassword={setConfirmDeletePassword}
                                handleDeleteAccountAttempt={handleDeleteAccountAttempt}
                                handleDeleteAccountConfirmed={handleDeleteAccountConfirmed}
                                handleCancelDelete={handleCancelDelete}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;