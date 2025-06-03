import { useState, useEffect } from "react";

export default function useDarkMode() {
  // Función para obtener el modo inicial: del localStorage o de la preferencia del sistema
  const getInitialMode = () => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode !== null) {
      return JSON.parse(storedMode);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [darkMode, setDarkMode] = useState(getInitialMode);

  useEffect(() => {
    // Aplicar el atributo data-bs-theme para aprovechar el theming nativo de Bootstrap
    document.body.setAttribute("data-bs-theme", darkMode ? "dark" : "light");
    // También puedes aplicar o quitar una clase personalizada para tus estilos propios
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return { darkMode, toggleDarkMode };
}