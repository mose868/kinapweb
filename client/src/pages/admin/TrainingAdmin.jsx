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
  BookOpen,
  Award,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
} from 'lucide-react';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TrainingAdmin = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Web Development',
    level: 'Beginner',
    duration: {
      weeks: 0,
      hours: 0,
      totalHours: 0,
    },
    schedule: {
      format: 'Online',
      days: [],
      timeSlot: '',
      startDate: '',
      endDate: '',
    },
    instructor: {
      name: '',
      bio: '',
      email: '',
      experience: '',
      specialization: [],
    },
    learningOutcomes: [],
    prerequisites: [],
    tools: [],
    certification: {
      provided: true,
      title: '',
      validityPeriod: 'Lifetime',
    },
    pricing: {
      isFree: false,
      regularPrice: 0,
      discountPrice: 0,
      currency: 'KES',
    },
    enrollment: {
      capacity: 50,
      isOpen: true,
    },
    features: [],
    tags: [],
    status: 'Draft',
    isFeatured: false,
    isActive: true,
  });

  // Fetch training programs for admin
  const { data: trainingsData, isLoading } = useQuery(
    ['adminTrainings', selectedCategory, selectedLevel, selectedStatus],
    async () => {
      let url = `${BASEURL}/training/admin?limit=100`;

      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }

      if (selectedLevel !== 'all') {
        url += `&level=${selectedLevel}`;
      }

      if (selectedStatus !== 'all') {
        url += `&status=${selectedStatus}`;
      }

      const response = await axios.get(url);
      return response.data;
    }
  );

  // Fetch training statistics
  const { data: trainingStats } = useQuery('trainingStats', async () => {
    const response = await axios.get(`${BASEURL}/training/stats/overview`);
    return response.data;
  });

  // Create/Update training mutation
  const saveTrainingMutation = useMutation(
    async (data) => {
      if (editingTraining) {
        const response = await axios.put(
          `${BASEURL}/training/${editingTraining._id}`,
          {
            ...data,
            lastUpdatedBy: 'admin@ajirakinap.com',
          }
        );
        return response.data;
      } else {
        const response = await axios.post(`${BASEURL}/training`, {
          ...data,
          lastUpdatedBy: 'admin@ajirakinap.com',
        });
        return response.data;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminTrainings');
        queryClient.invalidateQueries('trainingStats');
        setMessage(
          editingTraining
            ? 'Training program updated successfully!'
            : 'Training program created successfully!'
        );
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
        resetForm();
      },
      onError: (error) => {
        setMessage(
          error.response?.data?.message || 'Failed to save training program'
        );
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      },
    }
  );

  // Delete training mutation
  const deleteTrainingMutation = useMutation(
    async (id) => {
      const response = await axios.delete(`${BASEURL}/training/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminTrainings');
        queryClient.invalidateQueries('trainingStats');
        setMessage('Training program deleted successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      },
      onError: (error) => {
        setMessage(
          error.response?.data?.message || 'Failed to delete training program'
        );
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      },
    }
  );

  // Toggle publish status mutation
  const togglePublishMutation = useMutation(
    async (id) => {
      const response = await axios.patch(`${BASEURL}/training/${id}/publish`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminTrainings');
        queryClient.invalidateQueries('trainingStats');
      },
    }
  );

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation(
    async (id) => {
      const response = await axios.patch(`${BASEURL}/training/${id}/feature`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminTrainings');
        queryClient.invalidateQueries('trainingStats');
      },
    }
  );

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      category: 'Web Development',
      level: 'Beginner',
      duration: {
        weeks: 0,
        hours: 0,
        totalHours: 0,
      },
      schedule: {
        format: 'Online',
        days: [],
        timeSlot: '',
        startDate: '',
        endDate: '',
      },
      instructor: {
        name: '',
        bio: '',
        email: '',
        experience: '',
        specialization: [],
      },
      learningOutcomes: [],
      prerequisites: [],
      tools: [],
      certification: {
        provided: true,
        title: '',
        validityPeriod: 'Lifetime',
      },
      pricing: {
        isFree: false,
        regularPrice: 0,
        discountPrice: 0,
        currency: 'KES',
      },
      enrollment: {
        capacity: 50,
        isOpen: true,
      },
      features: [],
      tags: [],
      status: 'Draft',
      isFeatured: false,
      isActive: true,
    });
    setEditingTraining(null);
    setShowForm(false);
  };

  const handleEdit = (training) => {
    setFormData({
      ...training,
      learningOutcomes: training.learningOutcomes || [],
      prerequisites: training.prerequisites || [],
      tools: training.tools || [],
      features: training.features || [],
      tags: training.tags || [],
    });
    setEditingTraining(training);
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
          [child]: type === 'number' ? parseFloat(value) || 0 : value,
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
    saveTrainingMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (
      window.confirm('Are you sure you want to delete this training program?')
    ) {
      deleteTrainingMutation.mutate(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published':
        return 'text-green-600 bg-green-100';
      case 'Draft':
        return 'text-gray-600 bg-gray-100';
      case 'Coming Soon':
        return 'text-blue-600 bg-blue-100';
      case 'In Progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'Completed':
        return 'text-green-700 bg-green-200';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'text-green-600 bg-green-100';
      case 'Intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'Advanced':
        return 'text-red-600 bg-red-100';
      case 'All Levels':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Filter trainings based on search query
  const filteredTrainings =
    trainingsData?.trainings?.filter((training) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        training.title.toLowerCase().includes(query) ||
        training.description.toLowerCase().includes(query) ||
        training.instructor.name.toLowerCase().includes(query) ||
        training.tags.some((tag) => tag.toLowerCase().includes(query))
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
            Training Programs
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className='flex items-center space-x-2 bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90'
          >
            <Plus className='w-5 h-5' />
            <span>Add Training</span>
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

        {/* Training Statistics */}
        {trainingStats && (
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <div className='bg-ajira-primary/10 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <BookOpen className='w-8 h-8 text-ajira-primary' />
                <div>
                  <p className='text-sm text-gray-600'>Total Programs</p>
                  <p className='text-2xl font-bold text-ajira-primary'>
                    {trainingStats.totalTrainings}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-green-100 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <Eye className='w-8 h-8 text-green-600' />
                <div>
                  <p className='text-sm text-gray-600'>Published</p>
                  <p className='text-2xl font-bold text-green-600'>
                    {trainingStats.publishedTrainings}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-purple-100 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <Star className='w-8 h-8 text-purple-600' />
                <div>
                  <p className='text-sm text-gray-600'>Featured</p>
                  <p className='text-2xl font-bold text-purple-600'>
                    {trainingStats.featuredTrainings}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-blue-100 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <Users className='w-8 h-8 text-blue-600' />
                <div>
                  <p className='text-sm text-gray-600'>Total Enrollments</p>
                  <p className='text-2xl font-bold text-blue-600'>
                    {trainingStats.totalEnrollments}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className='flex flex-wrap gap-4 mb-6'>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
          >
            <option value='all'>All Categories</option>
            <option value='Web Development'>Web Development</option>
            <option value='Digital Marketing'>Digital Marketing</option>
            <option value='Graphic Design'>Graphic Design</option>
            <option value='Data Science'>Data Science</option>
            <option value='Mobile Development'>Mobile Development</option>
            <option value='UI/UX Design'>UI/UX Design</option>
            <option value='Cybersecurity'>Cybersecurity</option>
            <option value='Content Writing'>Content Writing</option>
            <option value='Project Management'>Project Management</option>
            <option value='Other'>Other</option>
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
          >
            <option value='all'>All Levels</option>
            <option value='Beginner'>Beginner</option>
            <option value='Intermediate'>Intermediate</option>
            <option value='Advanced'>Advanced</option>
            <option value='All Levels'>All Levels</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
          >
            <option value='all'>All Status</option>
            <option value='Published'>Published</option>
            <option value='Draft'>Draft</option>
            <option value='Coming Soon'>Coming Soon</option>
            <option value='In Progress'>In Progress</option>
            <option value='Completed'>Completed</option>
            <option value='Cancelled'>Cancelled</option>
          </select>

          <div className='relative flex-1 max-w-md'>
            <input
              type='text'
              placeholder='Search training programs...'
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
              {editingTraining
                ? 'Edit Training Program'
                : 'Add New Training Program'}
            </h2>

            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Basic Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Title *
                  </label>
                  <input
                    type='text'
                    name='title'
                    value={formData.title}
                    onChange={handleChange}
                    required
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
                    <option value='Digital Marketing'>Digital Marketing</option>
                    <option value='Graphic Design'>Graphic Design</option>
                    <option value='Data Science'>Data Science</option>
                    <option value='Mobile Development'>
                      Mobile Development
                    </option>
                    <option value='UI/UX Design'>UI/UX Design</option>
                    <option value='Cybersecurity'>Cybersecurity</option>
                    <option value='Content Writing'>Content Writing</option>
                    <option value='Project Management'>
                      Project Management
                    </option>
                    <option value='Other'>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Short Description
                </label>
                <textarea
                  name='shortDescription'
                  value={formData.shortDescription}
                  onChange={handleChange}
                  rows={2}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Full Description *
                </label>
                <textarea
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                />
              </div>

              {/* Course Details */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Level *
                  </label>
                  <select
                    name='level'
                    value={formData.level}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                  >
                    <option value='Beginner'>Beginner</option>
                    <option value='Intermediate'>Intermediate</option>
                    <option value='Advanced'>Advanced</option>
                    <option value='All Levels'>All Levels</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Total Hours *
                  </label>
                  <input
                    type='number'
                    name='duration.totalHours'
                    value={formData.duration.totalHours}
                    onChange={handleChange}
                    required
                    min='1'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Capacity
                  </label>
                  <input
                    type='number'
                    name='enrollment.capacity'
                    value={formData.enrollment.capacity}
                    onChange={handleChange}
                    min='1'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                  />
                </div>
              </div>

              {/* Instructor Information */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Instructor Name *
                  </label>
                  <input
                    type='text'
                    name='instructor.name'
                    value={formData.instructor.name}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Instructor Email
                  </label>
                  <input
                    type='email'
                    name='instructor.email'
                    value={formData.instructor.email}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    name='pricing.isFree'
                    checked={formData.pricing.isFree}
                    onChange={handleChange}
                    className='w-5 h-5 text-ajira-primary'
                  />
                  <label className='text-sm font-medium text-gray-700'>
                    Free Course
                  </label>
                </div>

                {!formData.pricing.isFree && (
                  <>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Regular Price (KES)
                      </label>
                      <input
                        type='number'
                        name='pricing.regularPrice'
                        value={formData.pricing.regularPrice}
                        onChange={handleChange}
                        min='0'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Discount Price (KES)
                      </label>
                      <input
                        type='number'
                        name='pricing.discountPrice'
                        value={formData.pricing.discountPrice}
                        onChange={handleChange}
                        min='0'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Arrays */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Learning Outcomes (comma-separated)
                  </label>
                  <textarea
                    value={formData.learningOutcomes.join(', ')}
                    onChange={(e) =>
                      handleArrayChange(e.target.value, 'learningOutcomes')
                    }
                    rows={3}
                    placeholder='Web development skills, JavaScript proficiency, etc.'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Prerequisites (comma-separated)
                  </label>
                  <textarea
                    value={formData.prerequisites.join(', ')}
                    onChange={(e) =>
                      handleArrayChange(e.target.value, 'prerequisites')
                    }
                    rows={3}
                    placeholder='Basic computer skills, HTML knowledge, etc.'
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Tags (comma-separated)
                </label>
                <input
                  type='text'
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleArrayChange(e.target.value, 'tags')}
                  placeholder='javascript, web development, frontend, backend'
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                />
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
                    Featured Program
                  </span>
                </label>

                <label className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    name='isActive'
                    checked={formData.isActive}
                    onChange={handleChange}
                    className='w-5 h-5 text-ajira-primary'
                  />
                  <span className='text-sm font-medium text-gray-700'>
                    Active
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
                    <option value='Draft'>Draft</option>
                    <option value='Published'>Published</option>
                    <option value='Coming Soon'>Coming Soon</option>
                    <option value='In Progress'>In Progress</option>
                    <option value='Completed'>Completed</option>
                    <option value='Cancelled'>Cancelled</option>
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
                  disabled={saveTrainingMutation.isLoading}
                  className='px-8 py-3 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 disabled:opacity-50 flex items-center space-x-2'
                >
                  {saveTrainingMutation.isLoading ? (
                    <>
                      <Loader2 className='w-5 h-5 animate-spin' />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className='w-5 h-5' />
                      <span>
                        {editingTraining ? 'Update' : 'Create'} Training
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Training Programs List */}
        <div className='space-y-4'>
          {filteredTrainings.map((training) => (
            <div
              key={training._id}
              className='bg-white border border-gray-200 rounded-lg p-6'
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-3 mb-2'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      {training.title}
                    </h3>
                    {training.isFeatured && (
                      <Star className='w-5 h-5 text-yellow-500 fill-current' />
                    )}
                  </div>

                  <p className='text-gray-600 mb-3 line-clamp-2'>
                    {training.shortDescription || training.description}
                  </p>

                  <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(training.status)}`}
                    >
                      {training.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(training.level)}`}
                    >
                      {training.level}
                    </span>
                    <span className='bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs'>
                      {training.category}
                    </span>
                    <span className='flex items-center space-x-1'>
                      <Clock className='w-4 h-4' />
                      <span>{training.duration.totalHours}h</span>
                    </span>
                    <span className='flex items-center space-x-1'>
                      <Users className='w-4 h-4' />
                      <span>
                        {training.enrollment.enrolled}/
                        {training.enrollment.capacity}
                      </span>
                    </span>
                    <span className='flex items-center space-x-1'>
                      <DollarSign className='w-4 h-4' />
                      <span>
                        {training.pricing.isFree
                          ? 'Free'
                          : `KES ${training.pricing.regularPrice.toLocaleString()}`}
                      </span>
                    </span>
                  </div>

                  <div className='flex items-center space-x-4 text-sm text-gray-500'>
                    <span>Instructor: {training.instructor.name}</span>
                    <span>Views: {training.statistics.views}</span>
                    {training.ratings.totalRatings > 0 && (
                      <span className='flex items-center space-x-1'>
                        <Star className='w-4 h-4 text-yellow-500 fill-current' />
                        <span>
                          {training.ratings.average} (
                          {training.ratings.totalRatings})
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className='flex items-center space-x-2 ml-4'>
                  <button
                    onClick={() => handleEdit(training)}
                    className='text-ajira-primary hover:text-ajira-primary/80'
                    title='Edit'
                  >
                    <Edit2 className='w-4 h-4' />
                  </button>

                  <button
                    onClick={() => togglePublishMutation.mutate(training._id)}
                    className={`${training.status === 'Published' ? 'text-green-600' : 'text-gray-400'} hover:text-green-800`}
                    title='Toggle Publish'
                  >
                    {training.status === 'Published' ? (
                      <Eye className='w-4 h-4' />
                    ) : (
                      <EyeOff className='w-4 h-4' />
                    )}
                  </button>

                  <button
                    onClick={() => toggleFeaturedMutation.mutate(training._id)}
                    className={`${training.isFeatured ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                    title='Toggle Featured'
                  >
                    <Star
                      className={`w-4 h-4 ${training.isFeatured ? 'fill-current' : ''}`}
                    />
                  </button>

                  <button
                    onClick={() => handleDelete(training._id)}
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

        {filteredTrainings.length === 0 && (
          <div className='text-center py-12'>
            <BookOpen className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              No training programs found
            </h3>
            <p className='text-gray-600 mb-4'>
              {searchQuery
                ? 'No programs match your search criteria.'
                : 'Start building your training catalog by adding the first program.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowForm(true)}
                className='bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary/90'
              >
                Add First Training Program
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingAdmin;
