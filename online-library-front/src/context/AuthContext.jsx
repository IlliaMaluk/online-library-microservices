// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Функція для декодування JWT без сторонніх бібліотек
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Invalid JWT:', e);
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const decoded = parseJwt(token);
            if (decoded) {
                setUser({
                    username: decoded.username || decoded.sub,
                    role: decoded.role
                });
            } else {
                logout();
            }
        }
    }, [token]);

    const login = (username, password) => {
        return axios
            .post('http://localhost:3000/users/login', { username, password })
            .then(res => {
                const jwt = res.data.token;
                localStorage.setItem('token', jwt);
                setToken(jwt);
                axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
                const decoded = parseJwt(jwt);
                if (decoded) {
                    setUser({ username: decoded.username || decoded.sub, role: decoded.role });
                }
            });
    };

    const register = (username, password) => {
        return axios
            .post('http://localhost:3000/users/register', { username, password })
            .then(() => login(username, password));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}