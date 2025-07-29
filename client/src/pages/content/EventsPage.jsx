import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Video,
  Star,
  Search,
  Filter,
  Eye,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Loader2,
  Grid,
  List,
  Globe,
  Award,
  Bookmark,
  Share2
} from 'lucide-react';
import axios from 'axios';
import LoadingState from '../../components/common/LoadingState';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [categories, setCategories] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  // Registration form data
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    title: '',
    specialRequests: '',
    dietaryRestrictions: ''
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASEURL}/events`);
        const eventData = response.data.events || [];
        setEvents(eventData);
        setFilteredEvents(eventData);
        
        // Fetch metadata
        const metaResponse = await axios.get(`${BASEURL}/events/meta/categories`);
        setCategories(metaResponse.data.categories || []);
        setEventTypes(metaResponse.data.eventTypes || []);
        setCities(metaResponse.data.cities || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.eventType === selectedType);
    }

    // Filter by city
    if (selectedCity !== 'all') {
      filtered = filtered.filter(event => event.location.city === selectedCity);
    }

    // Filter by free only
    if (showFreeOnly) {
      filtered = filtered.filter(event => event.pricing.isFree);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.organizer.name.toLowerCase().includes(query) ||
        event.location.venue?.toLowerCase().includes(query) ||
        event.speakers?.some(speaker => speaker.name.toLowerCase().includes(query))
      );
    }

    setFilteredEvents(filtered);
  }, [selectedCategory, selectedType, selectedCity, showFreeOnly, searchQuery, events]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Workshop': return <Users className="w-5 h-5" />;
      case 'Webinar': return <Video className="w-5 h-5" />;
      case 'Conference': return <Globe className="w-5 h-5" />;
      case 'Networking': return <UserPlus className="w-5 h-5" />;
      case 'Hackathon': return <Award className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'In-Person': return 'bg-blue-100 text-blue-800';
      case 'Virtual': return 'bg-green-100 text-green-800';
      case 'Hybrid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Registration Open': return 'text-green-600 bg-green-100';
      case 'Registration Closed': return 'text-red-600 bg-red-100';
      case 'In Progress': return 'text-purple-600 bg-purple-100';
      case 'Completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeUntilEvent = (eventDate) => {
    const now = new Date();
    const event = new Date(eventDate);
    const diffTime = event - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past event';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
    return `In ${Math.ceil(diffDays / 30)} months`;
  };

  const getAvailabilityStatus = (event) => {
    const now = new Date();
    const eventDate = new Date(event.schedule.startDate);
    const regDeadline = event.registration.registrationDeadline ? new Date(event.registration.registrationDeadline) : null;
    
    if (now > eventDate) return { text: 'Past Event', color: 'text-gray-600 bg-gray-100' };
    if (!event.registration.isRegistrationOpen) return { text: 'Registration Closed', color: 'text-red-600 bg-red-100' };
    if (regDeadline && now > regDeadline) return { text: 'Registration Deadline Passed', color: 'text-red-600 bg-red-100' };
    if (event.registration.registered >= event.registration.capacity) {
      return event.registration.waitlistEnabled 
        ? { text: 'Waitlist Available', color: 'text-yellow-600 bg-yellow-100' }
        : { text: 'Fully Booked', color: 'text-red-600 bg-red-100' };
    }
    return { text: 'Registration Open', color: 'text-green-600 bg-green-100' };
  };

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
    setRegistrationStatus(null);
  };

  const handleRegistrationChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitRegistration = async (e) => {
    e.preventDefault();
    setRegistrationLoading(true);
    
    try {
      const response = await axios.post(`${BASEURL}/events/${selectedEvent._id}/register`, registrationData);
      
      setRegistrationStatus({
        type: 'success',
        message: response.data.message,
        registrationStatus: response.data.registrationStatus
      });
      
      // Update the event in the local state
      const updatedEvents = events.map(event => 
        event._id === selectedEvent._id 
          ? { ...event, registration: { ...event.registration, registered: event.registration.registered + 1 } }
          : event
      );
      setEvents(updatedEvents);
      
      // Reset form
      setRegistrationData({
        name: '',
        email: '',
        phone: '',
        organization: '',
        title: '',
        specialRequests: '',
        dietaryRestrictions: ''
      });
      
      setTimeout(() => {
        setShowRegistrationForm(false);
        setSelectedEvent(null);
      }, 3000);
      
    } catch (error) {
      console.error('Error registering for event:', error);
      setRegistrationStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to register. Please try again.'
      });
    } finally {
      setRegistrationLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading events" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Events</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 w-full overflow-x-hidden">
      <div className="container-custom px-2 sm:px-4 w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-ajira-primary mb-4">Upcoming Events</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Join our community events, workshops, and networking sessions. 
            Connect with like-minded professionals and expand your skills.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
            <button className="bg-ajira-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-ajira-primary/90 transition-colors">
              Browse Events
            </button>
            <button className="bg-white text-ajira-primary border-2 border-ajira-primary px-8 py-3 rounded-lg font-semibold hover:bg-ajira-primary/5 transition-colors">
              View Calendar
            </button>
          </div>
        </div>

        {/* Registration Status */}
        {registrationStatus && (
          <div className={`mb-8 p-6 rounded-lg ${
            registrationStatus.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start">
              {registrationStatus.type === 'success' ? (
                <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-1" />
              )}
              <div>
                <h3 className={`font-semibold ${
                  registrationStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {registrationStatus.type === 'success' ? '🎉 Registration Successful!' : '❌ Registration Failed'}
                </h3>
                <p className={`mt-2 ${
                  registrationStatus.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {registrationStatus.message}
                </p>
                {registrationStatus.registrationStatus && (
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Status:</strong> {registrationStatus.registrationStatus}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Registration Form Modal */}
        {showRegistrationForm && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Register for Event</h2>
                <button
                  onClick={() => setShowRegistrationForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">{selectedEvent.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(selectedEvent.schedule.startDate)} • {formatTime(selectedEvent.schedule.startTime)} - {formatTime(selectedEvent.schedule.endTime)}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedEvent.location.venue || 'Virtual Event'}
                </p>
              </div>

              <form onSubmit={submitRegistration} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={registrationData.name}
                      onChange={handleRegistrationChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={registrationData.email}
                      onChange={handleRegistrationChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={registrationData.phone}
                      onChange={handleRegistrationChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={registrationData.organization}
                      onChange={handleRegistrationChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={registrationData.title}
                    onChange={handleRegistrationChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests or Accessibility Needs
                  </label>
                  <textarea
                    name="specialRequests"
                    value={registrationData.specialRequests}
                    onChange={handleRegistrationChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationForm(false)}
                    className="px-6 py-3 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={registrationLoading}
                    className="px-8 py-3 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {registrationLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        <span>Register for Event</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8 w-full">
          <div className="flex flex-wrap gap-4 items-center mb-4 w-full">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] sm:min-w-64">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 focus:border-transparent text-base sm:text-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 text-base sm:text-lg"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Event Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 text-base sm:text-lg"
            >
              <option value="all">All Types</option>
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 text-base sm:text-lg"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Free Only Filter */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showFreeOnly}
                onChange={(e) => setShowFreeOnly(e.target.checked)}
                className="w-4 h-4 text-ajira-primary"
              />
              <span className="text-sm font-medium text-gray-700">Free Only</span>
            </label>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-ajira-primary text-white' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-ajira-primary text-white' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found</span>
            <span>Showing {selectedCategory !== 'all' ? selectedCategory : 'all categories'}</span>
          </div>
        </div>

        {/* Events Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mb-12 w-full' : 'space-y-6 mb-12 w-full'}>
          {filteredEvents.map((event) => {
            const availability = getAvailabilityStatus(event);
            const timeUntil = getTimeUntilEvent(event.schedule.startDate);
            
            return (
              <div 
                key={event._id}
                className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Event Image Placeholder */}
                <div className={`bg-gradient-to-r from-ajira-primary to-ajira-secondary ${
                  viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48 w-full'
                } flex items-center justify-center text-white`}>
                  {getCategoryIcon(event.category)}
                  <span className="ml-2 font-semibold">{event.category}</span>
                </div>

                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  {/* Event Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.eventType)}`}>
                          {event.eventType}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${availability.color}`}>
                          {availability.text}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="text-gray-400 hover:text-red-500">
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button className="text-gray-400 hover:text-blue-500">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

                  {/* Event Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(event.schedule.startDate)} • {timeUntil}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{formatTime(event.schedule.startTime)} - {formatTime(event.schedule.endTime)}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{event.location.venue || 'Virtual Event'}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{event.registration.registered}/{event.registration.capacity} registered</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>{event.pricing.isFree ? 'Free' : `KES ${event.pricing.regularPrice.toLocaleString()}`}</span>
                    </div>
                  </div>

                  {/* Speakers */}
                  {event.speakers && event.speakers.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Speakers:</p>
                      <div className="flex flex-wrap gap-2">
                        {event.speakers.slice(0, 2).map((speaker, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {speaker.name}
                          </span>
                        ))}
                        {event.speakers.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{event.speakers.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button 
                      className="flex-1 px-4 py-2 text-sm border border-ajira-primary text-ajira-primary rounded-lg hover:bg-ajira-primary/5 transition-colors"
                    >
                      <Eye className="w-4 h-4 inline mr-2" />
                      View Details
                    </button>
                    <button 
                      onClick={() => handleRegister(event)}
                      disabled={availability.text === 'Past Event' || availability.text === 'Registration Closed'}
                      className={`flex-1 px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                        availability.text === 'Past Event' || availability.text === 'Registration Closed'
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-ajira-primary text-white hover:bg-ajira-primary/90'
                      }`}
                    >
                      <UserPlus className="w-4 h-4 inline mr-2" />
                      {availability.text === 'Waitlist Available' ? 'Join Waitlist' : 'Register'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms or filters.' 
                : 'No events match your current filters.'
              }
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedType('all');
                setSelectedCity('all');
                setShowFreeOnly(false);
              }}
              className="bg-ajira-primary text-white px-6 py-2 rounded-lg hover:bg-ajira-primary/90"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        {filteredEvents.length > 0 && (
          <div className="bg-gradient-to-r from-ajira-primary to-ajira-secondary rounded-lg p-4 sm:p-8 text-center w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Don't miss out on upcoming events!
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              Stay updated with the latest events, workshops, and networking opportunities. 
              Join our community and never miss an event that could change your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
              <button className="bg-white text-ajira-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto">
                Subscribe to Updates
              </button>
              <button className="bg-ajira-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-ajira-accent/90 transition-colors w-full sm:w-auto">
                Organize an Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage; 