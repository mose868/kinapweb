// Better Auth client using the new API endpoints
import { betterAuthSignIn, betterAuthSignUp, betterAuthSignOut, betterAuthGetSession, betterAuthVerifyAccount, betterAuthResendCode } from '../api/auth';

// Create a Better Auth client that uses our API
export const authClient = {
  signIn: async (provider: string, options: any) => {
    console.log('Better Auth signIn called with:', provider, options);

    try {
      // First, attempt to sign in (this will send verification code if needed)
      const result = await betterAuthSignIn({
        email: options.email,
        password: options.password,
      });

      // If the response indicates verification is needed, return that
      if (result.requiresVerification) {
        return {
          data: null,
          error: null,
          requiresVerification: true,
          message: result.message || 'Verification code sent to your email'
        };
      }

      // If successful, return the user data
      if (result.success && result.user) {
        return {
          data: {
            user: result.user,
            session: {
              token: result.token,
              expires: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
            },
          },
          error: null,
        };
      }

      // If there's an error, throw it
      throw new Error(result.message || 'Sign in failed');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signUp: async (provider: string, options: any) => {
    console.log('Better Auth signUp called with:', provider, options);

    try {
      // Sign up (this will send verification code)
      const result = await betterAuthSignUp({
        email: options.email,
        password: options.password,
        displayName: options.displayName,
        phoneNumber: options.phoneNumber,
        course: options.course,
        year: options.year,
        skills: options.skills,
        ajiraGoals: options.ajiraGoals,
        experienceLevel: options.experienceLevel,
        preferredLearningMode: options.preferredLearningMode,
        otherInfo: options.otherInfo,
        interests: options.interests,
      });

      // Sign up always requires verification
      if (result.success) {
        return {
          data: null,
          error: null,
          requiresVerification: true,
          message: result.message || 'Account created! Verification code sent to your email'
        };
      }

      // If there's an error, throw it
      throw new Error(result.message || 'Sign up failed');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  verifyCode: async (email: string, code: string) => {
    console.log('Better Auth verifyCode called with:', email, code);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://kinapweb.onrender.com/api'}/better-auth/verify-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const result = await response.json();
      console.log('🔍 Verification response:', result);

      if (response.ok && result.success) {
        console.log('✅ Verification successful, returning data');
        console.log('🔍 Result data structure:');
        console.log('  - result.success:', result.success);
        console.log('  - result.data.user:', result.data.user);
        console.log('  - result.data.token:', result.data.token);
        console.log('  - result.data.sessionExpiresAt:', result.data.sessionExpiresAt);
        
        const returnData = {
          data: {
            user: result.data.user,
            session: {
              token: result.data.token,
              expires: result.data.sessionExpiresAt,
            },
          },
          error: null,
        };
        
        console.log('🔍 Returning data structure:', JSON.stringify(returnData, null, 2));
        return returnData;
      } else {
        console.log('❌ Verification failed:', result.message);
        throw new Error(result.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      throw error;
    }
  },

  signOut: async (options?: any) => {
    console.log('Better Auth signOut called');

    try {
      await betterAuthSignOut();
      return { data: null, error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  getSession: async () => {
    console.log('Better Auth getSession called');

    try {
      const result = await betterAuthGetSession();
      
      if (result.success && result.data) {
        return {
          data: {
            user: result.data.user,
            session: result.data.session,
          },
          error: null,
        };
      }

      return { data: null, error: null };
    } catch (error) {
      console.error('Get session error:', error);
      return { data: null, error };
    }
  },

  getProviders: async () => {
    console.log('Better Auth getProviders called');
    return { data: ['emailAndPassword'], error: null };
  },

  resendCode: async (email: string) => {
    console.log('Better Auth resendCode called with:', email);

    try {
      const result = await betterAuthResendCode(email);

      if (result.success) {
        return {
          data: null,
          error: null,
          message: result.message || 'Verification code resent successfully'
        };
      }

      throw new Error(result.message || 'Failed to resend code');
    } catch (error) {
      console.error('Resend code error:', error);
      throw error;
    }
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
      const result = await signIn('emailAndPassword', {
        email,
        password,
        redirect: false,
      });
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  // Sign up with email and password
  signUpWithEmail: async (email: string, password: string, userData?: any) => {
    try {
      const result = await signUp('emailAndPassword', {
        email,
        password,
        ...userData,
        redirect: false,
      });
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },



  // Sign out
  signOutUser: async () => {
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get current session
  getCurrentSession: async () => {
    try {
      return await getSession();
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },

  // Get available providers
  getAvailableProviders: async () => {
    try {
      return await getProviders();
    } catch (error) {
      console.error('Get providers error:', error);
      return {};
    }
  },
};

export default authClient;
