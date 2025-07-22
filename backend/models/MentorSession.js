const mongoose = require('mongoose');

const mentorSessionSchema = new mongoose.Schema(
  {
    // Session Identification
    sessionId: { 
      type: String, 
      unique: true, 
      default: () => 'SES_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) 
    },
    
    // Participants
    mentor: {
      mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentorship', required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      profilePhoto: { type: String }
    },
    
    mentee: {
      menteeId: { type: String }, // Could be user ID if we have user system
      name: { type: String, required: true },
      email: { type: String, required: true },
      profilePhoto: { type: String },
      yearOfStudy: { type: String },
      course: { type: String },
      institution: { type: String }
    },
    
    // Session Details
    sessionInfo: {
      type: {
        type: String,
        enum: ['Instant', 'Scheduled', 'Follow-up', 'Group', 'Workshop', 'Code Review', 'Career Guidance'],
        required: true
      },
      category: {
        type: String,
        enum: [
          'Web Development', 'Mobile Development', 'Data Science', 'UI/UX Design',
          'Digital Marketing', 'Cybersecurity', 'Project Management', 'Entrepreneurship',
          'Career Development', 'Freelancing', 'Content Creation', 'Graphic Design',
          'Business Strategy', 'Leadership', 'Other'
        ],
        required: true
      },
      title: { type: String, required: true },
      description: { type: String, required: true },
      objectives: [{ type: String }],
      expectedOutcomes: [{ type: String }]
    },
    
    // Scheduling
    scheduling: {
      requestedAt: { type: Date, default: Date.now },
      scheduledFor: { type: Date, required: true },
      duration: { type: Number, default: 60 }, // minutes
      timezone: { type: String, default: 'Africa/Nairobi' },
      isRecurring: { type: Boolean, default: false },
      recurringPattern: {
        frequency: { type: String, enum: ['Weekly', 'Bi-weekly', 'Monthly'] },
        endDate: { type: Date },
        totalSessions: { type: Number }
      },
      rescheduledCount: { type: Number, default: 0 },
      reschedulingHistory: [{
        originalDate: { type: Date },
        newDate: { type: Date },
        reason: { type: String },
        initiatedBy: { type: String, enum: ['mentor', 'mentee', 'system'] },
        rescheduledAt: { type: Date }
      }]
    },
    
    // Session Format
    format: {
      type: { type: String, enum: ['Virtual', 'In-Person', 'Hybrid'], default: 'Virtual' },
      platform: { type: String }, // Zoom, Google Meet, Teams, etc.
      meetingLink: { type: String },
      meetingId: { type: String },
      accessCode: { type: String },
      location: {
        venue: { type: String },
        address: { type: String },
        city: { type: String },
        coordinates: {
          latitude: { type: Number },
          longitude: { type: Number }
        }
      },
      materials: [{
        name: { type: String },
        type: { type: String, enum: ['Document', 'Presentation', 'Video', 'Link', 'File'] },
        url: { type: String },
        description: { type: String }
      }]
    },
    
    // Session Status & Lifecycle
    status: {
      current: {
        type: String,
        enum: [
          'Requested', 'Pending Mentor Approval', 'Confirmed', 'Reminder Sent',
          'In Progress', 'Completed', 'Cancelled', 'No Show', 'Rescheduled'
        ],
        default: 'Requested'
      },
      workflow: [{
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        triggeredBy: { type: String },
        notes: { type: String }
      }],
      mentorConfirmed: { type: Boolean, default: false },
      menteeConfirmed: { type: Boolean, default: false },
      mentorConfirmedAt: { type: Date },
      menteeConfirmedAt: { type: Date }
    },
    
    // Session Execution
    execution: {
      actualStartTime: { type: Date },
      actualEndTime: { type: Date },
      actualDuration: { type: Number }, // minutes
      attendanceStatus: {
        mentor: { type: String, enum: ['Present', 'Late', 'Absent'], default: 'Present' },
        mentee: { type: String, enum: ['Present', 'Late', 'Absent'], default: 'Present' }
      },
      sessionNotes: {
        mentorNotes: { type: String },
        menteeNotes: { type: String },
        sharedNotes: { type: String },
        keyDiscussionPoints: [{ type: String }],
        actionItems: [{
          item: { type: String },
          assignedTo: { type: String, enum: ['mentor', 'mentee', 'both'] },
          dueDate: { type: Date },
          completed: { type: Boolean, default: false },
          completedAt: { type: Date }
        }],
        resourcesShared: [{
          name: { type: String },
          url: { type: String },
          type: { type: String }
        }]
      },
      sessionRecording: {
        available: { type: Boolean, default: false },
        recordingUrl: { type: String },
        duration: { type: Number },
        accessLevel: { type: String, enum: ['Private', 'Participants Only', 'Public'], default: 'Participants Only' }
      }
    },
    
    // Follow-up & Outcomes
    followUp: {
      nextSessionScheduled: { type: Boolean, default: false },
      nextSessionDate: { type: Date },
      followUpTasks: [{
        task: { type: String },
        assignedTo: { type: String },
        status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
        dueDate: { type: Date }
      }],
      resourcesProvided: [{
        name: { type: String },
        type: { type: String },
        url: { type: String },
        sentAt: { type: Date }
      }],
      mentorRecommendations: [{ type: String }],
      skillsToImprove: [{ type: String }],
      careerGuidanceGiven: { type: String }
    },
    
    // Feedback & Ratings
    feedback: {
      mentorFeedback: {
        submitted: { type: Boolean, default: false },
        submittedAt: { type: Date },
        rating: {
          overall: { type: Number, min: 1, max: 5 },
          preparation: { type: Number, min: 1, max: 5 },
          engagement: { type: Number, min: 1, max: 5 },
          communication: { type: Number, min: 1, max: 5 },
          goals_clarity: { type: Number, min: 1, max: 5 }
        },
        comments: { type: String },
        menteeStrengths: [{ type: String }],
        improvementAreas: [{ type: String }],
        recommendForFutureSessions: { type: Boolean },
        additionalSupport: { type: String }
      },
      
      menteeFeedback: {
        submitted: { type: Boolean, default: false },
        submittedAt: { type: Date },
        rating: {
          overall: { type: Number, min: 1, max: 5 },
          helpfulness: { type: Number, min: 1, max: 5 },
          clarity: { type: Number, min: 1, max: 5 },
          responsiveness: { type: Number, min: 1, max: 5 },
          expertise: { type: Number, min: 1, max: 5 }
        },
        comments: { type: String },
        mostHelpfulAspects: [{ type: String }],
        suggestionsForImprovement: [{ type: String }],
        wouldRecommendMentor: { type: Boolean },
        learningObjectivesMet: { type: Boolean },
        additionalSupportNeeded: { type: String }
      },
      
      // System-calculated metrics
      systemMetrics: {
        sessionQualityScore: { type: Number }, // 0-100
        engagementScore: { type: Number }, // 0-100
        outcomeSuccessScore: { type: Number }, // 0-100
        matchQualityScore: { type: Number }, // 0-100
        overallSuccessScore: { type: Number } // 0-100
      }
    },
    
    // Analytics & Insights
    analytics: {
      sessionMetrics: {
        responseTime: { type: Number }, // Time from request to confirmation (minutes)
        preparationTime: { type: Number }, // Time spent preparing (minutes)
        actualVsScheduledDuration: { type: Number }, // Difference in minutes
        punctualityScore: { type: Number }, // 0-100
        participationScore: { type: Number } // 0-100
      },
      
      learningOutcomes: {
        skillsDiscussed: [{ type: String }],
        knowledgeAreas: [{ type: String }],
        progressMade: { type: String, enum: ['Significant', 'Moderate', 'Minimal', 'None'] },
        goalsAchieved: { type: Number }, // Percentage
        newSkillsIntroduced: [{ type: String }],
        careerAdvancement: { type: String }
      },
      
      relationshipMetrics: {
        isFirstSession: { type: Boolean, default: true },
        totalSessionsWithThisMentor: { type: Number, default: 1 },
        relationshipDuration: { type: Number }, // Days since first session
        mentorshipPhase: { 
          type: String, 
          enum: ['Initial', 'Building', 'Established', 'Advanced', 'Transitioning'],
          default: 'Initial'
        }
      }
    },
    
    // Administrative
    administration: {
      createdBy: { type: String }, // System user who created/facilitated
      lastModifiedBy: { type: String },
      tags: [{ type: String }],
      priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
      visibility: { type: String, enum: ['Private', 'Mentor Only', 'Mentee Only', 'Both', 'Admin'], default: 'Both' },
      
      // Compliance & Quality
      qualityAssurance: {
        reviewed: { type: Boolean, default: false },
        reviewedBy: { type: String },
        reviewedAt: { type: Date },
        qualityScore: { type: Number },
        qualityNotes: { type: String },
        complianceCheck: { type: Boolean, default: false }
      },
      
      // Integration tracking
      integration: {
        calendarEventCreated: { type: Boolean, default: false },
        remindersSent: { type: Number, default: 0 },
        zoomMeetingCreated: { type: Boolean, default: false },
        followUpEmailSent: { type: Boolean, default: false },
        certificateGenerated: { type: Boolean, default: false }
      }
    },
    
    // Communication Log
    communications: [{
      type: { type: String, enum: ['Email', 'SMS', 'In-App', 'System'] },
      direction: { type: String, enum: ['To Mentor', 'To Mentee', 'To Both', 'From Mentor', 'From Mentee'] },
      subject: { type: String },
      message: { type: String },
      sentAt: { type: Date },
      deliveryStatus: { type: String, enum: ['Sent', 'Delivered', 'Opened', 'Clicked', 'Failed'] },
      automated: { type: Boolean, default: false }
    }],
    
    // Financial (if applicable)
    financial: {
      isPaid: { type: Boolean, default: false },
      amount: { type: Number, default: 0 },
      currency: { type: String, default: 'KES' },
      paymentMethod: { type: String },
      paymentStatus: { 
        type: String, 
        enum: ['Free', 'Pending', 'Paid', 'Refunded', 'Failed'],
        default: 'Free'
      },
      transactionId: { type: String },
      paidAt: { type: Date },
      mentorEarnings: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
mentorSessionSchema.index({ sessionId: 1 });
mentorSessionSchema.index({ 'mentor.mentorId': 1, 'scheduling.scheduledFor': -1 });
mentorSessionSchema.index({ 'mentee.email': 1, 'scheduling.scheduledFor': -1 });
mentorSessionSchema.index({ 'status.current': 1, 'scheduling.scheduledFor': 1 });
mentorSessionSchema.index({ 'sessionInfo.category': 1, 'scheduling.scheduledFor': -1 });
mentorSessionSchema.index({ 'scheduling.scheduledFor': 1 });

// Text search index
mentorSessionSchema.index({
  'sessionInfo.title': 'text',
  'sessionInfo.description': 'text',
  'mentor.name': 'text',
  'mentee.name': 'text'
});

// Virtual for session duration in human format
mentorSessionSchema.virtual('durationFormatted').get(function() {
  const duration = this.scheduling.duration;
  if (duration < 60) return `${duration} minutes`;
  const hours = Math.floor(duration / 60);
  const mins = duration % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
});

// Virtual for session time until
mentorSessionSchema.virtual('timeUntilSession').get(function() {
  const now = new Date();
  const sessionTime = this.scheduling.scheduledFor;
  const diffTime = sessionTime - now;
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  if (diffMinutes < 0) return 'Past';
  if (diffMinutes < 60) return `${diffMinutes} minutes`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours`;
  return `${Math.floor(diffMinutes / 1440)} days`;
});

// Virtual for overall session success
mentorSessionSchema.virtual('sessionSuccess').get(function() {
  if (!this.feedback.systemMetrics.overallSuccessScore) return 'Not Evaluated';
  
  const score = this.feedback.systemMetrics.overallSuccessScore;
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Improvement';
});

// Virtual for average rating
mentorSessionSchema.virtual('averageRating').get(function() {
  const mentorRating = this.feedback.mentorFeedback.rating?.overall || 0;
  const menteeRating = this.feedback.menteeFeedback.rating?.overall || 0;
  
  if (mentorRating && menteeRating) {
    return ((mentorRating + menteeRating) / 2).toFixed(1);
  } else if (mentorRating || menteeRating) {
    return (mentorRating || menteeRating).toFixed(1);
  }
  return 'No ratings';
});

// Pre-save middleware
mentorSessionSchema.pre('save', function(next) {
  // Calculate actual duration if session is completed
  if (this.execution.actualStartTime && this.execution.actualEndTime) {
    const duration = (this.execution.actualEndTime - this.execution.actualStartTime) / (1000 * 60);
    this.execution.actualDuration = Math.round(duration);
  }
  
  // Update relationship metrics
  if (this.analytics.relationshipMetrics.totalSessionsWithThisMentor > 1) {
    this.analytics.relationshipMetrics.isFirstSession = false;
    
    // Determine mentorship phase
    const sessionCount = this.analytics.relationshipMetrics.totalSessionsWithThisMentor;
    if (sessionCount <= 2) this.analytics.relationshipMetrics.mentorshipPhase = 'Initial';
    else if (sessionCount <= 5) this.analytics.relationshipMetrics.mentorshipPhase = 'Building';
    else if (sessionCount <= 10) this.analytics.relationshipMetrics.mentorshipPhase = 'Established';
    else this.analytics.relationshipMetrics.mentorshipPhase = 'Advanced';
  }
  
  next();
});

// Static method to get upcoming sessions
mentorSessionSchema.statics.getUpcomingSessions = function(mentorId, options = {}) {
  const { limit = 10, skip = 0 } = options;
  const query = {
    'mentor.mentorId': mentorId,
    'scheduling.scheduledFor': { $gte: new Date() },
    'status.current': { $in: ['Confirmed', 'Reminder Sent'] }
  };
  
  return this.find(query)
    .sort({ 'scheduling.scheduledFor': 1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get session history
mentorSessionSchema.statics.getSessionHistory = function(mentorId, options = {}) {
  const { limit = 20, skip = 0, status = 'Completed' } = options;
  const query = {
    'mentor.mentorId': mentorId,
    'status.current': status
  };
  
  return this.find(query)
    .sort({ 'scheduling.scheduledFor': -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to get mentee sessions
mentorSessionSchema.statics.getMenteeSessions = function(menteeEmail, options = {}) {
  const { limit = 20, skip = 0 } = options;
  const query = { 'mentee.email': menteeEmail };
  
  return this.find(query)
    .sort({ 'scheduling.scheduledFor': -1 })
    .limit(limit)
    .skip(skip);
};

// Instance method to confirm session
mentorSessionSchema.methods.confirmSession = function(confirmedBy) {
  if (confirmedBy === 'mentor') {
    this.status.mentorConfirmed = true;
    this.status.mentorConfirmedAt = new Date();
  } else if (confirmedBy === 'mentee') {
    this.status.menteeConfirmed = true;
    this.status.menteeConfirmedAt = new Date();
  }
  
  // If both confirmed, update status
  if (this.status.mentorConfirmed && this.status.menteeConfirmed) {
    this.status.current = 'Confirmed';
    this.status.workflow.push({
      status: 'Confirmed',
      timestamp: new Date(),
      triggeredBy: 'system',
      notes: 'Both parties confirmed'
    });
  }
  
  return this.save();
};

// Instance method to start session
mentorSessionSchema.methods.startSession = function() {
  this.status.current = 'In Progress';
  this.execution.actualStartTime = new Date();
  
  this.status.workflow.push({
    status: 'In Progress',
    timestamp: new Date(),
    triggeredBy: 'system'
  });
  
  return this.save();
};

// Instance method to complete session
mentorSessionSchema.methods.completeSession = function(completionData = {}) {
  this.status.current = 'Completed';
  this.execution.actualEndTime = new Date();
  
  if (completionData.mentorNotes) {
    this.execution.sessionNotes.mentorNotes = completionData.mentorNotes;
  }
  
  if (completionData.actionItems) {
    this.execution.sessionNotes.actionItems = completionData.actionItems;
  }
  
  this.status.workflow.push({
    status: 'Completed',
    timestamp: new Date(),
    triggeredBy: completionData.completedBy || 'system'
  });
  
  return this.save();
};

// Instance method to add feedback
mentorSessionSchema.methods.addFeedback = function(feedbackData, feedbackBy) {
  if (feedbackBy === 'mentor') {
    this.feedback.mentorFeedback = {
      ...feedbackData,
      submitted: true,
      submittedAt: new Date()
    };
  } else if (feedbackBy === 'mentee') {
    this.feedback.menteeFeedback = {
      ...feedbackData,
      submitted: true,
      submittedAt: new Date()
    };
  }
  
  // Calculate system metrics if both feedbacks are available
  this.calculateSystemMetrics();
  
  return this.save();
};

// Instance method to calculate system metrics
mentorSessionSchema.methods.calculateSystemMetrics = function() {
  const mentorRating = this.feedback.mentorFeedback.rating?.overall || 0;
  const menteeRating = this.feedback.menteeFeedback.rating?.overall || 0;
  
  if (mentorRating && menteeRating) {
    // Session quality (average of both ratings)
    this.feedback.systemMetrics.sessionQualityScore = Math.round(((mentorRating + menteeRating) / 2) * 20);
    
    // Engagement score (based on duration and participation)
    const plannedDuration = this.scheduling.duration;
    const actualDuration = this.execution.actualDuration || plannedDuration;
    const durationScore = Math.min((actualDuration / plannedDuration) * 100, 100);
    this.feedback.systemMetrics.engagementScore = Math.round(durationScore);
    
    // Overall success score
    this.feedback.systemMetrics.overallSuccessScore = Math.round(
      (this.feedback.systemMetrics.sessionQualityScore * 0.6) +
      (this.feedback.systemMetrics.engagementScore * 0.4)
    );
  }
};

// Instance method to reschedule session
mentorSessionSchema.methods.rescheduleSession = function(newDateTime, reason, initiatedBy) {
  this.scheduling.reschedulingHistory.push({
    originalDate: this.scheduling.scheduledFor,
    newDate: newDateTime,
    reason: reason,
    initiatedBy: initiatedBy,
    rescheduledAt: new Date()
  });
  
  this.scheduling.scheduledFor = newDateTime;
  this.scheduling.rescheduledCount += 1;
  this.status.current = 'Rescheduled';
  
  this.status.workflow.push({
    status: 'Rescheduled',
    timestamp: new Date(),
    triggeredBy: initiatedBy,
    notes: `Rescheduled: ${reason}`
  });
  
  return this.save();
};

module.exports = mongoose.model('MentorSession', mentorSessionSchema); 