import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Star,
  DollarSign,
  Video,
  Users,
  Filter,
  Zap,
  MessageSquare,
  Phone,
  Mail,
  Award,
  CheckCircle,
  AlertCircle,
  Loader2,
  Send,
  Eye,
  Calendar,
  Globe,
  User,
  BookOpen,
  Code,
  Briefcase,
} from 'lucide-react';
import axios from 'axios';
import LoadingState from '../../components/common/LoadingState';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MentorshipPage = () => {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [expertiseLevels, setExpertiseLevels] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);

  // Uber-like request form data
  const [requestData, setRequestData] = useState({
    mentee: {
      name: '',
      email: '',
      phone: '',
      bio: '',
      currentRole: '',
      experience: '',
      goals: [],
    },
    requestType: 'Instant',
    urgency: 'Medium',
    sessionType: 'Quick Question',
    category: 'Web Development',
    specificSkills: [],
    problemDescription: '',
    detailedContext: '',
    preferredDuration: 30,
    schedulingPreference: 'ASAP',
    communicationMethod: 'Video Call',
    budget: {
      hasBudget: false,
      maxAmount: 0,
      currency: 'KES',
      willingToPayPremium: false,
    },
    location: {
      city: '',
      country: 'Kenya',
      preferInPerson: false,
      maxDistance: 50,
    },
    preferredExpertiseLevel: 'Any',
  });

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASEURL}/mentorship`);
        const mentorData = response.data.mentors || [];
        setMentors(mentorData);
        setFilteredMentors(mentorData);

        // Extract unique categories and expertise levels
        const uniqueCategories = [
          ...new Set(mentorData.map((m) => m.category)),
        ];
        const uniqueExpertise = [
          ...new Set(mentorData.map((m) => m.expertiseLevel)),
        ];
        setCategories(uniqueCategories);
        setExpertiseLevels(uniqueExpertise);
      } catch (err) {
        console.error('Error fetching mentors:', err);
        setError('Failed to load mentors');
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  useEffect(() => {
    let filtered = mentors;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (mentor) => mentor.category === selectedCategory
      );
    }

    // Filter by expertise
    if (selectedExpertise !== 'all') {
      filtered = filtered.filter(
        (mentor) => mentor.expertiseLevel === selectedExpertise
      );
    }

    // Filter by free only
    if (showFreeOnly) {
      filtered = filtered.filter((mentor) => mentor.pricing.isFree);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (mentor) =>
          mentor.mentor.name.toLowerCase().includes(query) ||
          mentor.description.toLowerCase().includes(query) ||
          mentor.skills.some((skill) => skill.toLowerCase().includes(query)) ||
          mentor.specializations.some((spec) =>
            spec.toLowerCase().includes(query)
          )
      );
    }

    setFilteredMentors(filtered);
  }, [selectedCategory, selectedExpertise, showFreeOnly, searchQuery, mentors]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Web Development':
        return <Code className='w-5 h-5' />;
      case 'Mobile Development':
        return <Phone className='w-5 h-5' />;
      case 'Data Science':
        return <BookOpen className='w-5 h-5' />;
      case 'UI/UX Design':
        return <Award className='w-5 h-5' />;
      case 'Digital Marketing':
        return <Globe className='w-5 h-5' />;
      case 'Project Management':
        return <Briefcase className='w-5 h-5' />;
      case 'Career Development':
        return <User className='w-5 h-5' />;
      default:
        return <BookOpen className='w-5 h-5' />;
    }
  };

  const getExpertiseColor = (level) => {
    switch (level) {
      case 'Junior':
        return 'bg-green-100 text-green-800';
      case 'Mid-Level':
        return 'bg-blue-100 text-blue-800';
      case 'Senior':
        return 'bg-purple-100 text-purple-800';
      case 'Expert':
        return 'bg-yellow-100 text-yellow-800';
      case 'Thought Leader':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'Available':
        return 'text-green-600 bg-green-100';
      case 'Busy':
        return 'text-yellow-600 bg-yellow-100';
      case 'Away':
        return 'text-gray-600 bg-gray-100';
      case 'Do Not Disturb':
        return 'text-red-600 bg-red-100';
      case 'Offline':
        return 'text-gray-600 bg-gray-200';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatPrice = (mentor) => {
    if (mentor.pricing.isFree) return 'Free';
    if (mentor.pricing.sessionRate > 0)
      return `KES ${mentor.pricing.sessionRate.toLocaleString()}/session`;
    if (mentor.pricing.hourlyRate > 0)
      return `KES ${mentor.pricing.hourlyRate.toLocaleString()}/hour`;
    if (mentor.pricing.monthlyRate > 0)
      return `KES ${mentor.pricing.monthlyRate.toLocaleString()}/month`;
    return 'Contact for pricing';
  };

  const handleRequestChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setRequestData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]:
            type === 'number'
              ? parseFloat(value) || 0
              : type === 'checkbox'
                ? checked
                : value,
        },
      }));
    } else {
      setRequestData((prev) => ({
        ...prev,
        [name]:
          type === 'checkbox'
            ? checked
            : type === 'number'
              ? parseFloat(value) || 0
              : value,
      }));
    }
  };

  const handleArrayChange = (value, fieldName, parent = null) => {
    const array = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    if (parent) {
      setRequestData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [fieldName]: array,
        },
      }));
    } else {
      setRequestData((prev) => ({
        ...prev,
        [fieldName]: array,
      }));
    }
  };

  const submitMentorRequest = async (e) => {
    e.preventDefault();
    setRequestSubmitting(true);

    try {
      const response = await axios.post(
        `${BASEURL}/mentorship/request`,
        requestData
      );

      setRequestStatus({
        type: 'success',
        message: response.data.message,
        data: response.data.request,
      });

      // Reset form
      setShowRequestForm(false);
      setRequestData({
        ...requestData,
        problemDescription: '',
        detailedContext: '',
        mentee: {
          ...requestData.mentee,
          name: '',
          email: '',
          phone: '',
        },
      });
    } catch (error) {
      console.error('Error submitting request:', error);
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
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='container-custom'>
        {/* Hero Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-ajira-primary mb-4'>
            Find Your Perfect Mentor
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto mb-8'>
            Connect with expert mentors in real-time for instant help, career
            guidance, and skill development. Get matched with the right mentor
            in minutes, just like requesting a ride!
          </p>

          {/* Uber-like Request Button */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button
              onClick={() => setShowRequestForm(true)}
              className='bg-ajira-primary text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-ajira-primary/90 transition-colors shadow-lg'
            >
              <Zap className='w-6 h-6' />
              <span>Request Mentor Now</span>
            </button>
            <button className='bg-white text-ajira-primary border-2 border-ajira-primary px-8 py-4 rounded-lg font-semibold hover:bg-ajira-primary/5 transition-colors'>
              Browse All Mentors
            </button>
          </div>
        </div>

        {/* Request Status */}
        {requestStatus && (
          <div
            className={`mb-8 p-6 rounded-lg ${
              requestStatus.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className='flex items-start'>
              {requestStatus.type === 'success' ? (
                <CheckCircle className='w-6 h-6 text-green-600 mr-3 mt-1' />
              ) : (
                <AlertCircle className='w-6 h-6 text-red-600 mr-3 mt-1' />
              )}
              <div>
                <h3
                  className={`font-semibold ${
                    requestStatus.type === 'success'
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}
                >
                  {requestStatus.type === 'success'
                    ? '🚀 Request Submitted!'
                    : '❌ Request Failed'}
                </h3>
                <p
                  className={`mt-2 ${
                    requestStatus.type === 'success'
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}
                >
                  {requestStatus.message}
                </p>
                {requestStatus.data && (
                  <div className='mt-4 p-4 bg-white rounded-lg'>
                    <p className='text-sm text-gray-600'>
                      <strong>Request ID:</strong>{' '}
                      {requestStatus.data.requestId}
                      <br />
                      <strong>Mentors Notified:</strong>{' '}
                      {requestStatus.data.mentorsNotified}
                      <br />
                      <strong>Estimated Response:</strong>{' '}
                      {requestStatus.data.estimatedResponseTime}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Uber-like Request Form Modal */}
        {showRequestForm && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Request a Mentor
                </h2>
                <button
                  onClick={() => setShowRequestForm(false)}
                  className='text-gray-500 hover:text-gray-700'
                >
                  ✕
                </button>
              </div>

              <form onSubmit={submitMentorRequest} className='space-y-6'>
                {/* Basic Info */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Your Name *
                    </label>
                    <input
                      type='text'
                      name='mentee.name'
                      value={requestData.mentee.name}
                      onChange={handleRequestChange}
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Email *
                    </label>
                    <input
                      type='email'
                      name='mentee.email'
                      value={requestData.mentee.email}
                      onChange={handleRequestChange}
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                    />
                  </div>
                </div>

                {/* Help Details */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Category *
                    </label>
                    <select
                      name='category'
                      value={requestData.category}
                      onChange={handleRequestChange}
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Session Type *
                    </label>
                    <select
                      name='sessionType'
                      value={requestData.sessionType}
                      onChange={handleRequestChange}
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
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
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Urgency *
                    </label>
                    <select
                      name='urgency'
                      value={requestData.urgency}
                      onChange={handleRequestChange}
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                    >
                      <option value='Low'>Low</option>
                      <option value='Medium'>Medium</option>
                      <option value='High'>High</option>
                      <option value='Critical'>Critical</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    What do you need help with? *
                  </label>
                  <textarea
                    name='problemDescription'
                    value={requestData.problemDescription}
                    onChange={handleRequestChange}
                    required
                    rows={4}
                    placeholder='Describe your problem or what you need help with...'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Duration (minutes)
                    </label>
                    <select
                      name='preferredDuration'
                      value={requestData.preferredDuration}
                      onChange={handleRequestChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      When do you need help?
                    </label>
                    <select
                      name='schedulingPreference'
                      value={requestData.schedulingPreference}
                      onChange={handleRequestChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                    >
                      <option value='ASAP'>ASAP</option>
                      <option value='Within 1 hour'>Within 1 hour</option>
                      <option value='Within 4 hours'>Within 4 hours</option>
                      <option value='Within 24 hours'>Within 24 hours</option>
                      <option value='Schedule Later'>Schedule Later</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Communication Method
                    </label>
                    <select
                      name='communicationMethod'
                      value={requestData.communicationMethod}
                      onChange={handleRequestChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                    >
                      <option value='Video Call'>Video Call</option>
                      <option value='Voice Call'>Voice Call</option>
                      <option value='Chat'>Chat</option>
                      <option value='Screen Share'>Screen Share</option>
                      <option value='Email'>Email</option>
                    </select>
                  </div>
                </div>

                {/* Budget */}
                <div className='flex items-center space-x-4'>
                  <label className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      name='budget.hasBudget'
                      checked={requestData.budget.hasBudget}
                      onChange={handleRequestChange}
                      className='w-5 h-5 text-ajira-primary'
                    />
                    <span className='text-sm font-medium text-gray-700'>
                      I have a budget
                    </span>
                  </label>

                  {requestData.budget.hasBudget && (
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm text-gray-600'>Max:</span>
                      <input
                        type='number'
                        name='budget.maxAmount'
                        value={requestData.budget.maxAmount}
                        onChange={handleRequestChange}
                        placeholder='0'
                        className='w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                      />
                      <span className='text-sm text-gray-600'>KES</span>
                    </div>
                  )}
                </div>

                <div className='flex justify-end space-x-4'>
                  <button
                    type='button'
                    onClick={() => setShowRequestForm(false)}
                    className='px-6 py-3 text-gray-700 hover:text-gray-900'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    disabled={requestSubmitting}
                    className='px-8 py-3 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 disabled:opacity-50 flex items-center space-x-2'
                  >
                    {requestSubmitting ? (
                      <>
                        <Loader2 className='w-5 h-5 animate-spin' />
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <Send className='w-5 h-5' />
                        <span>Send Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <div className='flex flex-wrap gap-4 items-center'>
            {/* Search */}
            <div className='relative flex-1 min-w-64'>
              <input
                type='text'
                placeholder='Search mentors...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
              />
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
            >
              <option value='all'>All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Expertise Filter */}
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
            >
              <option value='all'>All Expertise</option>
              {expertiseLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            {/* Free Only Filter */}
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
          </div>

          <div className='mt-4 flex items-center justify-between text-sm text-gray-600'>
            <span>
              {filteredMentors.length} mentor
              {filteredMentors.length !== 1 ? 's' : ''} available
            </span>
            <span>
              Showing{' '}
              {selectedCategory !== 'all' ? selectedCategory : 'all categories'}
            </span>
          </div>
        </div>

        {/* Mentors Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {filteredMentors.map((mentor) => (
            <div
              key={mentor._id}
              className='bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden'
            >
              {/* Mentor Card Header */}
              <div className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-12 h-12 bg-ajira-primary/10 rounded-full flex items-center justify-center text-ajira-primary'>
                      {getCategoryIcon(mentor.category)}
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-gray-900 line-clamp-1'>
                        {mentor.mentor.name}
                      </h3>
                      <p className='text-sm text-gray-600'>
                        {mentor.mentor.title}
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-col items-end space-y-1'>
                    {mentor.isFeatured && (
                      <Star className='w-5 h-5 text-yellow-500 fill-current' />
                    )}
                    {mentor.verification.isVerified && (
                      <CheckCircle className='w-4 h-4 text-blue-500' />
                    )}
                  </div>
                </div>

                <p className='text-gray-600 mb-4 line-clamp-3'>
                  {mentor.description}
                </p>

                {/* Mentor Details */}
                <div className='space-y-3 mb-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>Expertise:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getExpertiseColor(mentor.expertiseLevel)}`}
                    >
                      {mentor.expertiseLevel}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(mentor.availability.status)}`}
                    >
                      {mentor.availability.status}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>
                      Response time:
                    </span>
                    <span className='text-sm font-medium text-gray-900'>
                      {mentor.availability.responseTime}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>Sessions:</span>
                    <span className='text-sm font-medium text-gray-900'>
                      {mentor.statistics.totalSessions}
                    </span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>Mentees:</span>
                    <span className='text-sm font-medium text-gray-900'>
                      {mentor.availability.currentMentees}/
                      {mentor.availability.maxMentees}
                    </span>
                  </div>

                  {mentor.ratings.totalRatings > 0 && (
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-500'>Rating:</span>
                      <div className='flex items-center space-x-1'>
                        <Star className='w-4 h-4 text-yellow-500 fill-current' />
                        <span className='text-sm font-medium text-gray-900'>
                          {mentor.ratings.overall} (
                          {mentor.ratings.totalRatings})
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Skills */}
                {mentor.skills && mentor.skills.length > 0 && (
                  <div className='mb-4'>
                    <p className='text-xs text-gray-500 mb-2'>Skills:</p>
                    <div className='flex flex-wrap gap-1'>
                      {mentor.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded'
                        >
                          {skill}
                        </span>
                      ))}
                      {mentor.skills.length > 3 && (
                        <span className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded'>
                          +{mentor.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Price and CTA */}
                <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                  <div className='text-lg font-bold text-ajira-primary'>
                    {formatPrice(mentor)}
                  </div>
                  <div className='flex space-x-2'>
                    <button className='px-3 py-2 text-sm border border-ajira-primary text-ajira-primary rounded-lg hover:bg-ajira-primary/5 transition-colors'>
                      <Eye className='w-4 h-4' />
                    </button>
                    <button
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                        mentor.availability.status === 'Available'
                          ? 'bg-ajira-primary text-white hover:bg-ajira-primary/90'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={mentor.availability.status !== 'Available'}
                      onClick={() => {
                        setRequestData((prev) => ({
                          ...prev,
                          category: mentor.category,
                          preferredExpertiseLevel: mentor.expertiseLevel,
                        }));
                        setShowRequestForm(true);
                      }}
                    >
                      {mentor.availability.status === 'Available'
                        ? 'Request Help'
                        : mentor.availability.status}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredMentors.length === 0 && (
          <div className='text-center py-12'>
            <Users className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              No mentors found
            </h3>
            <p className='text-gray-600 mb-4'>
              {searchQuery
                ? 'Try adjusting your search terms or filters.'
                : 'No mentors match your current filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedExpertise('all');
                setShowFreeOnly(false);
              }}
              className='bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary/90'
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        {filteredMentors.length > 0 && (
          <div className='bg-gradient-to-r from-ajira-primary to-ajira-secondary rounded-lg p-8 text-center'>
            <h2 className='text-2xl font-bold text-white mb-4'>
              Need help right now?
            </h2>
            <p className='text-white/90 mb-6 max-w-2xl mx-auto'>
              Get matched with an available mentor instantly. Our Uber-like
              system connects you with the perfect mentor based on your needs,
              location, and budget in minutes.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button
                onClick={() => setShowRequestForm(true)}
                className='bg-white text-ajira-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors'
              >
                🚀 Request Instant Help
              </button>
              <button className='bg-ajira-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-ajira-accent/90 transition-colors'>
                Browse All Mentors
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipPage;
