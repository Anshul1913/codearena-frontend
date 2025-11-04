import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
const getUserRoles = () => {
    const token = Cookies.get('jwtToken');
    if (token) {
        const decodedToken = jwtDecode(token);
        return decodedToken.roles || [];
    }
    return [];
};

const getUsername = () => {
    const token = Cookies.get('jwtToken');
    if (token) {
        const decodedToken = jwtDecode(token);
        return decodedToken.sub || null;
    }
    return null;
};

const hasRole = (userRoles) => getUserRoles().some(role => userRoles.includes(role));

const isAuthenticated = () => {
    const token = Cookies.get('jwtToken');
    return !!token;
};

// Function to check if the token is expired
const isTokenExpired = () => {
    const token = Cookies.get('jwtToken');
    if (token) {
        try {
            const { exp } = jwtDecode(token);
            if (exp && Date.now() >= exp * 1000) {
                return true;
            }
        } catch (error) {
            console.error('Failed to decode token:', error);
            return true;
        }
    }
    return false;
};

const clearCookies = () => {
    Cookies.remove('jwtToken');
    Cookies.remove('refreshJwtToken');
}

const JwtUtils = {
    getUserRoles,
    isAuthenticated,
    getUsername,
    isTokenExpired,
    hasRole,
    clearCookies
}

export default JwtUtils;