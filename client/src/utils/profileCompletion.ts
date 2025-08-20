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
  const linkedinPattern =
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_.]+\/?$/;
  const handlePattern = /^[a-zA-Z0-9-_.]+$/;
  return linkedinPattern.test(url.trim()) || handlePattern.test(url.trim());
};

// Calculate profile completion percentage
export const calculateProfileCompletion = (
  profileData: ProfileData
): number => {
  // Ensure profileData is not undefined
  const safeProfileData = profileData || {};
  
  // Define only the fields that users can actually edit in the profile form
  const requiredFields = [
    'photoURL',       // User can upload profile photo
    'bio',            // User can edit bio
    'ajiraGoals',     // User can edit their goals
    'linkedinProfile' // User can edit LinkedIn profile
  ];
  
  // Optional fields that contribute to completion but aren't required
  const optionalFields = [
    'displayName', // Comes from auth, usually filled
    'email',       // Comes from auth, usually filled
    'interests'    // User can select interests
  ];

  let completed = 0;
  let total = requiredFields.length;

  // Check required fields
  requiredFields.forEach((field) => {
    const value = safeProfileData[field as keyof ProfileData];

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

  // Add bonus points for optional fields (up to 20% bonus)
  let bonusPoints = 0;
  const maxBonus = 0.2; // 20% bonus for optional fields
  
  optionalFields.forEach((field) => {
    const value = safeProfileData[field as keyof ProfileData];
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value) && value.length > 0) {
        bonusPoints += maxBonus / optionalFields.length;
      } else if (typeof value === 'string' && value.trim() !== '') {
        bonusPoints += maxBonus / optionalFields.length;
      } else if (typeof value !== 'string') {
        bonusPoints += maxBonus / optionalFields.length;
      }
    }
  });

  const baseCompletion = (completed / total) * 100;
  const finalCompletion = Math.min(100, baseCompletion + (bonusPoints * 100));
  
  return Math.round(finalCompletion);
};

// Check if profile meets minimum requirements for specific features
export const checkProfileRequirements = (
  profileData: ProfileData,
  feature: 'community' | 'ambassador' | 'marketplace'
): {
  allowed: boolean;
  completion: number;
  requiredCompletion: number;
  missingFields: string[];
} => {
  // Ensure profileData is not undefined
  const safeProfileData = profileData || {};
  const completion = calculateProfileCompletion(safeProfileData);

  // Define requirements for each feature - only require fields users can actually edit
  const requirements = {
    community: {
      requiredCompletion: 50, // Lower requirement since fewer fields
      requiredFields: [
        'photoURL',
        'bio',
        'ajiraGoals',
      ],
    },
    ambassador: {
      requiredCompletion: 100, // Full completion for ambassador role
      requiredFields: [
        'photoURL',
        'bio',
        'ajiraGoals',
        'linkedinProfile',
      ],
    },
    marketplace: {
      requiredCompletion: 75, // Moderate requirement for marketplace
      requiredFields: [
        'photoURL',
        'bio',
        'ajiraGoals',
      ],
    },
  };

  const featureRequirements = requirements[feature];
  
  // Ensure featureRequirements exists
  if (!featureRequirements) {
    console.error(`Invalid feature: ${feature}`);
    return {
      allowed: false,
      completion,
      requiredCompletion: 100,
      missingFields: ['Invalid feature'],
    };
  }
  
  const allowed = completion >= featureRequirements.requiredCompletion;

  // Find missing fields
  const missingFields: string[] = [];
  featureRequirements.requiredFields.forEach((field) => {
    const value = safeProfileData[field as keyof ProfileData];

    if (value === undefined || value === null || value === '') {
      missingFields.push(field);
    } else if (Array.isArray(value) && value.length === 0) {
      missingFields.push(field);
    } else if (typeof value === 'string' && value.trim() === '') {
      missingFields.push(field);
    } else if (
      field === 'linkedinProfile' &&
      !validateLinkedInURL(String(value))
    ) {
      missingFields.push(field);
    }
  });

  return {
    allowed,
    completion,
    requiredCompletion: featureRequirements.requiredCompletion,
    missingFields,
  };
};

// Get human-readable field names - focus on editable fields
export const getFieldDisplayName = (field: string): string => {
  const fieldNames: Record<string, string> = {
    photoURL: 'Profile Photo',
    bio: 'Bio/About Me',
    ajiraGoals: 'Your Digital Goals',
    linkedinProfile: 'LinkedIn Profile',
    displayName: 'Display Name',
    email: 'Email Address',
    interests: 'Interests/Skills',
  };

  return fieldNames[field] || field;
};
