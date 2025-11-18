import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
    username: string;
    email: string;
    profile_pic: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('access_token');
                if (token && !config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (token) {
                const response = await axios.get('http://localhost:8000/users/me');
                setUser(response.data);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('access_token');
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }};

        checkAuth();
    }, []);

    const login = useCallback(async (token: string) => {
        try {
            localStorage.setItem('access_token', token);

            const userResponse = await axios.get('http://localhost:8000/users/me');
            
            setUser(userResponse.data);
            setIsAuthenticated(true);
        } catch (error) {
            localStorage.removeItem('access_token');
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    }, [navigate]);

    return (
        <AuthContext.Provider 
        value={{ 
            user, 
            isAuthenticated, 
            login, 
            logout, 
            isLoading 
        }}
        >
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};