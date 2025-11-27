import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import useDarkMode from "../hooks/useDarkMode";
import useGlobalReducer from "../context/useGlobalReducer";  // ✅ Agregar import
import SearchBar from "./search/SearchBar";

export const Navbar = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { store, dispatch } = useGlobalReducer();  // ✅ Usar el hook
  const isAuthenticated = store.isAuthenticated;
  const user = store.user;

  const handleLogout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  return (
    <nav className="navbar shadow-lg navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" onClick={() => navigate("/Home")} style={{ cursor: "pointer" }}>
          <img
            src={logo}
            alt="Logo"
            className="navbar-logo"
            style={{
              width: "auto",
              height: "45px",
              maxHeight: "45px",
              objectFit: "contain"
            }}
          />
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
          <div className="d-flex w-50 justify-content-center">
            <SearchBar />
          </div>

          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="darkModeSwitch"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            <label className="form-check-label" htmlFor="darkModeSwitch">
              {darkMode ? (
                <>
                  <i className="bi bi-sun-fill"></i> Activar Claro
                </>
              ) : (
                <>
                  <i className="bi bi-moon-fill"></i> Activar Oscuro
                </>
              )}
            </label>
          </div>

          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                {isAuthenticated && user ? `Hola, ${user.name}` : 'Menú'}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/home")}>
                    <i className="bi bi-house-door me-2"></i>
                    Inicio
                  </button>
                </li>
                {isAuthenticated && (
                  <>
                    <li>
                      <button className="dropdown-item" onClick={() => navigate("/catalog")}>
                        <i className="bi bi-grid-3x3-gap me-2"></i>
                        Catálogo
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => navigate("/favorites")}>
                        <i className="bi bi-heart me-2"></i>
                        Productos Favoritos
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => navigate("/user")}>
                        <i className="bi bi-person me-2"></i>
                        Perfil
                      </button>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Cerrar Sesión
                      </button>
                    </li>
                  </>
                )}
                {!isAuthenticated && (
                  <>
                    <li>
                      <button className="dropdown-item" onClick={() => navigate("/login")}>
                        Iniciar Sesión
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => navigate("/register")}>
                        Registrarse
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};