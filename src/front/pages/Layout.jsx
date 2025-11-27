import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Layout = () => {
    const location = useLocation();
    const path = location.pathname;

    // Ocultar
    const hide =
        path === '/' ||
        path === '/login' ||
        path === '/register' ||
        path === '/forgot-password' ||
        path.startsWith('/reset');

    return (
        <ScrollToTop>
            {!hide && <Navbar />}
            <Outlet />
            {!hide && <Footer />}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </ScrollToTop>
    );
};
