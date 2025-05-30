import React, { useEffect } from "react";
import ReactDOM from 'react-dom/client'
import './index.css'  // Global styles for your application
import { RouterProvider } from "react-router-dom";  // Import RouterProvider to use the router
import { router } from "./routes";  // Import the router configuration
import { StoreProvider } from './context/StoreContext';  // Import the StoreProvider for global state management
import { BackendURL } from './components/BackendURL';
import useGlobalProducts from './hooks/useGlobalProducts';

const Main = () => {
    if (!import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL === "")
        return (
            <React.StrictMode>
                <BackendURL />
            </React.StrictMode>
        );

    return (
        <React.StrictMode>
            <StoreProvider>
                <AppWithEffects />
            </StoreProvider>
        </React.StrictMode>
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

        if (products.length === 0 && !loadingProducts) {
            setLoadingProducts(true);
            fetch("/products.json")
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    setProducts(data.products);
                    
                    const shuffled = [...data.products].sort(() => 0.5 - Math.random());
                    const featured = shuffled.slice(0, 6);
                    const random = featured[0];

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
    }, []);

    return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<Main />);