import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Layout = () => {
    const location = useLocation();
    const path = location.pathname;

    // Ocultar
    const hideNavbar =
        path === '/' ||
        path === '/login' || 
        path === '/register' || 
        path === '/forgot-password' || 
        path.startsWith('/reset');

    return (
        <ScrollToTop>
            {!hideNavbar && <Navbar />}
            <Outlet />
            <Footer /> 
        </ScrollToTop>
    );
};
