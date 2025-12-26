import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/'; 

export const UserContext = createContext();

// 1. Exporting the instance for use outside of React components if needed
export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('access_token'));

    const setAuthHeader = useCallback((authToken) => {
        if (authToken) {
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            localStorage.setItem('access_token', authToken);
        } else {
            delete apiClient.defaults.headers.common['Authorization'];
            localStorage.removeItem('access_token');
        }
    }, []);

    const fetchUserProfile = useCallback(async (authToken) => {
        if (!authToken) {
            setLoading(false);
            return;
        }
        try {
            setAuthHeader(authToken); 
            const res = await apiClient.get('api/me/'); 
            const userData = Array.isArray(res.data) ? res.data[0] : res.data;
            setUser(userData);
        } catch (error) {
            console.error("Profile Fetch Error:", error.response?.data);
            logout(); 
        } finally {
            setLoading(false);
        }
    }, [setAuthHeader]);

    useEffect(() => {
        if (token) { fetchUserProfile(token); } 
        else { setLoading(false); }
    }, [token, fetchUserProfile]);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const res = await apiClient.post('auth/jwt/create/', { 
                username: email, 
                password: password 
            }); 
            const newToken = res.data.access; 
            setToken(newToken);
            setAuthHeader(newToken);
            await fetchUserProfile(newToken);
            return true;
        } catch (error) {
            setLoading(false);
            throw error.response?.data || error;
        }
    };

    const register = async (email, password) => {
        try {
            await apiClient.post('auth/users/', { 
                username: email, 
                email: email, 
                password: password,
                re_password: password 
            });
            return true;
        } catch (error) {
            throw error.response?.data || { detail: "Registration failed." }; 
        }
    };

    const logout = () => {
        setAuthHeader(null); 
        setToken(null);
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading, 
            isLoggedIn: !!user, 
            token, 
            register,
            apiClient // <-- 2. ADDED TO PROVIDER VALUE
        }}>
            {children}
        </UserContext.Provider>
    );
};