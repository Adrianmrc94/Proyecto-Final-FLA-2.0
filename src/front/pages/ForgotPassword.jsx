import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/img/logo.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/['"]/g, "").replace(/\/$/, "");

        try {
            const response = await fetch(`${backendUrl}/api/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Instrucciones enviadas al correo');
                setEmailSent(true);
            } else {
                setError(data.error || 'Error al enviar solicitud');
            }
        } catch {
            setError('Error de conexión con el servidor');
        }
    };

    return (
        <div className="container m-auto d-flex flex-column justify-content-between" style={{ minHeight: '100vh' }}>
            <div className="mt-5 mb-1 text-center">
                <img src={logo} alt="Logo FLA" className="logo" style={{ width: '300px', height: '300px', objectFit: 'contain' }} />
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
                    <div className="bg-light p-4 shadow-lg w-100">
                        <h4 className="mb-3">¿Cómo funciona?</h4>
                        <p>Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.</p>
                        <ul>
                            <li>Recibe un enlace seguro por email</li>
                            <li>Crea una nueva contraseña</li>
                            <li>Vuelve a iniciar sesión fácilmente</li>
                        </ul>
                        <p className="text-muted">
                            Asegúrate de revisar tu bandeja de entrada y también la carpeta de spam.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;