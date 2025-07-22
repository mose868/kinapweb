const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    // Basic Event Information
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    
    // Event Details
    category: {
      type: String,
      required: true,
      enum: [
        'Workshop',
        'Webinar', 
        'Networking',
        'Conference',
        'Hackathon',
        'Career Fair',
        'Training',
        'Panel Discussion',
        'Startup Pitch',
        'Tech Talk',
        'Community Meetup',
        'Product Launch',
        'Awards Ceremony',
        'Social Event',
        'Other'
      ],
      default: 'Workshop'
    },
    eventType: {
      type: String,
      enum: ['In-Person', 'Virtual', 'Hybrid'],
      required: true,
      default: 'Hybrid'
    },
    format: {
      type: String,
      enum: ['Free', 'Paid', 'Members Only', 'Invite Only'],
      default: 'Free'
    },
    
    // Date and Time
    schedule: {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      startTime: { type: String, required: true }, // "14:00"
      endTime: { type: String, required: true },   // "17:00"
      timezone: { type: String, default: 'Africa/Nairobi' },
      duration: { type: Number }, // Duration in minutes
      isAllDay: { type: Boolean, default: false },
      isMultiDay: { type: Boolean, default: false }
    },
    
    // Location Information
    location: {
      venue: { type: String },
      address: { type: String },
      city: { type: String, default: 'Nairobi' },
      country: { type: String, default: 'Kenya' },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number }
      },
      virtualPlatform: { type: String }, // Zoom, Teams, etc.
      meetingLink: { type: String },
      meetingId: { type: String },
      accessCode: { type: String },
      directions: { type: String },
      parkingInfo: { type: String }
    },
    
    // Organizer Information
    organizer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      organization: { type: String },
      website: { type: String },
      bio: { type: String },
      profileImage: { type: String },
      socialLinks: {
        linkedin: { type: String },
        twitter: { type: String },
        facebook: { type: String }
      }
    },
    
    // Speakers and Presenters
    speakers: [{
      name: { type: String, required: true },
      title: { type: String },
      company: { type: String },
      bio: { type: String },
      profileImage: { type: String },
      expertise: [{ type: String }],
      socialLinks: {
        linkedin: { type: String },
        twitter: { type: String }
      },
      sessionTitle: { type: String },
      sessionDescription: { type: String },
      sessionTime: { type: String }
    }],
    
    // Registration and Capacity
    registration: {
      isRequired: { type: Boolean, default: true },
      capacity: { type: Number, default: 100 },
      registered: { type: Number, default: 0 },
      waitlistEnabled: { type: Boolean, default: true },
      waitlistCount: { type: Number, default: 0 },
      registrationDeadline: { type: Date },
      registrationUrl: { type: String },
      isRegistrationOpen: { type: Boolean, default: true },
      requiresApproval: { type: Boolean, default: false },
      minAge: { type: Number },
      maxAge: { type: Number }
    },
    
    // Pricing Information
    pricing: {
      isFree: { type: Boolean, default: true },
      regularPrice: { type: Number, default: 0 },
      earlyBirdPrice: { type: Number, default: 0 },
      studentPrice: { type: Number, default: 0 },
      memberPrice: { type: Number, default: 0 },
      currency: { type: String, default: 'KES' },
      earlyBirdDeadline: { type: Date },
      refundPolicy: { type: String },
      paymentMethods: [{ type: String }] // ['M-Pesa', 'Bank Transfer', 'Card']
    },
    
    // Event Content and Resources
    agenda: [{
      time: { type: String },
      activity: { type: String },
      speaker: { type: String },
      duration: { type: Number }, // minutes
      description: { type: String }
    }],
    prerequisites: [{ type: String }],
    requirements: [{ type: String }],
    whatToExpect: [{ type: String }],
    targetAudience: [{ type: String }],
    learningOutcomes: [{ type: String }],
    materials: [{ type: String }],
    resources: [{
      title: { type: String },
      url: { type: String },
      type: { type: String } // 'slide', 'document', 'video', 'link'
    }],
    
    // Media and Promotion
    images: {
      featuredImage: { type: String },
      gallery: [{ type: String }],
      bannerImage: { type: String },
      thumbnailImage: { type: String }
    },
    videos: {
      promotionalVideo: { type: String },
      trailerVideo: { type: String },
      pastEventHighlights: [{ type: String }]
    },
    
    // Social and Networking
    socialFeatures: {
      allowNetworking: { type: Boolean, default: true },
      chatEnabled: { type: Boolean, default: true },
      qnaEnabled: { type: Boolean, default: true },
      pollsEnabled: { type: Boolean, default: false },
      breakoutRooms: { type: Boolean, default: false },
      certificateProvided: { type: Boolean, default: false }
    },
    
    // Event Status and Workflow
    status: {
      type: String,
      enum: [
        'Draft',
        'Published', 
        'Registration Open',
        'Registration Closed',
        'In Progress',
        'Completed',
        'Cancelled',
        'Postponed'
      ],
      default: 'Draft'
    },
    
    // Analytics and Engagement
    analytics: {
      views: { type: Number, default: 0 },
      registrations: { type: Number, default: 0 },
      attendees: { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 }, // Percentage
      satisfactionScore: { type: Number, default: 0 },
      engagementScore: { type: Number, default: 0 },
      socialShares: { type: Number, default: 0 },
      feedbackCount: { type: Number, default: 0 }
    },
    
    // Ratings and Reviews
    ratings: {
      overall: { type: Number, default: 0 },
      content: { type: Number, default: 0 },
      speakers: { type: Number, default: 0 },
      organization: { type: Number, default: 0 },
      value: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
      breakdown: {
        five: { type: Number, default: 0 },
        four: { type: Number, default: 0 },
        three: { type: Number, default: 0 },
        two: { type: Number, default: 0 },
        one: { type: Number, default: 0 }
      }
    },
    
    // Feedback and Reviews
    reviews: [{
      attendeeName: { type: String },
      attendeeEmail: { type: String },
      rating: {
        overall: { type: Number, min: 1, max: 5 },
        content: { type: Number, min: 1, max: 5 },
        speakers: { type: Number, min: 1, max: 5 },
        organization: { type: Number, min: 1, max: 5 },
        value: { type: Number, min: 1, max: 5 }
      },
      comment: { type: String },
      wouldRecommend: { type: Boolean },
      attendedBefore: { type: Boolean },
      suggestions: { type: String },
      date: { type: Date, default: Date.now },
      isPublic: { type: Boolean, default: true },
      isVerified: { type: Boolean, default: false }
    }],
    
    // RSVP and Attendee Management
    attendees: [{
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      organization: { type: String },
      title: { type: String },
      registrationDate: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ['Registered', 'Confirmed', 'Attended', 'No Show', 'Cancelled'],
        default: 'Registered'
      },
      ticketType: { type: String },
      paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Refunded', 'Free'],
        default: 'Free'
      },
      specialRequests: { type: String },
      dietaryRestrictions: { type: String },
      checkInTime: { type: Date },
      checkOutTime: { type: Date },
      certificateIssued: { type: Boolean, default: false },
      followUpSent: { type: Boolean, default: false }
    }],
    
    // Partnerships and Sponsors
    sponsors: [{
      name: { type: String },
      logo: { type: String },
      website: { type: String },
      level: {
        type: String,
        enum: ['Title', 'Platinum', 'Gold', 'Silver', 'Bronze', 'Supporting'],
        default: 'Supporting'
      },
      description: { type: String }
    }],
    partners: [{
      name: { type: String },
      logo: { type: String },
      website: { type: String },
      type: {
        type: String,
        enum: ['Media', 'Community', 'Technology', 'Venue', 'Other'],
        default: 'Community'
      }
    }],
    
    // Follow-up and Communication
    communications: {
      remindersSent: { type: Number, default: 0 },
      lastReminderDate: { type: Date },
      followUpSent: { type: Boolean, default: false },
      thankYouSent: { type: Boolean, default: false },
      certificatesSent: { type: Boolean, default: false },
      surveysSent: { type: Boolean, default: false }
    },
    
    // Recurring Events
    recurring: {
      isRecurring: { type: Boolean, default: false },
      frequency: {
        type: String,
        enum: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Annually'],
        default: 'Monthly'
      },
      recurringDays: [{ type: String }], // ['Monday', 'Wednesday']
      seriesId: { type: String },
      seriesTotal: { type: Number },
      seriesNumber: { type: Number },
      nextEventDate: { type: Date }
    },
    
    // Platform Settings
    settings: {
      allowGuestRegistration: { type: Boolean, default: true },
      sendConfirmationEmail: { type: Boolean, default: true },
      sendReminderEmails: { type: Boolean, default: true },
      allowWaitlist: { type: Boolean, default: true },
      collectFeedback: { type: Boolean, default: true },
      issueCertificates: { type: Boolean, default: false },
      enableNetworking: { type: Boolean, default: true },
      shareRecording: { type: Boolean, default: false }
    },
    
    // Admin and Moderation
    isPublished: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isPriority: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    lastUpdatedBy: { type: String },
    moderationNotes: { type: String },
    internalNotes: { type: String },
    
    // SEO and Discoverability
    seoMeta: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
      ogImage: { type: String },
      ogDescription: { type: String }
    },
    tags: [{ type: String }],
    hashtags: [{ type: String }]
  },
  { timestamps: true }
);

// Indexes for better query performance
eventSchema.index({ 'schedule.startDate': 1, status: 1, isPublished: 1 });
eventSchema.index({ category: 1, eventType: 1, status: 1 });
eventSchema.index({ 'location.city': 1, 'schedule.startDate': 1 });
eventSchema.index({ 'pricing.isFree': 1, status: 1 });
eventSchema.index({ slug: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ 'organizer.email': 1 });
eventSchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 });
eventSchema.index({ isFeatured: 1, status: 1, 'schedule.startDate': 1 });

// Compound indexes for complex queries
eventSchema.index({ 
  status: 1, 
  'schedule.startDate': 1, 
  category: 1,
  'registration.isRegistrationOpen': 1 
});

// Geospatial index for location-based queries
eventSchema.index({ 'location.coordinates': '2dsphere' });

// Text search index
eventSchema.index({ 
  title: 'text', 
  description: 'text', 
  'speakers.name': 'text',
  tags: 'text' 
});

// Virtual for event URL
eventSchema.virtual('eventUrl').get(function() {
  return `/events/${this.slug}`;
});

// Virtual for time until event
eventSchema.virtual('timeUntilEvent').get(function() {
  const now = new Date();
  const eventDate = this.schedule.startDate;
  const diffTime = eventDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Past event';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;
  if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
  return `In ${Math.ceil(diffDays / 30)} months`;
});

// Virtual for availability status
eventSchema.virtual('availabilityStatus').get(function() {
  const now = new Date();
  const eventDate = this.schedule.startDate;
  const regDeadline = this.registration.registrationDeadline;
  
  if (now > eventDate) return 'Past Event';
  if (!this.registration.isRegistrationOpen) return 'Registration Closed';
  if (regDeadline && now > regDeadline) return 'Registration Deadline Passed';
  if (this.registration.registered >= this.registration.capacity) {
    return this.registration.waitlistEnabled ? 'Waitlist Available' : 'Fully Booked';
  }
  return 'Registration Open';
});

// Virtual for capacity percentage
eventSchema.virtual('capacityPercentage').get(function() {
  if (this.registration.capacity === 0) return 0;
  return Math.round((this.registration.registered / this.registration.capacity) * 100);
});

// Virtual for display price
eventSchema.virtual('displayPrice').get(function() {
  if (this.pricing.isFree) return 'Free';
  
  const now = new Date();
  const earlyBird = this.pricing.earlyBirdDeadline;
  
  if (earlyBird && now <= earlyBird && this.pricing.earlyBirdPrice > 0) {
    return `${this.pricing.currency} ${this.pricing.earlyBirdPrice.toLocaleString()} (Early Bird)`;
  }
  
  if (this.pricing.regularPrice > 0) {
    return `${this.pricing.currency} ${this.pricing.regularPrice.toLocaleString()}`;
  }
  
  return 'Contact for pricing';
});

// Virtual for speaker count
eventSchema.virtual('speakerCount').get(function() {
  return this.speakers ? this.speakers.length : 0;
});

// Pre-save middleware to generate slug and SEO meta
eventSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  // Calculate duration
  if (this.schedule.startTime && this.schedule.endTime) {
    const [startHour, startMin] = this.schedule.startTime.split(':').map(Number);
    const [endHour, endMin] = this.schedule.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    this.schedule.duration = endMinutes - startMinutes;
  }
  
  // Check if multi-day event
  if (this.schedule.startDate && this.schedule.endDate) {
    const startDay = new Date(this.schedule.startDate).toDateString();
    const endDay = new Date(this.schedule.endDate).toDateString();
    this.schedule.isMultiDay = startDay !== endDay;
  }
  
  // Auto-generate SEO meta if not provided
  if (!this.seoMeta.metaTitle) {
    this.seoMeta.metaTitle = this.title.length > 60 
      ? this.title.substring(0, 57) + '...' 
      : this.title;
  }
  
  if (!this.seoMeta.metaDescription) {
    const desc = this.shortDescription || this.description;
    this.seoMeta.metaDescription = desc.length > 160 
      ? desc.substring(0, 157) + '...' 
      : desc;
  }
  
  next();
});

// Static method to get upcoming events
eventSchema.statics.getUpcomingEvents = function(options = {}) {
  const { 
    category, 
    eventType, 
    isFree, 
    city,
    limit = 20, 
    skip = 0,
    featured = false
  } = options;
  
  let query = {
    status: { $in: ['Published', 'Registration Open'] },
    isPublished: true,
    'schedule.startDate': { $gte: new Date() }
  };
  
  if (category && category !== 'all') query.category = category;
  if (eventType && eventType !== 'all') query.eventType = eventType;
  if (isFree !== undefined) query['pricing.isFree'] = isFree;
  if (city && city !== 'all') query['location.city'] = city;
  if (featured) query.isFeatured = true;
  
  return this.find(query)
    .sort({ 
      isPriority: -1, 
      isFeatured: -1, 
      'schedule.startDate': 1, 
      displayOrder: -1 
    })
    .limit(limit)
    .skip(skip)
    .select('-attendees -reviews -internalNotes -moderationNotes');
};

// Static method to get featured events
eventSchema.statics.getFeaturedEvents = function(limit = 6) {
  return this.find({
    status: { $in: ['Published', 'Registration Open'] },
    isPublished: true,
    isFeatured: true,
    'schedule.startDate': { $gte: new Date() }
  })
    .sort({ displayOrder: -1, 'schedule.startDate': 1 })
    .limit(limit)
    .select('-attendees -reviews -internalNotes -moderationNotes');
};

// Static method to get events by date range
eventSchema.statics.getEventsByDateRange = function(startDate, endDate, options = {}) {
  let query = {
    status: { $in: ['Published', 'Registration Open'] },
    isPublished: true,
    $or: [
      { 'schedule.startDate': { $gte: startDate, $lte: endDate } },
      { 'schedule.endDate': { $gte: startDate, $lte: endDate } },
      { 
        'schedule.startDate': { $lte: startDate },
        'schedule.endDate': { $gte: endDate }
      }
    ]
  };
  
  if (options.category) query.category = options.category;
  if (options.eventType) query.eventType = options.eventType;
  
  return this.find(query)
    .sort({ 'schedule.startDate': 1 })
    .select('-attendees -reviews -internalNotes -moderationNotes');
};

// Instance method to register attendee
eventSchema.methods.registerAttendee = function(attendeeData) {
  // Check capacity
  if (this.registration.registered >= this.registration.capacity) {
    if (this.registration.waitlistEnabled) {
      attendeeData.status = 'Waitlisted';
      this.registration.waitlistCount += 1;
    } else {
      throw new Error('Event is fully booked and waitlist is not enabled');
    }
  } else {
    this.registration.registered += 1;
    this.analytics.registrations += 1;
  }
  
  this.attendees.push({
    ...attendeeData,
    registrationDate: new Date(),
    status: attendeeData.status || 'Registered'
  });
  
  return this.save();
};

// Instance method to cancel registration
eventSchema.methods.cancelRegistration = function(attendeeEmail) {
  const attendeeIndex = this.attendees.findIndex(att => att.email === attendeeEmail);
  
  if (attendeeIndex === -1) {
    throw new Error('Attendee not found');
  }
  
  const attendee = this.attendees[attendeeIndex];
  
  if (attendee.status === 'Waitlisted') {
    this.registration.waitlistCount = Math.max(0, this.registration.waitlistCount - 1);
  } else {
    this.registration.registered = Math.max(0, this.registration.registered - 1);
  }
  
  this.attendees.splice(attendeeIndex, 1);
  
  return this.save();
};

// Instance method to add review
eventSchema.methods.addReview = function(reviewData) {
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
  this.ratings.content = Number((reviews.reduce((sum, r) => sum + r.rating.content, 0) / reviews.length).toFixed(1));
  this.ratings.speakers = Number((reviews.reduce((sum, r) => sum + r.rating.speakers, 0) / reviews.length).toFixed(1));
  this.ratings.organization = Number((reviews.reduce((sum, r) => sum + r.rating.organization, 0) / reviews.length).toFixed(1));
  this.ratings.value = Number((reviews.reduce((sum, r) => sum + r.rating.value, 0) / reviews.length).toFixed(1));
  
  this.analytics.feedbackCount = this.reviews.length;
  
  return this.save();
};

// Instance method to increment view count
eventSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  return this.save();
};

// Instance method to update event status
eventSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  // Auto-update registration status based on event status
  if (newStatus === 'Completed' || newStatus === 'Cancelled') {
    this.registration.isRegistrationOpen = false;
  }
  
  return this.save();
};

module.exports = mongoose.model('Event', eventSchema); 