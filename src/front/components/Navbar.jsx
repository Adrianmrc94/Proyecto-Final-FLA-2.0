import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/img/logo.png";
import useDarkMode from "../hooks/useDarkMode"; // Ajusta la ruta según tu estructura de carpetas

export const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" onClick={() => navigate("/Home")} style={{ cursor: "pointer" }}>
          <img src={logo} alt="Logo" width="50" height="50" />
        </a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
          <form className="d-flex w-50 justify-content-center" role="search" onSubmit={handleSearch}>
            <input
              className="form-control border-end-0 flex-grow-1"
              type="search"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn border-0" type="submit">
              Buscar
            </button>
          </form>

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
                  <i className="bi bi-sun-fill"></i> Modo Claro
                </>
              ) : (
                <>
                  <i className="bi bi-moon-fill"></i> Modo Oscuro
                </>
              )}
            </label>
          </div>

          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Menú
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/home")}>
                    Inicio
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/favorites")}>
                    Productos Favoritos
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/user")}>
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
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};