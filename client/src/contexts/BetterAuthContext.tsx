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
  verifyCode: (email: string, code: string) => Promise<any>;
  resendCode: (email: string) => Promise<any>;
  signOut: () => Promise<void>;
  getSession: () => Promise<any>;
  getProviders: () => Promise<any>;
}

const BetterAuthContext = createContext<BetterAuthContextType | undefined>(
  undefined
);

export const useBetterAuthContext = () => {
  const context = useContext(BetterAuthContext);
  if (context === undefined) {
    throw new Error(
      'useBetterAuthContext must be used within a BetterAuthProvider'
    );
  }
  return context;
};

interface BetterAuthProviderProps {
  children: React.ReactNode;
}

export const BetterAuthProvider: React.FC<BetterAuthProviderProps> = ({
  children,
}) => {
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

        // Check localStorage first for existing user data
        const storedUser = localStorage.getItem('userData');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setSession({ token: storedToken });
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Get session from Better Auth
        const session = await authClient.getSession();
        console.log('BetterAuthContext: Session from Better Auth', session);

        if (session?.data?.user) {
          setUser(session.data.user);
          setSession(session.data.session);
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

        const result = await authClient.signIn('emailAndPassword', {
          email,
          password,
          redirect: false,
        });

        // Check if verification is required
        if (result.requiresVerification) {
          return {
            requiresVerification: true,
            message: result.message,
            email: email
          };
        }

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
        const errorMessage =
          error?.message || error?.statusText || 'Authentication failed';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    signUpWithEmail: async (
      email: string,
      password: string,
      userData?: any
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await authClient.signUp('emailAndPassword', {
          email,
          password,
          ...userData,
          redirect: false,
        });

        // Sign up always requires verification
        if (result.requiresVerification) {
          return {
            requiresVerification: true,
            message: result.message,
            email: email
          };
        }

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
        const errorMessage =
          error?.message || error?.statusText || 'Registration failed';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    verifyCode: async (email: string, code: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await authClient.verifyCode(email, code);
        console.log('🔍 BetterAuthContext verifyCode result:', result);

        if (result?.data?.user) {
          console.log('✅ Setting user data and session');
          console.log('🔍 User data:', result.data.user);
          console.log('🔍 Session data:', result.data.session);
          
          // Store in localStorage
          localStorage.setItem('token', result.data.session.token);
          localStorage.setItem('userData', JSON.stringify(result.data.user));

          setUser(result.data.user);
          setSession(result.data.session);
          setIsAuthenticated(true);
          
          console.log('✅ Authentication state updated - user set, session set, isAuthenticated set to true');
          
          // Return the result so the VerificationCode component can handle success
          return result;
        } else {
          console.log('❌ No user data in result:', result);
          // Return the result even if no user data, so error handling works
          return result;
        }
      } catch (error) {
        console.log('🔍 BetterAuthContext caught error:', error);
        console.log('🔍 Error type:', typeof error);
        console.log('🔍 Error message:', error?.message);
        console.log('🔍 Error statusText:', error?.statusText);
        
        const errorMessage =
          error?.message || error?.statusText || 'Verification failed';
        console.log('🔍 BetterAuthContext setting error:', errorMessage);
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },

    resendCode: async (email: string) => {
      try {
        setError(null);

        const result = await authClient.resendCode(email);

        return result;
      } catch (error) {
        const errorMessage =
          error?.message || error?.statusText || 'Failed to resend code';
        setError(errorMessage);
        throw error;
      }
    },

    signOut: async () => {
      try {
        setIsLoading(true);

        await authClient.signOut({ redirect: false });

        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userData');

        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        setError(null);
      } catch (error) {
        console.error('Sign out error:', error);
        // Still clear local state even if API call fails
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    },

    getSession: async () => {
      try {
        return await authClient.getSession();
      } catch (error) {
        console.error('Get session error:', error);
        return null;
      }
    },

    getProviders: async () => {
      try {
        return await authClient.getProviders();
      } catch (error) {
        console.error('Get providers error:', error);
        return [];
      }
    },
  };

  const value = {
    user,
    session,
    isLoading,
    error,
    isAuthenticated,
    signIn: authHelpers.signInWithEmail,
    signUp: authHelpers.signUpWithEmail,
    verifyCode: authHelpers.verifyCode,
    resendCode: authHelpers.resendCode,
    signOut: authHelpers.signOut,
    getSession: authHelpers.getSession,
    getProviders: authHelpers.getProviders,
  };

  return (
    <BetterAuthContext.Provider value={value}>
      {children}
    </BetterAuthContext.Provider>
  );
};

export default BetterAuthProvider;
