// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roles }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (roles && roles.indexOf(role) === -1) {
        return <Navigate to="/login" />; // Redirect if the user doesn't have the required role
    }

    return children;
};

export default PrivateRoute;