// Auth API service for backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface User {
  _id: string;
  username: string;
  email: string;
  displayName?: string;
  role: 'student' | 'mentor' | 'admin';
  avatar?: string;
  phoneNumber?: string;
  course?: string;
  year?: string;
  experienceLevel?: string;
  skills?: string[];
  bio?: string;
  rating?: number;
  location?: {
    country: string;
    city: string;
  };
  languages?: string[];
  portfolio?: Array<{
    title: string;
    description: string;
    image: string;
    url: string;
  }>;
  isVerified?: boolean;
  // Google OAuth fields
  googleId?: string;
  googleEmail?: string;
  authProvider?: 'local' | 'google';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  phoneNumber?: string;
  course?: string;
  year?: string;
  experienceLevel?: string;
  skills?: string[];
  bio?: string;
  location?: {
    country: string;
    city: string;
  };
  languages?: string[];
}

export interface GoogleAuthData {
  googleId: string;
  email: string;
  displayName?: string;
  avatar?: string;
  googleEmail?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Login user
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Google OAuth login/signup
export const googleAuth = async (googleData: GoogleAuthData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Google authentication failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Google auth error:', error);
    throw error;
  }
};

// Register user
export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Get current user profile
export const getCurrentUser = async (token: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, userData: Partial<User>, token: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Logout user
export const logoutUser = async (token: string): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout error:', error);
    // Don't throw error for logout as it's not critical
  }
};

// Verify token
export const verifyToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}; 