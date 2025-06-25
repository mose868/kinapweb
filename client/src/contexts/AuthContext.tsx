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
    const loadUserFromStorage = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const userData = localStorage.getItem('userData');
        if (userData) {
          setUser(JSON.parse(userData));
          return;
        }

        // Fallback to API call
        const response = await api.get(endpoints.auth.profile);
        setUser(response.data);
      } catch (error) {
        try {
          const decoded = JSON.parse(atob(token));
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          const foundUser = registeredUsers.find((u: any) => u.id === decoded.userId);
          if (foundUser) {
            setUser(foundUser);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            setUser(null);
          }
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          setUser(null);
        }
      }
    };

    // Initial load
    loadUserFromStorage().finally(() => setLoading(false));

    // Listen for storage changes to update user state when login/logout happens
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userData' || e.key === 'token') {
        if (e.newValue === null) {
          // User was logged out
          setUser(null);
        } else if (e.key === 'userData' && e.newValue) {
          // User data was updated
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
      }
    };

    // Custom event fired manually after auth changes within the same tab
    const handleAuthUpdated = () => {
      loadUserFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authUpdated', handleAuthUpdated as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authUpdated', handleAuthUpdated as EventListener);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Mock authentication - check registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find((u: any) => u.email === email);
      
      if (!user) {
        throw new Error('User not found. Please check your email or sign up.');
      }
      
      if (user.password !== password) {
        throw new Error('Invalid password. Please try again.');
      }

      // Create session
      const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
      setUser(user);
      
    } catch (error: any) {
      setError(error.message || 'Failed to login');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      
      // Mock authentication - check if user exists
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const existingUser = registeredUsers.find((user: any) => user.email === email);
      
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: email,
        name: name,
        role: 'student',
        password: password, // In real app, this would be hashed
        avatar: null
      };

      // Save to registered users
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      // Create session
      const token = btoa(JSON.stringify({ userId: newUser.id, email: newUser.email }));
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(newUser));
      setUser(newUser);
      
    } catch (error: any) {
      setError(error.message || 'Failed to register');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post(endpoints.auth.logout);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all session data
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
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