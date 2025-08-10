import { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useBetterAuthContext } from '../contexts/BetterAuthContext';
import {
  Camera,
  Package,
  Edit2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  MapPin,
  Code,
  Globe,
  Target,
  Award,
  TrendingUp,
  Briefcase,
  BookOpen,
  Phone,
  Mail,
} from 'lucide-react';
import axios from 'axios';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// LinkedIn URL validation
const validateLinkedInURL = (url: string): boolean => {
  if (!url.trim()) return false;
  // Accept full URLs or handles
  const linkedinPattern =
    /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-_.]+\/?$/;
  const handlePattern = /^[a-zA-Z0-9-_.]+$/;
  return linkedinPattern.test(url.trim()) || handlePattern.test(url.trim());
};

interface ClubMemberProfile {
  displayName: string;
  email: string;
  photoURL?: string;
  bio: string;
  course: string;
  year: string;
  skills: string[];
  preferredPlatforms: string[];
  experienceLevel: string;
  ajiraGoals: string;
  preferredLearningMode: string;
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  phoneNumber?: string;
  idNumber?: string;
  achievements: string[];
  completedProjects: number;
  mentorshipInterest: boolean;
  availableForFreelance: boolean;
  joinedDate: string;
  lastActive: string;
  interests?: string[];
}

const ProfilePage = () => {
  const { user, isLoading } = useBetterAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const [formData, setFormData] = useState<ClubMemberProfile>({
    displayName: user?.displayName || user?.name || '',
    email: user?.email || '',
    photoURL: '',
    bio: '',
    course: '',
    year: '',
    skills: [],
    preferredPlatforms: [],
    experienceLevel: '',
    ajiraGoals: '',
    preferredLearningMode: '',
    linkedinProfile: '',
    githubProfile: '',
    portfolioUrl: '',
    phoneNumber: '',
    idNumber: '',
    achievements: [],
    completedProjects: 0,
    mentorshipInterest: false,
    availableForFreelance: false,
    joinedDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    interests: [],
  });

  // Fetch Ajira trainings/interests
  const { data: trainingsData } = useQuery('ajira-trainings', async () => {
    const res = await axios.get(`${BASEURL}/students/ajira-trainings`);
    return res.data.trainings as string[];
  });
  const ajiraTrainings = trainingsData || [];

  // Show loading state while auth is initializing
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin text-ajira-primary mx-auto mb-4' />
          <p className='text-gray-600'>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <User className='w-16 h-16 text-gray-400 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Please Log In
          </h2>
          <p className='text-gray-600 mb-4'>
            Please log in to view and manage your Ajira Digital KiNaP Club
            profile.
          </p>
          <a
            href='/auth'
            className='inline-flex items-center px-4 py-2 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 transition-colors'
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Fetch latest profile from backend using email
  useEffect(() => {
    let isMounted = true;
    let hasFetched = false;

    const fetchProfile = async () => {
      if (!user?.email || hasFetched) return;

      hasFetched = true;

      try {
        const res = await axios.post(
          `${BASEURL}/students/get-profile`,
          { email: user.email },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!isMounted) return;

        const profile = res.data;
        console.log('Loaded profile data:', profile);
        console.log('PhotoURL from backend:', profile.photoURL);
        console.log('All profile completion fields:');
        console.log('- Bio:', profile.bio);
        console.log('- Goals:', profile.ajiraGoals);
        console.log('- LinkedIn:', profile.linkedinProfile);
        console.log('- Photo:', !!profile.photoURL);

        setFormData((prev) => ({
          ...prev,
          displayName: profile.fullname || prev.displayName,
          // Basic info from signup (read-only display)
          course: profile.course || prev.course,
          year: profile.year || prev.year,
          skills:
            typeof profile.skills === 'string'
              ? profile.skills.split(',').map((s: string) => s.trim())
              : profile.skills || prev.skills,
          experienceLevel: profile.experience || prev.experienceLevel,
          phoneNumber: profile.phone || prev.phoneNumber,
          idNumber: profile.idNo || prev.idNumber,
          // Additional profile fields (editable)
          bio: profile.bio || prev.bio,
          ajiraGoals: profile.ajiraGoals || prev.ajiraGoals,
          linkedinProfile: profile.linkedinProfile || prev.linkedinProfile,
          photoURL: profile.photoURL || prev.photoURL,
          lastActive: profile.lastActive || prev.lastActive,
          interests: profile.interests || [],
        }));
      } catch (err) {
        if (isMounted) {
          console.warn('Failed to load profile', err);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    // Simplified completion check - only 4 essential fields
    const essentialFields = ['bio', 'ajiraGoals', 'linkedinProfile'];

    let completed = 0;
    let total = essentialFields.length + 1; // +1 for required photo

    // Check essential fields
    essentialFields.forEach((field) => {
      if (
        formData[field as keyof ClubMemberProfile] &&
        String(formData[field as keyof ClubMemberProfile]).trim() !== ''
      ) {
        // Special validation for LinkedIn
        if (field === 'linkedinProfile') {
          if (
            validateLinkedInURL(
              String(formData[field as keyof ClubMemberProfile])
            )
          ) {
            completed++;
          }
        } else {
          completed++;
        }
      }
    });

    // Check required photo
    if (formData.photoURL && formData.photoURL.trim() !== '') {
      completed++;
    }

    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Handle profile image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    try {
      const file = e.target.files[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Compress image before converting to base64
      const compressedFile = await compressImage(file, 800, 800, 0.8);

      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        console.log('Base64 image size:', base64.length, 'characters');
        setFormData((prev) => ({ ...prev, photoURL: base64 }));

        // Save to MongoDB immediately
        try {
          console.log('Saving profile image to MongoDB...');
          await axios.post(
            `${BASEURL}/students/update-profile`,
            {
              email: user.email,
              photoURL: base64,
            },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );
          console.log('Profile image saved successfully!');
          alert('Profile picture uploaded and saved!');
        } catch (error) {
          console.error('Failed to save profile image:', error);
          alert('Failed to save profile picture. Please try again.');
          // Reset the image if save failed
          setFormData((prev) => ({ ...prev, photoURL: '' }));
        }
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  // Compress image helper function
  const compressImage = (
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number
  ): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Fallback to original if compression fails
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Update profile mutation
  const updateProfileMutation = useMutation(async () => {
    if (!user?.email) return;

    // Validate required fields before submission
    if (!formData.bio.trim()) {
      throw new Error('Bio is required');
    }
    if (!formData.ajiraGoals.trim()) {
      throw new Error('Digital goals are required');
    }
    let linkedinProfile = formData.linkedinProfile.trim();
    if (/^[a-zA-Z0-9-_.]+$/.test(linkedinProfile)) {
      linkedinProfile = `https://linkedin.com/in/${linkedinProfile}`;
    }
    if (!validateLinkedInURL(linkedinProfile)) {
      throw new Error(
        'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname) or handle (e.g., yourname)'
      );
    }
    if (!formData.photoURL.trim()) {
      throw new Error('Profile picture is required. Please upload an image.');
    }

    // Prepare data for backend update
    const updateData = {
      bio: formData.bio,
      ajiraGoals: formData.ajiraGoals,
      linkedinProfile,
      photoURL: formData.photoURL,
      lastActive: new Date(),
      interests: formData.interests || [],
      skills: Array.isArray(formData.skills) ? formData.skills : [], // Ensure skills is always an array
    };

    console.log('Saving profile data to MongoDB:', updateData);

    try {
      await axios.post(
        `${BASEURL}/students/update-profile`,
        { email: user.email, ...updateData },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Profile data saved successfully!');
      alert('Profile updated and saved to database!');
      setFormData((prev) => ({
        ...prev,
        lastActive: new Date().toISOString(),
      }));

      // Show detailed success message with timestamp
      const timestamp = new Date().toLocaleString();
      setTimeout(() => {
        alert(
          `✅ All profile data saved successfully at ${timestamp}!\n\n📊 Saved to MongoDB:\n• Bio\n• Goals\n• LinkedIn\n• Profile Photo\n• Skills (${formData.skills.length} skills)\n• Last Updated Time\n\n🎯 You've been automatically added to groups based on your skills!\nCheck the Community page to see your new groups.`
        );
      }, 500);

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      console.error('Error details:', error.response?.data);
      console.error('Request data:', { email: user.email, ...updateData });
      alert(
        `Failed to save profile data. Error: ${error.response?.data?.message || error.message}\n\nPlease check the console for more details.`
      );
      throw new Error('Failed to update profile');
    }
  });

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Validate LinkedIn URL in real-time
      if (name === 'linkedinProfile' && value.trim()) {
        if (!validateLinkedInURL(value)) {
          // Show error styling but don't prevent typing
          e.target.style.borderColor = '#ef4444';
        } else {
          e.target.style.borderColor = '#10b981';
        }
      }
    }
  };

  // Handle array field changes
  const handleArrayChange = (
    value: string,
    field: 'skills' | 'preferredPlatforms' | 'achievements'
  ) => {
    const values = value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  const platformOptions = [
    'Upwork',
    'Fiverr',
    'Freelancer.com',
    'LinkedIn',
    'GitHub',
    'Behance',
    'Dribbble',
    '99designs',
    'Toptal',
    'Guru.com',
    'PeoplePerHour',
    'Local Clients',
  ];

  const skillCategories = {
    'Web Development': [
      'HTML/CSS',
      'JavaScript',
      'React',
      'Node.js',
      'Python',
      'PHP',
      'WordPress',
    ],
    'Mobile Development': [
      'React Native',
      'Flutter',
      'iOS (Swift)',
      'Android (Kotlin/Java)',
    ],
    Design: [
      'UI/UX Design',
      'Graphic Design',
      'Logo Design',
      'Branding',
      'Figma',
      'Adobe Creative Suite',
    ],
    'Digital Marketing': [
      'SEO',
      'Social Media Marketing',
      'Content Marketing',
      'Email Marketing',
      'PPC Advertising',
    ],
    'Data & Analytics': [
      'Data Analysis',
      'Excel',
      'Python',
      'SQL',
      'Power BI',
      'Tableau',
    ],
    'Writing & Content': [
      'Content Writing',
      'Copywriting',
      'Technical Writing',
      'Blog Writing',
      'Translation',
    ],
    Business: [
      'Project Management',
      'Business Analysis',
      'Consulting',
      'Virtual Assistant',
    ],
  };

  return (
    <div className='max-w-6xl mx-auto px-2 sm:px-4 py-8 w-full overflow-x-hidden'>
      {/* Profile Header */}
      <div className='bg-white rounded-lg shadow-lg mb-8 w-full'>
        <div className='relative h-48 rounded-t-lg bg-gradient-to-r from-ajira-primary to-ajira-accent w-full'>
          <div className='absolute -bottom-16 left-4 sm:left-8'>
            <div className='relative'>
              {!formData.photoURL && (
                <div className='absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
                  Required
                </div>
              )}
              <img
                src={formData.photoURL || '/images/default-avatar.png'}
                alt={formData.displayName}
                className={`w-24 sm:w-32 h-24 sm:h-32 rounded-full border-4 object-cover ${
                  formData.photoURL
                    ? 'border-white'
                    : 'border-red-300 border-dashed'
                }`}
              />
              <label
                htmlFor='profile-image'
                className={`absolute bottom-0 right-0 rounded-full p-2 shadow-lg cursor-pointer ${
                  formData.photoURL
                    ? 'bg-white hover:bg-gray-50'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                <Camera
                  className={`w-5 h-5 ${formData.photoURL ? 'text-gray-600' : 'text-white'}`}
                />
                <input
                  type='file'
                  id='profile-image'
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                />
              </label>
            </div>
          </div>
          {/* Profile Completion Badge */}
          <div className='absolute top-4 right-4'>
            <div className='bg-white rounded-full p-4 shadow-lg'>
              <div className='relative w-12 h-12 sm:w-16 sm:h-16'>
                <svg
                  className='w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90'
                  viewBox='0 0 36 36'
                >
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke='#e5e7eb'
                    strokeWidth='2'
                  />
                  <path
                    d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                    fill='none'
                    stroke={
                      profileCompletion >= 100
                        ? '#10b981'
                        : profileCompletion >= 70
                          ? '#f59e0b'
                          : '#ef4444'
                    }
                    strokeWidth='2'
                    strokeDasharray={`${profileCompletion}, 100`}
                  />
                </svg>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <span className='text-xs sm:text-sm font-bold text-gray-700'>
                    {profileCompletion}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='pt-20 px-2 sm:px-8 pb-8 w-full'>
          <div className='flex flex-col sm:flex-row justify-between items-start mb-6 w-full gap-4'>
            <div className='w-full'>
              <h1 className='text-2xl sm:text-3xl font-bold text-ajira-primary break-words'>
                {formData.displayName || 'Club Member'}
              </h1>
              <p className='text-gray-600 flex items-center mt-1 break-all'>
                <Mail className='w-4 h-4 mr-2' />
                {formData.email}
              </p>
              {formData.phoneNumber && (
                <p className='text-gray-600 flex items-center mt-1 break-all'>
                  <Phone className='w-4 h-4 mr-2' />
                  {formData.phoneNumber}
                </p>
              )}
              <div className='flex flex-wrap items-center mt-2 gap-2'>
                {formData.course && (
                  <span className='bg-ajira-primary/10 text-ajira-primary px-3 py-1 rounded-full text-xs sm:text-sm'>
                    {formData.course}
                  </span>
                )}
                {formData.year && (
                  <span className='bg-ajira-accent/10 text-ajira-accent px-3 py-1 rounded-full text-xs sm:text-sm'>
                    {formData.year}
                  </span>
                )}
                {formData.experienceLevel && (
                  <span className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs sm:text-sm'>
                    {formData.experienceLevel}
                  </span>
                )}
              </div>
              {/* Basic Info Note */}
              <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                <p className='text-xs sm:text-sm text-blue-800'>
                  <strong>Basic Info Complete:</strong> Your name, email,
                  course, year, phone, skills, and experience were collected
                  during signup. Now add: bio, goals, LinkedIn, and profile
                  photo for 100%!
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className='flex items-center space-x-2 bg-ajira-accent text-white px-4 py-2 rounded-lg hover:bg-ajira-accent/90 w-full sm:w-auto mt-4 sm:mt-0'
            >
              <Edit2 className='w-5 h-5' />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Profile Completion Alert */}
          {profileCompletion < 100 && (
            <div className='mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
              <div className='flex items-start'>
                <AlertCircle className='w-5 h-5 text-yellow-600 mr-3 mt-0.5' />
                <div>
                  <h3 className='text-xs sm:text-sm font-medium text-yellow-800'>
                    5 required fields to complete!
                  </h3>
                  <p className='text-xs sm:text-sm text-yellow-700 mt-1'>
                    Your profile is {profileCompletion}% complete. Required:
                    bio, goals, valid LinkedIn URL, and profile photo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 w-full'>
            <div className='text-center p-2 sm:p-4 bg-gray-50 rounded-lg'>
              <div className='text-lg sm:text-2xl font-bold text-ajira-primary'>
                {formData.completedProjects}
              </div>
              <p className='text-xs sm:text-sm text-gray-600'>
                Projects Completed
              </p>
            </div>
            <div className='text-center p-2 sm:p-4 bg-gray-50 rounded-lg'>
              <div className='text-lg sm:text-2xl font-bold text-ajira-primary'>
                {formData.skills.length}
              </div>
              <p className='text-xs sm:text-sm text-gray-600'>Skills Listed</p>
            </div>
            <div className='text-center p-2 sm:p-4 bg-gray-50 rounded-lg'>
              <div className='text-lg sm:text-2xl font-bold text-ajira-primary'>
                {formData.achievements.length}
              </div>
              <p className='text-xs sm:text-sm text-gray-600'>Achievements</p>
            </div>
            <div className='text-center p-2 sm:p-4 bg-gray-50 rounded-lg'>
              <div className='text-lg sm:text-2xl font-bold text-ajira-primary'>
                {Math.floor(
                  (new Date().getTime() -
                    new Date(formData.joinedDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
              </div>
              <p className='text-xs sm:text-sm text-gray-600'>Days Active</p>
            </div>
          </div>

          {/* Tabs */}
          <div className='border-b border-gray-200 mb-6 overflow-x-auto'>
            <nav className='-mb-px flex space-x-4 sm:space-x-8 w-full'>
              {['overview', 'skills', 'goals', 'platforms', 'portfolio'].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm capitalize whitespace-nowrap ${
                      activeTab === tab
                        ? 'border-ajira-accent text-ajira-accent'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </nav>
          </div>

          {/* Tab Content */}
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfileMutation.mutateAsync();
              }}
              className='space-y-8'
            >
              {/* Simple Profile Completion */}
              <div className='mb-6'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  Complete Your Profile
                </h3>
                <p className='text-sm text-gray-600 mb-4'>
                  Just 4 simple fields to complete your profile and unlock all
                  features!
                </p>
              </div>

              {/* Bio */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Tell us about yourself *
                </label>
                <textarea
                  name='bio'
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder='Briefly describe yourself, your interests, and what you hope to achieve...'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent'
                />
              </div>

              {/* Goals */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  What are your digital goals? *
                </label>
                <textarea
                  name='ajiraGoals'
                  value={formData.ajiraGoals}
                  onChange={handleChange}
                  rows={3}
                  required
                  placeholder='What do you want to achieve? (e.g., Learn new skills, find freelance work, start a business)'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent'
                />
              </div>

              {/* LinkedIn (Optional) */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  LinkedIn Profile *
                </label>
                <input
                  type='text'
                  name='linkedinProfile'
                  value={formData.linkedinProfile}
                  onChange={handleChange}
                  required
                  placeholder='e.g., https://linkedin.com/in/yourname or just yourname'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-accent/50 focus:border-transparent'
                />
                <p className='text-sm text-gray-500 mt-1'>
                  Enter your full LinkedIn profile URL or just your handle
                  (e.g., yourname)
                </p>
                {formData.linkedinProfile &&
                  !validateLinkedInURL(formData.linkedinProfile) && (
                    <p className='text-sm text-red-600 mt-1'>
                      Please enter a valid LinkedIn URL or handle
                    </p>
                  )}
              </div>

              {/* Interests Selection */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Select Your Interests (Ajira Trainings)
                </label>
                <p className='text-xs text-blue-600 mb-2'>
                  For each interest you choose, you will be automatically added
                  to the corresponding group in the Community Hub.
                </p>
                <div className='flex flex-wrap gap-2'>
                  {ajiraTrainings.map((interest) => (
                    <label
                      key={interest}
                      className='flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full cursor-pointer'
                    >
                      <input
                        type='checkbox'
                        checked={
                          formData.interests?.includes(interest) || false
                        }
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            interests: e.target.checked
                              ? [...(prev.interests || []), interest]
                              : (prev.interests || []).filter(
                                  (i) => i !== interest
                                ),
                          }));
                        }}
                        className='form-checkbox accent-ajira-accent'
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className='flex justify-end space-x-4'>
                <button
                  type='button'
                  onClick={() => setIsEditing(false)}
                  className='px-6 py-3 text-gray-700 hover:text-gray-900'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={updateProfileMutation.isLoading}
                  className='px-8 py-3 bg-ajira-accent text-white rounded-lg hover:bg-ajira-accent/90 disabled:opacity-50 flex items-center space-x-2'
                >
                  {updateProfileMutation.isLoading ? (
                    <>
                      <Loader2 className='w-5 h-5 animate-spin' />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className='w-5 h-5' />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className='space-y-8'>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-semibold text-ajira-primary mb-3 flex items-center'>
                      <User className='w-5 h-5 mr-2' />
                      About Me
                    </h3>
                    <p className='text-gray-600 leading-relaxed'>
                      {formData.bio ||
                        'No bio provided yet. Click "Edit Profile" to add your story!'}
                    </p>
                  </div>

                  {/* Ajira Goals */}
                  <div>
                    <h4 className='font-semibold text-gray-700 mb-3 flex items-center'>
                      <Target className='w-5 h-5 mr-2' />
                      Digital Goals
                    </h4>
                    <p className='text-gray-600 leading-relaxed'>
                      {formData.ajiraGoals ||
                        'No goals specified yet. Click "Edit Profile" to add your goals!'}
                    </p>
                  </div>

                  {/* LinkedIn Profile */}
                  {formData.linkedinProfile && (
                    <div>
                      <h4 className='font-semibold text-gray-700 mb-3 flex items-center'>
                        <Globe className='w-5 h-5 mr-2' />
                        Professional Links
                      </h4>
                      <div className='space-y-2'>
                        <a
                          href={formData.linkedinProfile}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline-flex items-center text-ajira-primary hover:text-ajira-accent'
                        >
                          <Globe className='w-4 h-4 mr-2' />
                          LinkedIn Profile
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Skills from Signup */}
                  <div>
                    <h4 className='font-semibold text-gray-700 mb-3 flex items-center'>
                      <Code className='w-5 h-5 mr-2' />
                      Digital Skills
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {formData.skills.length > 0 ? (
                        formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className='bg-ajira-primary/10 text-ajira-primary px-3 py-1 rounded-full text-sm'
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className='text-gray-500 text-sm'>
                          No skills listed
                        </span>
                      )}
                    </div>
                    <p className='text-xs text-gray-500 mt-2'>
                      Skills collected during signup
                    </p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <h4 className='font-semibold text-gray-700 mb-2'>
                        Academic Information
                      </h4>
                      <div className='space-y-2 text-sm text-gray-600'>
                        <p>
                          <span className='font-medium'>Course:</span>{' '}
                          {formData.course || 'Not specified'}
                        </p>
                        <p>
                          <span className='font-medium'>Year:</span>{' '}
                          {formData.year || 'Not specified'}
                        </p>
                        <p>
                          <span className='font-medium'>Experience:</span>{' '}
                          {formData.experienceLevel || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className='font-semibold text-gray-700 mb-2'>
                        Contact Information
                      </h4>
                      <div className='space-y-2 text-sm text-gray-600'>
                        <p className='flex items-center'>
                          <Phone className='w-4 h-4 mr-2' />
                          {formData.phoneNumber || 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {formData.achievements.length > 0 && (
                    <div>
                      <h3 className='text-lg font-semibold text-ajira-primary mb-3 flex items-center'>
                        <Award className='w-5 h-5 mr-2' />
                        Achievements & Certifications
                      </h3>
                      <div className='flex flex-wrap gap-2'>
                        {formData.achievements.map((achievement, index) => (
                          <span
                            key={index}
                            className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center'
                          >
                            <CheckCircle2 className='w-4 h-4 mr-1' />
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-semibold text-ajira-primary mb-3 flex items-center'>
                      <Code className='w-5 h-5 mr-2' />
                      Digital Skills
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {formData.skills.length > 0 ? (
                        formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className='px-4 py-2 bg-ajira-primary/10 text-ajira-primary rounded-lg text-sm font-medium'
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className='text-gray-600'>
                          No skills listed yet. Add your skills to showcase your
                          abilities!
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className='font-semibold text-gray-700 mb-3'>
                      Skill Development Suggestions
                    </h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {Object.entries(skillCategories).map(
                        ([category, skills]) => (
                          <div
                            key={category}
                            className='border border-gray-200 rounded-lg p-4'
                          >
                            <h5 className='font-medium text-ajira-primary mb-2'>
                              {category}
                            </h5>
                            <div className='space-y-1'>
                              {skills.slice(0, 4).map((skill, index) => (
                                <div
                                  key={index}
                                  className='text-sm text-gray-600'
                                >
                                  • {skill}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Goals Tab */}
              {activeTab === 'goals' && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-semibold text-ajira-primary mb-3 flex items-center'>
                      <Target className='w-5 h-5 mr-2' />
                      Ajira Goals
                    </h3>
                    <p className='text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg'>
                      {formData.ajiraGoals ||
                        'No goals specified yet. Set your digital transformation goals!'}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-lg font-semibold text-ajira-primary mb-3 flex items-center'>
                      <BookOpen className='w-5 h-5 mr-2' />
                      Learning Preferences
                    </h3>
                    <p className='text-gray-600'>
                      <span className='font-medium'>Preferred Mode:</span>{' '}
                      {formData.preferredLearningMode || 'Not specified'}
                    </p>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='border border-gray-200 rounded-lg p-4'>
                      <h4 className='font-semibold text-gray-700 mb-2 flex items-center'>
                        <TrendingUp className='w-5 h-5 mr-2' />
                        Mentorship
                      </h4>
                      <p className='text-sm text-gray-600'>
                        {formData.mentorshipInterest
                          ? '✅ Open to mentoring other members'
                          : 'Not currently interested in mentoring'}
                      </p>
                    </div>

                    <div className='border border-gray-200 rounded-lg p-4'>
                      <h4 className='font-semibold text-gray-700 mb-2 flex items-center'>
                        <Briefcase className='w-5 h-5 mr-2' />
                        Freelance Availability
                      </h4>
                      <p className='text-sm text-gray-600'>
                        {formData.availableForFreelance
                          ? '✅ Available for freelance projects'
                          : 'Not currently available for freelance work'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Platforms Tab */}
              {activeTab === 'platforms' && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-semibold text-ajira-primary mb-3 flex items-center'>
                      <Globe className='w-5 h-5 mr-2' />
                      Preferred Work Platforms
                    </h3>
                    <div className='flex flex-wrap gap-2'>
                      {formData.preferredPlatforms.length > 0 ? (
                        formData.preferredPlatforms.map((platform, index) => (
                          <span
                            key={index}
                            className='px-4 py-2 bg-ajira-accent/10 text-ajira-accent rounded-lg text-sm font-medium'
                          >
                            {platform}
                          </span>
                        ))
                      ) : (
                        <p className='text-gray-600'>
                          No platforms specified yet. Add platforms where you
                          want to find work!
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className='font-semibold text-gray-700 mb-3'>
                      Available Platforms
                    </h4>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                      {platformOptions.map((platform, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border text-center text-sm ${
                            formData.preferredPlatforms.includes(platform)
                              ? 'border-ajira-accent bg-ajira-accent/10 text-ajira-accent'
                              : 'border-gray-200 text-gray-600'
                          }`}
                        >
                          {platform}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Portfolio Tab */}
              {activeTab === 'portfolio' && (
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-semibold text-ajira-primary mb-3 flex items-center'>
                      <Globe className='w-5 h-5 mr-2' />
                      Professional Links
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      {formData.linkedinProfile && (
                        <a
                          href={formData.linkedinProfile}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center p-4 border border-gray-200 rounded-lg hover:border-ajira-accent transition-colors'
                        >
                          <div className='w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3'>
                            <span className='text-white text-xs font-bold'>
                              in
                            </span>
                          </div>
                          <div>
                            <div className='font-medium'>LinkedIn</div>
                            <div className='text-sm text-gray-600'>
                              Professional Profile
                            </div>
                          </div>
                        </a>
                      )}

                      {formData.githubProfile && (
                        <a
                          href={formData.githubProfile}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center p-4 border border-gray-200 rounded-lg hover:border-ajira-accent transition-colors'
                        >
                          <div className='w-8 h-8 bg-gray-900 rounded flex items-center justify-center mr-3'>
                            <Code className='w-4 h-4 text-white' />
                          </div>
                          <div>
                            <div className='font-medium'>GitHub</div>
                            <div className='text-sm text-gray-600'>
                              Code Repository
                            </div>
                          </div>
                        </a>
                      )}

                      {formData.portfolioUrl && (
                        <a
                          href={formData.portfolioUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='flex items-center p-4 border border-gray-200 rounded-lg hover:border-ajira-accent transition-colors'
                        >
                          <div className='w-8 h-8 bg-ajira-accent rounded flex items-center justify-center mr-3'>
                            <Globe className='w-4 h-4 text-white' />
                          </div>
                          <div>
                            <div className='font-medium'>Portfolio</div>
                            <div className='text-sm text-gray-600'>
                              Personal Website
                            </div>
                          </div>
                        </a>
                      )}
                    </div>

                    {!formData.linkedinProfile &&
                      !formData.githubProfile &&
                      !formData.portfolioUrl && (
                        <p className='text-gray-600'>
                          No professional links added yet. Add your LinkedIn,
                          GitHub, or portfolio links!
                        </p>
                      )}
                  </div>

                  <div>
                    <h4 className='font-semibold text-gray-700 mb-3'>
                      Project Portfolio
                    </h4>
                    <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
                      <Package className='w-12 h-12 text-gray-400 mx-auto mb-4' />
                      <h5 className='text-lg font-medium text-gray-700 mb-2'>
                        Showcase Your Work
                      </h5>
                      <p className='text-gray-600 mb-4'>
                        Upload screenshots, links, or descriptions of your
                        projects to showcase your skills.
                      </p>
                      <button className='bg-ajira-accent text-white px-6 py-2 rounded-lg hover:bg-ajira-accent/90'>
                        Add Project
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
