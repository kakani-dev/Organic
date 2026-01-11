import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    const location = useLocation();

    if (!user) {
        // Redirect to login page, but save the current location they were trying to go to
        // so we can send them back there after they login (optional improvement)
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
