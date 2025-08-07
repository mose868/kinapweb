// Mock Better Auth client for now (since the library might not be properly installed)
// This will be replaced with the real Better Auth once we get it working

// Create a mock auth client
export const authClient = {
  signIn: async (provider: string, options: any) => {
    console.log('Mock signIn called with:', provider, options);
    
    try {
      // Use the existing auth API instead of better-auth
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: options.email,
          password: options.password,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign in failed');
      }
      
      const data = await response.json();
      
      // Return in Better Auth format
      return {
        data: {
          user: data.user,
          session: {
            token: data.token,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }
        },
        error: null
      };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },
  
  signUp: async (provider: string, options: any) => {
    console.log('Mock signUp called with:', provider, options);
    
    try {
      // Use the existing auth API instead of better-auth
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: options.email,
          password: options.password,
          username: options.email.split('@')[0], // Generate username from email
          displayName: options.name || options.displayName,
          role: options.role || 'student',
          phoneNumber: options.phoneNumber,
          course: options.course,
          year: options.year,
          skills: options.skills,
          ajiraGoals: options.ajiraGoals,
          experienceLevel: options.experienceLevel,
          preferredLearningMode: options.preferredLearningMode,
          otherInfo: options.otherInfo,
          interests: options.interests,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sign up failed');
      }
      
      const data = await response.json();
      
      // Return in Better Auth format
      return {
        data: {
          user: data.user,
          session: {
            token: data.token,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }
        },
        error: null
      };
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },
  
  signOut: async (options: any) => {
    console.log('Mock signOut called with:', options);
    
    try {
      // Use the existing auth API instead of better-auth
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Clear local storage regardless of response
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      return {
        data: { success: true },
        error: null
      };
    } catch (error) {
      console.error('Sign out error:', error);
      // Clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      return {
        data: { success: true },
        error: null
      };
    }
  },
  
  getSession: async () => {
    console.log('Mock getSession called');
    
    try {
      // Check if user is logged in via localStorage
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData) {
        return null;
      }
      
      // Verify token with backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        // Token is invalid, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        return null;
      }
      
      const user = await response.json();
      
      return {
        data: {
          user: user.data || JSON.parse(userData),
          session: {
            token,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }
        },
        error: null
      };
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },
  
  getProviders: async () => {
    console.log('Mock getProviders called');
    // Simulate API call
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/better-auth/providers`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return {};
    }
    
    return response.json();
  },
  
  useSession: () => {
    // Mock hook that returns loading state
    return {
      data: null,
      isLoading: false,
      error: null,
    };
  },
  
  useUser: () => {
    // Mock hook that returns no user
    return {
      data: null,
      isLoading: false,
      error: null,
    };
  },
  
  getCsrfToken: async () => {
    return 'mock-csrf-token';
  },
};

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