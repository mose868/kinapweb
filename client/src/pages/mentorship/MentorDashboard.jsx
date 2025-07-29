import React, { useState, useEffect } from 'react';
import { 
  Car, 
  User, 
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  MessageCircle,
  Phone,
  Video,
  Calendar,
  DollarSign,
  Star,
  Activity,
  BarChart3,
  Settings,
  Bell,
  Power,
  Navigation,
  Zap,
  Users,
  TrendingUp,
  Award,
  Heart,
  Target,
  Loader2,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MentorDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [mentorId, setMentorId] = useState('670b8f123d4e567890abcdef'); // Mock mentor ID
  const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'sessions', 'earnings', 'profile'
  const [pendingRequests, setPendingRequests] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [mentorStats, setMentorStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState({ lat: -1.2921, lng: 36.8219 });

  // Mock data for demonstration (in real app, this would come from API)
  const [mockRequests] = useState([
    {
      requestId: 'REQ_001',
      mentee: { name: 'Jane Doe', email: 'jane@example.com' },
      sessionType: 'Quick Question',
      category: 'Web Development',
      urgency: 'High',
      problemDescription: 'Need help with React hooks implementation',
      preferredDuration: 30,
      location: { city: 'Nairobi', distance: '2.5 km' },
      requestedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      timeElapsed: '5 minutes ago'
    },
    {
      requestId: 'REQ_002',
      mentee: { name: 'John Smith', email: 'john@example.com' },
      sessionType: 'Career Advice',
      category: 'Career Development',
      urgency: 'Medium',
      problemDescription: 'Looking for guidance on transitioning to tech career',
      preferredDuration: 45,
      location: { city: 'Nairobi', distance: '5.1 km' },
      requestedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      timeElapsed: '10 minutes ago'
    }
  ]);

  const [mockSessions] = useState([
    {
      sessionId: 'SES_001',
      mentee: { name: 'Alice Johnson', email: 'alice@example.com' },
      sessionInfo: { 
        title: 'JavaScript Fundamentals',
        category: 'Web Development',
        type: 'Scheduled'
      },
      scheduling: {
        scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 60
      },
      format: { type: 'Virtual', platform: 'Zoom' },
      status: { current: 'Confirmed' }
    },
    {
      sessionId: 'SES_002',
      mentee: { name: 'Bob Wilson', email: 'bob@example.com' },
      sessionInfo: { 
        title: 'React Best Practices',
        category: 'Web Development',
        type: 'Instant'
      },
      scheduling: {
        scheduledFor: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        duration: 45
      },
      format: { type: 'Virtual', platform: 'Google Meet' },
      status: { current: 'In Progress' }
    }
  ]);

  const [mockStats] = useState({
    totalSessions: 47,
    completedSessions: 42,
    averageRating: 4.8,
    totalEarnings: 58500,
    thisWeekSessions: 8,
    thisWeekEarnings: 12000,
    responseTime: '12 minutes',
    acceptanceRate: 89
  });

  useEffect(() => {
    fetchDashboardData();
    
    // Get current location for proximity-based requests
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, [mentorId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // For demo purposes, using mock data
      // In real app, these would be actual API calls:
      /*
      const [requestsRes, sessionsRes, historyRes] = await Promise.all([
        axios.get(`${BASEURL}/mentorship/mentor/${mentorId}/requests`),
        axios.get(`${BASEURL}/mentorship/mentor/${mentorId}/sessions?status=upcoming`),
        axios.get(`${BASEURL}/mentorship/mentor/${mentorId}/sessions?status=completed`)
      ]);
      
      setPendingRequests(requestsRes.data.requests);
      setUpcomingSessions(sessionsRes.data.sessions);
      setSessionHistory(historyRes.data.sessions);
      */
      
      // Using mock data for demonstration
      setPendingRequests(mockRequests);
      setUpcomingSessions(mockSessions);
      setSessionHistory([]);
      setMentorStats(mockStats);
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      setIsOnline(!isOnline);
      // In real app, update mentor availability status
      /*
      await axios.patch(`${BASEURL}/mentorship/mentor/${mentorId}/availability`, {
        isAvailable: !isOnline
      });
      */
    } catch (error) {
      console.error('Failed to update availability:', error);
      setIsOnline(isOnline); // Revert on error
    }
  };

  const respondToRequest = async (requestId, response, message = '') => {
    try {
      /*
      await axios.post(`${BASEURL}/mentorship/request/${requestId}/respond`, {
        mentorId,
        response,
        message
      });
      */
      
      // Update local state (mock)
      setPendingRequests(prev => prev.filter(req => req.requestId !== requestId));
      
      if (response === 'Accepted') {
        // Move to upcoming sessions
        const acceptedRequest = pendingRequests.find(req => req.requestId === requestId);
        if (acceptedRequest) {
          const newSession = {
            sessionId: `SES_${Date.now()}`,
            mentee: acceptedRequest.mentee,
            sessionInfo: {
              title: acceptedRequest.sessionType,
              category: acceptedRequest.category,
              type: 'Instant'
            },
            scheduling: {
              scheduledFor: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
              duration: acceptedRequest.preferredDuration
            },
            format: { type: 'Virtual', platform: 'Zoom' },
            status: { current: 'Confirmed' }
          };
          setUpcomingSessions(prev => [...prev, newSession]);
        }
      }
    } catch (error) {
      console.error('Failed to respond to request:', error);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSessionStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Completed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-ajira-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading your mentor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-ajira-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mentor Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, Mentor!</p>
              </div>
            </div>

            {/* Online Status Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                <button
                  onClick={toggleOnlineStatus}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ajira-primary focus:ring-offset-2 ${
                    isOnline ? 'bg-ajira-primary' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isOnline ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      {isOnline && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-medium">You're online and available for mentoring</span>
                </div>
                <div className="text-green-600">
                  {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="text-green-600">
                Response time: {mentorStats.responseTime}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{mentorStats.totalSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{mentorStats.averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">KES {mentorStats.thisWeekEarnings?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Acceptance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{mentorStats.acceptanceRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'requests', name: 'Pending Requests', icon: Bell, count: pendingRequests.length },
                { id: 'sessions', name: 'Upcoming Sessions', icon: Calendar, count: upcomingSessions.length },
                { id: 'earnings', name: 'Earnings', icon: DollarSign },
                { id: 'profile', name: 'Profile', icon: User }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-ajira-primary text-ajira-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Pending Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pending Mentorship Requests
                  </h2>
                  <div className="text-sm text-gray-600">
                    {pendingRequests.length} active request{pendingRequests.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {pendingRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
                    <p className="text-gray-600">
                      {isOnline 
                        ? "You're online and ready to receive requests!" 
                        : "Go online to start receiving mentorship requests."
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.requestId} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {request.sessionType}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency)}`}>
                                {request.urgency} Priority
                              </span>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4" />
                                <span>{request.mentee.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Target className="w-4 h-4" />
                                <span>{request.category}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>{request.preferredDuration} minutes • {request.timeElapsed}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{request.location.city} • {request.location.distance}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => respondToRequest(request.requestId, 'Declined')}
                              className="p-3 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                              title="Decline"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => respondToRequest(request.requestId, 'Accepted')}
                              className="p-3 bg-ajira-primary text-white hover:bg-ajira-primary/90 rounded-full transition-colors"
                              title="Accept"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">Problem Description:</h4>
                          <p className="text-gray-700 text-sm">{request.problemDescription}</p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex space-x-2">
                            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                              <MessageCircle className="w-4 h-4" />
                              <span>Message</span>
                            </button>
                            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                              <Phone className="w-4 h-4" />
                              <span>Call</span>
                            </button>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Request ID: {request.requestId}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Upcoming Sessions Tab */}
            {activeTab === 'sessions' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Upcoming Sessions
                  </h2>
                  <div className="text-sm text-gray-600">
                    {upcomingSessions.length} scheduled session{upcomingSessions.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {upcomingSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming sessions</h3>
                    <p className="text-gray-600">
                      Accept pending requests to schedule new mentoring sessions.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.sessionId} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {session.sessionInfo.title}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSessionStatusColor(session.status.current)}`}>
                                {session.status.current}
                              </span>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4" />
                                <span>{session.mentee.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Target className="w-4 h-4" />
                                <span>{session.sessionInfo.category}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {formatTime(session.scheduling.scheduledFor)} • {session.scheduling.duration} minutes
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Video className="w-4 h-4" />
                                <span>{session.format.platform} • {session.format.type}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            {session.status.current === 'In Progress' ? (
                              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                Join Session
                              </button>
                            ) : (
                              <button className="px-4 py-2 bg-ajira-primary text-white rounded-lg hover:bg-ajira-primary/90 transition-colors">
                                Start Session
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                              <MessageCircle className="w-4 h-4" />
                              <span>Message</span>
                            </button>
                            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                              <Calendar className="w-4 h-4" />
                              <span>Reschedule</span>
                            </button>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Session ID: {session.sessionId}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Earnings Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
                    <p className="text-3xl font-bold">KES {mentorStats.totalEarnings?.toLocaleString()}</p>
                    <p className="text-green-100 text-sm mt-2">Across {mentorStats.completedSessions} completed sessions</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">This Week</h3>
                    <p className="text-3xl font-bold">KES {mentorStats.thisWeekEarnings?.toLocaleString()}</p>
                    <p className="text-blue-100 text-sm mt-2">{mentorStats.thisWeekSessions} sessions completed</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Average per session</span>
                      <span className="font-semibold">KES {Math.round(mentorStats.totalEarnings / mentorStats.completedSessions).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Sessions this month</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Monthly earnings</span>
                      <span className="font-semibold">KES 18,500</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600">Pending payments</span>
                      <span className="font-semibold text-yellow-600">KES 3,200</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Mentor Profile</h2>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Status</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Profile completion</span>
                        <span className="font-semibold text-green-600">100%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Verification status</span>
                        <span className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="font-semibold text-green-600">Verified</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Badge level</span>
                        <span className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-yellow-600" />
                          <span className="font-semibold text-yellow-600">Gold</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Instant mentoring</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-ajira-primary">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Push notifications</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-ajira-primary">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Weekend availability</span>
                        <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard; 