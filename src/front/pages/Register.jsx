import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from "../assets/img/logo.png";

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        postalCode: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { name, last_name, postalCode, email, password, confirmPassword } = formData;

        if (!name || !last_name || !postalCode || !email || !password || !confirmPassword) {
            setError('Todos los campos son requeridos');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Formato de email inválido');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/['"]/g, "").replace(/\/$/, "");

        try {
            const response = await fetch(`${backendUrl}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    last_name: last_name,
                    postal_code: postalCode,
                    email,
                    password
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Registro exitoso');
                navigate('/');
            } else {
                setError(data.error || 'Error al registrar');
            }
        } catch {
            setError('Error de conexión con el servidor');
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="text-center mb-4">
                <img src={logo} alt="Logo FLA" className="logo" style={{ width: '200px', height: '200px', objectFit: 'contain' }} />
            </div>

            <div className="row flex-grow-1">
                <div className="col-12 col-md-6 d-flex align-items-center">
                    <div className="w-100">
                        <h2 className="mb-4">Registro</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Nombre"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    name="last_name"
                                    type="text"
                                    placeholder="Apellido"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    name="postalCode"
                                    type="text"
                                    placeholder="Código Postal"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
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
                            <div className="mb-3">
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirmar Contraseña"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="form-control"
                                    required
                                />
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button type="submit" className="btn btn-primary w-100">Aceptar y continuar</button>
                        </form>
                        <div className="mt-3">
                            <small>
                                ¿Ya tienes cuenta?{" "}
                                <Link to="/login">Iniciar sesión</Link>
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

export default Register;