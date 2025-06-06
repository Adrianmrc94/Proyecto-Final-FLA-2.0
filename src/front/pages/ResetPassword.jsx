import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import logo from "../assets/img/logo.png";
import ApiService from '../services/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setError('Token no válido');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!token) {
            setError('Token no válido');
            return;
        }

        if (password !== confirm) {
            setError('Las contraseñas no coinciden');
            return;
        }
        
        try {
            await ApiService.resetPassword(token, password);
            setMessage('Contraseña actualizada correctamente');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setError(error.message || 'Error al actualizar contraseña');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="text-center mb-4">
                <img src={logo} alt="Logo FLA" className="logo" style={{ width: '300px', height: '300px', objectFit: 'contain' }} />
            </div>

            <div className="row align-items-center">
                <div className="col-12 col-md-6 d-flex align-items-center">
                    <div className="w-100">
                        <h2 className="mb-4">Nueva Contraseña</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    placeholder="Nueva contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    placeholder="Confirmar contraseña"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            {message && <div className="alert alert-success">{message}</div>}
                            <button type="submit" className="btn btn-success w-100">Actualizar Contraseña</button>
                        </form>
                        <div className="mt-3">
                            <small>
                                <Link to="/login">← Volver al inicio de sesión</Link>
                            </small>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 d-flex align-items-center mt-4 mt-md-0">
                    <div className="p-4 rounded shadow w-100">
                        <h4 className="mb-3">¿Cómo funciona?</h4>
                        <p>Ingresa tu nueva contraseña y confírmala para restablecerla.</p>
                        <ul>
                            <li>Tu contraseña debe tener al menos 6 caracteres</li>
                            <li>Usa una combinación de letras, números y símbolos</li>
                            <li>Evita usar contraseñas comunes o fáciles de adivinar</li>
                        </ul>
                        <p className="text-muted">
                            Una vez restablecida, podrás iniciar sesión con tu nueva contraseña.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;