const mongoose = require('mongoose');

const sellerApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Personal Information
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    nationality: { type: String, required: true },
    idNumber: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true }
    }
  },
  
  // Professional Information
  professionalInfo: {
    skills: [{ type: String, required: true }],
    experience: { type: String, required: true },
    education: { type: String, required: true },
    certifications: [{ type: String }],
    portfolio: { type: String },
    linkedinProfile: { type: String },
    githubProfile: { type: String },
    website: { type: String }
  },
  
  // Business Information
  businessInfo: {
    businessName: { type: String, required: true },
    businessType: { type: String, required: true },
    services: [{ type: String, required: true }],
    targetMarket: { type: String, required: true },
    pricingStrategy: { type: String, required: true },
    expectedEarnings: { type: Number, required: true }
  },
  
  // Application Content for AI Vetting
  applicationContent: {
    motivation: { type: String, required: true },
    experienceDescription: { type: String, required: true },
    serviceDescription: { type: String, required: true },
    valueProposition: { type: String, required: true },
    sampleWork: { type: String, required: true }
  },
  
  // AI Vetting Results
  aiVetting: {
    isProcessed: { type: Boolean, default: false },
    processedAt: { type: Date },
    confidence: { type: Number, min: 0, max: 1 },
    riskScore: { type: Number, min: 0, max: 1 },
    qualityScore: { type: Number, min: 0, max: 1 },
    recommendations: [{ type: String }],
    flaggedIssues: [{ type: String }],
    aiNotes: { type: String },
    modelUsed: { type: String }
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'ai_processing', 'ai_approved', 'ai_rejected', 'manual_review', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Review Information
  review: {
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    reviewNotes: { type: String },
    finalDecision: { type: String, enum: ['approved', 'rejected', 'needs_more_info'] },
    rejectionReason: { type: String }
  },
  
  // Supporting Documents
  documents: {
    idDocument: { type: String, required: true },
    portfolioSamples: [{ type: String }],
    certificates: [{ type: String }],
    references: [{ type: String }]
  },
  
  // Metadata
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  
  // Tracking
  viewCount: { type: Number, default: 0 },
  lastViewed: { type: Date }
}, {
  timestamps: true
});

// Indexes for efficient querying
sellerApplicationSchema.index({ userId: 1 });
sellerApplicationSchema.index({ status: 1 });
sellerApplicationSchema.index({ 'aiVetting.confidence': -1 });
sellerApplicationSchema.index({ submittedAt: -1 });

// Pre-save middleware to update the updatedAt field
sellerApplicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for application age
sellerApplicationSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.submittedAt) / (1000 * 60 * 60 * 24));
});

// Method to calculate overall score
sellerApplicationSchema.methods.calculateOverallScore = function() {
  if (!this.aiVetting.isProcessed) return null;
  
  const weights = {
    confidence: 0.3,
    qualityScore: 0.4,
    riskScore: 0.3
  };
  
  return (
    (this.aiVetting.confidence * weights.confidence) +
    (this.aiVetting.qualityScore * weights.qualityScore) +
    ((1 - this.aiVetting.riskScore) * weights.riskScore)
  );
};

// Method to check if application is expired
sellerApplicationSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return Date.now() > this.expiresAt;
};

module.exports = mongoose.model('SellerApplication', sellerApplicationSchema); 