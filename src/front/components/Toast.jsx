import { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-success';
            case 'error':
                return 'bg-danger';
            case 'warning':
                return 'bg-warning';
            default:
                return 'bg-info';
        }
    };

    return (
        <div
            className="position-fixed top-0 end-0 p-3"
            style={{ zIndex: 9999 }}
        >
            <div className={`toast show ${getTypeStyles()}`} role="alert">
                <div className="toast-header">
                    <i className={`bi ${type === 'success' ? 'bi-check-circle-fill' :
                            type === 'error' ? 'bi-x-circle-fill' :
                                type === 'warning' ? 'bi-exclamation-triangle-fill' :
                                    'bi-info-circle-fill'
                        } me-2`}></i>
                    <strong className="me-auto">
                        {type === 'success' ? 'Éxito' :
                            type === 'error' ? 'Error' :
                                type === 'warning' ? 'Advertencia' :
                                    'Información'}
                    </strong>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="toast-body text-white">
                    {message}
                </div>
            </div>
        </div>
    );
};

export default Toast;
