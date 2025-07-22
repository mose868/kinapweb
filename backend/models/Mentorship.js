const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema(
  {
    // Basic Information
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    
    // Mentor Information
    mentor: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      profileImage: { type: String }, // Base64 or URL
      bio: { type: String, required: true },
      title: { type: String }, // e.g., "Senior Software Engineer"
      company: { type: String },
      experience: { type: String, required: true }, // e.g., "5+ years"
      linkedinProfile: { type: String },
      githubProfile: { type: String },
      portfolioWebsite: { type: String },
      languages: [{ type: String }], // Spoken languages
      timezone: { type: String, default: 'EAT' } // East Africa Time
    },

    // Expertise and Categories
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
      ],
      default: 'Other'
    },
    subcategories: [{ type: String }], // e.g., ["React", "Node.js", "JavaScript"]
    expertiseLevel: {
      type: String,
      enum: ['Junior', 'Mid-Level', 'Senior', 'Expert', 'Thought Leader'],
      required: true
    },
    skills: [{ type: String }], // Technical and soft skills
    specializations: [{ type: String }], // Specific areas of expertise

    // Mentorship Details
    mentorshipType: {
      type: String,
      enum: ['One-on-One', 'Group', 'Workshop', 'Code Review', 'Career Guidance', 'Project-Based'],
      required: true
    },
    sessionFormat: {
      type: String,
      enum: ['Video Call', 'Voice Call', 'Chat', 'In-Person', 'Email', 'Mixed'],
      default: 'Video Call'
    },
    sessionDuration: {
      typical: { type: Number, default: 60 }, // minutes
      minimum: { type: Number, default: 30 },
      maximum: { type: Number, default: 120 }
    },

    // Availability and Scheduling
    availability: {
      isAvailable: { type: Boolean, default: true },
      status: {
        type: String,
        enum: ['Available', 'Busy', 'Away', 'Do Not Disturb', 'Offline'],
        default: 'Available'
      },
      responseTime: {
        type: String,
        enum: ['Within 1 hour', 'Within 4 hours', 'Within 24 hours', 'Within 48 hours'],
        default: 'Within 24 hours'
      },
      weeklyHours: { type: Number, default: 5 }, // Available hours per week
      maxMentees: { type: Number, default: 5 }, // Maximum concurrent mentees
      currentMentees: { type: Number, default: 0 }
    },
    schedule: {
      timezone: { type: String, default: 'Africa/Nairobi' },
      preferredDays: [{ type: String }], // ['Monday', 'Tuesday', 'Wednesday']
      preferredTimes: [{
        day: { type: String },
        startTime: { type: String }, // '09:00'
        endTime: { type: String }   // '17:00'
      }],
      blackoutDates: [{ type: Date }] // Unavailable dates
    },

    // Pricing and Payments
    pricing: {
      isFree: { type: Boolean, default: false },
      sessionRate: { type: Number, default: 0 }, // Per session
      hourlyRate: { type: Number, default: 0 },  // Per hour
      monthlyRate: { type: Number, default: 0 }, // Monthly mentorship
      currency: { type: String, default: 'KES' },
      acceptsEquity: { type: Boolean, default: false },
      paymentMethods: [{ type: String }], // ['M-Pesa', 'Bank Transfer', 'PayPal']
      discounts: [{
        type: { type: String }, // 'Student', 'Bulk', 'First-time'
        percentage: { type: Number },
        description: { type: String }
      }]
    },

    // What Mentor Offers
    services: [{
      name: { type: String }, // 'Code Review', 'Career Counseling'
      description: { type: String },
      duration: { type: Number }, // minutes
      price: { type: Number }
    }],
    mentorshipFocus: [{ type: String }], // What they help with
    targetAudience: [{ type: String }], // Who they mentor
    successStories: [{ type: String }], // Brief success stories

    // Requirements and Expectations
    prerequisites: [{ type: String }],
    expectations: [{ type: String }], // What mentor expects from mentees
    communicationStyle: { type: String },
    preferredMenteeLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'All Levels'
    },

    // Performance and Analytics
    statistics: {
      totalSessions: { type: Number, default: 0 },
      totalMentees: { type: Number, default: 0 },
      averageSessionRating: { type: Number, default: 0 },
      responseRate: { type: Number, default: 100 }, // Percentage
      completionRate: { type: Number, default: 0 }, // Percentage of completed mentorships
      profileViews: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: Date.now },
      joinedDate: { type: Date, default: Date.now }
    },

    // Ratings and Reviews
    ratings: {
      overall: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      expertise: { type: Number, default: 0 },
      helpfulness: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
      breakdown: {
        five: { type: Number, default: 0 },
        four: { type: Number, default: 0 },
        three: { type: Number, default: 0 },
        two: { type: Number, default: 0 },
        one: { type: Number, default: 0 }
      }
    },
    reviews: [{
      menteeName: { type: String },
      menteeEmail: { type: String },
      rating: {
        overall: { type: Number, min: 1, max: 5 },
        communication: { type: Number, min: 1, max: 5 },
        expertise: { type: Number, min: 1, max: 5 },
        helpfulness: { type: Number, min: 1, max: 5 }
      },
      comment: { type: String },
      sessionType: { type: String },
      date: { type: Date, default: Date.now },
      isVerified: { type: Boolean, default: false },
      isPublic: { type: Boolean, default: true }
    }],

    // Uber-like Features
    instantAvailability: {
      enabled: { type: Boolean, default: true }, // Available for instant requests
      radius: { type: Number, default: 50 }, // km radius for location-based matching
      autoAccept: { type: Boolean, default: false }, // Auto-accept requests
      maxInstantRequests: { type: Number, default: 3 }, // Max concurrent instant sessions
      currentInstantSessions: { type: Number, default: 0 }
    },
    location: {
      city: { type: String },
      country: { type: String, default: 'Kenya' },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number }
      },
      isLocationEnabled: { type: Boolean, default: false }
    },

    // Platform Settings
    verification: {
      isVerified: { type: Boolean, default: false },
      verificationDate: { type: Date },
      verificationMethod: { type: String }, // 'ID', 'LinkedIn', 'Portfolio'
      badgeLevel: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
        default: 'Bronze'
      }
    },
    settings: {
      instantNotifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      allowRecording: { type: Boolean, default: false },
      publicProfile: { type: Boolean, default: true },
      searchable: { type: Boolean, default: true }
    },

    // Admin and Moderation
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended', 'Under Review', 'Pending Approval'],
      default: 'Pending Approval'
    },
    tags: [{ type: String }], // Admin tags for categorization
    notes: { type: String }, // Admin notes
    featuredUntil: { type: Date }, // Featured mentor until date
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    lastUpdatedBy: { type: String },

    // SEO and Marketing
    seoMeta: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }]
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
mentorshipSchema.index({ category: 1, status: 1, 'availability.isAvailable': 1 });
mentorshipSchema.index({ expertiseLevel: 1, status: 1 });
mentorshipSchema.index({ 'pricing.isFree': 1, status: 1 });
mentorshipSchema.index({ 'ratings.overall': -1, status: 1 });
mentorshipSchema.index({ 'location.coordinates': '2dsphere' }); // Geospatial index
mentorshipSchema.index({ slug: 1 });
mentorshipSchema.index({ tags: 1 });
mentorshipSchema.index({ 'mentor.email': 1 }, { unique: true });
mentorshipSchema.index({ 
  'mentor.name': 'text', 
  description: 'text', 
  skills: 'text', 
  specializations: 'text' 
}); // Full-text search

// Virtual for mentor profile URL
mentorshipSchema.virtual('profileUrl').get(function() {
  return `/mentors/${this.slug}`;
});

// Virtual for availability status
mentorshipSchema.virtual('availabilityStatus').get(function() {
  if (!this.availability.isAvailable) return 'Unavailable';
  if (this.availability.currentMentees >= this.availability.maxMentees) return 'Fully Booked';
  if (this.availability.status === 'Busy') return 'Busy';
  if (this.availability.status === 'Away') return 'Away';
  return 'Available';
});

// Virtual for pricing display
mentorshipSchema.virtual('displayPrice').get(function() {
  if (this.pricing.isFree) return 'Free';
  if (this.pricing.sessionRate > 0) return `${this.pricing.currency} ${this.pricing.sessionRate}/session`;
  if (this.pricing.hourlyRate > 0) return `${this.pricing.currency} ${this.pricing.hourlyRate}/hour`;
  if (this.pricing.monthlyRate > 0) return `${this.pricing.currency} ${this.pricing.monthlyRate}/month`;
  return 'Contact for pricing';
});

// Virtual for experience level color
mentorshipSchema.virtual('experienceBadge').get(function() {
  const badges = {
    'Junior': { color: 'green', icon: '🌱' },
    'Mid-Level': { color: 'blue', icon: '🌿' },
    'Senior': { color: 'purple', icon: '🌳' },
    'Expert': { color: 'gold', icon: '⭐' },
    'Thought Leader': { color: 'diamond', icon: '💎' }
  };
  return badges[this.expertiseLevel] || badges['Junior'];
});

// Pre-save middleware to generate slug
mentorshipSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    this.slug = `${baseSlug}-${this.mentor.name.toLowerCase().replace(/\s+/g, '-')}`;
  }
  
  // Auto-generate SEO meta if not provided
  if (!this.seoMeta.metaTitle) {
    this.seoMeta.metaTitle = `${this.mentor.name} - ${this.title} | Mentorship`;
  }
  
  if (!this.seoMeta.metaDescription) {
    const desc = this.shortDescription || this.description;
    this.seoMeta.metaDescription = desc.length > 160 
      ? desc.substring(0, 157) + '...' 
      : desc;
  }
  
  next();
});

// Static method to find available mentors
mentorshipSchema.statics.findAvailableMentors = function(options = {}) {
  const { 
    category, 
    expertiseLevel, 
    isFree, 
    location,
    maxDistance = 50,
    instantOnly = false,
    limit = 20, 
    skip = 0 
  } = options;
  
  let query = {
    status: 'Active',
    'availability.isAvailable': true,
    $expr: { $lt: ['$availability.currentMentees', '$availability.maxMentees'] }
  };

  if (category && category !== 'all') {
    query.category = category;
  }

  if (expertiseLevel && expertiseLevel !== 'all') {
    query.expertiseLevel = expertiseLevel;
  }

  if (isFree !== undefined) {
    query['pricing.isFree'] = isFree;
  }

  if (instantOnly) {
    query['instantAvailability.enabled'] = true;
    query.$expr = {
      $and: [
        query.$expr,
        { $lt: ['$instantAvailability.currentInstantSessions', '$instantAvailability.maxInstantRequests'] }
      ]
    };
  }

  let pipeline = [{ $match: query }];

  // Location-based filtering
  if (location && location.latitude && location.longitude) {
    pipeline.unshift({
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude]
        },
        distanceField: 'distance',
        maxDistance: maxDistance * 1000, // Convert km to meters
        spherical: true,
        query: { 'location.isLocationEnabled': true }
      }
    });
  }

  pipeline.push(
    { $sort: { 'ratings.overall': -1, 'statistics.averageSessionRating': -1, createdAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  );

  return this.aggregate(pipeline);
};

// Static method to get featured mentors
mentorshipSchema.statics.getFeaturedMentors = function(limit = 6) {
  return this.find({
    status: 'Active',
    isFeatured: true,
    'availability.isAvailable': true
  })
    .sort({ displayOrder: -1, 'ratings.overall': -1, createdAt: -1 })
    .limit(limit)
    .select('-reviews -notes -lastUpdatedBy');
};

// Method to increment profile views
mentorshipSchema.methods.incrementViews = function() {
  this.statistics.profileViews += 1;
  this.statistics.lastActiveDate = new Date();
  return this.save();
};

// Method to add review
mentorshipSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  this.ratings.totalRatings += 1;
  
  // Update rating breakdowns
  const overallRating = reviewData.rating.overall;
  const ratingKey = overallRating === 5 ? 'five' : 
                   overallRating === 4 ? 'four' : 
                   overallRating === 3 ? 'three' : 
                   overallRating === 2 ? 'two' : 'one';
  
  this.ratings.breakdown[ratingKey] += 1;
  
  // Recalculate averages
  const totalStars = (this.ratings.breakdown.five * 5) + 
                    (this.ratings.breakdown.four * 4) + 
                    (this.ratings.breakdown.three * 3) + 
                    (this.ratings.breakdown.two * 2) + 
                    (this.ratings.breakdown.one * 1);
  
  this.ratings.overall = Number((totalStars / this.ratings.totalRatings).toFixed(1));
  
  // Update specific rating averages
  const reviews = this.reviews;
  this.ratings.communication = Number((reviews.reduce((sum, r) => sum + r.rating.communication, 0) / reviews.length).toFixed(1));
  this.ratings.expertise = Number((reviews.reduce((sum, r) => sum + r.rating.expertise, 0) / reviews.length).toFixed(1));
  this.ratings.helpfulness = Number((reviews.reduce((sum, r) => sum + r.rating.helpfulness, 0) / reviews.length).toFixed(1));
  
  this.statistics.averageSessionRating = this.ratings.overall;
  
  return this.save();
};

// Method to update availability
mentorshipSchema.methods.updateAvailability = function(status, isAvailable = null) {
  if (isAvailable !== null) {
    this.availability.isAvailable = isAvailable;
  }
  if (status) {
    this.availability.status = status;
  }
  this.statistics.lastActiveDate = new Date();
  return this.save();
};

// Method to increment session count
mentorshipSchema.methods.incrementSessions = function() {
  this.statistics.totalSessions += 1;
  this.statistics.lastActiveDate = new Date();
  return this.save();
};

// Method to add/remove mentee
mentorshipSchema.methods.updateMenteeCount = function(change = 1) {
  this.availability.currentMentees = Math.max(0, this.availability.currentMentees + change);
  this.statistics.lastActiveDate = new Date();
  return this.save();
};

module.exports = mongoose.model('Mentorship', mentorshipSchema); 