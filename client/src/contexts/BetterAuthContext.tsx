import React, { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from '../services/betterAuth';

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
    // Check for existing session using Better Auth
    const checkExistingSession = async () => {
      try {
        setIsLoading(true);
        
        // Get session from Better Auth
        const session = await authClient.getSession();
        console.log('BetterAuthContext: Session from Better Auth', session);
        
        if (session?.data?.user) {
          setUser(session.data.user);
          setSession(session.data);
          setIsAuthenticated(true);
        } else {
          console.log('BetterAuthContext: No existing session found');
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Real auth helpers using Better Auth
  const authHelpers = {
    signInWithEmail: async (email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await authClient.signIn("emailAndPassword", {
          email,
          password,
          redirect: false,
        });
        
        if (result?.data?.user) {
          // Store in localStorage
          localStorage.setItem('token', result.data.session.token);
          localStorage.setItem('userData', JSON.stringify(result.data.user));
          
          setUser(result.data.user);
          setSession(result.data.session);
          setIsAuthenticated(true);
        }
        
        return result;
      } catch (error) {
        // Handle error properly
        const errorMessage = error?.message || error?.statusText || 'Authentication failed';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    signUpWithEmail: async (email: string, password: string, userData?: any) => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await authClient.signUp("emailAndPassword", {
          email,
          password,
          name: userData?.displayName || userData?.name,
          ...userData,
          redirect: false,
        });
        
        if (result?.data?.user) {
          // Store in localStorage
          localStorage.setItem('token', result.data.session.token);
          localStorage.setItem('userData', JSON.stringify(result.data.user));
          
          setUser(result.data.user);
          setSession(result.data.session);
          setIsAuthenticated(true);
        }
        
        return result;
      } catch (error) {
        // Handle error properly
        const errorMessage = error?.message || error?.statusText || 'Authentication failed';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    signInWithGoogle: async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await authClient.signIn("google", {
          redirect: false,
        });
        
        if (result?.data?.user) {
          setUser(result.data.user);
          setSession(result.data);
          setIsAuthenticated(true);
        }
        
        return result;
      } catch (error) {
        // Handle error properly
        const errorMessage = error?.message || error?.statusText || 'Authentication failed';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    signOutUser: async () => {
      try {
        await authClient.signOut({ redirect: false });
        
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        setError(null);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    },

    getCurrentSession: async () => {
      try {
        return await authClient.getSession();
      } catch (error) {
        console.error('Error getting session:', error);
        return null;
      }
    },

    getAvailableProviders: async () => {
      try {
        return await authClient.getProviders();
      } catch (error) {
        console.error('Error getting providers:', error);
        return {};
      }
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