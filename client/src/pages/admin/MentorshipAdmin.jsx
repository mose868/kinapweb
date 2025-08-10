import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Star,
  Users,
  Clock,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Award,
  Globe,
  MessageSquare,
  Zap,
  UserCheck,
  UserX,
  Activity,
} from 'lucide-react';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MentorshipAdmin = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingMentor, setEditingMentor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [activeTab, setActiveTab] = useState('mentors'); // 'mentors', 'requests', 'analytics'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Web Development',
    expertiseLevel: 'Senior',
    mentorshipType: 'One-on-One',
    sessionFormat: 'Video Call',
    mentor: {
      name: '',
      email: '',
      phone: '',
      bio: '',
      title: '',
      company: '',
      experience: '',
      linkedinProfile: '',
      githubProfile: '',
      timezone: 'Africa/Nairobi',
    },
    availability: {
      isAvailable: true,
      status: 'Available',
      responseTime: 'Within 24 hours',
      weeklyHours: 5,
      maxMentees: 5,
    },
    pricing: {
      isFree: false,
      sessionRate: 0,
      hourlyRate: 0,
      currency: 'KES',
    },
    skills: [],
    specializations: [],
    mentorshipFocus: [],
    targetAudience: [],
    instantAvailability: {
      enabled: true,
      maxInstantRequests: 3,
    },
    location: {
      city: '',
      country: 'Kenya',
      isLocationEnabled: false,
    },
    verification: {
      isVerified: false,
      badgeLevel: 'Bronze',
    },
    settings: {
      instantNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
      publicProfile: true,
      searchable: true,
    },
    status: 'Pending Approval',
    isFeatured: false,
  });

  // Fetch mentors for admin
  const { data: mentorsData, isLoading } = useQuery(
    ['adminMentors', selectedCategory, selectedExpertise, selectedStatus],
    async () => {
      let url = `${BASEURL}/mentorship/admin?limit=100`;

      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }

      if (selectedExpertise !== 'all') {
        url += `&expertiseLevel=${selectedExpertise}`;
      }

      if (selectedStatus !== 'all') {
        url += `&status=${selectedStatus}`;
      }

      const response = await axios.get(url);
      return response.data;
    }
  );

  // Fetch mentorship statistics
  const { data: mentorshipStats } = useQuery('mentorshipStats', async () => {
    const response = await axios.get(
      `${BASEURL}/mentorship/admin/stats/overview`
    );
    return response.data;
  });

  // Fetch mentorship requests
  const { data: requestsData } = useQuery(
    'mentorshipRequests',
    async () => {
      const response = await axios.get(`${BASEURL}/mentorship/admin/requests`);
      return response.data;
    },
    { enabled: activeTab === 'requests' }
  );

  // Create/Update mentor mutation
  const saveMentorMutation = useMutation(
    async (data) => {
      if (editingMentor) {
        const response = await axios.put(
          `${BASEURL}/mentorship/admin/${editingMentor._id}`,
          {
            ...data,
            lastUpdatedBy: 'admin@ajirakinap.com',
          }
        );
        return response.data;
      } else {
        const response = await axios.post(`${BASEURL}/mentorship/admin`, {
          ...data,
          lastUpdatedBy: 'admin@ajirakinap.com',
        });
        return response.data;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminMentors');
        queryClient.invalidateQueries('mentorshipStats');
        setMessage(
          editingMentor
            ? 'Mentor updated successfully!'
            : 'Mentor created successfully!'
        );
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
        resetForm();
      },
      onError: (error) => {
        setMessage(error.response?.data?.message || 'Failed to save mentor');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      },
    }
  );

  // Delete mentor mutation
  const deleteMentorMutation = useMutation(
    async (id) => {
      const response = await axios.delete(`${BASEURL}/mentorship/admin/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminMentors');
        queryClient.invalidateQueries('mentorshipStats');
        setMessage('Mentor deleted successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      },
      onError: (error) => {
        setMessage(error.response?.data?.message || 'Failed to delete mentor');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      },
    }
  );

  // Toggle status mutation
  const toggleStatusMutation = useMutation(
    async ({ id, status }) => {
      const response = await axios.patch(
        `${BASEURL}/mentorship/admin/${id}/status`,
        { status }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminMentors');
        queryClient.invalidateQueries('mentorshipStats');
      },
    }
  );

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation(
    async (id) => {
      const response = await axios.patch(
        `${BASEURL}/mentorship/admin/${id}/feature`
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminMentors');
        queryClient.invalidateQueries('mentorshipStats');
      },
    }
  );

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      category: 'Web Development',
      expertiseLevel: 'Senior',
      mentorshipType: 'One-on-One',
      sessionFormat: 'Video Call',
      mentor: {
        name: '',
        email: '',
        phone: '',
        bio: '',
        title: '',
        company: '',
        experience: '',
        linkedinProfile: '',
        githubProfile: '',
        timezone: 'Africa/Nairobi',
      },
      availability: {
        isAvailable: true,
        status: 'Available',
        responseTime: 'Within 24 hours',
        weeklyHours: 5,
        maxMentees: 5,
      },
      pricing: {
        isFree: false,
        sessionRate: 0,
        hourlyRate: 0,
        currency: 'KES',
      },
      skills: [],
      specializations: [],
      mentorshipFocus: [],
      targetAudience: [],
      instantAvailability: {
        enabled: true,
        maxInstantRequests: 3,
      },
      location: {
        city: '',
        country: 'Kenya',
        isLocationEnabled: false,
      },
      verification: {
        isVerified: false,
        badgeLevel: 'Bronze',
      },
      settings: {
        instantNotifications: true,
        emailNotifications: true,
        smsNotifications: false,
        publicProfile: true,
        searchable: true,
      },
      status: 'Pending Approval',
      isFeatured: false,
    });
    setEditingMentor(null);
    setShowForm(false);
  };

  const handleEdit = (mentor) => {
    setFormData({
      ...mentor,
      skills: mentor.skills || [],
      specializations: mentor.specializations || [],
      mentorshipFocus: mentor.mentorshipFocus || [],
      targetAudience: mentor.targetAudience || [],
    });
    setEditingMentor(mentor);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
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
      setFormData((prev) => ({
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

  const handleArrayChange = (value, fieldName) => {
    const array = value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: array,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMentorMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      deleteMentorMutation.mutate(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'text-green-600 bg-green-100';
      case 'Inactive':
        return 'text-gray-600 bg-gray-100';
      case 'Suspended':
        return 'text-red-600 bg-red-100';
      case 'Under Review':
        return 'text-yellow-600 bg-yellow-100';
      case 'Pending Approval':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getExpertiseColor = (level) => {
    switch (level) {
      case 'Junior':
        return 'text-green-600 bg-green-100';
      case 'Mid-Level':
        return 'text-blue-600 bg-blue-100';
      case 'Senior':
        return 'text-purple-600 bg-purple-100';
      case 'Expert':
        return 'text-yellow-600 bg-yellow-100';
      case 'Thought Leader':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Bronze':
        return 'text-yellow-700 bg-yellow-100';
      case 'Silver':
        return 'text-gray-700 bg-gray-100';
      case 'Gold':
        return 'text-yellow-600 bg-yellow-200';
      case 'Platinum':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical':
        return 'text-red-600 bg-red-100';
      case 'High':
        return 'text-orange-600 bg-orange-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Filter mentors based on search query
  const filteredMentors =
    mentorsData?.mentors?.filter((mentor) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        mentor.mentor.name.toLowerCase().includes(query) ||
        mentor.mentor.email.toLowerCase().includes(query) ||
        mentor.description.toLowerCase().includes(query) ||
        mentor.skills.some((skill) => skill.toLowerCase().includes(query))
      );
    }) || [];

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='w-8 h-8 animate-spin text-ajira-primary' />
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto p-6'>
      <div className='bg-white rounded-lg shadow-lg p-8'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-bold text-ajira-primary'>
            Mentorship Management
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className='flex items-center space-x-2 bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90'
          >
            <Plus className='w-5 h-5' />
            <span>Add Mentor</span>
          </button>
        </div>

        {/* Success/Error Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center ${
              messageType === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {messageType === 'success' ? (
              <CheckCircle className='w-5 h-5 mr-2' />
            ) : (
              <AlertCircle className='w-5 h-5 mr-2' />
            )}
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className='flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg'>
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'mentors'
                ? 'bg-white text-ajira-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className='w-4 h-4 inline mr-2' />
            Mentors
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'requests'
                ? 'bg-white text-ajira-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className='w-4 h-4 inline mr-2' />
            Requests
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white text-ajira-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className='w-4 h-4 inline mr-2' />
            Analytics
          </button>
        </div>

        {/* Mentorship Statistics */}
        {mentorshipStats && (
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <div className='bg-ajira-primary/10 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <Users className='w-8 h-8 text-ajira-primary' />
                <div>
                  <p className='text-sm text-gray-600'>Total Mentors</p>
                  <p className='text-2xl font-bold text-ajira-primary'>
                    {mentorshipStats.mentorStats?.totalMentors || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-green-100 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <UserCheck className='w-8 h-8 text-green-600' />
                <div>
                  <p className='text-sm text-gray-600'>Active Mentors</p>
                  <p className='text-2xl font-bold text-green-600'>
                    {mentorshipStats.mentorStats?.activeMentors || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-purple-100 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <Activity className='w-8 h-8 text-purple-600' />
                <div>
                  <p className='text-sm text-gray-600'>Available Now</p>
                  <p className='text-2xl font-bold text-purple-600'>
                    {mentorshipStats.mentorStats?.availableMentors || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-blue-100 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <MessageSquare className='w-8 h-8 text-blue-600' />
                <div>
                  <p className='text-sm text-gray-600'>Active Requests</p>
                  <p className='text-2xl font-bold text-blue-600'>
                    {mentorshipStats.requestStats?.activeRequests || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mentors Tab */}
        {activeTab === 'mentors' && (
          <>
            {/* Filters and Search */}
            <div className='flex flex-wrap gap-4 mb-6'>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
              >
                <option value='all'>All Categories</option>
                <option value='Web Development'>Web Development</option>
                <option value='Mobile Development'>Mobile Development</option>
                <option value='Data Science'>Data Science</option>
                <option value='UI/UX Design'>UI/UX Design</option>
                <option value='Digital Marketing'>Digital Marketing</option>
                <option value='Cybersecurity'>Cybersecurity</option>
                <option value='Project Management'>Project Management</option>
                <option value='Entrepreneurship'>Entrepreneurship</option>
                <option value='Career Development'>Career Development</option>
                <option value='Other'>Other</option>
              </select>

              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
              >
                <option value='all'>All Expertise Levels</option>
                <option value='Junior'>Junior</option>
                <option value='Mid-Level'>Mid-Level</option>
                <option value='Senior'>Senior</option>
                <option value='Expert'>Expert</option>
                <option value='Thought Leader'>Thought Leader</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
              >
                <option value='all'>All Status</option>
                <option value='Active'>Active</option>
                <option value='Inactive'>Inactive</option>
                <option value='Suspended'>Suspended</option>
                <option value='Under Review'>Under Review</option>
                <option value='Pending Approval'>Pending Approval</option>
              </select>

              <div className='relative flex-1 max-w-md'>
                <input
                  type='text'
                  placeholder='Search mentors...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                />
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              </div>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
              <div className='mb-8 p-6 bg-gray-50 rounded-lg'>
                <h2 className='text-xl font-bold text-gray-900 mb-6'>
                  {editingMentor ? 'Edit Mentor' : 'Add New Mentor'}
                </h2>

                <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* Basic Information */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Program Title *
                      </label>
                      <input
                        type='text'
                        name='title'
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder='e.g., Senior React Developer Mentorship'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Category *
                      </label>
                      <select
                        name='category'
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      >
                        <option value='Web Development'>Web Development</option>
                        <option value='Mobile Development'>
                          Mobile Development
                        </option>
                        <option value='Data Science'>Data Science</option>
                        <option value='UI/UX Design'>UI/UX Design</option>
                        <option value='Digital Marketing'>
                          Digital Marketing
                        </option>
                        <option value='Cybersecurity'>Cybersecurity</option>
                        <option value='Project Management'>
                          Project Management
                        </option>
                        <option value='Entrepreneurship'>
                          Entrepreneurship
                        </option>
                        <option value='Career Development'>
                          Career Development
                        </option>
                        <option value='Other'>Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Mentor Personal Information */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Mentor Name *
                      </label>
                      <input
                        type='text'
                        name='mentor.name'
                        value={formData.mentor.name}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Mentor Email *
                      </label>
                      <input
                        type='email'
                        name='mentor.email'
                        value={formData.mentor.email}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Description *
                    </label>
                    <textarea
                      name='description'
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder='Describe what this mentor offers and their expertise...'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                    />
                  </div>

                  {/* Expertise and Pricing */}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Expertise Level *
                      </label>
                      <select
                        name='expertiseLevel'
                        value={formData.expertiseLevel}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      >
                        <option value='Junior'>Junior</option>
                        <option value='Mid-Level'>Mid-Level</option>
                        <option value='Senior'>Senior</option>
                        <option value='Expert'>Expert</option>
                        <option value='Thought Leader'>Thought Leader</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Session Rate (KES)
                      </label>
                      <input
                        type='number'
                        name='pricing.sessionRate'
                        value={formData.pricing.sessionRate}
                        onChange={handleChange}
                        min='0'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                    <div className='flex items-center space-x-2 pt-8'>
                      <input
                        type='checkbox'
                        name='pricing.isFree'
                        checked={formData.pricing.isFree}
                        onChange={handleChange}
                        className='w-5 h-5 text-ajira-primary'
                      />
                      <label className='text-sm font-medium text-gray-700'>
                        Free Mentorship
                      </label>
                    </div>
                  </div>

                  {/* Skills and Arrays */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Skills (comma-separated)
                      </label>
                      <textarea
                        value={formData.skills.join(', ')}
                        onChange={(e) =>
                          handleArrayChange(e.target.value, 'skills')
                        }
                        rows={3}
                        placeholder='React, Node.js, JavaScript, etc.'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Specializations (comma-separated)
                      </label>
                      <textarea
                        value={formData.specializations.join(', ')}
                        onChange={(e) =>
                          handleArrayChange(e.target.value, 'specializations')
                        }
                        rows={3}
                        placeholder='Frontend Architecture, API Design, etc.'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                  </div>

                  {/* Status and Features */}
                  <div className='flex items-center space-x-6'>
                    <label className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        name='isFeatured'
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className='w-5 h-5 text-ajira-primary'
                      />
                      <span className='text-sm font-medium text-gray-700'>
                        Featured Mentor
                      </span>
                    </label>

                    <label className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        name='availability.isAvailable'
                        checked={formData.availability.isAvailable}
                        onChange={handleChange}
                        className='w-5 h-5 text-ajira-primary'
                      />
                      <span className='text-sm font-medium text-gray-700'>
                        Available
                      </span>
                    </label>

                    <label className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        name='instantAvailability.enabled'
                        checked={formData.instantAvailability.enabled}
                        onChange={handleChange}
                        className='w-5 h-5 text-ajira-primary'
                      />
                      <span className='text-sm font-medium text-gray-700'>
                        Instant Requests
                      </span>
                    </label>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Status
                      </label>
                      <select
                        name='status'
                        value={formData.status}
                        onChange={handleChange}
                        className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                      >
                        <option value='Active'>Active</option>
                        <option value='Inactive'>Inactive</option>
                        <option value='Suspended'>Suspended</option>
                        <option value='Under Review'>Under Review</option>
                        <option value='Pending Approval'>
                          Pending Approval
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className='flex justify-end space-x-4'>
                    <button
                      type='button'
                      onClick={resetForm}
                      className='px-6 py-3 text-gray-700 hover:text-gray-900'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      disabled={saveMentorMutation.isLoading}
                      className='px-8 py-3 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 disabled:opacity-50 flex items-center space-x-2'
                    >
                      {saveMentorMutation.isLoading ? (
                        <>
                          <Loader2 className='w-5 h-5 animate-spin' />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className='w-5 h-5' />
                          <span>
                            {editingMentor ? 'Update' : 'Create'} Mentor
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Mentors List */}
            <div className='space-y-4'>
              {filteredMentors.map((mentor) => (
                <div
                  key={mentor._id}
                  className='bg-white border border-gray-200 rounded-lg p-6'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-3 mb-2'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {mentor.mentor.name}
                        </h3>
                        {mentor.isFeatured && (
                          <Star className='w-5 h-5 text-yellow-500 fill-current' />
                        )}
                        {mentor.verification.isVerified && (
                          <Award className='w-5 h-5 text-blue-500' />
                        )}
                      </div>

                      <p className='text-gray-600 mb-3 line-clamp-2'>
                        {mentor.description}
                      </p>

                      <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3'>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(mentor.status)}`}
                        >
                          {mentor.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getExpertiseColor(mentor.expertiseLevel)}`}
                        >
                          {mentor.expertiseLevel}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(mentor.verification.badgeLevel)}`}
                        >
                          {mentor.verification.badgeLevel}
                        </span>
                        <span className='bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs'>
                          {mentor.category}
                        </span>
                        <span className='flex items-center space-x-1'>
                          <Clock className='w-4 h-4' />
                          <span>{mentor.availability.responseTime}</span>
                        </span>
                        <span className='flex items-center space-x-1'>
                          <Users className='w-4 h-4' />
                          <span>
                            {mentor.availability.currentMentees}/
                            {mentor.availability.maxMentees}
                          </span>
                        </span>
                        <span className='flex items-center space-x-1'>
                          <DollarSign className='w-4 h-4' />
                          <span>
                            {mentor.pricing.isFree
                              ? 'Free'
                              : `KES ${mentor.pricing.sessionRate}/session`}
                          </span>
                        </span>
                      </div>

                      <div className='flex items-center space-x-4 text-sm text-gray-500'>
                        <span className='flex items-center space-x-1'>
                          <Mail className='w-4 h-4' />
                          <span>{mentor.mentor.email}</span>
                        </span>
                        <span>Sessions: {mentor.statistics.totalSessions}</span>
                        <span>Views: {mentor.statistics.profileViews}</span>
                        {mentor.ratings.totalRatings > 0 && (
                          <span className='flex items-center space-x-1'>
                            <Star className='w-4 h-4 text-yellow-500 fill-current' />
                            <span>
                              {mentor.ratings.overall} (
                              {mentor.ratings.totalRatings})
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center space-x-2 ml-4'>
                      <button
                        onClick={() => handleEdit(mentor)}
                        className='text-ajira-primary hover:text-ajira-primary/80'
                        title='Edit'
                      >
                        <Edit2 className='w-4 h-4' />
                      </button>

                      <select
                        value={mentor.status}
                        onChange={(e) =>
                          toggleStatusMutation.mutate({
                            id: mentor._id,
                            status: e.target.value,
                          })
                        }
                        className='text-sm px-2 py-1 border border-gray-300 rounded'
                      >
                        <option value='Active'>Active</option>
                        <option value='Inactive'>Inactive</option>
                        <option value='Suspended'>Suspended</option>
                        <option value='Under Review'>Under Review</option>
                        <option value='Pending Approval'>
                          Pending Approval
                        </option>
                      </select>

                      <button
                        onClick={() =>
                          toggleFeaturedMutation.mutate(mentor._id)
                        }
                        className={`${mentor.isFeatured ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                        title='Toggle Featured'
                      >
                        <Star
                          className={`w-4 h-4 ${mentor.isFeatured ? 'fill-current' : ''}`}
                        />
                      </button>

                      <button
                        onClick={() => handleDelete(mentor._id)}
                        className='text-red-600 hover:text-red-800'
                        title='Delete'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && requestsData && (
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Recent Mentorship Requests
            </h2>

            {requestsData.requests.map((request) => (
              <div
                key={request._id}
                className='bg-white border border-gray-200 rounded-lg p-6'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-3 mb-2'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        {request.mentee.name} - {request.sessionType}
                      </h3>
                      <span className='text-gray-500 text-sm'>
                        #{request.requestId}
                      </span>
                    </div>

                    <p className='text-gray-600 mb-3'>
                      {request.problemDescription}
                    </p>

                    <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}
                      >
                        {request.urgency} Priority
                      </span>
                      <span className='bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs'>
                        {request.category}
                      </span>
                      <span className='flex items-center space-x-1'>
                        <Clock className='w-4 h-4' />
                        <span>{request.timeElapsed}</span>
                      </span>
                      <span className='flex items-center space-x-1'>
                        <Users className='w-4 h-4' />
                        <span>{request.preferredDuration} min session</span>
                      </span>
                    </div>

                    <div className='flex items-center space-x-4 text-sm text-gray-500'>
                      <span>Status: {request.status}</span>
                      <span>Type: {request.requestType}</span>
                      <span>
                        Budget:{' '}
                        {request.budget.hasBudget
                          ? `KES ${request.budget.maxAmount}`
                          : 'Not specified'}
                      </span>
                    </div>
                  </div>

                  <div className='ml-4'>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : request.status === 'Matched'
                              ? 'bg-purple-100 text-purple-800'
                              : request.status === 'Broadcasted'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {requestsData.requests.length === 0 && (
              <div className='text-center py-12'>
                <MessageSquare className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  No active requests
                </h3>
                <p className='text-gray-600'>
                  No mentorship requests at the moment.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && mentorshipStats && (
          <div className='space-y-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Mentorship Analytics
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Mentor Stats */}
              <div className='bg-white border border-gray-200 rounded-lg p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Mentor Distribution
                </h3>

                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Total Mentors</span>
                    <span className='font-semibold'>
                      {mentorshipStats.mentorStats.totalMentors}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Active Mentors</span>
                    <span className='font-semibold text-green-600'>
                      {mentorshipStats.mentorStats.activeMentors}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Available Now</span>
                    <span className='font-semibold text-blue-600'>
                      {mentorshipStats.mentorStats.availableMentors}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Verified Mentors</span>
                    <span className='font-semibold text-purple-600'>
                      {mentorshipStats.mentorStats.verifiedMentors}
                    </span>
                  </div>
                </div>
              </div>

              {/* Request Stats */}
              <div className='bg-white border border-gray-200 rounded-lg p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Request Statistics
                </h3>

                <div className='space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Total Requests</span>
                    <span className='font-semibold'>
                      {mentorshipStats.requestStats.totalRequests}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Active Requests</span>
                    <span className='font-semibold text-orange-600'>
                      {mentorshipStats.requestStats.activeRequests}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Completed</span>
                    <span className='font-semibold text-green-600'>
                      {mentorshipStats.requestStats.completedRequests}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Avg Response Time</span>
                    <span className='font-semibold'>
                      {mentorshipStats.requestStats.averageResponseTime}min
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            {mentorshipStats.mentorStats.categoryStats && (
              <div className='bg-white border border-gray-200 rounded-lg p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Mentors by Category
                </h3>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                  {mentorshipStats.mentorStats.categoryStats.map(
                    (cat, index) => (
                      <div
                        key={index}
                        className='text-center p-3 bg-gray-50 rounded-lg'
                      >
                        <p className='font-semibold text-lg'>{cat.count}</p>
                        <p className='text-sm text-gray-600'>{cat._id}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {activeTab === 'mentors' && filteredMentors.length === 0 && (
          <div className='text-center py-12'>
            <Users className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              No mentors found
            </h3>
            <p className='text-gray-600 mb-4'>
              {searchQuery
                ? 'No mentors match your search criteria.'
                : 'Start building your mentor network by adding the first mentor.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowForm(true)}
                className='bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary/90'
              >
                Add First Mentor
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipAdmin;
