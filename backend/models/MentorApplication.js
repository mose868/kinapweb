const mongoose = require('mongoose');

const mentorApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Personal Information
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    nationality: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    location: {
      city: { type: String, required: true },
      country: { type: String, required: true }
    }
  },

  // Professional Information
  professionalInfo: {
    currentRole: { type: String, required: true },
    company: { type: String, required: true },
    experience: { type: String, required: true }, // years of experience
    education: { type: String, required: true },
    skills: [{ type: String, required: true }],
    certifications: [{ type: String }],
    achievements: [{ type: String }]
  },

  // Mentorship Information
  mentorshipInfo: {
    categories: [{ type: String, required: true }],
    expertiseLevel: { type: String, required: true }, // Junior, Mid-Level, Senior, Expert
    sessionTypes: [{ type: String, required: true }], // Quick Question, Code Review, Career Advice, etc.
    availability: {
      isAvailable: { type: Boolean, default: true },
      responseTime: { type: String, default: 'Within 24 hours' },
      instantAvailability: { type: Boolean, default: false }
    },
    pricing: {
      isFree: { type: Boolean, default: false },
      sessionRate: { type: Number, default: 0 },
      currency: { type: String, default: 'KES' }
    }
  },

  // Application Content
  applicationContent: {
    motivation: { type: String, required: true },
    experienceDescription: { type: String, required: true },
    mentoringApproach: { type: String, required: true },
    successStories: { type: String, required: true },
    valueProposition: { type: String, required: true },
    sampleSession: { type: String, required: true }
  },

  // AI Vetting Results
  aiVetting: {
    overallScore: { type: Number, default: 0 },
    sentimentScore: { type: Number, default: 0 },
    qualityScore: { type: Number, default: 0 },
    riskScore: { type: Number, default: 0 },
    motivationScore: { type: Number, default: 0 },
    experienceScore: { type: Number, default: 0 },
    recommendations: [{ type: String }],
    flaggedIssues: [{ type: String }],
    aiNotes: { type: String },
    confidence: { type: Number, default: 0 }
  },

  // Application Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },

  // Review Information
  review: {
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    notes: { type: String },
    adminNotes: { type: String }
  },

  // Documents
  documents: {
    resume: { type: String },
    portfolio: { type: String },
    certificates: [{ type: String }],
    references: [{ type: String }]
  },

  // Metadata
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Indexes
mentorApplicationSchema.index({ userId: 1 });
mentorApplicationSchema.index({ status: 1 });
mentorApplicationSchema.index({ 'aiVetting.overallScore': -1 });
mentorApplicationSchema.index({ submittedAt: -1 });

// Virtual for age calculation
mentorApplicationSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.submittedAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware
mentorApplicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Methods
mentorApplicationSchema.methods.calculateOverallScore = function() {
  const { aiVetting } = this;
  const weights = {
    sentiment: 0.15,
    quality: 0.25,
    risk: 0.20,
    motivation: 0.20,
    experience: 0.20
  };

  return (
    aiVetting.sentimentScore * weights.sentiment +
    aiVetting.qualityScore * weights.quality +
    (1 - aiVetting.riskScore) * weights.risk +
    aiVetting.motivationScore * weights.motivation +
    aiVetting.experienceScore * weights.experience
  );
};

mentorApplicationSchema.methods.isExpired = function() {
  const daysSinceSubmission = this.ageInDays;
  return daysSinceSubmission > 30; // Applications expire after 30 days
};

module.exports = mongoose.model('MentorApplication', mentorApplicationSchema); 