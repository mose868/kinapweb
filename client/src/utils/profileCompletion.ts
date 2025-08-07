// Profile completion utility functions

export interface ProfileData {
  displayName?: string;
  email?: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  course?: string;
  year?: string;
  skills?: string[];
  preferredPlatforms?: string[];
  experienceLevel?: string;
  ajiraGoals?: string;
  preferredLearningMode?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  phoneNumber?: string;
  idNumber?: string;
  achievements?: string[];
  completedProjects?: number;
  mentorshipInterest?: boolean;
  availableForFreelance?: boolean;
  joinedDate?: string;
  lastActive?: string;
}

// LinkedIn URL validation - update to match the new format
const validateLinkedInURL = (url: string): boolean => {
  if (!url.trim()) return false;
  // Accept full URLs or handles
  const linkedinPattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_.]+\/?$/;
  const handlePattern = /^[a-zA-Z0-9-_.]+$/;
  return linkedinPattern.test(url.trim()) || handlePattern.test(url.trim());
};

// Calculate profile completion percentage
export const calculateProfileCompletion = (profileData: ProfileData): number => {
  // Define all required fields for 100% completion (removed location and preferredLearningMode)
  const requiredFields = [
    'displayName',
    'email', 
    'photoURL',
    'bio',
    // 'location', // Remove location
    'course',
    'year',
    'skills',
    'experienceLevel',
    'ajiraGoals',
    // 'preferredLearningMode', // Remove preferredLearningMode
    'linkedinProfile',
    'phoneNumber',
    'idNumber'
  ];

  let completed = 0;
  let total = requiredFields.length;

  requiredFields.forEach(field => {
    const value = profileData[field as keyof ProfileData];
    
    if (value !== undefined && value !== null && value !== '') {
      // Special validation for arrays
      if (Array.isArray(value)) {
        if (value.length > 0) {
          completed++;
        }
      }
      // Special validation for LinkedIn URL
      else if (field === 'linkedinProfile') {
        if (validateLinkedInURL(String(value))) {
          completed++;
        }
      }
      // Regular string validation
      else if (typeof value === 'string' && value.trim() !== '') {
        completed++;
      }
      // Other types (boolean, number)
      else if (typeof value !== 'string') {
        completed++;
      }
    }
  });

  return Math.round((completed / total) * 100);
};

// Check if profile meets minimum requirements for specific features
export const checkProfileRequirements = (profileData: ProfileData, feature: 'community' | 'ambassador' | 'marketplace'): {
  allowed: boolean;
  completion: number;
  requiredCompletion: number;
  missingFields: string[];
} => {
  const completion = calculateProfileCompletion(profileData);
  
  // Define requirements for each feature (removed location and preferredLearningMode)
  const requirements = {
    community: {
      requiredCompletion: 70,
      requiredFields: ['displayName', 'email', 'photoURL', 'bio', 'course', 'year', 'skills', 'experienceLevel', 'ajiraGoals']
    },
    ambassador: {
      requiredCompletion: 100,
      requiredFields: ['displayName', 'email', 'photoURL', 'bio', 'course', 'year', 'skills', 'experienceLevel', 'ajiraGoals', 'linkedinProfile', 'phoneNumber', 'idNumber']
    },
    marketplace: {
      requiredCompletion: 70,
      requiredFields: ['displayName', 'email', 'photoURL', 'bio', 'skills', 'experienceLevel']
    }
  };

  const featureRequirements = requirements[feature];
  const allowed = completion >= featureRequirements.requiredCompletion;

  // Find missing fields
  const missingFields: string[] = [];
  featureRequirements.requiredFields.forEach(field => {
    const value = profileData[field as keyof ProfileData];
    
    if (value === undefined || value === null || value === '') {
      missingFields.push(field);
    } else if (Array.isArray(value) && value.length === 0) {
      missingFields.push(field);
    } else if (typeof value === 'string' && value.trim() === '') {
      missingFields.push(field);
    } else if (field === 'linkedinProfile' && !validateLinkedInURL(String(value))) {
      missingFields.push(field);
    }
  });

  return {
    allowed,
    completion,
    requiredCompletion: featureRequirements.requiredCompletion,
    missingFields
  };
};

// Get human-readable field names
export const getFieldDisplayName = (field: string): string => {
  const fieldNames: Record<string, string> = {
    displayName: 'Display Name',
    email: 'Email Address',
    photoURL: 'Profile Photo',
    bio: 'Bio/About Me',
    // location: 'Location', // Remove location
    course: 'Course of Study',
    year: 'Year of Study',
    skills: 'Skills',
    experienceLevel: 'Experience Level',
    ajiraGoals: 'Ajira Goals',
    // preferredLearningMode: 'Preferred Learning Mode', // Remove preferredLearningMode
    linkedinProfile: 'LinkedIn Profile',
    phoneNumber: 'Phone Number',
    idNumber: 'ID Number'
  };

  return fieldNames[field] || field;
}; 