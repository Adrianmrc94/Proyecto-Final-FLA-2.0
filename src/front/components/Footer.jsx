import React from 'react';

export const Footer = () => {
    return (
        <footer className="footer border border-dark border-2 shadow-lg py-3">
            <div className="container">
                <div className="row align-items-center">

                    <div className="col-md-4 mb-3 mb-md-0">
                        <h5 className="text-uppercase fw-bold mb-2">Sobre nosotros</h5>
                        <p className=" small">
                            Plataforma que te permite comparar precios de productos entre diferentes supermercados usando tu código postal.
                        </p>
                    </div>

                    <div className="col-md-4 text-center mb-3 mb-md-0">
                        <h5 className="text-uppercase fw-bold mb-2">Contacto</h5>
                        <p className=" mb-1">
                            <i className="fas fa-phone me-2"></i>+34 123 456 789
                        </p>
                        <p className="text-muted mt-2">&copy; {new Date().getFullYear()} FLA PROYECT</p>
                    </div>

                    <div className="col-md-4 d-flex flex-column align-items-md-end justify-content-center text-center">
                        <h5 className="text-uppercase fw-bold mb-3">Síguenos</h5>
                        <div className="d-flex justify-content-center gap-2">
                            <a href="https://www.facebook.com/FLA_Proyect " className=" fs-4" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://twitter.com/FLA_Proyect " className=" fs-4" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://www.instagram.com/FLA_Proyect " className=" fs-4" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};