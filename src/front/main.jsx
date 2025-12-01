import React, { useEffect } from "react";
import ReactDOM from 'react-dom/client'
import './index.css'  // Global styles for your application
import './custom-bootstrap.css'  // Custom Bootstrap overrides
import { RouterProvider } from "react-router-dom";  // Import RouterProvider to use the router
import { router } from "./routes";  // Import the router configuration
import { StoreProvider } from './context/StoreContext';  // Import the StoreProvider for global state management
import { BackendURL } from './components/BackendURL';
import useGlobalProducts from './hooks/useGlobalProducts';
import ApiService from './services/api';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Main = () => {
    if (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL === "")
        return <BackendURL />;

    return (
        <StoreProvider>
            <AppWithEffects />
        </StoreProvider>
    );
}

function AppWithEffects() {
    const {
        products,
        loadingProducts,
        setProducts,
        setLoadingProducts,
        setErrorLoadingProducts,
        setFeaturedProducts,
        setRandomProduct
    } = useGlobalProducts();

    useEffect(() => {
        // Versión de caché - cambiarla cuando modifiquemos el formato de datos
        // IMPORTANTE: Incrementar este número después de cada cambio en la estructura de URLs
        const CACHE_VERSION = "v7-improved-categories";
        const cachedVersion = localStorage.getItem("products_version");

        // Si la versión cambió, limpiar caché antiguo
        if (cachedVersion !== CACHE_VERSION) {
            localStorage.clear(); // Limpiar TODO el localStorage
            localStorage.setItem("products_version", CACHE_VERSION);
            console.log("🔄 Cache limpiado - Nueva versión:", CACHE_VERSION);
        }

        if (products.length === 0 && !loadingProducts) {
            setLoadingProducts(true);

            ApiService.fetchProducts()
                .then((data) => {
                    console.log("📦 Productos cargados:", data.length);
                    console.log("🖼️ Primera imagen:", data[0]?.image);
                    setProducts(data);

                    // Generar productos destacados y aleatorio
                    const shuffled = [...data].sort(() => 0.5 - Math.random());
                    const featured = shuffled.slice(0, 8);
                    const random = featured[0];

                    // Guardar en localStorage para persistencia
                    localStorage.setItem("featured", JSON.stringify(featured));
                    localStorage.setItem("randomProduct", JSON.stringify(random));

                    setFeaturedProducts(featured);
                    setRandomProduct(random);
                    setLoadingProducts(false);
                })
                .catch((err) => {
                    console.error("Error cargando productos:", err);
                    setErrorLoadingProducts(err.message);
                    setLoadingProducts(false);
                });
        }
    }, [products.length, loadingProducts, setProducts, setLoadingProducts, setErrorLoadingProducts, setFeaturedProducts, setRandomProduct]); return <RouterProvider router={router} />;
}

const rootElement = document.getElementById('root');
if (!rootElement._reactRoot) {
    rootElement._reactRoot = ReactDOM.createRoot(rootElement);
}
rootElement._reactRoot.render(<Main />);