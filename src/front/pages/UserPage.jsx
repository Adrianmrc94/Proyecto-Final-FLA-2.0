import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PasswordResetForm from '../components/user/PasswordResetForm';
import UserInfo from '../components/user/UserInfo';
import DeleteAccountForm from '../components/user/DeleteAccountForm';
import useDarkMode from '../hooks/useDarkMode';
import ApiService from '../services/api';

const UserPage = () => {
    const [activeTab, setActiveTab] = useState('info');
    const [userData, setUserData] = useState({});
    const [deletePassword, setDeletePassword] = useState('');
    const [confirmDeletePassword, setConfirmDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }

            try {
                const data = await ApiService.getUserProfile();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };
        fetchUserData();
    }, [navigate]);

    const handlePasswordChangeSuccess = () => {
        toast.success('Contraseña actualizada correctamente');
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

        try {
            // ✅ Usar ApiService
            await ApiService.deleteAccount(deletePassword);
            setDeleteMessage('Tu cuenta ha sido eliminada correctamente.');
            setShowDeleteConfirmation(false);
            setDeletePassword('');
            setConfirmDeletePassword('');
            toast.success('Tu cuenta ha sido eliminada correctamente');
            localStorage.clear();
            navigate('/login');
        } catch (error) {
            setDeleteError(error.message || 'Error al eliminar la cuenta. Por favor, verifica tu contraseña.');
            setDeleteMessage('');
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
            <div className="card shadow-lg p-3 mb-5 shadow-lg rounded">
                <div className="card-header text-center">
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