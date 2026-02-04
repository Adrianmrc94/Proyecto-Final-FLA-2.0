import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import { toast } from 'react-toastify';
import './ScrapingProgressModal.css';

export default function ScrapingProgressModal({ jobId, postalCode, onComplete, onCancel }) {
    const [status, setStatus] = useState({
        status: 'pending',
        progress: 0,
        message: 'Iniciando...',
        total_products: 0,
        current_products: 0
    });
    const [polling, setPolling] = useState(null);

    useEffect(() => {
        if (!jobId) return;

        // Función para consultar el estado
        const checkStatus = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/scraping/status/${jobId}`, {
                    headers: ApiService.getAuthHeaders()
                });

                if (!response.ok) {
                    throw new Error('Error al consultar estado');
                }

                const data = await response.json();
                setStatus(data);

                // Si completó o hubo error, detener polling
                if (data.status === 'completed') {
                    clearInterval(polling);
                    setTimeout(() => {
                        toast.success(`¡Scraping completado! ${data.total_products} productos descargados`);
                        onComplete && onComplete(data);
                    }, 1000);
                } else if (data.status === 'error') {
                    clearInterval(polling);
                    toast.error(`Error en scraping: ${data.error}`);
                    onCancel && onCancel();
                }
            } catch (error) {
                console.error('Error checking scraping status:', error);
            }
        };

        // Iniciar polling cada 2 segundos
        const intervalId = setInterval(checkStatus, 2000);
        setPolling(intervalId);

        // Primera consulta inmediata
        checkStatus();

        // Cleanup
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [jobId]);

    const getStatusColor = () => {
        switch (status.status) {
            case 'completed':
                return 'success';
            case 'error':
                return 'danger';
            case 'running':
                return 'primary';
            default:
                return 'info';
        }
    };

    const getStatusIcon = () => {
        switch (status.status) {
            case 'completed':
                return 'fa-check-circle';
            case 'error':
                return 'fa-times-circle';
            case 'running':
                return 'fa-sync fa-spin';
            default:
                return 'fa-hourglass-half';
        }
    };

    return (
        <div className="modal-overlay">
            <div className="scraping-modal">
                <div className="modal-header">
                    <h3>
                        <i className={`fas ${getStatusIcon()} me-2`}></i>
                        Descargando productos
                    </h3>
                    <p className="text-muted">Código Postal: {postalCode}</p>
                </div>

                <div className="modal-body">
                    <div className="progress-info mb-3">
                        <div className="d-flex justify-content-between mb-2">
                            <span>{status.message}</span>
                            <span className="fw-bold">{status.progress}%</span>
                        </div>

                        <div className="progress" style={{ height: '25px' }}>
                            <div
                                className={`progress-bar progress-bar-striped ${status.status === 'running' ? 'progress-bar-animated' : ''
                                    } bg-${getStatusColor()}`}
                                role="progressbar"
                                style={{ width: `${status.progress}%` }}
                                aria-valuenow={status.progress}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                {status.progress}%
                            </div>
                        </div>
                    </div>

                    {status.total_products > 0 && (
                        <div className="products-count text-center">
                            <i className="fas fa-box me-2"></i>
                            <strong>{status.current_products}</strong> de <strong>{status.total_products}</strong> productos
                        </div>
                    )}

                    {status.status === 'error' && (
                        <div className="alert alert-danger mt-3">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            {status.error}
                        </div>
                    )}

                    {status.status === 'completed' && (
                        <div className="alert alert-success mt-3">
                            <i className="fas fa-check-circle me-2"></i>
                            ¡Productos descargados correctamente! Redirigiendo...
                        </div>
                    )}
                </div>

                {status.status !== 'completed' && status.status !== 'running' && (
                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={status.status === 'running'}
                        >
                            Cancelar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
