import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Better Auth API endpoints
const BETTER_AUTH_URL = `${API_URL}/better-auth`;

export interface LoginData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
  phoneNumber?: string;
  course?: string;
  year?: string;
  skills?: string;
  ajiraGoals?: string;
  experienceLevel?: string;
  preferredLearningMode?: string;
  otherInfo?: string;
  interests?: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
  user?: any;
  token?: string;
}

// Better Auth API functions
export const betterAuthSignIn = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${BETTER_AUTH_URL}/signin`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Sign in failed');
  }
};

export const betterAuthSignUp = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${BETTER_AUTH_URL}/signup`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Sign up failed');
  }
};

export const betterAuthSignOut = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${BETTER_AUTH_URL}/signout`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Sign out failed');
  }
};

export const betterAuthGetSession = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.get(`${BETTER_AUTH_URL}/session`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get session');
  }
};

// Better Auth Forgot Password
export const betterAuthForgotPassword = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${BETTER_AUTH_URL}/forgot-password`, { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send verification code');
  }
};

// Better Auth Reset Password
export const betterAuthResetPassword = async (email: string, code: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${BETTER_AUTH_URL}/reset-password`, { email, code, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

// Better Auth Verify Code
export const betterAuthVerifyCode = async (email: string, code: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${BETTER_AUTH_URL}/verify-code`, { email, code });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to verify code');
  }
};

// Better Auth Verify Account
export const betterAuthVerifyAccount = async (email: string, code: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${BETTER_AUTH_URL}/verify-account`, { email, code });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to verify account');
  }
};

// Better Auth Check Session
export const betterAuthCheckSession = async (): Promise<AuthResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No session found');
    }
    
    const response = await axios.get(`${BETTER_AUTH_URL}/check-session`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    // If session expired, clear token
    if (error.response?.data?.sessionExpired) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
    throw new Error(error.response?.data?.message || 'Session check failed');
  }
};

// Better Auth Extend Session
export const betterAuthExtendSession = async (): Promise<AuthResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No session found');
    }

    // Simply call check session to extend it
    return await betterAuthCheckSession();
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to extend session');
  }
};

// Better Auth Resend Code
export const betterAuthResendCode = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${BETTER_AUTH_URL}/resend-code`, { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to resend verification code');
  }
};

// Legacy auth functions (keeping for backward compatibility)
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const forgotPassword = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send password reset email');
  }
};

export const resetPassword = async (token: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/reset-password`, { token, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

export const verifyResetToken = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await axios.get(`${API_URL}/auth/verify-reset-token/${token}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to verify reset token');
  }
};
