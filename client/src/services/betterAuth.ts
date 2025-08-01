import { createAuthClient } from "better-auth/react";

// Create Better Auth client instance
export const authClient = createAuthClient({
  // Base URL of the Better Auth server
  baseURL: import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5000",
  
  // Auth path (default is /api/auth, but we're using /api/better-auth)
  authPath: "/api/better-auth",
});

// Export commonly used methods for easier access
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  useUser,
  getSession,
  getCsrfToken,
  getProviders,
} = authClient;

// Custom hooks for better integration
export const useAuth = () => {
  const { data: session, isLoading, error } = useSession();
  const { data: user } = useUser();

  return {
    user: user || session?.user,
    session,
    isLoading,
    error,
    isAuthenticated: !!user || !!session?.user,
  };
};

// Helper functions for authentication
export const authHelpers = {
  // Sign in with email and password
  signInWithEmail: async (email: string, password: string) => {
    try {
      const result = await signIn("emailAndPassword", {
        email,
        password,
        redirect: false,
      });
      return result;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  },

  // Sign up with email and password
  signUpWithEmail: async (email: string, password: string, userData?: any) => {
    try {
      const result = await signUp("emailAndPassword", {
        email,
        password,
        ...userData,
        redirect: false,
      });
      return result;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      const result = await signIn("google", {
        redirect: false,
      });
      return result;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  },

  // Sign out
  signOutUser: async () => {
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  },

  // Get current session
  getCurrentSession: async () => {
    try {
      return await getSession();
    } catch (error) {
      console.error("Get session error:", error);
      return null;
    }
  },

  // Get available providers
  getAvailableProviders: async () => {
    try {
      return await getProviders();
    } catch (error) {
      console.error("Get providers error:", error);
      return {};
    }
  },
};

export default authClient; 