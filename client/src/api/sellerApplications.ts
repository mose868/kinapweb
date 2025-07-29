const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Types for seller applications
export interface PersonalInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  nationality: string;
  idNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface ProfessionalInfo {
  skills: string[];
  experience: string;
  education: string;
  certifications?: string[];
  portfolio?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  website?: string;
}

export interface BusinessInfo {
  businessName: string;
  businessType: string;
  services: string[];
  targetMarket: string;
  pricingStrategy: string;
  expectedEarnings: number;
}

export interface ApplicationContent {
  motivation: string;
  experienceDescription: string;
  serviceDescription: string;
  valueProposition: string;
  sampleWork: string;
}

export interface Documents {
  idDocument: string;
  portfolioSamples?: string[];
  certificates?: string[];
  references?: string[];
}

export interface AIVetting {
  isProcessed: boolean;
  processedAt?: string;
  confidence: number;
  riskScore: number;
  qualityScore: number;
  recommendations: string[];
  flaggedIssues: string[];
  aiNotes?: string;
  modelUsed?: string;
}

export interface Review {
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  finalDecision?: 'approved' | 'rejected' | 'needs_more_info';
  rejectionReason?: string;
}

export interface SellerApplication {
  _id: string;
  userId: string;
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  businessInfo: BusinessInfo;
  applicationContent: ApplicationContent;
  documents: Documents;
  aiVetting: AIVetting;
  status: 'pending' | 'ai_processing' | 'ai_approved' | 'ai_rejected' | 'manual_review' | 'approved' | 'rejected';
  review: Review;
  submittedAt: string;
  updatedAt: string;
  expiresAt?: string;
  viewCount: number;
  lastViewed?: string;
}

export interface CreateApplicationData {
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  businessInfo: BusinessInfo;
  applicationContent: ApplicationContent;
  documents: Documents;
}

export interface ApplicationResponse {
  message: string;
  application: Partial<SellerApplication>;
}

export interface ApplicationsListResponse {
  applications: SellerApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DashboardStats {
  stats: {
    total: number;
    pendingAI: number;
    pendingReview: number;
    byStatus: Array<{
      _id: string;
      count: number;
    }>;
  };
  recentApplications: SellerApplication[];
}

// Submit a new seller application
export const submitSellerApplication = async (
  applicationData: CreateApplicationData,
  token: string
): Promise<ApplicationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/seller-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(applicationData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit application');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting seller application:', error);
    throw error;
  }
};

// Get user's own seller application
export const getMySellerApplication = async (token: string): Promise<{ application: SellerApplication }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/seller-applications/my-application`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch application');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching seller application:', error);
    throw error;
  }
};

// Get all seller applications (admin only)
export const getAllSellerApplications = async (
  token: string,
  filters: {
    status?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  } = {}
): Promise<ApplicationsListResponse> => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/api/seller-applications?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch applications');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching seller applications:', error);
    throw error;
  }
};

// Get specific seller application (admin only)
export const getSellerApplicationById = async (
  applicationId: string,
  token: string
): Promise<{ application: SellerApplication }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/seller-applications/${applicationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch application');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching seller application:', error);
    throw error;
  }
};

// Review seller application (admin only)
export const reviewSellerApplication = async (
  applicationId: string,
  reviewData: {
    finalDecision: 'approved' | 'rejected' | 'needs_more_info';
    reviewNotes?: string;
    rejectionReason?: string;
  },
  token: string
): Promise<ApplicationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/seller-applications/${applicationId}/review`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to review application');
    }

    return await response.json();
  } catch (error) {
    console.error('Error reviewing seller application:', error);
    throw error;
  }
};

// Retry AI vetting for an application (admin only)
export const retryAIVetting = async (
  applicationId: string,
  token: string
): Promise<ApplicationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/seller-applications/${applicationId}/retry-ai`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to retry AI vetting');
    }

    return await response.json();
  } catch (error) {
    console.error('Error retrying AI vetting:', error);
    throw error;
  }
};

// Get dashboard statistics (admin only)
export const getSellerApplicationsStats = async (token: string): Promise<DashboardStats> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/seller-applications/stats/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch dashboard stats');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Helper function to get status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'ai_processing':
      return 'text-blue-600 bg-blue-100';
    case 'ai_approved':
      return 'text-green-600 bg-green-100';
    case 'ai_rejected':
      return 'text-red-600 bg-red-100';
    case 'manual_review':
      return 'text-orange-600 bg-orange-100';
    case 'approved':
      return 'text-green-600 bg-green-100';
    case 'rejected':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Helper function to get status label
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'ai_processing':
      return 'AI Processing';
    case 'ai_approved':
      return 'AI Approved';
    case 'ai_rejected':
      return 'AI Rejected';
    case 'manual_review':
      return 'Manual Review';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    default:
      return 'Unknown';
  }
}; 