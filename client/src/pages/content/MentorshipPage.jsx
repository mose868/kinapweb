import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  Search,
  Grid,
  List,
  Zap,
  Target,
  Award,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Calendar,
  Phone,
  Video,
  TrendingUp,
  UserPlus,
  Loader2,
  AlertCircle,
  Heart,
  Globe,
  BookOpen,
  Briefcase,
  GraduationCap,
  Eye,
} from 'lucide-react';
import axios from 'axios';
import LoadingState from '../../components/common/LoadingState';
import { useBetterAuthContext } from '../../contexts/BetterAuthContext';
import { fetchMyMentorApplication } from '../../api/mentorApplications';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MentorshipPage = () => {
  const { user } = useBetterAuthContext();
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMentor, setIsMentor] = useState(false);
  const [mentorApplication, setMentorApplication] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showInstantOnly, setShowInstantOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Uber-like request functionality
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [requestData, setRequestData] = useState({
    mentee: {
      name: '',
      email: '',
      goals: [],
    },
    requestType: 'Instant',
    urgency: 'Medium',
    sessionType: 'Quick Question',
    category: 'Web Development',
    problemDescription: '',
    preferredDuration: 30,
    location: {
      city: 'Nairobi',
      country: 'Kenya',
      preferInPerson: false,
      maxDistance: 50,
    },
    budget: {
      hasBudget: false,
      maxAmount: 0,
      currency: 'KES',
    },
  });

  useEffect(() => {
    fetchMentors();
    fetchCategories();
    checkMentorStatus();
  }, [user]);

  useEffect(() => {
    filterMentors();
  }, [
    selectedCategory,
    selectedExpertise,
    selectedCity,
    showFreeOnly,
    showInstantOnly,
    searchQuery,
    mentors,
  ]);

  const checkMentorStatus = async () => {
    if (!user) return;

    try {
      const application = await fetchMyMentorApplication();
      setMentorApplication(application);
      setIsMentor(application.status === 'approved');
    } catch (error) {
      // User doesn't have an application or it's not approved
      setIsMentor(false);
    }
  };

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASEURL}/mentorship`);
      const mentorData = response.data.mentors || [];
      setMentors(mentorData);
      setFilteredMentors(mentorData);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      setError('Failed to load mentors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Mock categories
      setCategories([
        'Web Development',
        'Mobile Development',
        'Data Science',
        'UI/UX Design',
        'Digital Marketing',
        'Cybersecurity',
        'Project Management',
        'Entrepreneurship',
        'Career Development',
        'Freelancing',
        'Content Creation',
        'Graphic Design',
      ]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterMentors = () => {
    let filtered = [...mentors];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (mentor) => mentor.category === selectedCategory
      );
    }

    if (selectedExpertise !== 'all') {
      filtered = filtered.filter(
        (mentor) => mentor.expertiseLevel === selectedExpertise
      );
    }

    if (selectedCity !== 'all') {
      filtered = filtered.filter(
        (mentor) => mentor.location.city === selectedCity
      );
    }

    if (showFreeOnly) {
      filtered = filtered.filter((mentor) => mentor.pricing.isFree);
    }

    if (showInstantOnly) {
      filtered = filtered.filter(
        (mentor) => mentor.instantAvailability.enabled
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (mentor) =>
          mentor.mentor.name.toLowerCase().includes(query) ||
          mentor.title.toLowerCase().includes(query) ||
          mentor.category.toLowerCase().includes(query)
      );
    }

    setFilteredMentors(filtered);
  };

  const submitMentorRequest = async (e) => {
    e.preventDefault();
    setRequestSubmitting(true);

    try {
      // Mock API call
      // const response = await axios.post(`${BASEURL}/mentorship/request`, requestData);

      // Simulate request processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setRequestStatus({
        type: 'success',
        message:
          'Request sent to available mentors! Expected response time: 15 minutes',
        data: {
          requestId: 'REQ_' + Date.now(),
          mentorsNotified: 0,
          estimatedResponseTime: '15 minutes',
        },
      });
      setShowRequestForm(false);
      resetRequestForm();
    } catch (error) {
      setRequestStatus({
        type: 'error',
        message:
          error.response?.data?.message ||
          'Failed to submit request. Please try again.',
      });
    } finally {
      setRequestSubmitting(false);
    }
  };

  const resetRequestForm = () => {
    setRequestData({
      mentee: { name: '', email: '', goals: [] },
      requestType: 'Instant',
      urgency: 'Medium',
      sessionType: 'Quick Question',
      category: 'Web Development',
      problemDescription: '',
      preferredDuration: 30,
      location: {
        city: 'Nairobi',
        country: 'Kenya',
        preferInPerson: false,
        maxDistance: 50,
      },
      budget: {
        hasBudget: false,
        maxAmount: 0,
        currency: 'KES',
      },
    });
  };

  const handleRequestDataChange = (field, value, nested = null) => {
    if (nested) {
      setRequestData((prev) => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value,
        },
      }));
    } else {
      setRequestData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  if (loading) {
    return <LoadingState message='Loading mentors' />;
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 py-12'>
        <div className='container-custom'>
          <div className='text-center'>
            <AlertCircle className='w-16 h-16 text-red-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold text-red-600 mb-4'>
              Error Loading Mentors
            </h2>
            <p className='text-gray-600'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 sm:py-12 w-full overflow-x-hidden'>
      <div className='container-custom px-2 sm:px-4 w-full'>
        {/* Hero Section */}
        <div className='bg-gradient-to-r from-ajira-primary to-ajira-secondary rounded-lg p-4 sm:p-8 text-center text-white mb-12 w-full'>
          <h1 className='text-3xl sm:text-4xl font-bold mb-4'>
            Find Your Perfect Mentor
          </h1>
          <p className='text-base sm:text-xl mb-8 opacity-90'>
            Connect with experienced professionals who can guide you through
            your career journey. Get personalized advice, industry insights, and
            accelerate your growth.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full'>
            {isMentor ? (
              <button
                onClick={() => setShowRequestForm(true)}
                className='bg-white text-ajira-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold w-full sm:w-auto'
              >
                Request a Mentor
              </button>
            ) : (
              <button
                onClick={() => setShowRequestForm(true)}
                className='bg-white text-ajira-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold w-full sm:w-auto'
              >
                Find a Mentor
              </button>
            )}
            <Link
              to='/mentorship/apply'
              className='border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold w-full sm:w-auto'
            >
              Become a Mentor
            </Link>
          </div>
        </div>

        {/* Request Status */}
        {requestStatus && (
          <div
            className={`mb-8 p-6 rounded-lg border ${
              requestStatus.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className='flex items-center space-x-3'>
              {requestStatus.type === 'success' ? (
                <CheckCircle className='w-6 h-6 text-green-600' />
              ) : (
                <AlertCircle className='w-6 h-6 text-red-600' />
              )}
              <div>
                <p className='font-semibold'>{requestStatus.message}</p>
                {requestStatus.data && (
                  <p className='text-sm mt-1'>
                    Request ID: {requestStatus.data.requestId} •
                    {requestStatus.data.mentorsNotified} mentors notified
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 w-full'>
          <div className='bg-white rounded-lg shadow-sm p-6 text-center'>
            <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3'>
              <Users className='w-6 h-6 text-blue-600' />
            </div>
            <h3 className='text-2xl font-bold text-gray-900'>
              {mentors.length}
            </h3>
            <p className='text-gray-600'>Expert Mentors</p>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6 text-center'>
            <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3'>
              <CheckCircle className='w-6 h-6 text-green-600' />
            </div>
            <h3 className='text-2xl font-bold text-gray-900'>0</h3>
            <p className='text-gray-600'>Sessions Completed</p>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6 text-center'>
            <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3'>
              <Star className='w-6 h-6 text-yellow-600' />
            </div>
            <h3 className='text-2xl font-bold text-gray-900'>0.0</h3>
            <p className='text-gray-600'>Average Rating</p>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6 text-center'>
            <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3'>
              <Zap className='w-6 h-6 text-purple-600' />
            </div>
            <h3 className='text-2xl font-bold text-gray-900'>--</h3>
            <p className='text-gray-600'>Avg Response Time</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-8 w-full'>
          <div className='flex flex-wrap items-center justify-between gap-4 mb-6 w-full'>
            <div className='flex items-center space-x-4'>
              <div className='relative'>
                <Search className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2' />
                <input
                  type='text'
                  placeholder='Search mentors...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 w-full sm:w-64 text-base sm:text-lg'
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 text-base sm:text-lg'
              >
                <option value='all'>All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 text-base sm:text-lg'
              >
                <option value='all'>All Levels</option>
                <option value='Junior'>Junior</option>
                <option value='Mid-Level'>Mid-Level</option>
                <option value='Senior'>Senior</option>
                <option value='Expert'>Expert</option>
              </select>
            </div>

            <div className='flex items-center space-x-4'>
              <label className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={showFreeOnly}
                  onChange={(e) => setShowFreeOnly(e.target.checked)}
                  className='w-4 h-4 text-ajira-primary'
                />
                <span className='text-sm font-medium text-gray-700'>
                  Free Only
                </span>
              </label>

              <label className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={showInstantOnly}
                  onChange={(e) => setShowInstantOnly(e.target.checked)}
                  className='w-4 h-4 text-ajira-primary'
                />
                <span className='text-sm font-medium text-gray-700'>
                  Instant Available
                </span>
              </label>

              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-ajira-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Grid className='w-5 h-5' />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-ajira-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <List className='w-5 h-5' />
                </button>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-between text-sm text-gray-600'>
            <span>
              {filteredMentors.length} mentor
              {filteredMentors.length !== 1 ? 's' : ''} found
            </span>
            <span>
              Showing{' '}
              {selectedCategory !== 'all' ? selectedCategory : 'all categories'}
            </span>
          </div>
        </div>

        {/* Mentors Grid/List */}
        {filteredMentors.length === 0 ? (
          <div className='text-center py-12'>
            <Users className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              No mentors found
            </h3>
            <p className='text-gray-600 mb-6'>
              Try adjusting your filters or search criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedExpertise('all');
                setSelectedCity('all');
                setShowFreeOnly(false);
                setShowInstantOnly(false);
                setSearchQuery('');
              }}
              className='bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary/90 transition-colors'
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-4 sm:gap-6 w-full ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {filteredMentors.map((mentor) => (
              <MentorCard
                key={mentor._id}
                mentor={mentor}
                viewMode={viewMode}
                onRequestMentor={() => {
                  setRequestData((prev) => ({
                    ...prev,
                    category: mentor.category,
                  }));
                  setShowRequestForm(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className='mt-16 bg-gradient-to-r from-ajira-primary to-ajira-secondary rounded-lg p-4 sm:p-8 text-center text-white w-full'>
          <h2 className='text-xl sm:text-3xl font-bold mb-4'>
            Ready to accelerate your career?
          </h2>
          <p className='text-base sm:text-xl mb-8 opacity-90'>
            Join thousands of professionals who have transformed their careers
            through mentorship.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full'>
            {isMentor ? (
              <button
                onClick={() => setShowRequestForm(true)}
                className='bg-white text-ajira-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold w-full sm:w-auto'
              >
                Request a Mentor
              </button>
            ) : (
              <button
                onClick={() => setShowRequestForm(true)}
                className='bg-white text-ajira-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold w-full sm:w-auto'
              >
                Find a Mentor
              </button>
            )}
            <Link
              to='/mentorship/apply'
              className='border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold w-full sm:w-auto'
            >
              Become a Mentor
            </Link>
          </div>
        </div>
      </div>

      {/* Uber-like Request Form Modal */}
      {showRequestForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='sticky top-0 bg-white border-b border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Request Instant Mentoring
                </h2>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className='text-gray-400 hover:text-gray-600'
                >
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
              <p className='text-gray-600 mt-2'>
                Get matched with available mentors in minutes. Just like
                requesting an Uber!
              </p>
            </div>

            <form onSubmit={submitMentorRequest} className='p-6 space-y-6'>
              {/* Basic Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Your Name *
                  </label>
                  <input
                    type='text'
                    value={requestData.mentee.name}
                    onChange={(e) =>
                      handleRequestDataChange('name', e.target.value, 'mentee')
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                    placeholder='John Doe'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email *
                  </label>
                  <input
                    type='email'
                    value={requestData.mentee.email}
                    onChange={(e) =>
                      handleRequestDataChange('email', e.target.value, 'mentee')
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                    placeholder='john@example.com'
                    required
                  />
                </div>
              </div>

              {/* Request Details */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Category *
                  </label>
                  <select
                    value={requestData.category}
                    onChange={(e) =>
                      handleRequestDataChange('category', e.target.value)
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                    required
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Session Type *
                  </label>
                  <select
                    value={requestData.sessionType}
                    onChange={(e) =>
                      handleRequestDataChange('sessionType', e.target.value)
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                    required
                  >
                    <option value='Quick Question'>Quick Question</option>
                    <option value='Code Review'>Code Review</option>
                    <option value='Career Advice'>Career Advice</option>
                    <option value='Technical Help'>Technical Help</option>
                    <option value='Project Guidance'>Project Guidance</option>
                    <option value='General Mentorship'>
                      General Mentorship
                    </option>
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Urgency
                  </label>
                  <select
                    value={requestData.urgency}
                    onChange={(e) =>
                      handleRequestDataChange('urgency', e.target.value)
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                  >
                    <option value='Low'>Low (Within 24 hours)</option>
                    <option value='Medium'>Medium (Within 2 hours)</option>
                    <option value='High'>High (Within 30 minutes)</option>
                    <option value='Critical'>Critical (ASAP)</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Preferred Duration (minutes)
                  </label>
                  <input
                    type='number'
                    value={requestData.preferredDuration}
                    onChange={(e) =>
                      handleRequestDataChange(
                        'preferredDuration',
                        parseInt(e.target.value)
                      )
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                    min='15'
                    max='120'
                    step='15'
                  />
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Problem Description *
                </label>
                <textarea
                  value={requestData.problemDescription}
                  onChange={(e) =>
                    handleRequestDataChange(
                      'problemDescription',
                      e.target.value
                    )
                  }
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                  rows='4'
                  placeholder='Describe your problem or what you need help with...'
                  required
                />
              </div>

              {/* Location */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    City
                  </label>
                  <select
                    value={requestData.location.city}
                    onChange={(e) =>
                      handleRequestDataChange(
                        'city',
                        e.target.value,
                        'location'
                      )
                    }
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                  >
                    <option value='Nairobi'>Nairobi</option>
                    <option value='Mombasa'>Mombasa</option>
                    <option value='Kisumu'>Kisumu</option>
                    <option value='Nakuru'>Nakuru</option>
                    <option value='Other'>Other</option>
                  </select>
                </div>
                <div className='flex items-center space-x-4 pt-8'>
                  <label className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      checked={requestData.location.preferInPerson}
                      onChange={(e) =>
                        handleRequestDataChange(
                          'preferInPerson',
                          e.target.checked,
                          'location'
                        )
                      }
                      className='w-4 h-4 text-ajira-primary'
                    />
                    <span className='text-sm text-gray-700'>
                      Prefer in-person meeting
                    </span>
                  </label>
                </div>
              </div>

              {/* Budget (Optional) */}
              <div>
                <label className='flex items-center space-x-2 mb-3'>
                  <input
                    type='checkbox'
                    checked={requestData.budget.hasBudget}
                    onChange={(e) =>
                      handleRequestDataChange(
                        'hasBudget',
                        e.target.checked,
                        'budget'
                      )
                    }
                    className='w-4 h-4 text-ajira-primary'
                  />
                  <span className='text-sm font-medium text-gray-700'>
                    I have a budget for this session
                  </span>
                </label>

                {requestData.budget.hasBudget && (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Max Budget
                      </label>
                      <input
                        type='number'
                        value={requestData.budget.maxAmount}
                        onChange={(e) =>
                          handleRequestDataChange(
                            'maxAmount',
                            parseInt(e.target.value),
                            'budget'
                          )
                        }
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                        placeholder='5000'
                        min='0'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Currency
                      </label>
                      <select
                        value={requestData.budget.currency}
                        onChange={(e) =>
                          handleRequestDataChange(
                            'currency',
                            e.target.value,
                            'budget'
                          )
                        }
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                      >
                        <option value='KES'>KES</option>
                        <option value='USD'>USD</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className='flex justify-end space-x-4 pt-6 border-t border-gray-200'>
                <button
                  type='button'
                  onClick={() => setShowRequestForm(false)}
                  className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={requestSubmitting}
                  className='bg-ajira-primary text-white px-8 py-3 rounded-lg hover:bg-ajira-primary/90 transition-colors flex items-center space-x-2 disabled:opacity-50'
                >
                  {requestSubmitting ? (
                    <>
                      <Loader2 className='w-5 h-5 animate-spin' />
                      <span>Finding Mentors...</span>
                    </>
                  ) : (
                    <>
                      <Zap className='w-5 h-5' />
                      <span>Request Mentor</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Mentor Card Component
const MentorCard = ({ mentor, viewMode, onRequestMentor }) => {
  if (viewMode === 'list') {
    return (
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'>
        <div className='p-6'>
          <div className='flex items-start space-x-4'>
            <div className='w-16 h-16 bg-gradient-to-r from-ajira-primary to-ajira-secondary rounded-full flex items-center justify-center text-white text-lg font-bold'>
              {mentor.mentor.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            <div className='flex-1'>
              <div className='flex items-start justify-between mb-2'>
                <div>
                  <h3 className='text-lg font-bold text-gray-900'>
                    {mentor.title}
                  </h3>
                  <p className='text-gray-600'>{mentor.mentor.name}</p>
                </div>
                <div className='text-right'>
                  <div className='flex items-center space-x-1 mb-1'>
                    <Star className='w-4 h-4 text-yellow-500 fill-current' />
                    <span className='font-semibold'>
                      {mentor.ratings.overall}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500'>
                    ({mentor.ratings.totalRatings} reviews)
                  </p>
                </div>
              </div>

              <p className='text-gray-600 mb-4'>{mentor.mentor.bio}</p>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4'>
                <div className='flex items-center space-x-2'>
                  <Target className='w-4 h-4' />
                  <span>{mentor.category}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Award className='w-4 h-4' />
                  <span>{mentor.expertiseLevel}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <MapPin className='w-4 h-4' />
                  <span>{mentor.location.city}</span>
                </div>
                <div className='flex items-center space-x-2'>
                  <Clock className='w-4 h-4' />
                  <span>{mentor.availability.responseTime}</span>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='flex flex-wrap gap-1'>
                    {mentor.verification.isVerified && (
                      <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full'>
                        Verified
                      </span>
                    )}
                    {mentor.instantAvailability.enabled && (
                      <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1'>
                        <Zap className='w-3 h-3' />
                        <span>Instant</span>
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      mentor.availability.status === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {mentor.availability.status}
                  </span>
                </div>

                <div className='flex items-center space-x-4'>
                  <p className='text-lg font-bold text-ajira-primary'>
                    {mentor.pricing.isFree
                      ? 'Free'
                      : `${mentor.pricing.currency} ${mentor.pricing.sessionRate}`}
                  </p>
                  <div className='flex space-x-2'>
                    <Link
                      to={`/mentorship/${mentor.slug}`}
                      className='text-ajira-primary hover:text-ajira-primary/80 transition-colors'
                    >
                      <Eye className='w-5 h-5' />
                    </Link>
                    <button
                      onClick={onRequestMentor}
                      className='bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90 transition-colors text-sm'
                    >
                      Request Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'>
      <div className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='w-16 h-16 bg-gradient-to-r from-ajira-primary to-ajira-secondary rounded-full flex items-center justify-center text-white text-lg font-bold'>
            {mentor.mentor.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>

          <div className='text-right'>
            <div className='flex items-center space-x-1 mb-1'>
              <Star className='w-4 h-4 text-yellow-500 fill-current' />
              <span className='font-semibold'>{mentor.ratings.overall}</span>
            </div>
            <p className='text-xs text-gray-500'>
              ({mentor.ratings.totalRatings} reviews)
            </p>
          </div>
        </div>

        <h3 className='text-lg font-bold text-gray-900 mb-2'>{mentor.title}</h3>
        <p className='text-gray-600 mb-1'>{mentor.mentor.name}</p>
        <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
          {mentor.mentor.bio}
        </p>

        <div className='space-y-2 text-sm text-gray-600 mb-4'>
          <div className='flex items-center space-x-2'>
            <Target className='w-4 h-4' />
            <span>{mentor.category}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <Award className='w-4 h-4' />
            <span>{mentor.expertiseLevel}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <MapPin className='w-4 h-4' />
            <span>{mentor.location.city}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <Clock className='w-4 h-4' />
            <span>{mentor.availability.responseTime}</span>
          </div>
        </div>

        <div className='flex items-center justify-between mb-4'>
          <div className='flex flex-wrap gap-1'>
            {mentor.verification.isVerified && (
              <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full'>
                Verified
              </span>
            )}
            {mentor.instantAvailability.enabled && (
              <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center space-x-1'>
                <Zap className='w-3 h-3' />
                <span>Instant</span>
              </span>
            )}
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              mentor.availability.status === 'Available'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {mentor.availability.status}
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <p className='text-lg font-bold text-ajira-primary'>
            {mentor.pricing.isFree
              ? 'Free'
              : `${mentor.pricing.currency} ${mentor.pricing.sessionRate}`}
          </p>
          <div className='flex space-x-2'>
            <Link
              to={`/mentorship/${mentor.slug}`}
              className='text-ajira-primary hover:text-ajira-primary/80 transition-colors'
            >
              <Eye className='w-5 h-5' />
            </Link>
            <button
              onClick={onRequestMentor}
              className='bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90 transition-colors text-sm'
            >
              Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipPage;
