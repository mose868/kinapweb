import React, { createContext, useContext, useEffect, useState } from 'react';

interface BetterAuthContextType {
  user: any;
  session: any;
  isLoading: boolean;
  error: any;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  getSession: () => Promise<any>;
  getProviders: () => Promise<any>;
}

const BetterAuthContext = createContext<BetterAuthContextType | undefined>(undefined);

export const useBetterAuthContext = () => {
  const context = useContext(BetterAuthContext);
  if (context === undefined) {
    throw new Error('useBetterAuthContext must be used within a BetterAuthProvider');
  }
  return context;
};

interface BetterAuthProviderProps {
  children: React.ReactNode;
}

export const BetterAuthProvider: React.FC<BetterAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session in localStorage
    const checkExistingSession = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        console.log('BetterAuthContext: Checking existing session', { hasToken: !!token, hasUserData: !!userData });
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          console.log('BetterAuthContext: Setting user from localStorage', parsedUser);
          setUser(parsedUser);
          setSession({ token });
          setIsAuthenticated(true);
        } else {
          console.log('BetterAuthContext: No existing session found');
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Simplified auth helpers
  const authHelpers = {
    signInWithEmail: async (email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);
        
        // For now, simulate a successful login
        const mockUser = {
          id: '1',
          email,
          displayName: email.split('@')[0],
          role: 'student'
        };
        
        const mockSession = {
          token: 'mock-token-' + Date.now()
        };
        
        // Store in localStorage
        localStorage.setItem('token', mockSession.token);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setSession(mockSession);
        setIsAuthenticated(true);
        
        return { success: true };
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    signUpWithEmail: async (email: string, password: string, userData?: any) => {
      try {
        setIsLoading(true);
        setError(null);
        
        // For now, simulate a successful registration
        const mockUser = {
          id: '1',
          email,
          displayName: userData?.displayName || email.split('@')[0],
          role: userData?.role || 'student',
          ...userData
        };
        
        const mockSession = {
          token: 'mock-token-' + Date.now()
        };
        
        // Store in localStorage
        localStorage.setItem('token', mockSession.token);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setSession(mockSession);
        setIsAuthenticated(true);
        
        return { success: true };
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    signInWithGoogle: async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // For now, simulate Google sign-in
        const mockUser = {
          id: '1',
          email: 'user@gmail.com',
          displayName: 'Google User',
          role: 'student'
        };
        
        const mockSession = {
          token: 'google-token-' + Date.now()
        };
        
        // Store in localStorage
        localStorage.setItem('token', mockSession.token);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setSession(mockSession);
        setIsAuthenticated(true);
        
        return { success: true };
      } catch (error) {
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    signOutUser: async () => {
      try {
        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        setError(null);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    },

    getCurrentSession: async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        return {
          token,
          user: JSON.parse(userData)
        };
      }
      return null;
    },

    getAvailableProviders: async () => {
      return {
        email: true,
        google: true
      };
    }
  };

  const value: BetterAuthContextType = {
    user,
    session,
    isLoading,
    error,
    isAuthenticated,
    signIn: authHelpers.signInWithEmail,
    signUp: authHelpers.signUpWithEmail,
    signInWithGoogle: authHelpers.signInWithGoogle,
    signOut: authHelpers.signOutUser,
    getSession: authHelpers.getCurrentSession,
    getProviders: authHelpers.getAvailableProviders,
  };

  return (
    <BetterAuthContext.Provider value={value}>
      {children}
    </BetterAuthContext.Provider>
  );
};

export default BetterAuthProvider; 