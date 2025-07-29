import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Clock,
  Briefcase,
  GraduationCap,
  Users,
  Award,
  Heart,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Star,
  Globe,
  Phone,
  Mail,
  Calendar,
  Target,
  TrendingUp,
  FileText,
  Camera
} from 'lucide-react';
import axios from 'axios';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ApplyAsMentor = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationId, setApplicationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      nationality: 'Kenyan',
      profilePhoto: '',
      socialLinks: {
        linkedin: '',
        twitter: '',
        github: '',
        website: ''
      }
    },

    // Step 2: Location & Availability
    location: {
      city: 'Nairobi',
      county: 'Nairobi',
      country: 'Kenya',
      isLocationFlexible: true,
      preferredRadius: 50,
      canTravelForMentoring: false
    },
    availability: {
      isAvailableNow: false,
      preferredSchedule: {
        monday: { available: false, hours: [] },
        tuesday: { available: false, hours: [] },
        wednesday: { available: false, hours: [] },
        thursday: { available: false, hours: [] },
        friday: { available: false, hours: [] },
        saturday: { available: false, hours: [] },
        sunday: { available: false, hours: [] }
      },
      weeklyHoursCommitment: 5,
      maxMentees: 3,
      responseTimeCommitment: 'Within 24 hours',
      instantMentoring: {
        enabled: false,
        maxInstantSessions: 2,
        instantSessionDuration: 30
      }
    },

    // Step 3: Professional Background
    professional: {
      currentRole: '',
      currentCompany: '',
      industry: 'Technology',
      experienceLevel: 'Mid-Level (3-6 years)',
      yearsOfExperience: 3,
      previousRoles: [],
      achievements: [],
      certifications: []
    },

    // Step 4: Education
    education: {
      highestDegree: 'Bachelor\'s',
      fieldOfStudy: '',
      institution: '',
      graduationYear: new Date().getFullYear(),
      additionalEducation: [],
      onlineCoursesCompleted: []
    },

    // Step 5: Mentoring Experience
    mentoringExperience: {
      hasMentoredBefore: false,
      previousMentoringExperience: '',
      numberOfMentees: 0,
      mentoringDuration: '',
      mentoringStyle: 'Collaborative',
      preferredMentoringFormat: ['One-on-One']
    },

    // Step 6: Expertise & Skills
    expertise: {
      primarySkills: [],
      secondarySkills: [],
      technicalSkills: [],
      softSkills: [],
      specializations: [],
      industries: [],
      careerStages: ['Students']
    },

    // Step 7: Motivation & Goals
    motivation: {
      whyMentor: '',
      mentoringGoals: [],
      successDefinition: '',
      challengesToAddress: [],
      idealMenteeProfile: '',
      valuesToShare: [],
      personalGrowthGoals: ''
    },

    // Step 8: Documents
    documents: {
      resume: '',
      coverLetter: '',
      portfolio: '',
      recommendations: []
    }
  });

  const steps = [
    {
      number: 1,
      title: 'Personal Information',
      icon: User,
      description: 'Tell us about yourself'
    },
    {
      number: 2,
      title: 'Location & Availability',
      icon: MapPin,
      description: 'Where and when you can mentor'
    },
    {
      number: 3,
      title: 'Professional Background',
      icon: Briefcase,
      description: 'Your career journey'
    },
    {
      number: 4,
      title: 'Education',
      icon: GraduationCap,
      description: 'Academic background'
    },
    {
      number: 5,
      title: 'Mentoring Experience',
      icon: Users,
      description: 'Previous mentoring history'
    },
    {
      number: 6,
      title: 'Expertise & Skills',
      icon: Award,
      description: 'What you can teach'
    },
    {
      number: 7,
      title: 'Motivation & Goals',
      icon: Heart,
      description: 'Why you want to mentor'
    },
    {
      number: 8,
      title: 'Documents',
      icon: Upload,
      description: 'Supporting documents'
    }
  ];

  // Check for existing application on load
  useEffect(() => {
    const checkExistingApplication = async () => {
      const savedEmail = localStorage.getItem('mentorApplicationEmail');
      if (savedEmail) {
        try {
          const response = await axios.get(`${BASEURL}/mentor-application/application/${savedEmail}`);
          if (response.data.applicationId) {
            setApplicationId(response.data.applicationId);
            setCurrentStep(getStepFromStatus(response.data.currentStep));
            setCompletionPercentage(response.data.completionPercentage);
            setSuccess('Continuing your existing application...');
          }
        } catch (error) {
          // No existing application or error, continue with new application
          localStorage.removeItem('mentorApplicationEmail');
        }
      }
    };

    checkExistingApplication();
  }, []);

  const getStepFromStatus = (currentStepName) => {
    const stepMap = {
      'Personal Info': 1,
      'Location & Availability': 2,
      'Professional Background': 3,
      'Education': 4,
      'Mentoring Experience': 5,
      'Expertise & Skills': 6,
      'Motivation': 7,
      'Documents Upload': 8,
      'Submitted': 9
    };
    return stepMap[currentStepName] || 1;
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleArrayInputChange = (section, field, values) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: values
      }
    }));
  };

  const addToArray = (section, field, item) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], item]
      }
    }));
  };

  const removeFromArray = (section, field, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index)
      }
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        const { firstName, lastName, email, phone } = formData.personalInfo;
        return firstName && lastName && email && phone;
      case 2:
        return formData.location.city && formData.availability.weeklyHoursCommitment > 0;
      case 3:
        const { currentRole, currentCompany, industry } = formData.professional;
        return currentRole && currentCompany && industry;
      case 4:
        const { fieldOfStudy, institution } = formData.education;
        return fieldOfStudy && institution;
      case 5:
        return true; // Optional step
      case 6:
        return formData.expertise.primarySkills.length >= 3 && formData.expertise.specializations.length > 0;
      case 7:
        return formData.motivation.whyMentor.length > 50;
      case 8:
        return true; // Documents are optional initially
      default:
        return true;
    }
  };

  const saveStep = async (stepNumber) => {
    if (!applicationId && stepNumber === 1) {
      // Create new application
      try {
        setLoading(true);
        const response = await axios.post(`${BASEURL}/mentor-application/apply`, {
          email: formData.personalInfo.email,
          sourceChannel: 'website'
        });
        
        setApplicationId(response.data.applicationId);
        localStorage.setItem('mentorApplicationEmail', formData.personalInfo.email);
      } catch (error) {
        if (error.response?.status === 400) {
          // Application already exists
          setApplicationId(error.response.data.applicationId);
          setCurrentStep(getStepFromStatus(error.response.data.currentStep));
          setSuccess('Continuing your existing application...');
        } else {
          setError(error.response?.data?.message || 'Failed to start application');
          return false;
        }
      } finally {
        setLoading(false);
      }
    }

    if (applicationId) {
      // Update existing application step
      try {
        setLoading(true);
        const stepMap = {
          1: 'personal-info',
          2: 'location-availability',
          3: 'professional',
          4: 'education',
          5: 'mentoring-experience',
          6: 'expertise',
          7: 'motivation',
          8: 'documents'
        };

        const stepData = getStepData(stepNumber);
        const response = await axios.put(
          `${BASEURL}/mentor-application/application/${applicationId}/step/${stepMap[stepNumber]}`,
          stepData
        );

        setCompletionPercentage(response.data.completionPercentage);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to save step');
        return false;
      } finally {
        setLoading(false);
      }
    }

    return true;
  };

  const getStepData = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return formData.personalInfo;
      case 2:
        return { location: formData.location, availability: formData.availability };
      case 3:
        return formData.professional;
      case 4:
        return formData.education;
      case 5:
        return formData.mentoringExperience;
      case 6:
        return formData.expertise;
      case 7:
        return formData.motivation;
      case 8:
        return formData.documents;
      default:
        return {};
    }
  };

  const nextStep = async () => {
    if (!validateStep(currentStep)) {
      setError('Please fill in all required fields before continuing.');
      return;
    }

    setError('');
    const saved = await saveStep(currentStep);
    
    if (saved && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setSuccess('Progress saved!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitApplication = async () => {
    if (!validateStep(currentStep)) {
      setError('Please complete all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Save final step
      await saveStep(currentStep);

      // Submit application
      const response = await axios.post(`${BASEURL}/mentor-application/application/${applicationId}/submit`);
      
      setSuccess(`Application submitted successfully! Your AI score: ${response.data.aiScore}/100. Expected review time: ${response.data.estimatedReviewTime}`);
      localStorage.removeItem('mentorApplicationEmail');
      
      // Redirect to status page after delay
      setTimeout(() => {
        window.location.href = `/mentor-application/status/${applicationId}`;
      }, 3000);

    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep 
            data={formData.personalInfo}
            onChange={(field, value) => handleInputChange('personalInfo', field, value)}
            onNestedChange={(subsection, field, value) => handleNestedInputChange('personalInfo', subsection, field, value)}
          />
        );
      case 2:
        return (
          <LocationAvailabilityStep 
            locationData={formData.location}
            availabilityData={formData.availability}
            onLocationChange={(field, value) => handleInputChange('location', field, value)}
            onAvailabilityChange={(field, value) => handleInputChange('availability', field, value)}
            onNestedChange={handleNestedInputChange}
          />
        );
      case 3:
        return (
          <ProfessionalStep 
            data={formData.professional}
            onChange={(field, value) => handleInputChange('professional', field, value)}
            onArrayChange={(field, values) => handleArrayInputChange('professional', field, values)}
            addToArray={(field, item) => addToArray('professional', field, item)}
            removeFromArray={(field, index) => removeFromArray('professional', field, index)}
          />
        );
      case 4:
        return (
          <EducationStep 
            data={formData.education}
            onChange={(field, value) => handleInputChange('education', field, value)}
            onArrayChange={(field, values) => handleArrayInputChange('education', field, values)}
          />
        );
      case 5:
        return (
          <MentoringExperienceStep 
            data={formData.mentoringExperience}
            onChange={(field, value) => handleInputChange('mentoringExperience', field, value)}
            onArrayChange={(field, values) => handleArrayInputChange('mentoringExperience', field, values)}
          />
        );
      case 6:
        return (
          <ExpertiseStep 
            data={formData.expertise}
            onChange={(field, value) => handleInputChange('expertise', field, value)}
            onArrayChange={(field, values) => handleArrayInputChange('expertise', field, values)}
          />
        );
      case 7:
        return (
          <MotivationStep 
            data={formData.motivation}
            onChange={(field, value) => handleInputChange('motivation', field, value)}
            onArrayChange={(field, values) => handleArrayInputChange('motivation', field, values)}
          />
        );
      case 8:
        return (
          <DocumentsStep 
            data={formData.documents}
            onChange={(field, value) => handleInputChange('documents', field, value)}
            onArrayChange={(field, values) => handleArrayInputChange('documents', field, values)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ajira-primary mb-4">
            Apply to Become a Mentor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our community of mentors and help shape the next generation of digital professionals. 
            Our application process is designed to ensure the best match between mentors and mentees.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Application Progress</h2>
            <span className="text-sm font-medium text-ajira-primary">
              {completionPercentage}% Complete
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-ajira-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isActive ? 'bg-ajira-primary text-white' :
                    isCompleted ? 'bg-green-500 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-medium ${isActive ? 'text-ajira-primary' : 'text-gray-600'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 hidden sm:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Step {currentStep}: {steps[currentStep - 1]?.title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep - 1]?.description}
            </p>
          </div>

          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              disabled={loading || !validateStep(currentStep)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                loading || !validateStep(currentStep)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-ajira-primary text-white hover:bg-ajira-primary/90'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={submitApplication}
              disabled={submitting || !validateStep(currentStep)}
              className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                submitting || !validateStep(currentStep)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
          <p className="text-blue-700 mb-4">
            Our application process typically takes 15-20 minutes to complete. 
            Your progress is automatically saved, so you can return anytime to continue.
          </p>
          <div className="flex space-x-4 text-sm">
            <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
              Contact Support
            </a>
            <a href="/mentorship/faq" className="text-blue-600 hover:text-blue-800 font-medium">
              Application FAQ
            </a>
            <a href="/mentorship/requirements" className="text-blue-600 hover:text-blue-800 font-medium">
              Requirements
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Components (I'll create these as separate components for cleaner code)

const PersonalInfoStep = ({ data, onChange, onNestedChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Name *
        </label>
        <input
          type="text"
          value={data.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          placeholder="John"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Name *
        </label>
        <input
          type="text"
          value={data.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          placeholder="Doe"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          placeholder="john.doe@example.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          placeholder="+254 712 345 678"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date of Birth
        </label>
        <input
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => onChange('dateOfBirth', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nationality
        </label>
        <select
          value={data.nationality}
          onChange={(e) => onChange('nationality', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
        >
          <option value="Kenyan">Kenyan</option>
          <option value="Ugandan">Ugandan</option>
          <option value="Tanzanian">Tanzanian</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Social Links (Optional)
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="url"
          value={data.socialLinks.linkedin}
          onChange={(e) => onNestedChange('socialLinks', 'linkedin', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          placeholder="LinkedIn Profile URL"
        />
        <input
          type="url"
          value={data.socialLinks.github}
          onChange={(e) => onNestedChange('socialLinks', 'github', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          placeholder="GitHub Profile URL"
        />
      </div>
    </div>
  </div>
);

const LocationAvailabilityStep = ({ locationData, availabilityData, onLocationChange, onAvailabilityChange, onNestedChange }) => (
  <div className="space-y-8">
    {/* Location Section */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <select
            value={locationData.city}
            onChange={(e) => onLocationChange('city', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          >
            <option value="Nairobi">Nairobi</option>
            <option value="Mombasa">Mombasa</option>
            <option value="Kisumu">Kisumu</option>
            <option value="Nakuru">Nakuru</option>
            <option value="Eldoret">Eldoret</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Radius (km)
          </label>
          <input
            type="number"
            value={locationData.preferredRadius}
            onChange={(e) => onLocationChange('preferredRadius', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
            min="5"
            max="100"
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={locationData.isLocationFlexible}
            onChange={(e) => onLocationChange('isLocationFlexible', e.target.checked)}
            className="w-4 h-4 text-ajira-primary"
          />
          <span className="ml-2 text-sm text-gray-700">I'm flexible with location</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={locationData.canTravelForMentoring}
            onChange={(e) => onLocationChange('canTravelForMentoring', e.target.checked)}
            className="w-4 h-4 text-ajira-primary"
          />
          <span className="ml-2 text-sm text-gray-700">I can travel for in-person mentoring</span>
        </label>
      </div>
    </div>

    {/* Availability Section */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekly Hours Commitment *
          </label>
          <input
            type="number"
            value={availabilityData.weeklyHoursCommitment}
            onChange={(e) => onAvailabilityChange('weeklyHoursCommitment', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
            min="1"
            max="40"
          />
          <p className="text-xs text-gray-500 mt-1">Hours per week you can dedicate</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Mentees
          </label>
          <input
            type="number"
            value={availabilityData.maxMentees}
            onChange={(e) => onAvailabilityChange('maxMentees', parseInt(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
            min="1"
            max="20"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Response Time Commitment
          </label>
          <select
            value={availabilityData.responseTimeCommitment}
            onChange={(e) => onAvailabilityChange('responseTimeCommitment', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          >
            <option value="Within 1 hour">Within 1 hour</option>
            <option value="Within 4 hours">Within 4 hours</option>
            <option value="Within 24 hours">Within 24 hours</option>
            <option value="Within 48 hours">Within 48 hours</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={availabilityData.isAvailableNow}
            onChange={(e) => onAvailabilityChange('isAvailableNow', e.target.checked)}
            className="w-4 h-4 text-ajira-primary"
          />
          <span className="ml-2 text-sm text-gray-700">I'm available for immediate mentoring</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={availabilityData.instantMentoring.enabled}
            onChange={(e) => onNestedChange('availability', 'instantMentoring', 'enabled', e.target.checked)}
            className="w-4 h-4 text-ajira-primary"
          />
          <span className="ml-2 text-sm text-gray-700">Enable instant mentoring (Uber-like on-demand help)</span>
        </label>
      </div>
    </div>
  </div>
);

// Additional step components would be similar in structure...
// For brevity, I'll create placeholder components for the remaining steps

const ProfessionalStep = ({ data, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Role *</label>
        <input
          type="text"
          value={data.currentRole}
          onChange={(e) => onChange('currentRole', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          placeholder="Software Engineer"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Company *</label>
        <input
          type="text"
          value={data.currentCompany}
          onChange={(e) => onChange('currentCompany', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          placeholder="Safaricom PLC"
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
        <select
          value={data.industry}
          onChange={(e) => onChange('industry', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
        >
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Education">Education</option>
          <option value="Marketing">Marketing</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
        <input
          type="number"
          value={data.yearsOfExperience}
          onChange={(e) => onChange('yearsOfExperience', parseInt(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          min="1"
          max="50"
        />
      </div>
    </div>
  </div>
);

const EducationStep = ({ data, onChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Highest Degree</label>
        <select
          value={data.highestDegree}
          onChange={(e) => onChange('highestDegree', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
        >
          <option value="High School">High School</option>
          <option value="Certificate">Certificate</option>
          <option value="Diploma">Diploma</option>
          <option value="Bachelor's">Bachelor's</option>
          <option value="Master's">Master's</option>
          <option value="PhD">PhD</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study *</label>
        <input
          type="text"
          value={data.fieldOfStudy}
          onChange={(e) => onChange('fieldOfStudy', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          placeholder="Computer Science"
        />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Institution *</label>
        <input
          type="text"
          value={data.institution}
          onChange={(e) => onChange('institution', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          placeholder="University of Nairobi"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year</label>
        <input
          type="number"
          value={data.graduationYear}
          onChange={(e) => onChange('graduationYear', parseInt(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          min="1990"
          max={new Date().getFullYear() + 10}
        />
      </div>
    </div>
  </div>
);

const MentoringExperienceStep = ({ data, onChange }) => (
  <div className="space-y-6">
    <div>
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={data.hasMentoredBefore}
          onChange={(e) => onChange('hasMentoredBefore', e.target.checked)}
          className="w-4 h-4 text-ajira-primary"
        />
        <span className="ml-2 text-sm font-medium text-gray-700">I have mentored before</span>
      </label>
      
      {data.hasMentoredBefore && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Previous Mentoring Experience</label>
            <textarea
              value={data.previousMentoringExperience}
              onChange={(e) => onChange('previousMentoringExperience', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
              rows="3"
              placeholder="Describe your previous mentoring experience..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Mentees</label>
              <input
                type="number"
                value={data.numberOfMentees}
                onChange={(e) => onChange('numberOfMentees', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mentoring Style</label>
              <select
                value={data.mentoringStyle}
                onChange={(e) => onChange('mentoringStyle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
              >
                <option value="Directive">Directive</option>
                <option value="Non-Directive">Non-Directive</option>
                <option value="Collaborative">Collaborative</option>
                <option value="Coaching">Coaching</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

const ExpertiseStep = ({ data, onChange, onArrayChange }) => {
  const [skillInput, setSkillInput] = useState('');
  
  const addSkill = () => {
    if (skillInput.trim() && !data.primarySkills.includes(skillInput.trim())) {
      onArrayChange('primarySkills', [...data.primarySkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    onArrayChange('primarySkills', data.primarySkills.filter(s => s !== skill));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Skills * (Add at least 3)
        </label>
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
            placeholder="e.g., JavaScript, React, Python"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-4 py-3 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.primarySkills.map((skill, index) => (
            <span
              key={index}
              className="bg-ajira-primary/10 text-ajira-primary px-3 py-1 rounded-full text-sm flex items-center"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Specializations *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'Web Development', 'Mobile Development', 'Data Science', 'UI/UX Design',
            'Digital Marketing', 'Cybersecurity', 'Project Management', 'Entrepreneurship',
            'Career Development', 'Freelancing', 'Content Creation', 'Graphic Design'
          ].map((specialization) => (
            <label key={specialization} className="flex items-center">
              <input
                type="checkbox"
                checked={data.specializations.includes(specialization)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onArrayChange('specializations', [...data.specializations, specialization]);
                  } else {
                    onArrayChange('specializations', data.specializations.filter(s => s !== specialization));
                  }
                }}
                className="w-4 h-4 text-ajira-primary"
              />
              <span className="ml-2 text-sm text-gray-700">{specialization}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const MotivationStep = ({ data, onChange, onArrayChange }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Why do you want to become a mentor? * (Minimum 50 characters)
      </label>
      <textarea
        value={data.whyMentor}
        onChange={(e) => onChange('whyMentor', e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
        rows="4"
        placeholder="Share your motivation for mentoring and how you plan to help mentees grow..."
      />
      <p className="text-sm text-gray-500 mt-1">
        {data.whyMentor.length}/50 characters minimum
      </p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        How do you define success in mentoring?
      </label>
      <textarea
        value={data.successDefinition}
        onChange={(e) => onChange('successDefinition', e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
        rows="3"
        placeholder="What does a successful mentoring relationship look like to you?"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Describe your ideal mentee
      </label>
      <textarea
        value={data.idealMenteeProfile}
        onChange={(e) => onChange('idealMenteeProfile', e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
        rows="3"
        placeholder="What type of mentee would you work best with?"
      />
    </div>
  </div>
);

const DocumentsStep = ({ data, onChange }) => (
  <div className="space-y-6">
    <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Supporting Documents</h3>
      <p className="text-gray-600 mb-6">
        While optional now, providing documents can help speed up your application review.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
          <textarea
            value={data.coverLetter}
            onChange={(e) => onChange('coverLetter', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
            rows="4"
            placeholder="Tell us more about why you'd be a great mentor..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
          <input
            type="url"
            value={data.portfolio}
            onChange={(e) => onChange('portfolio', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>
    </div>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-medium text-blue-900 mb-2">📄 Document Guidelines</h4>
      <ul className="text-sm text-blue-700 space-y-1">
        <li>• Resume: PDF format preferred, max 2MB</li>
        <li>• Cover Letter: Focus on your mentoring goals and experience</li>
        <li>• Portfolio: Showcase your best work and projects</li>
        <li>• All documents will be reviewed confidentially</li>
      </ul>
    </div>
  </div>
);

export default ApplyAsMentor; 