import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginUser, 
  registerUser, 
  getCurrentUser, 
  updateUserProfile, 
  logoutUser, 
  verifyToken,
  googleAuth,
  type User,
  type LoginCredentials,
  type RegisterData,
  type GoogleAuthData
} from '../api/auth';

// Remove duplicate interface since we're importing it from auth.ts

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (googleData: GoogleAuthData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
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
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const isValid = await verifyToken(token);
        if (!isValid) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          setUser(null);
          setLoading(false);
          return;
        }

        // Get user data from backend
        const userData = await getCurrentUser(token);
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      const credentials: LoginCredentials = { email, password };
      const response = await loginUser(credentials);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      setUser(response.user);
      
    } catch (error: any) {
      setError(error.message || 'Failed to login');
      throw error;
    }
  };

  const googleLogin = async (googleData: GoogleAuthData) => {
    try {
      setError(null);
      
      const response = await googleAuth(googleData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      setUser(response.user);
      
    } catch (error: any) {
      setError(error.message || 'Failed to login with Google');
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setError(null);
      
      const response = await registerUser(userData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      setUser(response.user);
      
    } catch (error: any) {
      setError(error.message || 'Failed to register');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await logoutUser(token);
      }
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
      const token = localStorage.getItem('token');
      if (!token || !user) {
        throw new Error('Not authenticated');
      }
      
      const updatedUser = await updateUserProfile(user._id, data, token);
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    googleLogin,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 