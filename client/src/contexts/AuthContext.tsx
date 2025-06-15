import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<any>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Dummy state for demonstration; replace with real auth logic
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Dummy implementations; replace with real logic
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setTimeout(() => {
      setUser({ email });
      setLoading(false);
    }, 1000);
  };
  const signUp = async (email: string, password: string, displayName: string) => {
    setLoading(true);
    setTimeout(() => {
      setUser({ email, displayName });
      setLoading(false);
    }, 1000);
  };
  const signOut = async () => {
    setUser(null);
  };
  const resetPassword = async (email: string) => {
    // Implement password reset logic
  };
  const updateProfile = async (data: Partial<any>) => {
    setUser((prev: any) => ({ ...prev, ...data }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 