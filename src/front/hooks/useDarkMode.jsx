import { useState, useEffect } from "react";

export default function useDarkMode() {
  // Obtener el modo inicial del sistema o del localStorage
  const getInitialMode = () => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode !== null) {
      return JSON.parse(storedMode);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [darkMode, setDarkMode] = useState(getInitialMode);
  const [key, setKey] = useState(0); // Clave para forzar re-render

  useEffect(() => {
    // Aplicar el tema antes de actualizar localStorage
    document.body.setAttribute("data-bs-theme", darkMode ? "dark" : "light");

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    setTimeout(() => {
      localStorage.setItem("darkMode", JSON.stringify(darkMode));
      setKey((prevKey) => prevKey + 1); // Fuerza re-render global
    }, 50);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return { darkMode, toggleDarkMode, key };
}