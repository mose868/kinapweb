import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Briefcase,
  Star,
  Upload,
  Camera,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  Target,
  DollarSign,
  Clock,
  Globe,
  Video,
  Image,
  FileText,
  Plus,
  X,
  Eye,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Zap,
  Shield,
  TrendingUp,
  BookOpen,
  Smartphone,
  Palette,
  Code,
  Megaphone,
  Edit3,
  Database,
  PlayCircle,
  Mic,
  Headphones,
  Languages,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBetterAuthContext } from '../contexts/BetterAuthContext';
import { createSellerProfile, analyzeSellerContent } from '../api/sellers';
import toast from 'react-hot-toast';
import AIAnalysisResults from '../components/seller/AIAnalysisResults';
import ServiceModal from '../components/seller/ServiceModal';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  videoUrl?: string;
  liveUrl?: string;
  technologies?: string[];
  completed?: boolean;
}

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryTime: number;
  features: string[];
  revisions: number;
}

interface SellerFormData {
  // Personal Info
  fullName: string;
  professionalTitle: string;
  bio: string;
  profileImage: File | null;
  profileImageUrl: string;
  location: string;
  languages: string[];
  
  // Professional Info
  skills: string[];
  experience: string;
  education: string[];
  certifications: string[];
  
  // Portfolio & Showcase
  portfolio: PortfolioItem[];
  showcaseVideo: File | null;
  showcaseVideoUrl: string;
  
  // Services & Pricing
  services: ServicePackage[];
  hourlyRate: number;
  availability: string;
  responseTime: string;
  
  // Social & Links
  websiteUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  
  // Business Info
  businessDescription: string;
  uniqueSellingPoint: string;
  targetAudience: string;
  
  // AI Analysis
  aiScore: number;
  aiRecommendations: string[];
  aiStrengths: string[];
  contentQuality: number;
  marketplaceReadiness: boolean;
}

const categories = [
  { id: 'web-development', name: 'Web Development', icon: Code, color: 'bg-blue-500' },
  { id: 'mobile-development', name: 'Mobile Development', icon: Smartphone, color: 'bg-green-500' },
  { id: 'graphic-design', name: 'Graphic Design', icon: Palette, color: 'bg-purple-500' },
  { id: 'digital-marketing', name: 'Digital Marketing', icon: Megaphone, color: 'bg-red-500' },
  { id: 'content-writing', name: 'Content Writing', icon: Edit3, color: 'bg-yellow-500' },
  { id: 'data-analysis', name: 'Data Analysis', icon: Database, color: 'bg-indigo-500' },
  { id: 'video-editing', name: 'Video Editing', icon: PlayCircle, color: 'bg-pink-500' },
  { id: 'voice-over', name: 'Voice Over', icon: Mic, color: 'bg-teal-500' },
  { id: 'translation', name: 'Translation', icon: Languages, color: 'bg-orange-500' },
  { id: 'virtual-assistant', name: 'Virtual Assistant', icon: Headphones, color: 'bg-cyan-500' },
];

const skillsByCategory = {
  'web-development': ['React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'PHP', 'JavaScript', 'TypeScript', 'HTML/CSS', 'WordPress'],
  'mobile-development': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Xamarin', 'Ionic', 'Unity', 'Android', 'iOS'],
  'graphic-design': ['Photoshop', 'Illustrator', 'Figma', 'Sketch', 'InDesign', 'After Effects', 'Canva', 'CorelDRAW'],
  'digital-marketing': ['SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'PPC', 'Analytics'],
  'content-writing': ['Blog Writing', 'Copywriting', 'Technical Writing', 'SEO Writing', 'Social Media Content'],
  'data-analysis': ['Excel', 'Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Google Analytics', 'SPSS'],
  'video-editing': ['Premiere Pro', 'Final Cut Pro', 'After Effects', 'DaVinci Resolve', 'Camtasia'],
  'voice-over': ['Narration', 'Commercial', 'E-learning', 'Audiobook', 'Character Voice'],
  'translation': ['English', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Portuguese'],
  'virtual-assistant': ['Data Entry', 'Customer Service', 'Research', 'Scheduling', 'Email Management'],
};

const EnhancedBecomeSeller: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useBetterAuthContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  const profileImageRef = useRef<HTMLInputElement>(null);
  const showcaseVideoRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<SellerFormData>({
    fullName: user?.displayName || user?.name || '',
    professionalTitle: '',
    bio: '',
    profileImage: null,
    profileImageUrl: user?.avatar || '',
    location: '',
    languages: ['English'],
    
    skills: [],
    experience: '',
    education: [],
    certifications: [],
    
    portfolio: [],
    showcaseVideo: null,
    showcaseVideoUrl: '',
    
    services: [],
    hourlyRate: 25,
    availability: 'part-time',
    responseTime: 'within-24-hours',
    
    websiteUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    
    businessDescription: '',
    uniqueSellingPoint: '',
    targetAudience: '',
    
    aiScore: 0,
    aiRecommendations: [],
    aiStrengths: [],
    contentQuality: 0,
    marketplaceReadiness: false,
  });

  const [portfolioForm, setPortfolioForm] = useState<PortfolioItem>({
    id: '',
    title: '',
    description: '',
    category: '',
    images: [],
    videoUrl: '',
    liveUrl: '',
    technologies: [],
    completed: false,
  });



  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showStabilityBanner, setShowStabilityBanner] = useState(true);

  // Persist step and form data to prevent resets
  useEffect(() => {
    try {
      const savedForm = localStorage.getItem('sellerProfileFormData');
      const savedStep = localStorage.getItem('sellerProfileStep');
      if (savedForm) {
        const parsed = JSON.parse(savedForm);
        if (parsed && typeof parsed === 'object') {
          setFormData((prev) => ({ ...prev, ...parsed }));
        }
      }
      if (savedStep) {
        const stepNum = parseInt(savedStep, 10);
        if (!Number.isNaN(stepNum) && stepNum >= 1 && stepNum <= 6) {
          setStep(stepNum);
        }
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('sellerProfileFormData', JSON.stringify(formData));
      localStorage.setItem('sellerProfileStep', String(step));
    } catch {}
  }, [formData, step]);

  // Guard against accidental page unloads
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (loading || analyzing) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [loading, analyzing]);

  // Prevent backspace from navigating back when not typing in an input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        const target = e.target as HTMLElement | null;
        const isEditable = !!(
          target && (
            (target as HTMLInputElement).isContentEditable ||
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA'
          )
        );
        if (!isEditable) {
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true } as any);
  }, []);

  // Persist/recover selected category
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sellerProfileSelectedCategory');
      if (saved) setSelectedCategory(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('sellerProfileSelectedCategory', selectedCategory);
    } catch {}
  }, [selectedCategory]);

  // Guard browser back while busy to avoid unintended navigation
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      if (loading || analyzing) {
        e.preventDefault();
        // Re-push state to keep user on page while busy
        window.history.pushState(null, '', window.location.href);
        toast.error('Please wait until the current operation completes.');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [loading, analyzing]);

  // Initialize banner visibility from localStorage
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem('sellerProfileStabilityBannerDismissed') === 'true';
      if (dismissed) setShowStabilityBanner(false);
    } catch {}
  }, []);

  // Handle profile image upload
  const handleProfileImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        profileImage: file,
        profileImageUrl: URL.createObjectURL(file)
      }));
      toast.success('Profile image uploaded successfully!');
    }
  }, []);

  // Handle showcase video upload
  const handleShowcaseVideoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error('Video size must be less than 100MB');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        showcaseVideo: file,
        showcaseVideoUrl: URL.createObjectURL(file)
      }));
      toast.success('Showcase video uploaded successfully!');
    }
  }, []);

  // AI Content Analysis
  const analyzeContent = async () => {
    setAnalyzing(true);
    try {
      console.log('🤖 Starting AI content analysis...');
      
      // Prepare data for AI analysis
      const analysisData = {
        bio: formData.bio,
        businessDescription: formData.businessDescription,
        uniqueSellingPoint: formData.uniqueSellingPoint,
        professionalTitle: formData.professionalTitle,
        skills: JSON.stringify(formData.skills),
        experience: formData.experience,
        portfolio: JSON.stringify(formData.portfolio),
        services: JSON.stringify(formData.services),
        fullName: formData.fullName,
        hasProfileImage: !!formData.profileImage || !!formData.profileImageUrl,
        hasShowcaseVideo: !!formData.showcaseVideo || !!formData.showcaseVideoUrl,
        education: JSON.stringify(formData.education),
        certifications: JSON.stringify(formData.certifications),
        languages: JSON.stringify(formData.languages)
      };

      // Call AI analysis API using the new function
      const analysisResult = await analyzeSellerContent(analysisData);
      
      if (analysisResult.success) {
        setFormData(prev => ({
          ...prev,
          aiScore: analysisResult.aiScore,
          contentQuality: analysisResult.contentQuality,
          aiRecommendations: analysisResult.recommendations,
          aiStrengths: analysisResult.strengths || [],
          marketplaceReadiness: analysisResult.marketplaceReadiness,
        }));
        
        toast.success('AI analysis completed successfully!');
        console.log('✅ AI Analysis Results:', analysisResult);
      } else {
        throw new Error('AI analysis failed');
      }
    } catch (error) {
      console.error('❌ AI analysis error:', error);
      toast.error('AI analysis failed. Please try again.');
      
      // Fallback to basic analysis if API fails
      const fallbackScore = Math.max(60, Math.min(85, 
        (formData.bio.length / 10) + 
        (formData.skills.length * 5) + 
        (formData.portfolio.length * 10) +
        (formData.services.length * 8) +
        (formData.professionalTitle ? 10 : 0)
      ));
      
      setFormData(prev => ({
        ...prev,
        aiScore: Math.round(fallbackScore),
        contentQuality: Math.round(fallbackScore * 0.9),
        aiRecommendations: [
          'Complete your profile with more detailed information',
          'Add more portfolio items to showcase your work',
          'Include relevant skills for your industry'
        ],
        aiStrengths: [
          'Profile foundation is in place',
          'Basic information provided'
        ],
        marketplaceReadiness: fallbackScore >= 75,
      }));
    } finally {
      setAnalyzing(false);
    }
  };

  // Add portfolio item
  const addPortfolioItem = () => {
    if (!portfolioForm.title || !portfolioForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newItem: PortfolioItem = {
      ...portfolioForm,
      id: Date.now().toString(),
      completed: true,
    };

    setFormData(prev => ({
      ...prev,
      portfolio: [...prev.portfolio, newItem]
    }));

    setPortfolioForm({
      id: '',
      title: '',
      description: '',
      category: '',
      images: [],
      videoUrl: '',
      liveUrl: '',
      technologies: [],
      completed: false,
    });

    setShowPortfolioModal(false);
    toast.success('Portfolio item added successfully!');
  };

  // Add service package
  const addServicePackage = (service: ServicePackage) => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, service]
    }));

    toast.success('Service package added successfully!');
  };

  // Submit seller profile
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add basic info (remove sellerId as it will be set by backend from auth)
      submitData.append('fullName', formData.fullName);
      submitData.append('professionalTitle', formData.professionalTitle);
      submitData.append('bio', formData.bio);
      submitData.append('location', formData.location);
      submitData.append('languages', JSON.stringify(formData.languages));
      
      // Add professional info
      submitData.append('skills', JSON.stringify(formData.skills));
      submitData.append('experience', formData.experience);
      submitData.append('education', JSON.stringify(formData.education));
      submitData.append('certifications', JSON.stringify(formData.certifications));
      
      // Add files
      if (formData.profileImage) {
        submitData.append('profileImage', formData.profileImage);
      }
      if (formData.showcaseVideo) {
        submitData.append('showcaseVideo', formData.showcaseVideo);
      }
      
      // Add portfolio and services
      submitData.append('portfolio', JSON.stringify(formData.portfolio));
      submitData.append('services', JSON.stringify(formData.services));
      
      // Add pricing and availability
      submitData.append('hourlyRate', formData.hourlyRate.toString());
      submitData.append('availability', formData.availability);
      submitData.append('responseTime', formData.responseTime);
      
      // Add social links
      submitData.append('websiteUrl', formData.websiteUrl);
      submitData.append('linkedinUrl', formData.linkedinUrl);
      submitData.append('githubUrl', formData.githubUrl);
      submitData.append('portfolioUrl', formData.portfolioUrl);
      
      // Add business info
      submitData.append('businessDescription', formData.businessDescription);
      submitData.append('uniqueSellingPoint', formData.uniqueSellingPoint);
      submitData.append('targetAudience', formData.targetAudience);
      
      // Add AI analysis results
      submitData.append('aiScore', formData.aiScore.toString());
      submitData.append('contentQuality', formData.contentQuality.toString());
      submitData.append('marketplaceReadiness', formData.marketplaceReadiness.toString());

      const result = await createSellerProfile(submitData);
      
      toast.success('Seller profile created successfully!');
      navigate(`/marketplace/seller/${result.sellerId}`);
      
    } catch (error: any) {
      console.error('Error creating seller profile:', error);
      toast.error(error.message || 'Failed to create seller profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ajira-primary/5 via-white to-ajira-accent/5">
      <div className="container mx-auto px-4 py-8">
        {showStabilityBanner && (
          <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Heads up: Seller profile is in beta</p>
                <p className="text-sm mt-1">
                  Profile creation may be unstable and could fail intermittently. Our team is actively working on it as we prepare for today’s deployment. Payments are also being integrated. It might work or not for now.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowStabilityBanner(false);
                  try { localStorage.setItem('sellerProfileStabilityBannerDismissed', 'true'); } catch {}
                }}
                className="text-yellow-700 hover:text-yellow-900"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ajira-primary mb-4">
            Create Your Seller Profile
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Build a professional seller profile that attracts clients and showcases your expertise.
            Our AI will help optimize your profile for maximum visibility.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-ajira-primary">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-ajira-primary to-ajira-accent h-2 rounded-full"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <motion.div
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <User className="w-16 h-16 text-ajira-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-ajira-primary mb-2">
                    Personal Information
                  </h2>
                  <p className="text-gray-600">
                    Let's start with your basic information and professional details
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Profile Image Upload */}
                  <div className="md:col-span-2 flex flex-col items-center mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <div className="relative">
                      <img
                        src={formData.profileImageUrl || '/default-avatar.png'}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-ajira-primary/20"
                      />
                      <button
                        type="button"
                        onClick={() => profileImageRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-ajira-primary text-white rounded-full p-2 hover:bg-ajira-primary/90 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      <input
                        ref={profileImageRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Professional Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Title *
                    </label>
                    <input
                      type="text"
                      value={formData.professionalTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, professionalTitle: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="e.g., Full-Stack Developer, UI/UX Designer"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="e.g., Nairobi, Kenya"
                    />
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages
                    </label>
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value && !formData.languages.includes(e.target.value)) {
                          setFormData(prev => ({
                            ...prev,
                            languages: [...prev.languages, e.target.value]
                          }));
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                    >
                      <option value="">Add a language</option>
                      <option value="English">English</option>
                      <option value="Swahili">Swahili</option>
                      <option value="French">French</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.languages.map((language, index) => (
                        <span
                          key={index}
                          className="bg-ajira-primary/10 text-ajira-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {language}
                          <button
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                languages: prev.languages.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-ajira-primary hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Bio *
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="Write a compelling bio that highlights your expertise and experience..."
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.bio.length}/500 characters
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!formData.fullName || !formData.professionalTitle || !formData.bio}
                    className="bg-ajira-primary text-white px-6 py-3 rounded-lg hover:bg-ajira-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Skills & Experience */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <Briefcase className="w-16 h-16 text-ajira-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-ajira-primary mb-2">
                    Skills & Experience
                  </h2>
                  <p className="text-gray-600">
                    Tell us about your skills, experience, and expertise
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Primary Category *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <motion.button
                            key={category.id}
                            type="button"
                            onClick={() => setSelectedCategory(category.id)}
                            className={`p-4 rounded-lg border-2 transition-all text-center ${
                              selectedCategory === category.id
                                ? 'border-ajira-primary bg-ajira-primary/10'
                                : 'border-gray-200 hover:border-ajira-primary/50'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center ${category.color}`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-xs font-medium">{category.name}</p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Skills Selection */}
                  {selectedCategory && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                        {skillsByCategory[selectedCategory as keyof typeof skillsByCategory]?.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => {
                              if (formData.skills.includes(skill)) {
                                setFormData(prev => ({
                                  ...prev,
                                  skills: prev.skills.filter(s => s !== skill)
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  skills: [...prev.skills, skill]
                                }));
                              }
                            }}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              formData.skills.includes(skill)
                                ? 'border-ajira-primary bg-ajira-primary/10 text-ajira-primary'
                                : 'border-gray-200 hover:border-ajira-primary/50'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-ajira-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {skill}
                            <button
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  skills: prev.skills.filter((_, i) => i !== index)
                                }));
                              }}
                              className="text-white hover:text-red-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level *
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select experience level</option>
                      <option value="beginner">Beginner (0-1 years)</option>
                      <option value="intermediate">Intermediate (1-3 years)</option>
                      <option value="advanced">Advanced (3-5 years)</option>
                      <option value="expert">Expert (5+ years)</option>
                    </select>
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <div className="space-y-3">
                      {formData.education.map((edu, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <input
                            type="text"
                            value={edu}
                            onChange={(e) => {
                              const newEducation = [...formData.education];
                              newEducation[index] = e.target.value;
                              setFormData(prev => ({ ...prev, education: newEducation }));
                            }}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                            placeholder="e.g., Bachelor's in Computer Science - University of Nairobi"
                          />
                          <button
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                education: prev.education.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            education: [...prev.education, '']
                          }));
                        }}
                        className="text-ajira-primary hover:text-ajira-primary/80 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Education
                      </button>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certifications
                    </label>
                    <div className="space-y-3">
                      {formData.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <input
                            type="text"
                            value={cert}
                            onChange={(e) => {
                              const newCertifications = [...formData.certifications];
                              newCertifications[index] = e.target.value;
                              setFormData(prev => ({ ...prev, certifications: newCertifications }));
                            }}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                            placeholder="e.g., AWS Certified Developer, Google Analytics Certified"
                          />
                          <button
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                certifications: prev.certifications.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            certifications: [...prev.certifications, '']
                          }));
                        }}
                        className="text-ajira-primary hover:text-ajira-primary/80 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Certification
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedCategory || formData.skills.length === 0 || !formData.experience}
                    className="bg-ajira-primary text-white px-6 py-3 rounded-lg hover:bg-ajira-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Portfolio & Showcase */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <Award className="w-16 h-16 text-ajira-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-ajira-primary mb-2">
                    Portfolio & Showcase
                  </h2>
                  <p className="text-gray-600">
                    Showcase your best work and create a compelling portfolio
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Showcase Video Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Showcase Video (Optional but Recommended)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      {formData.showcaseVideoUrl ? (
                        <div className="space-y-4">
                          <video
                            src={formData.showcaseVideoUrl}
                            controls
                            className="w-full max-w-md mx-auto rounded-lg"
                          />
                          <button
                            onClick={() => showcaseVideoRef.current?.click()}
                            className="bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90 transition-colors"
                          >
                            Change Video
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => showcaseVideoRef.current?.click()}
                          className="cursor-pointer"
                        >
                          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-medium text-gray-700 mb-2">
                            Upload a showcase video
                          </p>
                          <p className="text-gray-500">
                            Create a 30-60 second video introducing yourself and your services
                          </p>
                          <p className="text-sm text-gray-400 mt-2">
                            Max size: 100MB | Formats: MP4, MOV, AVI
                          </p>
                        </div>
                      )}
                      <input
                        ref={showcaseVideoRef}
                        type="file"
                        accept="video/*"
                        onChange={handleShowcaseVideoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Portfolio Items */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Portfolio Items
                      </label>
                      <button
                        onClick={() => setShowPortfolioModal(true)}
                        className="bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Portfolio Item
                      </button>
                    </div>

                    {formData.portfolio.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-700 mb-2">No portfolio items yet</p>
                        <p className="text-gray-500">Add your best work to showcase your skills</p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        {formData.portfolio.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="font-semibold text-gray-900">{item.title}</h3>
                              <button
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    portfolio: prev.portfolio.filter(p => p.id !== item.id)
                                  }));
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                            {item.technologies && item.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {item.technologies.map((tech, index) => (
                                  <span
                                    key={index}
                                    className="bg-ajira-primary/10 text-ajira-primary px-2 py-1 rounded text-xs"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="bg-ajira-primary text-white px-6 py-3 rounded-lg hover:bg-ajira-primary/90 transition-colors flex items-center gap-2"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Services & Pricing */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <DollarSign className="w-16 h-16 text-ajira-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-ajira-primary mb-2">
                    Services & Pricing
                  </h2>
                  <p className="text-gray-600">
                    Define your service packages and pricing structure
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Hourly Rate */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hourly Rate (USD) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={formData.hourlyRate}
                          onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                          placeholder="25"
                          min="1"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability *
                      </label>
                      <select
                        value={formData.availability}
                        onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        required
                      >
                        <option value="full-time">Full-time (40+ hours/week)</option>
                        <option value="part-time">Part-time (20-40 hours/week)</option>
                        <option value="weekends">Weekends only</option>
                        <option value="evenings">Evenings only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Response Time *
                    </label>
                    <select
                      value={formData.responseTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, responseTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      required
                    >
                      <option value="within-1-hour">Within 1 hour</option>
                      <option value="within-6-hours">Within 6 hours</option>
                      <option value="within-24-hours">Within 24 hours</option>
                      <option value="within-3-days">Within 3 days</option>
                    </select>
                  </div>

                  {/* Service Packages */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Service Packages
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowServiceModal(true)}
                        className="bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Service Package
                      </button>
                    </div>

                    {formData.services.length === 0 ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-700 mb-2">No service packages yet</p>
                        <p className="text-gray-500">Create service packages to attract clients</p>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {formData.services.map((service) => (
                          <div key={service.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-semibold text-gray-900">{service.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-ajira-primary font-bold">${service.price}</span>
                                <button
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      services: prev.services.filter(s => s.id !== service.id)
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>{service.deliveryTime} days</span>
                              <span>{service.revisions} revisions</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(3)}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => setStep(5)}
                    disabled={formData.hourlyRate <= 0 || !formData.availability || !formData.responseTime}
                    className="bg-ajira-primary text-white px-6 py-3 rounded-lg hover:bg-ajira-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Business Information */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <Globe className="w-16 h-16 text-ajira-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-ajira-primary mb-2">
                    Business Information
                  </h2>
                  <p className="text-gray-600">
                    Tell us about your business and add your social links
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Business Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description
                    </label>
                    <textarea
                      value={formData.businessDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="Describe your business, mission, and what makes you unique..."
                    />
                  </div>

                  {/* Unique Selling Point */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unique Selling Point
                    </label>
                    <input
                      type="text"
                      value={formData.uniqueSellingPoint}
                      onChange={(e) => setFormData(prev => ({ ...prev, uniqueSellingPoint: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="What makes you different from other sellers?"
                    />
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      placeholder="Who are your ideal clients?"
                    />
                  </div>

                  {/* Social Links */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(4)}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => setStep(6)}
                    className="bg-ajira-primary text-white px-6 py-3 rounded-lg hover:bg-ajira-primary/90 transition-colors flex items-center gap-2"
                  >
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 6: AI Analysis & Review */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <Sparkles className="w-16 h-16 text-ajira-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-ajira-primary mb-2">
                    AI Analysis & Review
                  </h2>
                  <p className="text-gray-600">
                    Let our AI analyze your profile and provide personalized recommendations
                  </p>
                </div>

                {!analyzing && formData.aiScore === 0 && (
                  <div className="text-center py-8">
                    <button
                      onClick={analyzeContent}
                      className="bg-gradient-to-r from-ajira-primary to-ajira-accent text-white px-8 py-4 rounded-lg hover:opacity-90 transition-opacity font-medium text-lg flex items-center gap-3 mx-auto"
                    >
                      <Sparkles className="w-6 h-6" />
                      Analyze My Profile with AI
                    </button>
                    <p className="text-gray-500 mt-4">
                      Our AI will analyze your content, skills, portfolio, and provide personalized suggestions
                    </p>
                  </div>
                )}

                <AIAnalysisResults
                  aiScore={formData.aiScore}
                  contentQuality={formData.contentQuality}
                  recommendations={formData.aiRecommendations}
                  strengths={formData.aiStrengths}
                  marketplaceReadiness={formData.marketplaceReadiness}
                  analyzing={analyzing}
                />

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(5)}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  {formData.aiScore > 0 && (
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-gradient-to-r from-ajira-primary to-ajira-accent text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating Profile...
                        </>
                      ) : (
                        <>
                          Create My Seller Profile
                          <CheckCircle className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Portfolio Modal */}
        <AnimatePresence>
          {showPortfolioModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-ajira-primary">Add Portfolio Item</h3>
                    <button
                      onClick={() => setShowPortfolioModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={portfolioForm.title}
                        onChange={(e) => setPortfolioForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="e.g., E-commerce Website for Local Business"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={portfolioForm.description}
                        onChange={(e) => setPortfolioForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="Describe the project, your role, and the impact..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={portfolioForm.category}
                        onChange={(e) => setPortfolioForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Live URL
                      </label>
                      <input
                        type="url"
                        value={portfolioForm.liveUrl}
                        onChange={(e) => setPortfolioForm(prev => ({ ...prev, liveUrl: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Technologies Used
                      </label>
                      <input
                        type="text"
                        value={portfolioForm.technologies?.join(', ') || ''}
                        onChange={(e) => setPortfolioForm(prev => ({
                          ...prev,
                          technologies: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean)
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary focus:border-transparent"
                        placeholder="React, Node.js, MongoDB (comma separated)"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => setShowPortfolioModal(false)}
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addPortfolioItem}
                      className="bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary/90 transition-colors"
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Service Modal */}
        <ServiceModal
          isOpen={showServiceModal}
          onClose={() => setShowServiceModal(false)}
          onSave={addServicePackage}
        />
      </div>
    </div>
  );
};

export default EnhancedBecomeSeller;
