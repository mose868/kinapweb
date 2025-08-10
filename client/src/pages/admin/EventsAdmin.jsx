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
  Calendar,
  Video,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Loader2,
  CheckCircle,
  AlertCircle,
  Globe,
  Award,
  Download,
  UserCheck,
  Activity,
} from 'lucide-react';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EventsAdmin = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [activeTab, setActiveTab] = useState('events'); // 'events', 'attendees', 'analytics'
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'Workshop',
    eventType: 'Hybrid',
    format: 'Free',
    schedule: {
      startDate: '',
      endDate: '',
      startTime: '14:00',
      endTime: '17:00',
      timezone: 'Africa/Nairobi',
      isAllDay: false,
    },
    location: {
      venue: '',
      address: '',
      city: 'Nairobi',
      country: 'Kenya',
      virtualPlatform: '',
      meetingLink: '',
      directions: '',
    },
    organizer: {
      name: '',
      email: '',
      phone: '',
      organization: '',
      bio: '',
    },
    registration: {
      capacity: 100,
      isRegistrationOpen: true,
      waitlistEnabled: true,
      requiresApproval: false,
    },
    pricing: {
      isFree: true,
      regularPrice: 0,
      currency: 'KES',
    },
    speakers: [],
    agenda: [],
    prerequisites: [],
    targetAudience: [],
    learningOutcomes: [],
    tags: [],
    socialFeatures: {
      allowNetworking: true,
      chatEnabled: true,
      qnaEnabled: true,
      certificateProvided: false,
    },
    status: 'Draft',
    isPublished: false,
    isFeatured: false,
  });

  // Fetch events for admin
  const { data: eventsData, isLoading } = useQuery(
    ['adminEvents', selectedCategory, selectedType, selectedStatus],
    async () => {
      let url = `${BASEURL}/events/admin/all?limit=100`;

      if (selectedCategory !== 'all') {
        url += `&category=${selectedCategory}`;
      }

      if (selectedType !== 'all') {
        url += `&eventType=${selectedType}`;
      }

      if (selectedStatus !== 'all') {
        url += `&status=${selectedStatus}`;
      }

      const response = await axios.get(url);
      return response.data;
    }
  );

  // Fetch event statistics
  const { data: eventStats } = useQuery('eventStats', async () => {
    const response = await axios.get(`${BASEURL}/events/admin/stats/overview`);
    return response.data;
  });

  // Fetch attendees for selected event
  const { data: attendeesData } = useQuery(
    ['eventAttendees', selectedEventId],
    async () => {
      if (!selectedEventId) return null;
      const response = await axios.get(
        `${BASEURL}/events/admin/${selectedEventId}/attendees`
      );
      return response.data;
    },
    { enabled: !!selectedEventId && activeTab === 'attendees' }
  );

  // Create/Update event mutation
  const saveEventMutation = useMutation(
    async (data) => {
      if (editingEvent) {
        const response = await axios.put(
          `${BASEURL}/events/admin/${editingEvent._id}`,
          {
            ...data,
            lastUpdatedBy: 'admin@ajirakinap.com',
          }
        );
        return response.data;
      } else {
        const response = await axios.post(`${BASEURL}/events/admin`, {
          ...data,
          lastUpdatedBy: 'admin@ajirakinap.com',
        });
        return response.data;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminEvents');
        queryClient.invalidateQueries('eventStats');
        setMessage(
          editingEvent
            ? 'Event updated successfully!'
            : 'Event created successfully!'
        );
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
        resetForm();
      },
      onError: (error) => {
        setMessage(error.response?.data?.message || 'Failed to save event');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      },
    }
  );

  // Delete event mutation
  const deleteEventMutation = useMutation(
    async (id) => {
      const response = await axios.delete(`${BASEURL}/events/admin/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminEvents');
        queryClient.invalidateQueries('eventStats');
        setMessage('Event deleted successfully!');
        setMessageType('success');
        setTimeout(() => setMessage(''), 3000);
      },
      onError: (error) => {
        setMessage(error.response?.data?.message || 'Failed to delete event');
        setMessageType('error');
        setTimeout(() => setMessage(''), 3000);
      },
    }
  );

  // Toggle published status mutation
  const togglePublishMutation = useMutation(
    async (id) => {
      const response = await axios.patch(
        `${BASEURL}/events/admin/${id}/publish`
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminEvents');
        queryClient.invalidateQueries('eventStats');
      },
    }
  );

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation(
    async (id) => {
      const response = await axios.patch(
        `${BASEURL}/events/admin/${id}/feature`
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminEvents');
        queryClient.invalidateQueries('eventStats');
      },
    }
  );

  // Update status mutation
  const updateStatusMutation = useMutation(
    async ({ id, status }) => {
      const response = await axios.patch(
        `${BASEURL}/events/admin/${id}/status`,
        { status }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('adminEvents');
        queryClient.invalidateQueries('eventStats');
      },
    }
  );

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      category: 'Workshop',
      eventType: 'Hybrid',
      format: 'Free',
      schedule: {
        startDate: '',
        endDate: '',
        startTime: '14:00',
        endTime: '17:00',
        timezone: 'Africa/Nairobi',
        isAllDay: false,
      },
      location: {
        venue: '',
        address: '',
        city: 'Nairobi',
        country: 'Kenya',
        virtualPlatform: '',
        meetingLink: '',
        directions: '',
      },
      organizer: {
        name: '',
        email: '',
        phone: '',
        organization: '',
        bio: '',
      },
      registration: {
        capacity: 100,
        isRegistrationOpen: true,
        waitlistEnabled: true,
        requiresApproval: false,
      },
      pricing: {
        isFree: true,
        regularPrice: 0,
        currency: 'KES',
      },
      speakers: [],
      agenda: [],
      prerequisites: [],
      targetAudience: [],
      learningOutcomes: [],
      tags: [],
      socialFeatures: {
        allowNetworking: true,
        chatEnabled: true,
        qnaEnabled: true,
        certificateProvided: false,
      },
      status: 'Draft',
      isPublished: false,
      isFeatured: false,
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleEdit = (event) => {
    setFormData({
      ...event,
      schedule: {
        ...event.schedule,
        startDate: event.schedule.startDate
          ? new Date(event.schedule.startDate).toISOString().split('T')[0]
          : '',
        endDate: event.schedule.endDate
          ? new Date(event.schedule.endDate).toISOString().split('T')[0]
          : '',
      },
    });
    setEditingEvent(event);
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
    saveEventMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEventMutation.mutate(id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published':
        return 'text-green-600 bg-green-100';
      case 'Registration Open':
        return 'text-blue-600 bg-blue-100';
      case 'Registration Closed':
        return 'text-yellow-600 bg-yellow-100';
      case 'In Progress':
        return 'text-purple-600 bg-purple-100';
      case 'Completed':
        return 'text-gray-600 bg-gray-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      case 'Postponed':
        return 'text-orange-600 bg-orange-100';
      case 'Draft':
        return 'text-gray-600 bg-gray-200';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'In-Person':
        return 'text-blue-600 bg-blue-100';
      case 'Virtual':
        return 'text-green-600 bg-green-100';
      case 'Hybrid':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Workshop':
        return <Users className='w-4 h-4' />;
      case 'Webinar':
        return <Video className='w-4 h-4' />;
      case 'Conference':
        return <Globe className='w-4 h-4' />;
      case 'Networking':
        return <UserCheck className='w-4 h-4' />;
      case 'Hackathon':
        return <Activity className='w-4 h-4' />;
      default:
        return <Calendar className='w-4 h-4' />;
    }
  };

  const exportAttendees = (eventId, format = 'csv') => {
    const url = `${BASEURL}/events/admin/${eventId}/attendees/export?format=${format}`;
    window.open(url, '_blank');
  };

  // Filter events based on search query
  const filteredEvents =
    eventsData?.events?.filter((event) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.organizer.name.toLowerCase().includes(query) ||
        event.location.venue?.toLowerCase().includes(query)
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
            Events Management
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className='flex items-center space-x-2 bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90'
          >
            <Plus className='w-5 h-5' />
            <span>Add Event</span>
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
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'events'
                ? 'bg-white text-ajira-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className='w-4 h-4 inline mr-2' />
            Events
          </button>
          <button
            onClick={() => setActiveTab('attendees')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'attendees'
                ? 'bg-white text-ajira-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className='w-4 h-4 inline mr-2' />
            Attendees
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

        {/* Event Statistics */}
        {eventStats && (
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
            <div className='bg-ajira-primary/10 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <Calendar className='w-8 h-8 text-ajira-primary' />
                <div>
                  <p className='text-sm text-gray-600'>Total Events</p>
                  <p className='text-2xl font-bold text-ajira-primary'>
                    {eventStats.eventStats?.totalEvents || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-green-100 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <CheckCircle className='w-8 h-8 text-green-600' />
                <div>
                  <p className='text-sm text-gray-600'>Published</p>
                  <p className='text-2xl font-bold text-green-600'>
                    {eventStats.eventStats?.publishedEvents || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-blue-100 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <Clock className='w-8 h-8 text-blue-600' />
                <div>
                  <p className='text-sm text-gray-600'>Upcoming</p>
                  <p className='text-2xl font-bold text-blue-600'>
                    {eventStats.eventStats?.upcomingEvents || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className='bg-purple-100 rounded-lg p-4'>
              <div className='flex items-center space-x-3'>
                <Users className='w-8 h-8 text-purple-600' />
                <div>
                  <p className='text-sm text-gray-600'>Total Registrations</p>
                  <p className='text-2xl font-bold text-purple-600'>
                    {eventStats.eventStats?.totalRegistrations || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <>
            {/* Filters and Search */}
            <div className='flex flex-wrap gap-4 mb-6'>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
              >
                <option value='all'>All Categories</option>
                <option value='Workshop'>Workshop</option>
                <option value='Webinar'>Webinar</option>
                <option value='Networking'>Networking</option>
                <option value='Conference'>Conference</option>
                <option value='Hackathon'>Hackathon</option>
                <option value='Career Fair'>Career Fair</option>
                <option value='Training'>Training</option>
                <option value='Panel Discussion'>Panel Discussion</option>
                <option value='Tech Talk'>Tech Talk</option>
                <option value='Other'>Other</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
              >
                <option value='all'>All Types</option>
                <option value='In-Person'>In-Person</option>
                <option value='Virtual'>Virtual</option>
                <option value='Hybrid'>Hybrid</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
              >
                <option value='all'>All Status</option>
                <option value='Draft'>Draft</option>
                <option value='Published'>Published</option>
                <option value='Registration Open'>Registration Open</option>
                <option value='Registration Closed'>Registration Closed</option>
                <option value='In Progress'>In Progress</option>
                <option value='Completed'>Completed</option>
                <option value='Cancelled'>Cancelled</option>
              </select>

              <div className='relative flex-1 max-w-md'>
                <input
                  type='text'
                  placeholder='Search events...'
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
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>

                <form onSubmit={handleSubmit} className='space-y-6'>
                  {/* Basic Information */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Event Title *
                      </label>
                      <input
                        type='text'
                        name='title'
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder='e.g., React Workshop 2024'
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
                        <option value='Workshop'>Workshop</option>
                        <option value='Webinar'>Webinar</option>
                        <option value='Networking'>Networking</option>
                        <option value='Conference'>Conference</option>
                        <option value='Hackathon'>Hackathon</option>
                        <option value='Career Fair'>Career Fair</option>
                        <option value='Training'>Training</option>
                        <option value='Panel Discussion'>
                          Panel Discussion
                        </option>
                        <option value='Tech Talk'>Tech Talk</option>
                        <option value='Other'>Other</option>
                      </select>
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
                      placeholder='Describe your event in detail...'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                    />
                  </div>

                  {/* Date and Time */}
                  <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Start Date *
                      </label>
                      <input
                        type='date'
                        name='schedule.startDate'
                        value={formData.schedule.startDate}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        End Date *
                      </label>
                      <input
                        type='date'
                        name='schedule.endDate'
                        value={formData.schedule.endDate}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Start Time
                      </label>
                      <input
                        type='time'
                        name='schedule.startTime'
                        value={formData.schedule.startTime}
                        onChange={handleChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        End Time
                      </label>
                      <input
                        type='time'
                        name='schedule.endTime'
                        value={formData.schedule.endTime}
                        onChange={handleChange}
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                  </div>

                  {/* Organizer Information */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Organizer Name *
                      </label>
                      <input
                        type='text'
                        name='organizer.name'
                        value={formData.organizer.name}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Organizer Email *
                      </label>
                      <input
                        type='email'
                        name='organizer.email'
                        value={formData.organizer.email}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                  </div>

                  {/* Location and Type */}
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Event Type *
                      </label>
                      <select
                        name='eventType'
                        value={formData.eventType}
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      >
                        <option value='In-Person'>In-Person</option>
                        <option value='Virtual'>Virtual</option>
                        <option value='Hybrid'>Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Venue
                      </label>
                      <input
                        type='text'
                        name='location.venue'
                        value={formData.location.venue}
                        onChange={handleChange}
                        placeholder='e.g., iHub Nairobi'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Capacity
                      </label>
                      <input
                        type='number'
                        name='registration.capacity'
                        value={formData.registration.capacity}
                        onChange={handleChange}
                        min='1'
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
                        Free Event
                      </label>
                    </div>
                    {!formData.pricing.isFree && (
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Price (KES)
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
                    )}
                  </div>

                  {/* Status and Publishing */}
                  <div className='flex items-center space-x-6'>
                    <label className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        name='isPublished'
                        checked={formData.isPublished}
                        onChange={handleChange}
                        className='w-5 h-5 text-ajira-primary'
                      />
                      <span className='text-sm font-medium text-gray-700'>
                        Published
                      </span>
                    </label>

                    <label className='flex items-center space-x-2'>
                      <input
                        type='checkbox'
                        name='isFeatured'
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className='w-5 h-5 text-ajira-primary'
                      />
                      <span className='text-sm font-medium text-gray-700'>
                        Featured
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
                        <option value='Registration Open'>
                          Registration Open
                        </option>
                        <option value='Registration Closed'>
                          Registration Closed
                        </option>
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
                      disabled={saveEventMutation.isLoading}
                      className='px-8 py-3 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 disabled:opacity-50 flex items-center space-x-2'
                    >
                      {saveEventMutation.isLoading ? (
                        <>
                          <Loader2 className='w-5 h-5 animate-spin' />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className='w-5 h-5' />
                          <span>
                            {editingEvent ? 'Update' : 'Create'} Event
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Events List */}
            <div className='space-y-4'>
              {filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className='bg-white border border-gray-200 rounded-lg p-6'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-3 mb-2'>
                        {getCategoryIcon(event.category)}
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {event.title}
                        </h3>
                        {event.isFeatured && (
                          <Star className='w-5 h-5 text-yellow-500 fill-current' />
                        )}
                      </div>

                      <p className='text-gray-600 mb-3 line-clamp-2'>
                        {event.description}
                      </p>

                      <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3'>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}
                        >
                          {event.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.eventType)}`}
                        >
                          {event.eventType}
                        </span>
                        <span className='bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs'>
                          {event.category}
                        </span>
                        <span className='flex items-center space-x-1'>
                          <Calendar className='w-4 h-4' />
                          <span>
                            {new Date(
                              event.schedule.startDate
                            ).toLocaleDateString()}
                          </span>
                        </span>
                        <span className='flex items-center space-x-1'>
                          <Clock className='w-4 h-4' />
                          <span>
                            {event.schedule.startTime} -{' '}
                            {event.schedule.endTime}
                          </span>
                        </span>
                        <span className='flex items-center space-x-1'>
                          <Users className='w-4 h-4' />
                          <span>
                            {event.registration.registered}/
                            {event.registration.capacity}
                          </span>
                        </span>
                        <span className='flex items-center space-x-1'>
                          <DollarSign className='w-4 h-4' />
                          <span>
                            {event.pricing.isFree
                              ? 'Free'
                              : `KES ${event.pricing.regularPrice}`}
                          </span>
                        </span>
                      </div>

                      <div className='flex items-center space-x-4 text-sm text-gray-500'>
                        <span className='flex items-center space-x-1'>
                          <MapPin className='w-4 h-4' />
                          <span>{event.location.venue || 'Virtual'}</span>
                        </span>
                        <span>Organizer: {event.organizer.name}</span>
                        <span>Views: {event.analytics.views}</span>
                      </div>
                    </div>

                    <div className='flex items-center space-x-2 ml-4'>
                      <button
                        onClick={() => handleEdit(event)}
                        className='text-ajira-primary hover:text-ajira-primary/80'
                        title='Edit'
                      >
                        <Edit2 className='w-4 h-4' />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedEventId(event._id);
                          setActiveTab('attendees');
                        }}
                        className='text-blue-600 hover:text-blue-800'
                        title='View Attendees'
                      >
                        <Users className='w-4 h-4' />
                      </button>

                      <select
                        value={event.status}
                        onChange={(e) =>
                          updateStatusMutation.mutate({
                            id: event._id,
                            status: e.target.value,
                          })
                        }
                        className='text-sm px-2 py-1 border border-gray-300 rounded'
                      >
                        <option value='Draft'>Draft</option>
                        <option value='Published'>Published</option>
                        <option value='Registration Open'>
                          Registration Open
                        </option>
                        <option value='Registration Closed'>
                          Registration Closed
                        </option>
                        <option value='In Progress'>In Progress</option>
                        <option value='Completed'>Completed</option>
                        <option value='Cancelled'>Cancelled</option>
                      </select>

                      <button
                        onClick={() => togglePublishMutation.mutate(event._id)}
                        className={`${event.isPublished ? 'text-green-600' : 'text-gray-400'} hover:text-green-800`}
                        title='Toggle Published'
                      >
                        {event.isPublished ? (
                          <Eye className='w-4 h-4' />
                        ) : (
                          <EyeOff className='w-4 h-4' />
                        )}
                      </button>

                      <button
                        onClick={() => toggleFeaturedMutation.mutate(event._id)}
                        className={`${event.isFeatured ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
                        title='Toggle Featured'
                      >
                        <Star
                          className={`w-4 h-4 ${event.isFeatured ? 'fill-current' : ''}`}
                        />
                      </button>

                      <button
                        onClick={() => handleDelete(event._id)}
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

        {/* Attendees Tab */}
        {activeTab === 'attendees' && (
          <div className='space-y-6'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Event Attendees
              </h2>
              <div className='flex space-x-2'>
                <select
                  value={selectedEventId || ''}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                >
                  <option value=''>Select Event</option>
                  {filteredEvents.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.title} (
                      {new Date(event.schedule.startDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                {selectedEventId && (
                  <button
                    onClick={() => exportAttendees(selectedEventId, 'csv')}
                    className='flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700'
                  >
                    <Download className='w-4 h-4' />
                    <span>Export CSV</span>
                  </button>
                )}
              </div>
            </div>

            {attendeesData && (
              <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
                <div className='px-6 py-4 border-b border-gray-200'>
                  <h3 className='text-lg font-semibold'>
                    {attendeesData.eventTitle}
                  </h3>
                  <p className='text-sm text-gray-600'>
                    {attendeesData.totalCount} total attendees
                  </p>
                </div>

                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Attendee
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Organization
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Registration Date
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Status
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Payment
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {attendeesData.attendees.map((attendee, index) => (
                        <tr key={index}>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <div>
                              <div className='text-sm font-medium text-gray-900'>
                                {attendee.name}
                              </div>
                              <div className='text-sm text-gray-500'>
                                {attendee.email}
                              </div>
                            </div>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {attendee.organization || '-'}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {new Date(
                              attendee.registrationDate
                            ).toLocaleDateString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                attendee.status === 'Confirmed'
                                  ? 'bg-green-100 text-green-800'
                                  : attendee.status === 'Registered'
                                    ? 'bg-blue-100 text-blue-800'
                                    : attendee.status === 'Attended'
                                      ? 'bg-purple-100 text-purple-800'
                                      : attendee.status === 'No Show'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {attendee.status}
                            </span>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap'>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                attendee.paymentStatus === 'Paid'
                                  ? 'bg-green-100 text-green-800'
                                  : attendee.paymentStatus === 'Free'
                                    ? 'bg-blue-100 text-blue-800'
                                    : attendee.paymentStatus === 'Pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {attendee.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!selectedEventId && (
              <div className='text-center py-12'>
                <Users className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  Select an Event
                </h3>
                <p className='text-gray-600'>
                  Choose an event to view its attendees
                </p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && eventStats && (
          <div className='space-y-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
              Event Analytics
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Event Categories */}
              <div className='bg-white border border-gray-200 rounded-lg p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Events by Category
                </h3>

                <div className='space-y-3'>
                  {eventStats.eventStats.categoryStats?.map((cat, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center'
                    >
                      <span className='text-gray-600'>{cat._id}</span>
                      <span className='font-semibold'>{cat.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Types */}
              <div className='bg-white border border-gray-200 rounded-lg p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Events by Type
                </h3>

                <div className='space-y-3'>
                  {eventStats.eventStats.typeStats?.map((type, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center'
                    >
                      <span className='text-gray-600'>{type._id}</span>
                      <span className='font-semibold'>{type.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Popular Events */}
            {eventStats.eventStats.popularEvents && (
              <div className='bg-white border border-gray-200 rounded-lg p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Most Popular Events
                </h3>

                <div className='space-y-4'>
                  {eventStats.eventStats.popularEvents.map((event, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'
                    >
                      <div>
                        <p className='font-medium text-gray-900'>
                          {event.title}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {event.category}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-semibold text-gray-900'>
                          {event.analytics.views} views
                        </p>
                        <p className='text-sm text-gray-600'>
                          {event.registration.registered} registered
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {activeTab === 'events' && filteredEvents.length === 0 && (
          <div className='text-center py-12'>
            <Calendar className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              No events found
            </h3>
            <p className='text-gray-600 mb-4'>
              {searchQuery
                ? 'No events match your search criteria.'
                : 'Start building your event calendar by adding the first event.'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowForm(true)}
                className='bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary/90'
              >
                Add First Event
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsAdmin;
