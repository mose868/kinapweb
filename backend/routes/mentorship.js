const express = require('express');
const Mentorship = require('../models/Mentorship');
const MentorshipRequest = require('../models/MentorshipRequest');
const MentorSession = require('../models/MentorSession');
const MentorApplication = require('../models/MentorApplication');
const mentorNotificationService = require('../services/mentorNotificationService');

const router = express.Router();

// ================== PUBLIC MENTORSHIP ROUTES ==================

// Get all active mentors (public)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      expertiseLevel, 
      city,
      isFree,
      instantAvailable,
      search,
      limit = 20, 
      skip = 0 
    } = req.query;

    let options = { 
      limit: parseInt(limit), 
      skip: parseInt(skip)
    };
    
    if (category && category !== 'all') options.category = category;
    if (expertiseLevel && expertiseLevel !== 'all') options.expertiseLevel = expertiseLevel;
    if (city && city !== 'all') options.city = city;
    if (isFree !== undefined) options.isFree = isFree === 'true';
    if (instantAvailable === 'true') options.featured = true; // Use featured as proxy for instant

    let mentors;
    
    if (search) {
      // Text search
      let query = {
        status: 'Active',
        $text: { $search: search }
      };
      
      if (options.category) query.category = options.category;
      if (options.expertiseLevel) query.expertiseLevel = options.expertiseLevel;
      if (options.city) query['location.city'] = options.city;
      if (options.isFree !== undefined) query['pricing.isFree'] = options.isFree;
      
      mentors = await Mentorship.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' }, 'ratings.overall': -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .select('-reviews -statistics -internalNotes');
    } else {
      mentors = await Mentorship.getUpcomingMentors ? 
        await Mentorship.getUpcomingMentors(options) :
        await Mentorship.find({ status: 'Active' })
          .sort({ isFeatured: -1, 'ratings.overall': -1 })
          .limit(parseInt(limit))
          .skip(parseInt(skip));
    }

    // Calculate total count for pagination
    let totalQuery = { status: 'Active' };
    if (options.category) totalQuery.category = options.category;
    if (options.expertiseLevel) totalQuery.expertiseLevel = options.expertiseLevel;
    if (options.city) totalQuery['location.city'] = options.city;
    if (options.isFree !== undefined) totalQuery['pricing.isFree'] = options.isFree;
    if (search) totalQuery.$text = { $search: search };

    const total = await Mentorship.countDocuments(totalQuery);

    res.json({
      mentors,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: skip > 0
      }
    });
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get featured mentors (public)
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const mentors = await Mentorship.getFeaturedMentors ? 
      await Mentorship.getFeaturedMentors(parseInt(limit)) :
      await Mentorship.find({ status: 'Active', isFeatured: true })
        .sort({ 'ratings.overall': -1 })
        .limit(parseInt(limit));
    
    res.json({
      mentors,
      count: mentors.length
    });
  } catch (error) {
    console.error('Get featured mentors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single mentor by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const mentor = await Mentorship.findOne({ 
      slug, 
      status: 'Active'
    }).select('-internalNotes -statistics.detailed');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Increment view count
    if (mentor.incrementViews) {
      await mentor.incrementViews();
    }

    // Get recent sessions for this mentor
    const recentSessions = await MentorSession.find({
      'mentor.mentorId': mentor._id,
      'status.current': 'Completed'
    })
      .sort({ 'scheduling.scheduledFor': -1 })
      .limit(5)
      .select('feedback.menteeFeedback.rating sessionInfo.category scheduling.scheduledFor');

    // Add virtual properties to response
    const mentorResponse = {
      ...mentor.toObject(),
      profileUrl: mentor.profileUrl,
      availabilityStatus: mentor.availabilityStatus,
      displayPrice: mentor.displayPrice,
      recentSessions: recentSessions
    };

    res.json(mentorResponse);
  } catch (error) {
    console.error('Get mentor by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review to mentor (public)
router.post('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      menteeName, 
      menteeEmail,
      rating, 
      comment, 
      sessionType 
    } = req.body;

    if (!menteeName || !rating || !rating.overall) {
      return res.status(400).json({ message: 'Mentee name and overall rating are required' });
    }

    // Validate rating values
    const ratingFields = ['overall', 'communication', 'expertise', 'helpfulness'];
    for (const field of ratingFields) {
      if (rating[field] && (rating[field] < 1 || rating[field] > 5)) {
        return res.status(400).json({ message: `${field} rating must be between 1 and 5` });
      }
    }

    const mentor = await Mentorship.findById(id);
    
    if (!mentor || mentor.status !== 'Active') {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    const reviewData = {
      menteeName,
      menteeEmail,
      rating: {
        overall: parseInt(rating.overall),
        communication: parseInt(rating.communication) || parseInt(rating.overall),
        expertise: parseInt(rating.expertise) || parseInt(rating.overall),
        helpfulness: parseInt(rating.helpfulness) || parseInt(rating.overall)
      },
      comment: comment || '',
      sessionType: sessionType || 'General',
      date: new Date(),
      isVerified: false,
      isPublic: true
    };

    await mentor.addReview(reviewData);

    res.json({ 
      message: 'Review added successfully',
      ratings: mentor.ratings
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories and metadata (public)
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Mentorship.distinct('category', { 
      status: 'Active'
    });

    const expertiseLevels = await Mentorship.distinct('expertiseLevel', { 
      status: 'Active'
    });

    const cities = await Mentorship.distinct('location.city', { status: 'Active' });

    const categoriesWithCounts = await Mentorship.aggregate([
      { $match: { status: 'Active', 'availability.isAvailable': true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({ 
      categories,
      expertiseLevels,
      cities,
      categoriesWithCounts: categoriesWithCounts.map(cat => ({
        category: cat._id,
        count: cat.count
      }))
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================== UBER-LIKE MENTOR REQUEST ROUTES ==================

// Create mentorship request (Uber-like request for help)
router.post('/request', async (req, res) => {
  try {
    const requestData = {
      ...req.body,
      status: 'Pending'
    };

    const request = await MentorshipRequest.create(requestData);
    
    // Broadcast request to mentors (Uber-like system)
    const broadcastResult = await mentorNotificationService.broadcastRequestToMentors(request._id, {
      maxMentors: 5,
      onlineOnly: request.urgency === 'Critical' || request.requestType === 'Instant'
    });

    let responseMessage = 'Mentorship request created successfully!';
    let estimatedResponse = '24 hours';

    if (broadcastResult.notifiedMentors > 0) {
      responseMessage = `Request sent to ${broadcastResult.notifiedMentors} available mentors!`;
      estimatedResponse = broadcastResult.estimatedResponseTime || '15 minutes';
    } else {
      responseMessage = 'Request created. Looking for available mentors...';
    }

    res.status(201).json({ 
      message: responseMessage,
      request: {
        requestId: request.requestId,
        status: request.status,
        urgency: request.urgency,
        category: request.category,
        estimatedResponseTime: estimatedResponse,
        mentorsNotified: broadcastResult.notifiedMentors || 0
      },
      broadcastResult
    });
  } catch (error) {
    console.error('Create mentorship request error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get mentorship request status (for mentee to track)
router.get('/request/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = await MentorshipRequest.findOne({ requestId })
      .populate('selectedMentor.mentorId', 'mentor.name mentor.email mentor.profileImage pricing.sessionRate')
      .populate('targetedMentors.mentorId', 'mentor.name mentor.email');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({
      request: {
        ...request.toObject(),
        timeElapsed: request.timeElapsed,
        statusDisplay: request.statusDisplay,
        urgencyScore: request.urgencyScore
      }
    });
  } catch (error) {
    console.error('Get request status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mentor responds to request (accept/decline)
router.post('/request/:requestId/respond', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { mentorId, response, message } = req.body;

    if (!['Accepted', 'Declined'].includes(response)) {
      return res.status(400).json({ message: 'Invalid response. Must be Accepted or Declined' });
    }

    const request = await MentorshipRequest.findOne({ requestId });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if mentor already responded
    const existingResponse = request.targetedMentors.find(tm => tm.mentorId.toString() === mentorId);
    if (!existingResponse) {
      return res.status(400).json({ message: 'Mentor not targeted for this request' });
    }

    if (existingResponse.response !== 'Pending') {
      return res.status(400).json({ message: 'Mentor has already responded to this request' });
    }

    // Update mentor response
    await request.updateMentorResponse(mentorId, response, message);

    if (response === 'Accepted') {
      // If accepted, create a session
      const sessionData = {
        mentor: {
          mentorId: mentorId,
          name: `Mentor ${mentorId}`, // In real app, get from mentor profile
          email: `mentor${mentorId}@example.com`
        },
        mentee: {
          name: request.mentee.name,
          email: request.mentee.email
        },
        sessionInfo: {
          type: request.requestType,
          category: request.category,
          title: `${request.sessionType} Session`,
          description: request.problemDescription,
          objectives: ['Help with specific problem', 'Provide guidance'],
          expectedOutcomes: ['Problem resolution', 'Learning new skills']
        },
        scheduling: {
          scheduledFor: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
          duration: request.preferredDuration || 30
        },
        format: {
          type: 'Virtual',
          platform: 'Zoom'
        },
        status: {
          current: 'Confirmed',
          mentorConfirmed: true,
          menteeConfirmed: false
        }
      };

      const session = await MentorSession.create(sessionData);

      // Update request status
      request.status = 'Matched';
      request.selectedMentor = {
        mentorId: mentorId,
        acceptedAt: new Date()
      };
      await request.save();

      res.json({ 
        message: 'Request accepted successfully! Session created.',
        request: {
          requestId: request.requestId,
          status: request.status
        },
        session: {
          sessionId: session.sessionId,
          scheduledFor: session.scheduling.scheduledFor,
          duration: session.scheduling.duration
        }
      });
    } else {
      res.json({ 
        message: 'Request declined.',
        request: {
          requestId: request.requestId,
          status: request.status
        }
      });
    }

    // Notify mentee about the response
    await mentorNotificationService.notifyMenteeAboutResponse(requestId, response, { mentorId, message });

  } catch (error) {
    console.error('Mentor respond error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start mentorship session
router.post('/request/:requestId/start-session', async (req, res) => {
  try {
    const { requestId } = req.params;
    const sessionData = req.body;

    const request = await MentorshipRequest.findOne({ requestId });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'Matched') {
      return res.status(400).json({ message: 'Request must be matched before starting session' });
    }

    await request.startSession(sessionData);

    // Update mentor session count
    if (request.selectedMentor.mentorId) {
      const mentor = await Mentorship.findById(request.selectedMentor.mentorId);
      if (mentor) {
        await mentor.incrementSessions();
      }
    }

    res.json({ 
      message: 'Session started successfully',
      request: {
        requestId: request.requestId,
        status: request.status,
        session: request.session
      }
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete mentorship session
router.post('/request/:requestId/complete', async (req, res) => {
  try {
    const { requestId } = req.params;
    const sessionData = req.body;

    const request = await MentorshipRequest.findOne({ requestId });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'In Progress') {
      return res.status(400).json({ message: 'Session must be in progress to complete' });
    }

    await request.completeSession(sessionData);

    // Update mentor's instant session count
    if (request.selectedMentor.mentorId) {
      const mentor = await Mentorship.findById(request.selectedMentor.mentorId);
      if (mentor && request.requestType === 'Instant') {
        mentor.instantAvailability.currentInstantSessions = Math.max(0, 
          mentor.instantAvailability.currentInstantSessions - 1
        );
        await mentor.save();
      }
    }

    res.json({ 
      message: 'Session completed successfully',
      request: {
        requestId: request.requestId,
        status: request.status,
        session: request.session
      }
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending requests for a mentor (Uber-like driver app)
router.get('/mentor/:mentorId/requests', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { status = 'all' } = req.query;

    let query = {
      'targetedMentors.mentorId': mentorId
    };

    if (status !== 'all') {
      query['targetedMentors.response'] = status;
    }

    const requests = await MentorshipRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .select('-targetedMentors');

    res.json({
      requests,
      count: requests.length
    });
  } catch (error) {
    console.error('Get mentor requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================== MENTOR SESSION ROUTES ==================

// Get mentor sessions
router.get('/mentor/:mentorId/sessions', async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { status = 'all', limit = 20, skip = 0 } = req.query;

    let sessions;
    if (status === 'upcoming') {
      sessions = await MentorSession.getUpcomingSessions(mentorId, { limit: parseInt(limit), skip: parseInt(skip) });
    } else if (status === 'completed') {
      sessions = await MentorSession.getSessionHistory(mentorId, { limit: parseInt(limit), skip: parseInt(skip), status: 'Completed' });
    } else {
      let query = { 'mentor.mentorId': mentorId };
      sessions = await MentorSession.find(query)
        .sort({ 'scheduling.scheduledFor': -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));
    }

    res.json({
      sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Get mentor sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get mentee sessions
router.get('/mentee/:email/sessions', async (req, res) => {
  try {
    const { email } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const sessions = await MentorSession.getMenteeSessions(email, { 
      limit: parseInt(limit), 
      skip: parseInt(skip) 
    });

    res.json({
      sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Get mentee sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm session
router.post('/sessions/:sessionId/confirm', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { confirmedBy } = req.body; // 'mentor' or 'mentee'

    const session = await MentorSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.confirmSession(confirmedBy);

    res.json({
      message: `Session confirmed by ${confirmedBy}`,
      session: {
        sessionId: session.sessionId,
        status: session.status.current,
        mentorConfirmed: session.status.mentorConfirmed,
        menteeConfirmed: session.status.menteeConfirmed
      }
    });
  } catch (error) {
    console.error('Confirm session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start session
router.post('/sessions/:sessionId/start', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await MentorSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.startSession();

    res.json({
      message: 'Session started successfully',
      session: {
        sessionId: session.sessionId,
        status: session.status.current,
        startTime: session.execution.actualStartTime
      }
    });
  } catch (error) {
    console.error('Start session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete session
router.post('/sessions/:sessionId/complete', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { mentorNotes, actionItems, completedBy } = req.body;

    const session = await MentorSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.completeSession({
      mentorNotes,
      actionItems,
      completedBy
    });

    res.json({
      message: 'Session completed successfully',
      session: {
        sessionId: session.sessionId,
        status: session.status.current,
        duration: session.execution.actualDuration
      }
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add session feedback
router.post('/sessions/:sessionId/feedback', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { feedbackBy, ...feedbackData } = req.body; // 'mentor' or 'mentee'

    const session = await MentorSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.addFeedback(feedbackData, feedbackBy);

    res.json({
      message: `Feedback submitted by ${feedbackBy}`,
      session: {
        sessionId: session.sessionId,
        averageRating: session.averageRating,
        sessionSuccess: session.sessionSuccess
      }
    });
  } catch (error) {
    console.error('Add session feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reschedule session
router.post('/sessions/:sessionId/reschedule', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { newDateTime, reason, initiatedBy } = req.body;

    const session = await MentorSession.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.rescheduleSession(new Date(newDateTime), reason, initiatedBy);

    res.json({
      message: 'Session rescheduled successfully',
      session: {
        sessionId: session.sessionId,
        newScheduledTime: session.scheduling.scheduledFor,
        rescheduledCount: session.scheduling.rescheduledCount
      }
    });
  } catch (error) {
    console.error('Reschedule session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================== ADMIN ROUTES ==================

// Get all mentors for admin (includes inactive)
router.get('/admin/mentors', async (req, res) => {
  try {
    const { 
      category, 
      expertiseLevel, 
      status,
      city,
      limit = 100, 
      skip = 0 
    } = req.query;

    let query = {};

    if (category && category !== 'all') query.category = category;
    if (expertiseLevel && expertiseLevel !== 'all') query.expertiseLevel = expertiseLevel;
    if (status && status !== 'all') query.status = status;
    if (city && city !== 'all') query['location.city'] = city;

    const mentors = await Mentorship.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Mentorship.countDocuments(query);

    res.json({
      mentors,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin mentors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all mentorship requests for admin
router.get('/admin/requests', async (req, res) => {
  try {
    const { 
      status, 
      urgency,
      category,
      limit = 100, 
      skip = 0 
    } = req.query;

    let query = {};

    if (status && status !== 'all') query.status = status;
    if (urgency && urgency !== 'all') query.urgency = urgency;
    if (category && category !== 'all') query.category = category;

    const requests = await MentorshipRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await MentorshipRequest.countDocuments(query);

    res.json({
      requests,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sessions for admin
router.get('/admin/sessions', async (req, res) => {
  try {
    const { 
      status, 
      category,
      mentorId,
      limit = 100, 
      skip = 0 
    } = req.query;

    let query = {};

    if (status && status !== 'all') query['status.current'] = status;
    if (category && category !== 'all') query['sessionInfo.category'] = category;
    if (mentorId) query['mentor.mentorId'] = mentorId;

    const sessions = await MentorSession.find(query)
      .sort({ 'scheduling.scheduledFor': -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('mentor.mentorId', 'mentor.name');

    const total = await MentorSession.countDocuments(query);

    res.json({
      sessions,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get mentorship statistics (admin)
router.get('/admin/stats/overview', async (req, res) => {
  try {
    const totalMentors = await Mentorship.countDocuments();
    const activeMentors = await Mentorship.countDocuments({ status: 'Active' });
    const totalRequests = await MentorshipRequest.countDocuments();
    const pendingRequests = await MentorshipRequest.countDocuments({ status: 'Pending' });
    const totalSessions = await MentorSession.countDocuments();
    const completedSessions = await MentorSession.countDocuments({ 'status.current': 'Completed' });

    // Applications statistics
    const totalApplications = await MentorApplication.countDocuments();
    const pendingApplications = await MentorApplication.countDocuments({ 'applicationStatus.status': 'Submitted' });
    const approvedApplications = await MentorApplication.countDocuments({ 'applicationStatus.status': 'Approved' });

    // Category stats
    const categoryStats = await Mentorship.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Expertise level stats
    const expertiseStats = await Mentorship.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$expertiseLevel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Session completion rate
    const sessionStats = await MentorSession.aggregate([
      {
        $group: {
          _id: '$status.current',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top mentors by rating
    const topMentors = await Mentorship.find({ 
      status: 'Active',
      'ratings.totalRatings': { $gt: 0 }
    })
      .sort({ 'ratings.overall': -1 })
      .limit(5)
      .select('mentor.name ratings.overall ratings.totalRatings category');

    res.json({
      mentorshipStats: {
        totalMentors,
        activeMentors,
        totalRequests,
        pendingRequests,
        totalSessions,
        completedSessions,
        totalApplications,
        pendingApplications,
        approvedApplications,
        categoryStats,
        expertiseStats,
        sessionStats,
        topMentors,
        completionRate: totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Get mentorship stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get mentor categories and metadata (public)
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Mentorship.distinct('category', { status: 'Active' });
    const expertiseLevels = await Mentorship.distinct('expertiseLevel', { status: 'Active' });
    const cities = await Mentorship.distinct('location.city', { status: 'Active' });

    const categoriesWithCounts = await Mentorship.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({ 
      categories,
      expertiseLevels,
      cities,
      categoriesWithCounts: categoriesWithCounts.map(cat => ({
        category: cat._id,
        count: cat.count
      }))
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rest of the existing admin routes...
// [Previous admin routes for creating, updating, deleting mentors remain the same]

module.exports = router; 