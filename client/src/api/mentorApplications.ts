const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface MentorApplicationData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    nationality: string;
    dateOfBirth: string;
    location: {
      city: string;
      country: string;
    };
  };
  professionalInfo: {
    currentRole: string;
    company: string;
    experience: string;
    education: string;
    skills: string[];
    certifications?: string[];
    achievements?: string[];
  };
  mentorshipInfo: {
    categories: string[];
    expertiseLevel: string;
    sessionTypes: string[];
    availability: {
      isAvailable: boolean;
      responseTime: string;
      instantAvailability: boolean;
    };
    pricing: {
      isFree: boolean;
      sessionRate: number;
      currency: string;
    };
  };
  applicationContent: {
    motivation: string;
    experienceDescription: string;
    mentoringApproach: string;
    successStories: string;
    valueProposition: string;
    sampleSession: string;
  };
  documents?: {
    resume?: string;
    portfolio?: string;
    certificates?: string[];
    references?: string[];
  };
}

export interface AIVettingResult {
  overallScore: number;
  sentimentScore: number;
  qualityScore: number;
  riskScore: number;
  motivationScore: number;
  experienceScore: number;
  recommendations: string[];
  flaggedIssues: string[];
  aiNotes: string;
  confidence: number;
}

export interface MentorApplication {
  _id: string;
  userId: string;
  personalInfo: MentorApplicationData['personalInfo'];
  professionalInfo: MentorApplicationData['professionalInfo'];
  mentorshipInfo: MentorApplicationData['mentorshipInfo'];
  applicationContent: MentorApplicationData['applicationContent'];
  aiVetting: AIVettingResult;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  review?: {
    reviewedBy: string;
    reviewedAt: string;
    notes: string;
    adminNotes: string;
  };
  documents?: MentorApplicationData['documents'];
  submittedAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface MentorApplicationStats {
  total: number;
  pending: number;
  approved: number;
  byStatus: Record<string, number>;
}

export interface PaginatedResponse<T> {
  applications: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Submit mentor application
export const submitMentorApplication = async (
  applicationData: MentorApplicationData
): Promise<{ message: string; application: any }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/mentor-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit application');
    }

    return await response.json();
  } catch (error) {
    console.error('Submit mentor application error:', error);
    throw error;
  }
};

// Get user's mentor application
export const fetchMyMentorApplication =
  async (): Promise<MentorApplication> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/mentor-applications/my-application`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No application found');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch application');
      }

      const data = await response.json();
      return data.application;
    } catch (error) {
      console.error('Fetch mentor application error:', error);
      throw error;
    }
  };

// Get all mentor applications (admin only)
export const fetchAllMentorApplications = async (
  filters: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<PaginatedResponse<MentorApplication>> => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/api/mentor-applications?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch applications');
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch all mentor applications error:', error);
    throw error;
  }
};

// Get specific mentor application (admin only)
export const fetchMentorApplicationById = async (
  id: string
): Promise<MentorApplication> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/mentor-applications/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch application');
    }

    const data = await response.json();
    return data.application;
  } catch (error) {
    console.error('Fetch mentor application by ID error:', error);
    throw error;
  }
};

// Review mentor application (admin only)
export const reviewMentorApplication = async (
  id: string,
  reviewData: {
    status: string;
    notes?: string;
    adminNotes?: string;
  }
): Promise<{ message: string; application: any }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/mentor-applications/${id}/review`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(reviewData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to review application');
    }

    return await response.json();
  } catch (error) {
    console.error('Review mentor application error:', error);
    throw error;
  }
};

// Retry AI vetting (admin only)
export const retryAIVetting = async (
  id: string
): Promise<{ message: string; application: any }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/mentor-applications/${id}/retry-ai`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to retry AI vetting');
    }

    return await response.json();
  } catch (error) {
    console.error('Retry AI vetting error:', error);
    throw error;
  }
};

// Get dashboard stats (admin only)
export const fetchMentorApplicationStats =
  async (): Promise<MentorApplicationStats> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/mentor-applications/stats/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch stats');
      }

      const data = await response.json();
      return data.stats;
    } catch (error) {
      console.error('Fetch mentor application stats error:', error);
      throw error;
    }
  };
