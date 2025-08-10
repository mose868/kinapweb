import React, { useState, useEffect } from 'react';
import {
  Brain,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  TrendingUp,
  AlertTriangle,
  Eye,
  MessageSquare,
  Calendar,
  Star,
  Target,
  Activity,
  Filter,
  Search,
  Download,
  BarChart3,
  Zap,
  Bot,
  UserCheck,
  Briefcase,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Loader2,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';

const BASEURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MentorApplicationsAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [aiRecommendations, setAIRecommendations] = useState({});
  const [filters, setFilters] = useState({
    status: 'all',
    step: 'all',
    minScore: '',
    industry: 'all',
    experience: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplications, setSelectedApplications] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [aiProcessing, setAIProcessing] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [bulkAction, setBulkAction] = useState('');

  // Mock data for demonstration
  const [mockApplications] = useState([
    {
      applicationId: 'APP_001',
      personalInfo: {
        firstName: 'Sarah',
        lastName: 'Wanjiku',
        email: 'sarah@example.com',
        phone: '+254712345678',
      },
      professional: {
        currentRole: 'Senior Software Engineer',
        currentCompany: 'Safaricom PLC',
        industry: 'Technology',
        experienceLevel: 'Senior (6-10 years)',
        yearsOfExperience: 8,
      },
      education: {
        highestDegree: "Master's",
        fieldOfStudy: 'Computer Science',
        institution: 'University of Nairobi',
      },
      expertise: {
        primarySkills: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB'],
        specializations: ['Web Development', 'Cloud Computing'],
      },
      applicationStatus: {
        status: 'Submitted',
        currentStep: 'AI Assessment',
        completionPercentage: 100,
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      assessment: {
        overallScore: 92,
        categoryScores: {
          experience: 90,
          communication: 95,
          availability: 88,
          expertise: 95,
          motivation: 90,
        },
        aiEvaluation: {
          recommendation: 'Strong Approve',
          confidenceLevel: 92,
          resumeAnalysis: {
            score: 88,
            strengths: ['Strong technical background', 'Leadership experience'],
            concerns: [],
          },
          skillsMatch: { score: 95, marketDemand: 'High' },
          riskFactors: [],
        },
      },
      applicationAge: '2 days ago',
      approvalReadiness: 'Auto-Approve Ready',
    },
    {
      applicationId: 'APP_002',
      personalInfo: {
        firstName: 'James',
        lastName: 'Mwangi',
        email: 'james@example.com',
        phone: '+254787654321',
      },
      professional: {
        currentRole: 'Data Scientist',
        currentCompany: 'Kenya Commercial Bank',
        industry: 'Finance',
        experienceLevel: 'Mid-Level (3-6 years)',
        yearsOfExperience: 5,
      },
      education: {
        highestDegree: "Bachelor's",
        fieldOfStudy: 'Statistics',
        institution: 'Strathmore University',
      },
      expertise: {
        primarySkills: ['Python', 'R', 'SQL', 'Machine Learning'],
        specializations: ['Data Science', 'Analytics'],
      },
      applicationStatus: {
        status: 'Submitted',
        currentStep: 'Manual Review',
        completionPercentage: 100,
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      assessment: {
        overallScore: 76,
        categoryScores: {
          experience: 75,
          communication: 80,
          availability: 70,
          expertise: 85,
          motivation: 75,
        },
        aiEvaluation: {
          recommendation: 'Approve',
          confidenceLevel: 78,
          resumeAnalysis: {
            score: 75,
            strengths: ['Good technical skills'],
            concerns: ['Limited mentoring experience'],
          },
          skillsMatch: { score: 80, marketDemand: 'High' },
          riskFactors: [{ factor: 'New to mentoring', severity: 'Low' }],
        },
      },
      applicationAge: '5 days ago',
      approvalReadiness: 'Interview Required',
    },
    {
      applicationId: 'APP_003',
      personalInfo: {
        firstName: 'Grace',
        lastName: 'Achieng',
        email: 'grace@example.com',
        phone: '+254798765432',
      },
      professional: {
        currentRole: 'UX Designer',
        currentCompany: 'iHub',
        industry: 'Technology',
        experienceLevel: 'Mid-Level (3-6 years)',
        yearsOfExperience: 4,
      },
      education: {
        highestDegree: "Bachelor's",
        fieldOfStudy: 'Design',
        institution: 'USIU-Africa',
      },
      expertise: {
        primarySkills: ['Figma', 'Sketch', 'User Research', 'Prototyping'],
        specializations: ['UI/UX Design', 'Product Design'],
      },
      applicationStatus: {
        status: 'Under Review',
        currentStep: 'Interview Scheduled',
        completionPercentage: 100,
        submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      assessment: {
        overallScore: 82,
        categoryScores: {
          experience: 78,
          communication: 88,
          availability: 85,
          expertise: 80,
          motivation: 85,
        },
        aiEvaluation: {
          recommendation: 'Conditional Approve',
          confidenceLevel: 85,
          resumeAnalysis: {
            score: 82,
            strengths: ['Strong design portfolio', 'User-centered approach'],
            concerns: ['Limited teaching experience'],
          },
          skillsMatch: { score: 85, marketDemand: 'Medium' },
          riskFactors: [{ factor: 'First-time mentor', severity: 'Medium' }],
        },
      },
      applicationAge: '8 days ago',
      approvalReadiness: 'Interview Required',
    },
  ]);

  const [mockStats] = useState({
    totalApplications: 47,
    submittedApplications: 12,
    approvedApplications: 23,
    rejectedApplications: 8,
    approvalRate: 74.2,
    avgProcessingTime: '3.2 days',
    aiRecommendations: 15,
    pendingReview: 12,
  });

  const [mockAIRecommendations] = useState({
    autoApprove: [
      {
        applicationId: 'APP_001',
        score: 92,
        name: 'Sarah Wanjiku',
        industry: 'Technology',
      },
    ],
    interviewRequired: [
      {
        applicationId: 'APP_002',
        score: 76,
        name: 'James Mwangi',
        industry: 'Finance',
      },
      {
        applicationId: 'APP_003',
        score: 82,
        name: 'Grace Achieng',
        industry: 'Technology',
      },
    ],
    needsReview: [],
    summary: {
      totalPendingReview: 3,
      autoApproveReady: 1,
      interviewsNeeded: 2,
    },
  });

  useEffect(() => {
    fetchApplicationsData();
    fetchAIRecommendations();
  }, [filters]);

  const fetchApplicationsData = async () => {
    try {
      setLoading(true);

      // Mock API call - in real app:
      // const response = await axios.get(`${BASEURL}/mentor-application/admin/applications`, { params: filters });
      // setApplications(response.data.applications);

      // Using mock data
      setApplications(mockApplications);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIRecommendations = async () => {
    try {
      // Mock API call - in real app:
      // const response = await axios.get(`${BASEURL}/mentor-application/admin/applications/ai-recommendations`);
      // setAIRecommendations(response.data);

      setAIRecommendations(mockAIRecommendations);
    } catch (error) {
      console.error('Failed to fetch AI recommendations:', error);
    }
  };

  const runAIEvaluation = async (applicationId) => {
    try {
      setAIProcessing(true);

      // Mock API call - in real app:
      // await axios.post(`${BASEURL}/mentor-application/admin/applications/${applicationId}/ai-evaluate`);

      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Update application with AI results
      setApplications((prev) =>
        prev.map((app) =>
          app.applicationId === applicationId
            ? {
                ...app,
                assessment: {
                  ...app.assessment,
                  aiEvaluation: {
                    ...app.assessment.aiEvaluation,
                    processed: true,
                  },
                },
              }
            : app
        )
      );
    } catch (error) {
      console.error('AI evaluation failed:', error);
    } finally {
      setAIProcessing(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status, notes = '') => {
    try {
      // Mock API call - in real app:
      // await axios.patch(`${BASEURL}/mentor-application/admin/applications/${applicationId}/status`, { status, notes });

      setApplications((prev) =>
        prev.map((app) =>
          app.applicationId === applicationId
            ? {
                ...app,
                applicationStatus: { ...app.applicationStatus, status },
              }
            : app
        )
      );

      // Refresh recommendations
      await fetchAIRecommendations();
    } catch (error) {
      console.error('Failed to update application status:', error);
    }
  };

  const bulkApproveApplications = async () => {
    try {
      const applicationIds = Array.from(selectedApplications);

      // Mock API call - in real app:
      // await axios.post(`${BASEURL}/mentor-application/admin/applications/bulk-approve`, { applicationIds });

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          selectedApplications.has(app.applicationId)
            ? {
                ...app,
                applicationStatus: {
                  ...app.applicationStatus,
                  status: 'Approved',
                },
              }
            : app
        )
      );

      setSelectedApplications(new Set());
      setBulkAction('');
    } catch (error) {
      console.error('Bulk approval failed:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationIcon = (recommendation) => {
    switch (recommendation) {
      case 'Strong Approve':
        return <ThumbsUp className='w-4 h-4 text-green-600' />;
      case 'Approve':
        return <CheckCircle className='w-4 h-4 text-green-600' />;
      case 'Conditional Approve':
        return <AlertTriangle className='w-4 h-4 text-yellow-600' />;
      case 'Review Needed':
        return <Eye className='w-4 h-4 text-blue-600' />;
      case 'Reject':
        return <ThumbsDown className='w-4 h-4 text-red-600' />;
      default:
        return <AlertCircle className='w-4 h-4 text-gray-600' />;
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      if (
        !app.personalInfo.firstName.toLowerCase().includes(searchLower) &&
        !app.personalInfo.lastName.toLowerCase().includes(searchLower) &&
        !app.personalInfo.email.toLowerCase().includes(searchLower) &&
        !app.professional.currentRole.toLowerCase().includes(searchLower) &&
        !app.professional.currentCompany.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    if (
      filters.status !== 'all' &&
      app.applicationStatus.status !== filters.status
    )
      return false;
    if (
      filters.industry !== 'all' &&
      app.professional.industry !== filters.industry
    )
      return false;
    if (
      filters.minScore &&
      app.assessment.overallScore < parseInt(filters.minScore)
    )
      return false;

    return true;
  });

  return (
    <div className='max-w-7xl mx-auto p-6'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center space-x-3 mb-4'>
          <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
            <Brain className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              AI Mentor Recruiting
            </h1>
            <p className='text-gray-600'>
              Automated application review and mentor onboarding
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
          <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                <Users className='w-5 h-5 text-blue-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Applications</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.totalApplications}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                <CheckCircle className='w-5 h-5 text-green-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Approval Rate</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.approvalRate}%
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center'>
                <Bot className='w-5 h-5 text-purple-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>AI Processed</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.aiRecommendations}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center'>
                <Clock className='w-5 h-5 text-yellow-600' />
              </div>
              <div>
                <p className='text-sm text-gray-600'>Avg Processing</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.avgProcessingTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendations Panel */}
      {showAIInsights && (
        <div className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8 border border-blue-200'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-3'>
              <Brain className='w-6 h-6 text-blue-600' />
              <h2 className='text-lg font-semibold text-gray-900'>
                AI Recommendations
              </h2>
              <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
                {aiRecommendations.summary?.totalPendingReview} pending
              </span>
            </div>
            <button
              onClick={() => setShowAIInsights(false)}
              className='text-gray-400 hover:text-gray-600'
            >
              <XCircle className='w-5 h-5' />
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Auto-Approve Ready */}
            <div className='bg-white rounded-lg p-4 border border-green-200'>
              <div className='flex items-center space-x-2 mb-3'>
                <Zap className='w-5 h-5 text-green-600' />
                <h3 className='font-semibold text-green-900'>
                  Auto-Approve Ready
                </h3>
                <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full'>
                  {aiRecommendations.autoApprove?.length || 0}
                </span>
              </div>
              <div className='space-y-2'>
                {aiRecommendations.autoApprove?.map((app) => (
                  <div
                    key={app.applicationId}
                    className='flex items-center justify-between text-sm'
                  >
                    <span className='font-medium'>{app.name}</span>
                    <span className='text-green-600 font-semibold'>
                      {app.score}/100
                    </span>
                  </div>
                ))}
                {aiRecommendations.autoApprove?.length > 0 && (
                  <button
                    onClick={() => {
                      aiRecommendations.autoApprove.forEach((app) =>
                        updateApplicationStatus(app.applicationId, 'Approved')
                      );
                    }}
                    className='w-full mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors'
                  >
                    Auto-Approve All
                  </button>
                )}
              </div>
            </div>

            {/* Interview Required */}
            <div className='bg-white rounded-lg p-4 border border-yellow-200'>
              <div className='flex items-center space-x-2 mb-3'>
                <Calendar className='w-5 h-5 text-yellow-600' />
                <h3 className='font-semibold text-yellow-900'>
                  Interview Required
                </h3>
                <span className='bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full'>
                  {aiRecommendations.interviewRequired?.length || 0}
                </span>
              </div>
              <div className='space-y-2'>
                {aiRecommendations.interviewRequired?.map((app) => (
                  <div
                    key={app.applicationId}
                    className='flex items-center justify-between text-sm'
                  >
                    <span className='font-medium'>{app.name}</span>
                    <span className='text-yellow-600 font-semibold'>
                      {app.score}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Needs Manual Review */}
            <div className='bg-white rounded-lg p-4 border border-blue-200'>
              <div className='flex items-center space-x-2 mb-3'>
                <Eye className='w-5 h-5 text-blue-600' />
                <h3 className='font-semibold text-blue-900'>Manual Review</h3>
                <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
                  {aiRecommendations.needsReview?.length || 0}
                </span>
              </div>
              <div className='space-y-2'>
                {aiRecommendations.needsReview?.length === 0 ? (
                  <p className='text-sm text-gray-600'>
                    All applications processed
                  </p>
                ) : (
                  aiRecommendations.needsReview.map((app) => (
                    <div
                      key={app.applicationId}
                      className='flex items-center justify-between text-sm'
                    >
                      <span className='font-medium'>{app.name}</span>
                      <span className='text-blue-600 font-semibold'>
                        {app.score}/100
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className='bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <Search className='w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2' />
              <input
                type='text'
                placeholder='Search applications...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
            >
              <option value='all'>All Status</option>
              <option value='Submitted'>Submitted</option>
              <option value='Under Review'>Under Review</option>
              <option value='Approved'>Approved</option>
              <option value='Rejected'>Rejected</option>
            </select>

            <select
              value={filters.industry}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, industry: e.target.value }))
              }
              className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
            >
              <option value='all'>All Industries</option>
              <option value='Technology'>Technology</option>
              <option value='Finance'>Finance</option>
              <option value='Healthcare'>Healthcare</option>
              <option value='Education'>Education</option>
            </select>

            <input
              type='number'
              placeholder='Min AI Score'
              value={filters.minScore}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, minScore: e.target.value }))
              }
              className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50 w-32'
              min='0'
              max='100'
            />
          </div>

          <div className='flex items-center space-x-2'>
            {selectedApplications.size > 0 && (
              <>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ajira-primary/50'
                >
                  <option value=''>Bulk Actions</option>
                  <option value='approve'>Approve Selected</option>
                  <option value='reject'>Reject Selected</option>
                  <option value='interview'>Schedule Interviews</option>
                </select>

                {bulkAction === 'approve' && (
                  <button
                    onClick={bulkApproveApplications}
                    className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors'
                  >
                    Approve {selectedApplications.size}
                  </button>
                )}
              </>
            )}

            <button
              onClick={() => runAIEvaluation('batch')}
              disabled={aiProcessing}
              className='bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50'
            >
              {aiProcessing ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Brain className='w-4 h-4' />
              )}
              <span>Run AI Batch</span>
            </button>

            <button className='bg-ajira-primary text-white px-4 py-2 rounded-lg hover:bg-ajira-primary/90 transition-colors flex items-center space-x-2'>
              <Download className='w-4 h-4' />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Mentor Applications ({filteredApplications.length})
          </h2>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='w-4 px-6 py-3'>
                  <input
                    type='checkbox'
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedApplications(
                          new Set(
                            filteredApplications.map((app) => app.applicationId)
                          )
                        );
                      } else {
                        setSelectedApplications(new Set());
                      }
                    }}
                    className='w-4 h-4 text-ajira-primary'
                  />
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Applicant
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Experience
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  AI Score
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  AI Recommendation
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredApplications.map((application) => (
                <tr
                  key={application.applicationId}
                  className='hover:bg-gray-50'
                >
                  <td className='px-6 py-4'>
                    <input
                      type='checkbox'
                      checked={selectedApplications.has(
                        application.applicationId
                      )}
                      onChange={(e) => {
                        const newSelected = new Set(selectedApplications);
                        if (e.target.checked) {
                          newSelected.add(application.applicationId);
                        } else {
                          newSelected.delete(application.applicationId);
                        }
                        setSelectedApplications(newSelected);
                      }}
                      className='w-4 h-4 text-ajira-primary'
                    />
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='w-10 h-10 bg-ajira-primary/10 rounded-full flex items-center justify-center'>
                        <span className='text-ajira-primary font-semibold'>
                          {application.personalInfo.firstName[0]}
                          {application.personalInfo.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className='font-semibold text-gray-900'>
                          {application.personalInfo.firstName}{' '}
                          {application.personalInfo.lastName}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {application.personalInfo.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className='px-6 py-4'>
                    <div>
                      <p className='font-medium text-gray-900'>
                        {application.professional.currentRole}
                      </p>
                      <p className='text-sm text-gray-600'>
                        {application.professional.currentCompany}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {application.professional.yearsOfExperience} years •{' '}
                        {application.professional.industry}
                      </p>
                    </div>
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex items-center space-x-2'>
                      <span
                        className={`text-2xl font-bold ${getScoreColor(application.assessment.overallScore)}`}
                      >
                        {application.assessment.overallScore}
                      </span>
                      <span className='text-gray-500'>/100</span>
                    </div>
                    <div className='w-24 h-2 bg-gray-200 rounded-full mt-1'>
                      <div
                        className={`h-2 rounded-full ${
                          application.assessment.overallScore >= 85
                            ? 'bg-green-500'
                            : application.assessment.overallScore >= 70
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{
                          width: `${application.assessment.overallScore}%`,
                        }}
                      ></div>
                    </div>
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex items-center space-x-2'>
                      {getRecommendationIcon(
                        application.assessment.aiEvaluation.recommendation
                      )}
                      <span className='font-medium text-sm'>
                        {application.assessment.aiEvaluation.recommendation}
                      </span>
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      {application.assessment.aiEvaluation.confidenceLevel}%
                      confidence
                    </p>
                  </td>

                  <td className='px-6 py-4'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.applicationStatus.status)}`}
                    >
                      {application.applicationStatus.status}
                    </span>
                    <p className='text-xs text-gray-500 mt-1'>
                      {application.applicationAge}
                    </p>
                  </td>

                  <td className='px-6 py-4'>
                    <div className='flex items-center space-x-2'>
                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            application.applicationId,
                            'Approved'
                          )
                        }
                        className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                        title='Approve'
                      >
                        <CheckCircle className='w-4 h-4' />
                      </button>

                      <button
                        onClick={() =>
                          updateApplicationStatus(
                            application.applicationId,
                            'Rejected'
                          )
                        }
                        className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                        title='Reject'
                      >
                        <XCircle className='w-4 h-4' />
                      </button>

                      <button
                        onClick={() =>
                          runAIEvaluation(application.applicationId)
                        }
                        className='p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors'
                        title='Run AI Evaluation'
                      >
                        <Brain className='w-4 h-4' />
                      </button>

                      <button
                        className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                        title='View Details'
                      >
                        <Eye className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className='text-center py-12'>
            <Users className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              No applications found
            </h3>
            <p className='text-gray-600'>
              Try adjusting your filters or search criteria.
            </p>
          </div>
        )}
      </div>

      {/* AI Processing Modal */}
      {aiProcessing && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-8 max-w-md w-full mx-4'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Brain className='w-8 h-8 text-purple-600 animate-pulse' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                AI Processing Applications
              </h3>
              <p className='text-gray-600 mb-4'>
                Our AI is analyzing applications and generating
                recommendations...
              </p>
              <div className='flex items-center justify-center space-x-2'>
                <Loader2 className='w-5 h-5 animate-spin text-purple-600' />
                <span className='text-sm text-gray-600'>
                  Analyzing candidate profiles
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorApplicationsAdmin;
