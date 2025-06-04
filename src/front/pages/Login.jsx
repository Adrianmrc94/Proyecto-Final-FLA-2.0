import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/img/logo.png';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/['"]/g, "").replace(/\/$/, "");

        try {
            const response = await fetch(`${backendUrl}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            console.log('Login response:', data);
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                console.log('Token stored:', data.token);
                navigate('/home');
            } else {
                setError(data.msg || data.error || 'Crea un usuario primero o contacta con administración');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Error de conexión con el servidor');
        }
    };

    return (
        <div className="container mt-5 mb-5 d-flex flex-column justify-content-between" style={{ minHeight: '100vh' }}>
            <div className="mb-4 text-center">
                <img src={logo} alt="Logo FLA" className="logo" style={{ width: '200px', height: '200px', objectFit: 'contain' }} />
            </div>

            <div className="row flex-grow-1">
                <div className="col-12 col-md-6 d-flex align-items-center">
                    <div className="w-100">
                        <h2 className="mb-4">Iniciar Sesión</h2>
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className="mb-3">
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                        </form>
                        <div className="mt-3">
                            <small>
                                ¿Olvidaste tu contraseña?{" "}
                                <Link to="/forgot-password">Recupérala aquí</Link>
                            </small><br />
                            <small>
                                ¿No tienes cuenta?{" "}
                                <Link to="/register">Regístrate</Link>
                            </small>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 d-flex align-items-center mt-4 mt-md-0">
                    <div className="bg-light p-4 rounded shadow w-100">
                        <h4 className="mb-3">¿Qué es FLA?</h4>
                        <p><strong>FLA (Find Lowest App)</strong> es una plataforma que te permite comparar precios de productos entre diferentes supermercados usando tu código postal.</p>
                        <ul>
                            <li>Compara precios fácilmente</li>
                            <li>Filtra por categoría o tienda</li>
                            <li>Guarda tus productos favoritos</li>
                        </ul>
                        <p>¡Optimiza tus compras y ahorra dinero cada mes!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;