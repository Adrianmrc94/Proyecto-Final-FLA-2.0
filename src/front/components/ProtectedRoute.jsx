import React from 'react';
import { Navigate } from 'react-router-dom';
import useGlobalReducer from '../context/useGlobalReducer';

const ProtectedRoute = ({ children }) => {
    const { store } = useGlobalReducer();
    const isAuthenticated = store.isAuthenticated;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
