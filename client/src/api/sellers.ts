import { api } from '../config/api';

// Types for seller profiles
export interface SellerProfile {
  id: string;
  sellerId: string;
  fullName: string;
  professionalTitle: string;
  bio: string;
  profileImageUrl?: string;
  location?: string;
  languages: string[];
  skills: string[];
  experience: string;
  education: any[];
  certifications: any[];
  portfolio: any[];
  showcaseVideoUrl?: string;
  services: string[];
  hourlyRate: number;
  availability: 'full-time' | 'part-time' | 'weekends' | 'evenings';
  responseTime: 'within-1-hour' | 'within-4-hours' | 'within-24-hours' | 'within-48-hours';
  websiteUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  businessDescription?: string;
  uniqueSellingPoint?: string;
  targetAudience?: string;
  aiScore: number;
  contentQuality: number;
  marketplaceReadiness: boolean;
  aiRecommendations: string[];
  status: 'draft' | 'pending-review' | 'approved' | 'rejected' | 'suspended';
  isVerified: boolean;
  verifiedAt?: string;
  views: number;
  bookings: number;
  rating: number;
  totalReviews: number;
  profileCompleteness: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSellerProfileData {
  sellerId: string;
  fullName: string;
  professionalTitle: string;
  bio: string;
  location?: string;
  languages: string[];
  skills: string[];
  experience: string;
  education: any[];
  certifications: any[];
  portfolio: any[];
  services: string[];
  hourlyRate: number;
  availability: 'full-time' | 'part-time' | 'weekends' | 'evenings';
  responseTime: 'within-1-hour' | 'within-4-hours' | 'within-24-hours' | 'within-48-hours';
  websiteUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  businessDescription?: string;
  uniqueSellingPoint?: string;
  targetAudience?: string;
  aiScore: number;
  contentQuality: number;
  marketplaceReadiness: boolean;
  aiRecommendations: string[];
}

export interface UpdateSellerProfileData extends Partial<CreateSellerProfileData> {
  // All fields are optional for updates
}

// Create seller profile
export const createSellerProfile = async (
  profileData: FormData
): Promise<{ success: boolean; message: string; sellerId: string; profile: SellerProfile }> => {
  try {
    // Get authentication token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await api.post('/sellers/create-profile', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating seller profile:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to create seller profile');
  }
};

// Get seller profile by ID
export const getSellerProfile = async (sellerId: string): Promise<SellerProfile> => {
  try {
    const response = await api.get(`/sellers/profile/${sellerId}`);
    return response.data.profile;
  } catch (error: any) {
    console.error('Error fetching seller profile:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to fetch seller profile');
  }
};

// Update seller profile
export const updateSellerProfile = async (
  sellerId: string,
  profileData: FormData
): Promise<{ success: boolean; message: string; profile: SellerProfile }> => {
  try {
    const response = await api.put(`/sellers/profile/${sellerId}`, profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating seller profile:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to update seller profile');
  }
};

// Delete seller profile
export const deleteSellerProfile = async (sellerId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/sellers/profile/${sellerId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting seller profile:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to delete seller profile');
  }
};

// Get all seller profiles (for admin/marketplace)
export const getAllSellerProfiles = async (filters?: {
  status?: string;
  category?: string;
  location?: string;
  minRating?: number;
  maxHourlyRate?: number;
  page?: number;
  limit?: number;
}): Promise<{ profiles: SellerProfile[]; pagination: any }> => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/sellers/profiles?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching seller profiles:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch seller profiles');
  }
};

// Search seller profiles
export const searchSellerProfiles = async (query: string, filters?: {
  category?: string;
  location?: string;
  minRating?: number;
  maxHourlyRate?: number;
  page?: number;
  limit?: number;
}): Promise<{ profiles: SellerProfile[]; pagination: any }> => {
  try {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/sellers/search?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error('Error searching seller profiles:', error);
    throw new Error(error.response?.data?.message || 'Failed to search seller profiles');
  }
};

// Analyze seller profile content with AI
export const analyzeSellerContent = async (analysisData: any): Promise<{
  success: boolean;
  aiScore: number;
  contentQuality: number;
  recommendations: string[];
  strengths: string[];
  marketplaceReadiness: boolean;
}> => {
  try {
    // Get authentication token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please log in again.');
    }

    const response = await api.post('/sellers/analyze-content', analysisData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error analyzing seller content:', error);
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please log in again.');
    }
    throw new Error(error.response?.data?.message || 'Failed to analyze seller content');
  }
};
