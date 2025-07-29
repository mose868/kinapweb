const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  
  // Mentor Profile
  mentor: {
    name: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      required: true,
      maxlength: 500
    },
    profilePhoto: String,
    avatar: String
  },

  // Professional Information
  category: {
    type: String,
    required: true,
    enum: [
      'Web Development', 'Mobile Development', 'Data Science', 'UI/UX Design',
      'Digital Marketing', 'Cybersecurity', 'Project Management', 'Entrepreneurship',
      'Career Development', 'Freelancing', 'Content Creation', 'Graphic Design'
    ]
  },
  
  expertiseLevel: {
    type: String,
    required: true,
    enum: ['Junior', 'Mid-Level', 'Senior', 'Expert']
  },

  // Availability
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['Available', 'Busy', 'Away', 'Offline'],
      default: 'Available'
    },
    responseTime: {
      type: String,
      default: 'Within 24 hours'
    }
  },

  // Instant Availability
  instantAvailability: {
    enabled: {
      type: Boolean,
      default: false
    },
    responseTime: {
      type: String,
      default: 'Within 1 hour'
    }
  },

  // Pricing
  pricing: {
    isFree: {
      type: Boolean,
      default: false
    },
    sessionRate: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'KES'
    },
    regularPrice: {
      type: Number,
      default: 0
    },
    discountPrice: {
      type: Number,
      default: 0
    }
  },

  // Location
  location: {
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'Kenya'
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Ratings and Reviews
  ratings: {
    overall: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    average: {
      type: Number,
      default: 0
    }
  },

  // Verification
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },

  // Features
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Session Types
  sessionTypes: [{
    type: String,
    enum: [
      'Quick Question', 'Code Review', 'Career Advice', 'Technical Help',
      'Project Guidance', 'General Mentorship', 'Interview Prep', 'Skill Building'
    ]
  }],

  // Skills and Expertise
  skills: [{
    type: String,
    trim: true
  }],

  // Experience
  experience: {
    years: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },

  // Education
  education: {
    degree: String,
    institution: String,
    year: Number
  },

  // Social Links
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String,
    website: String
  },

  // Statistics
  stats: {
    sessionsCompleted: {
      type: Number,
      default: 0
    },
    totalHours: {
      type: Number,
      default: 0
    },
    satisfactionRate: {
      type: Number,
      default: 0
    },
    responseRate: {
      type: Number,
      default: 0
    }
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },

  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  
  displayOrder: {
    type: Number,
    default: 0
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
mentorSchema.index({ userId: 1 });
mentorSchema.index({ category: 1 });
mentorSchema.index({ expertiseLevel: 1 });
mentorSchema.index({ 'location.city': 1 });
mentorSchema.index({ status: 1 });
mentorSchema.index({ isActive: 1 });
mentorSchema.index({ isFeatured: 1 });
mentorSchema.index({ 'ratings.overall': -1 });
mentorSchema.index({ createdAt: -1 });

// Virtual for full name
mentorSchema.virtual('fullName').get(function() {
  return this.mentor.name;
});

// Pre-save middleware
mentorSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Generate slug if not provided
  if (!this.slug) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  next();
});

// Methods
mentorSchema.methods.updateRating = function(newRating) {
  const totalRatings = this.ratings.totalRatings + 1;
  const newOverall = ((this.ratings.overall * this.ratings.totalRatings) + newRating) / totalRatings;
  
  this.ratings.overall = Math.round(newOverall * 10) / 10;
  this.ratings.totalRatings = totalRatings;
  this.ratings.average = newOverall;
  
  return this.save();
};

mentorSchema.methods.incrementSessions = function() {
  this.stats.sessionsCompleted += 1;
  return this.save();
};

mentorSchema.methods.isAvailable = function() {
  return this.isActive && this.availability.isAvailable && this.status === 'active';
};

module.exports = mongoose.model('Mentor', mentorSchema); 