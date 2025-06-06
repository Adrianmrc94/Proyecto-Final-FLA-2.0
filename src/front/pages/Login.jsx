import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import ApiService from '../services/api'; 
import useGlobalReducer from '../context/useGlobalReducer';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await ApiService.login(formData.email, formData.password);
            
            if (data.token && data.user) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: {
                        user: data.user,
                        token: data.token
                    }
                });
                
                navigate('/home');
            } else {
                setError('Respuesta inválida del servidor');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Error de conexión con el servidor');
        } finally {
            setIsLoading(false);
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
                                />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button 
                                type="submit" 
                                className="btn btn-success w-100"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </button>
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
                    <div className="p-4 shadow-lg w-100">
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