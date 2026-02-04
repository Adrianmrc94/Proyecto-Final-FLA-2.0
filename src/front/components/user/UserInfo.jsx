import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import StoreContext from '../../context/StoreContext';
import { actionTypes } from '../../store';

export default function UserInfo({ userData, onUserDataUpdate }) {
    const { dispatch } = React.useContext(StoreContext);
    const navigate = useNavigate();
    const [isEditingPostalCode, setIsEditingPostalCode] = useState(false);
    const [newPostalCode, setNewPostalCode] = useState(userData.postal_code || '');
    const [isUpdating, setIsUpdating] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleUpdatePostalCode = async () => {
        if (!newPostalCode || newPostalCode.length !== 5) {
            toast.error('Por favor, introduce un código postal válido de 5 dígitos');
            return;
        }

        setIsUpdating(true);

        try {
            // Llamada SÍNCRONA al scraping (bloqueante)
            const data = await ApiService.scrapePostalCode(newPostalCode);

            // Scraping completado, actualizar CP del usuario
            await ApiService.updatePostalCode(newPostalCode);

            // Actualizar store global
            dispatch({
                type: actionTypes.UPDATE_USER_POSTAL_CODE,
                payload: newPostalCode
            });

            // Limpiar localStorage para forzar recarga de productos
            localStorage.removeItem('products');
            localStorage.removeItem('products_version');
            localStorage.removeItem('featured');
            localStorage.removeItem('randomProduct');

            // Limpiar productos del store
            dispatch({
                type: actionTypes.SET_PRODUCTS,
                payload: []
            });

            if (data.needs_scraping) {
                toast.success(`✅ Scraping completado: ${data.products_imported} productos importados`);
            } else {
                toast.success('Código postal actualizado');
            }

            setIsEditingPostalCode(false);

            if (onUserDataUpdate) {
                await onUserDataUpdate();
            }

            // Recargar página para obtener nuevos productos
            setTimeout(() => {
                window.location.href = '/catalog';
            }, 500);

        } catch (error) {
            toast.error(error.message || 'Error al actualizar código postal');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelEdit = () => {
        setNewPostalCode(userData.postal_code || '');
        setIsEditingPostalCode(false);
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
                        {isEditingPostalCode ? (
                            <div className="postal-code-edit">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={newPostalCode}
                                    onChange={(e) => setNewPostalCode(e.target.value)}
                                    maxLength="5"
                                    placeholder="28020"
                                    disabled={isUpdating}
                                />
                                <div className="postal-code-actions mt-2">
                                    <button
                                        className="btn btn-sm btn-success me-2"
                                        onClick={handleUpdatePostalCode}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-check me-1"></i>
                                                Guardar
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={handleCancelEdit}
                                        disabled={isUpdating}
                                    >
                                        <i className="fas fa-times me-1"></i>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="postal-code-display">
                                <p>{userData.postal_code || 'No especificado'}</p>
                                <button
                                    className="btn btn-sm btn-outline-primary mt-2"
                                    onClick={() => setIsEditingPostalCode(true)}
                                >
                                    <i className="fas fa-edit me-1"></i>
                                    Cambiar CP
                                </button>
                            </div>
                        )}
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
                <strong>Nota:</strong> Al cambiar tu código postal, los productos disponibles se actualizarán según tu nueva ubicación. {isUpdating && 'Procesando scraping...'}
            </div>
        </div>
    );
}