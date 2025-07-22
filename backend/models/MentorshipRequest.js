const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema(
  {
    // Request Basic Information
    requestId: { 
      type: String, 
      unique: true,
      default: () => 'REQ_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    },
    
    // Mentee Information
    mentee: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      profileImage: { type: String },
      bio: { type: String },
      experience: { type: String }, // e.g., "Beginner", "2 years"
      currentRole: { type: String },
      goals: [{ type: String }], // What they want to achieve
      timezone: { type: String, default: 'EAT' }
    },

    // Request Details
    requestType: {
      type: String,
      enum: ['Instant', 'Scheduled', 'Ongoing', 'Project-Based'],
      required: true,
      default: 'Instant'
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    sessionType: {
      type: String,
      enum: ['Quick Question', 'Code Review', 'Career Advice', 'Technical Help', 'Project Guidance', 'General Mentorship'],
      required: true
    },

    // What Help is Needed
    category: { 
      type: String, 
      required: true,
      enum: [
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
        'Business Strategy',
        'Leadership',
        'Other'
      ]
    },
    specificSkills: [{ type: String }], // e.g., ["React", "Node.js"]
    problemDescription: { type: String, required: true },
    detailedContext: { type: String }, // More context about the problem
    codeSnippets: [{ type: String }], // Code that needs review
    attachments: [{ type: String }], // File URLs or base64
    preferredExpertiseLevel: {
      type: String,
      enum: ['Any', 'Junior', 'Mid-Level', 'Senior', 'Expert'],
      default: 'Any'
    },

    // Scheduling and Duration
    preferredDuration: { type: Number, default: 30 }, // minutes
    schedulingPreference: {
      type: String,
      enum: ['ASAP', 'Within 1 hour', 'Within 4 hours', 'Within 24 hours', 'Schedule Later'],
      default: 'ASAP'
    },
    preferredDateTime: { type: Date }, // For scheduled requests
    isFlexibleTiming: { type: Boolean, default: true },
    availableTimeSlots: [{ 
      startTime: { type: Date },
      endTime: { type: Date }
    }],

    // Communication Preferences
    communicationMethod: {
      type: String,
      enum: ['Video Call', 'Voice Call', 'Chat', 'Screen Share', 'Email'],
      default: 'Video Call'
    },
    language: { type: String, default: 'English' },
    recordSession: { type: Boolean, default: false },

    // Location and Proximity (Uber-like)
    location: {
      city: { type: String },
      country: { type: String, default: 'Kenya' },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number }
      },
      address: { type: String },
      preferInPerson: { type: Boolean, default: false },
      maxDistance: { type: Number, default: 50 } // km
    },

    // Pricing and Budget
    budget: {
      hasBudget: { type: Boolean, default: false },
      maxAmount: { type: Number },
      currency: { type: String, default: 'KES' },
      paymentMethod: { type: String }, // 'M-Pesa', 'Card', etc.
      willingToPayPremium: { type: Boolean, default: false } // For urgent requests
    },

    // Request Status and Workflow
    status: {
      type: String,
      enum: [
        'Pending',        // Just created, looking for mentors
        'Broadcasted',    // Sent to potential mentors
        'Matched',        // Mentor found and accepted
        'In Progress',    // Session ongoing
        'Completed',      // Session finished
        'Cancelled',      // Cancelled by mentee
        'Expired',        // No mentor found in time
        'Declined'        // All contacted mentors declined
      ],
      default: 'Pending'
    },
    priority: { type: Number, default: 1 }, // Higher number = higher priority

    // Mentor Matching and Responses
    targetedMentors: [{
      mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentorship' },
      notifiedAt: { type: Date, default: Date.now },
      response: {
        type: String,
        enum: ['Pending', 'Accepted', 'Declined', 'No Response'],
        default: 'Pending'
      },
      responseTime: { type: Date },
      declineReason: { type: String },
      suggestedAlternative: { type: String }
    }],
    
    selectedMentor: {
      mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentorship' },
      acceptedAt: { type: Date },
      mentorResponse: { type: String }
    },

    // Session Details (when matched)
    session: {
      startTime: { type: Date },
      endTime: { type: Date },
      actualDuration: { type: Number }, // minutes
      meetingLink: { type: String },
      roomId: { type: String },
      notes: { type: String },
      outcome: { type: String },
      followUpNeeded: { type: Boolean, default: false },
      wasHelpful: { type: Boolean },
      problemSolved: { type: Boolean }
    },

    // Feedback and Rating
    menteeRating: {
      overall: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      expertise: { type: Number, min: 1, max: 5 },
      helpfulness: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      wouldRecommend: { type: Boolean },
      ratedAt: { type: Date }
    },
    mentorRating: {
      menteePreparedness: { type: Number, min: 1, max: 5 },
      clarity: { type: Number, min: 1, max: 5 },
      engagement: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      wouldMentorAgain: { type: Boolean },
      ratedAt: { type: Date }
    },

    // Analytics and Tracking
    metrics: {
      responseTime: { type: Number }, // Time to get first mentor response (minutes)
      matchTime: { type: Number },    // Time to get matched (minutes)
      totalNotificationsSent: { type: Number, default: 0 },
      viewCount: { type: Number, default: 0 },
      mentorPoolSize: { type: Number, default: 0 }, // How many mentors were available
      conversionRate: { type: Number, default: 0 } // Success rate
    },

    // Platform Data
    source: {
      type: String,
      enum: ['Web', 'Mobile App', 'API', 'Widget'],
      default: 'Web'
    },
    userAgent: { type: String },
    ipAddress: { type: String },
    
    // Auto-matching and AI
    autoMatchingEnabled: { type: Boolean, default: true },
    aiRecommendations: [{
      mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentorship' },
      matchScore: { type: Number }, // 0-100
      reasons: [{ type: String }]
    }],

    // Admin and Moderation
    isUrgent: { type: Boolean, default: false },
    adminNotes: { type: String },
    flaggedContent: { type: Boolean, default: false },
    moderationStatus: {
      type: String,
      enum: ['Approved', 'Under Review', 'Flagged', 'Rejected'],
      default: 'Approved'
    }
  },
  { timestamps: true }
);

// Indexes for performance and Uber-like functionality
mentorshipRequestSchema.index({ status: 1, category: 1, createdAt: -1 });
mentorshipRequestSchema.index({ 'location.coordinates': '2dsphere' }); // Geospatial
mentorshipRequestSchema.index({ requestType: 1, urgency: 1, createdAt: -1 });
mentorshipRequestSchema.index({ 'mentee.email': 1 });
mentorshipRequestSchema.index({ requestId: 1 });
mentorshipRequestSchema.index({ 'selectedMentor.mentorId': 1 });
mentorshipRequestSchema.index({ priority: -1, createdAt: -1 });

// Compound indexes for matching
mentorshipRequestSchema.index({ 
  category: 1, 
  status: 1, 
  preferredExpertiseLevel: 1,
  'budget.hasBudget': 1 
});

// Text search index
mentorshipRequestSchema.index({ 
  problemDescription: 'text', 
  detailedContext: 'text',
  specificSkills: 'text' 
});

// Virtual for time elapsed since request
mentorshipRequestSchema.virtual('timeElapsed').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffMinutes = Math.floor((now - created) / (1000 * 60));
  
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  return `${Math.floor(diffMinutes / 1440)}d ago`;
});

// Virtual for urgency score (for prioritization)
mentorshipRequestSchema.virtual('urgencyScore').get(function() {
  let score = 0;
  
  // Base urgency
  const urgencyMap = { 'Critical': 100, 'High': 75, 'Medium': 50, 'Low': 25 };
  score += urgencyMap[this.urgency] || 25;
  
  // Time factor (older requests get higher priority)
  const ageMinutes = (Date.now() - this.createdAt) / (1000 * 60);
  score += Math.min(ageMinutes / 10, 50); // Max 50 points for age
  
  // Premium factor
  if (this.budget.willingToPayPremium) score += 25;
  
  // Request type factor
  if (this.requestType === 'Instant') score += 20;
  
  return Math.min(score, 200); // Cap at 200
});

// Virtual for status display
mentorshipRequestSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'Pending': { text: 'Looking for mentor...', color: 'yellow', icon: '🔍' },
    'Broadcasted': { text: 'Sent to mentors', color: 'blue', icon: '📡' },
    'Matched': { text: 'Mentor found!', color: 'green', icon: '✅' },
    'In Progress': { text: 'Session ongoing', color: 'purple', icon: '🎯' },
    'Completed': { text: 'Completed', color: 'green', icon: '✅' },
    'Cancelled': { text: 'Cancelled', color: 'red', icon: '❌' },
    'Expired': { text: 'Expired', color: 'gray', icon: '⏰' },
    'Declined': { text: 'No mentor available', color: 'red', icon: '😞' }
  };
  
  return statusMap[this.status] || statusMap['Pending'];
});

// Pre-save middleware
mentorshipRequestSchema.pre('save', function(next) {
  // Auto-set priority based on urgency and other factors
  if (this.isModified('urgency') || this.isNew) {
    const urgencyMap = { 'Critical': 5, 'High': 4, 'Medium': 3, 'Low': 2 };
    this.priority = urgencyMap[this.urgency] || 3;
    
    if (this.budget.willingToPayPremium) this.priority += 1;
    if (this.requestType === 'Instant') this.priority += 1;
  }
  
  next();
});

// Static method to find matching mentors
mentorshipRequestSchema.statics.findMatchingMentors = function(requestId, options = {}) {
  return this.findById(requestId).then(request => {
    if (!request) throw new Error('Request not found');
    
    const Mentorship = mongoose.model('Mentorship');
    
    let matchQuery = {
      status: 'Active',
      'availability.isAvailable': true,
      category: request.category,
      $expr: { $lt: ['$availability.currentMentees', '$availability.maxMentees'] }
    };

    // Expertise level matching
    if (request.preferredExpertiseLevel !== 'Any') {
      matchQuery.expertiseLevel = request.preferredExpertiseLevel;
    }

    // Budget matching
    if (request.budget.hasBudget) {
      matchQuery.$or = [
        { 'pricing.isFree': true },
        { 'pricing.sessionRate': { $lte: request.budget.maxAmount } },
        { 'pricing.hourlyRate': { $lte: request.budget.maxAmount } }
      ];
    }

    // Instant availability for instant requests
    if (request.requestType === 'Instant') {
      matchQuery['instantAvailability.enabled'] = true;
      matchQuery.$expr = {
        $and: [
          matchQuery.$expr,
          { $lt: ['$instantAvailability.currentInstantSessions', '$instantAvailability.maxInstantRequests'] }
        ]
      };
    }

    let pipeline = [{ $match: matchQuery }];

    // Location-based matching for in-person preferences
    if (request.location.preferInPerson && request.location.coordinates.latitude) {
      pipeline.unshift({
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [request.location.coordinates.longitude, request.location.coordinates.latitude]
          },
          distanceField: 'distance',
          maxDistance: request.location.maxDistance * 1000,
          spherical: true,
          query: { 'location.isLocationEnabled': true }
        }
      });
    }

    // Add matching score calculation
    pipeline.push({
      $addFields: {
        matchScore: {
          $add: [
            // Base score
            50,
            // Rating bonus
            { $multiply: ['$ratings.overall', 5] },
            // Experience bonus
            {
              $cond: {
                if: { $in: ['$expertiseLevel', ['Senior', 'Expert', 'Thought Leader']] },
                then: 15,
                else: 0
              }
            },
            // Response time bonus
            {
              $cond: {
                if: { $eq: ['$availability.responseTime', 'Within 1 hour'] },
                then: 10,
                else: { $cond: { if: { $eq: ['$availability.responseTime', 'Within 4 hours'] }, then: 5, else: 0 } }
              }
            },
            // Availability bonus
            {
              $cond: {
                if: { $eq: ['$availability.status', 'Available'] },
                then: 10,
                else: 0
              }
            }
          ]
        }
      }
    });

    pipeline.push(
      { $sort: { matchScore: -1, 'ratings.overall': -1, 'statistics.responseRate': -1 } },
      { $limit: options.limit || 10 }
    );

    return Mentorship.aggregate(pipeline);
  });
};

// Static method to get active requests for dashboard
mentorshipRequestSchema.statics.getActiveRequests = function(options = {}) {
  const { status, category, urgency, limit = 50, skip = 0 } = options;
  
  let query = { status: { $in: ['Pending', 'Broadcasted', 'Matched', 'In Progress'] } };
  
  if (status) query.status = status;
  if (category) query.category = category;
  if (urgency) query.urgency = urgency;
  
  return this.find(query)
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('selectedMentor.mentorId', 'mentor.name mentor.email')
    .populate('targetedMentors.mentorId', 'mentor.name mentor.email');
};

// Instance method to add mentor to notification list
mentorshipRequestSchema.methods.addTargetedMentor = function(mentorId) {
  if (!this.targetedMentors.find(tm => tm.mentorId.toString() === mentorId.toString())) {
    this.targetedMentors.push({
      mentorId,
      notifiedAt: new Date(),
      response: 'Pending'
    });
    this.metrics.totalNotificationsSent += 1;
  }
  return this.save();
};

// Instance method to update mentor response
mentorshipRequestSchema.methods.updateMentorResponse = function(mentorId, response, additionalData = {}) {
  const targetedMentor = this.targetedMentors.find(tm => tm.mentorId.toString() === mentorId.toString());
  
  if (targetedMentor) {
    targetedMentor.response = response;
    targetedMentor.responseTime = new Date();
    
    if (additionalData.declineReason) {
      targetedMentor.declineReason = additionalData.declineReason;
    }
    
    if (additionalData.suggestedAlternative) {
      targetedMentor.suggestedAlternative = additionalData.suggestedAlternative;
    }
    
    // If accepted, set as selected mentor
    if (response === 'Accepted') {
      this.selectedMentor = {
        mentorId,
        acceptedAt: new Date(),
        mentorResponse: additionalData.message || ''
      };
      this.status = 'Matched';
      
      // Calculate response time metric
      const responseTimeMinutes = (Date.now() - this.createdAt) / (1000 * 60);
      this.metrics.responseTime = responseTimeMinutes;
    }
    
    // If all contacted mentors declined, mark as declined
    const allResponses = this.targetedMentors.map(tm => tm.response);
    if (allResponses.every(r => r === 'Declined' || r === 'No Response') && allResponses.length > 0) {
      this.status = 'Declined';
    }
  }
  
  return this.save();
};

// Instance method to start session
mentorshipRequestSchema.methods.startSession = function(sessionData = {}) {
  this.status = 'In Progress';
  this.session = {
    ...this.session,
    startTime: new Date(),
    meetingLink: sessionData.meetingLink,
    roomId: sessionData.roomId,
    ...sessionData
  };
  return this.save();
};

// Instance method to complete session
mentorshipRequestSchema.methods.completeSession = function(sessionData = {}) {
  this.status = 'Completed';
  this.session = {
    ...this.session,
    endTime: new Date(),
    actualDuration: sessionData.actualDuration || Math.floor((Date.now() - this.session.startTime) / (1000 * 60)),
    notes: sessionData.notes,
    outcome: sessionData.outcome,
    followUpNeeded: sessionData.followUpNeeded || false,
    problemSolved: sessionData.problemSolved || false,
    ...sessionData
  };
  
  // Calculate match time metric
  if (this.selectedMentor && this.selectedMentor.acceptedAt) {
    const matchTimeMinutes = (this.selectedMentor.acceptedAt - this.createdAt) / (1000 * 60);
    this.metrics.matchTime = matchTimeMinutes;
  }
  
  return this.save();
};

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema); 