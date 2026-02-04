import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PasswordResetForm from '../components/user/PasswordResetForm';
import UserInfo from '../components/user/UserInfo';
import DeleteAccountForm from '../components/user/DeleteAccountForm';
import useDarkMode from '../hooks/useDarkMode';
import ApiService from '../services/api';
import '../styles/UserPage.css';

const UserPage = () => {
    const [activeTab, setActiveTab] = useState('info');
    const [userData, setUserData] = useState({});
    const [deletePassword, setDeletePassword] = useState('');
    const [confirmDeletePassword, setConfirmDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { darkMode } = useDarkMode();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }

            try {
                setIsLoading(true);
                const data = await ApiService.getUserProfile();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    const handlePasswordChangeSuccess = () => {
        toast.success('Contraseña actualizada correctamente');
    };

    const handleUserDataUpdate = async () => {
        try {
            const data = await ApiService.getUserProfile();
            setUserData(data);
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
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

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5">
            {/* Header con Avatar */}
            <div className="user-header-card">
                <div className="user-avatar-section">
                    <div className="user-avatar">
                        <i className="fas fa-user"></i>
                    </div>
                    <div className="user-header-info">
                        <h2 className="user-name">{userData.name} {userData.last_name}</h2>
                        <p className="user-email"><i className="fas fa-envelope me-2"></i>{userData.email}</p>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="user-tabs-container">
                <div className="user-tabs">
                    <button
                        className={`user-tab ${activeTab === 'info' ? 'active' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        <i className="fas fa-user-circle"></i>
                        <span>Información</span>
                    </button>
                    <button
                        className={`user-tab ${activeTab === 'changePassword' ? 'active' : ''}`}
                        onClick={() => setActiveTab('changePassword')}
                    >
                        <i className="fas fa-key"></i>
                        <span>Contraseña</span>
                    </button>
                    <button
                        className={`user-tab ${activeTab === 'deleteAccount' ? 'active' : ''}`}
                        onClick={() => setActiveTab('deleteAccount')}
                    >
                        <i className="fas fa-trash-alt"></i>
                        <span>Eliminar Cuenta</span>
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="user-content-card">
                <div className={`tab-content-wrapper ${activeTab}`}>
                    {activeTab === 'info' && <UserInfo userData={userData} onUserDataUpdate={handleUserDataUpdate} />}
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
    );
};

export default UserPage;