import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import ApiService from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await ApiService.forgotPassword(email);
            setMessage('Instrucciones enviadas al correo');
            setEmailSent(true);
        } catch (error) {
            setError(error.message || 'Error al enviar solicitud');
        }
    };

    return (
        <div className="container m-auto d-flex flex-column justify-content-between" style={{ minHeight: '100vh' }}>
            <div className="mt-5 mb-1 text-center position-relative">
                <div
                    className="logo-container-static d-inline-block p-3 rounded-4 shadow-lg"
                    style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: '3px solid rgba(102, 126, 234, 0.4)',
                        animation: 'fadeInScale 0.6s ease'
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo FLA"
                        className="logo"
                        style={{
                            width: '350px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 10px 25px rgba(102, 126, 234, 0.4))'
                        }}
                    />
                </div>
            </div>

            <div className="row flex-grow-1">
                <div className="col-12 col-md-6 d-flex align-items-center">
                    <div className="w-100">
                        <h2 className="mb-4">Recuperar Contraseña</h2>
                        <form onSubmit={handleSubmit}>
                            {!emailSent && (
                                <div className="shadow-lg mb-3">
                                    <input
                                        type="email"
                                        placeholder="Tu email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>
                            )}
                            {error && <div className="alert alert-danger">{error}</div>}
                            {message && <div className="alert alert-success">{message}</div>}

                            {!emailSent ? (
                                <button type="submit" className="btn btn-success shadow-lg w-100">Enviar instrucciones</button>
                            ) : (
                                <p className="text-muted text-center">Revisa tu bandeja de entrada.</p>
                            )}
                        </form>
                        <div className="mt-3">
                            <small>
                                <Link to="/login">← Volver al inicio de sesión</Link>
                            </small>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 d-flex align-items-center mt-4 mt-md-0">
                    <div className="card shadow-lg w-100 border-0" style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div className="card-body p-4">
                            <h4 className="mb-3 text-primary">
                                <i className="bi bi-question-circle-fill me-2"></i>
                                ¿Cómo funciona?
                            </h4>
                            <p className="lead mb-3">
                                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
                            </p>
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary text-white rounded-circle p-2 me-3" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="bi bi-envelope-fill"></i>
                                    </div>
                                    <span>Recibe un enlace seguro por email</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary text-white rounded-circle p-2 me-3" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="bi bi-key-fill"></i>
                                    </div>
                                    <span>Crea una nueva contraseña</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary text-white rounded-circle p-2 me-3" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="bi bi-box-arrow-in-right"></i>
                                    </div>
                                    <span>Vuelve a iniciar sesión fácilmente</span>
                                </div>
                            </div>
                            <p className="mt-4 mb-0 text-center text-muted">
                                <small>Asegúrate de revisar tu bandeja de entrada y también la carpeta de spam.</small>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;