import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, endpoints } from '../config/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get(endpoints.auth.profile);
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await api.post(endpoints.auth.login, { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to login');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const response = await api.post(endpoints.auth.register, {
        email,
        password,
        name,
      });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to register');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post(endpoints.auth.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      const response = await api.put(endpoints.users.update(user?.id || ''), data);
      setUser(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 