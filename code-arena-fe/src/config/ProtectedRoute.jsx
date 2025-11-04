import React from 'react';
import { Navigate } from 'react-router-dom';
import JwtUtils from '../utils/security/JwtUtils';
const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
    if (!JwtUtils.isAuthenticated() || JwtUtils.isTokenExpired()) {
        return <Navigate to="/unauthorized" replace/>;
    } else {
        const userRoles = JwtUtils.getUserRoles();
        return (
            userRoles.some(role => allowedRoles.includes(role)) ? (
                <Component />
                // <Route {...rest} element={<Component />} />
            ) : (
                <Navigate to="/unauthorized" replace />
            )
        );
    }

};

export default ProtectedRoute;
