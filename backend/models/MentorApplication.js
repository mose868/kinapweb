const mongoose = require('mongoose');

const mentorApplicationSchema = new mongoose.Schema(
  {
    // Application Tracking
    applicationId: { 
      type: String, 
      unique: true, 
      default: () => 'APP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) 
    },
    
    // Personal Information (Step 1)
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      phone: { type: String, required: true },
      dateOfBirth: { type: Date },
      nationality: { type: String, default: 'Kenyan' },
      idNumber: { type: String },
      profilePhoto: { type: String },
      socialLinks: {
        linkedin: { type: String },
        twitter: { type: String },
        github: { type: String },
        website: { type: String }
      }
    },
    
    // Location & Availability (Step 2)
    location: {
      city: { type: String, required: true, default: 'Nairobi' },
      county: { type: String, default: 'Nairobi' },
      country: { type: String, default: 'Kenya' },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number }
      },
      isLocationFlexible: { type: Boolean, default: true },
      preferredRadius: { type: Number, default: 50 }, // km
      canTravelForMentoring: { type: Boolean, default: false }
    },
    
    // Availability (Uber-like availability settings)
    availability: {
      isAvailableNow: { type: Boolean, default: false },
      preferredSchedule: {
        monday: { available: { type: Boolean, default: false }, hours: [{ start: String, end: String }] },
        tuesday: { available: { type: Boolean, default: false }, hours: [{ start: String, end: String }] },
        wednesday: { available: { type: Boolean, default: false }, hours: [{ start: String, end: String }] },
        thursday: { available: { type: Boolean, default: false }, hours: [{ start: String, end: String }] },
        friday: { available: { type: Boolean, default: false }, hours: [{ start: String, end: String }] },
        saturday: { available: { type: Boolean, default: false }, hours: [{ start: String, end: String }] },
        sunday: { available: { type: Boolean, default: false }, hours: [{ start: String, end: String }] }
      },
      weeklyHoursCommitment: { type: Number, default: 5 }, // hours per week
      maxMentees: { type: Number, default: 3 },
      responseTimeCommitment: { 
        type: String, 
        enum: ['Within 1 hour', 'Within 4 hours', 'Within 24 hours', 'Within 48 hours'],
        default: 'Within 24 hours'
      },
      instantMentoring: {
        enabled: { type: Boolean, default: false },
        maxInstantSessions: { type: Number, default: 2 },
        instantSessionDuration: { type: Number, default: 30 } // minutes
      }
    },
    
    // Professional Background (Step 3)
    professional: {
      currentRole: { type: String, required: true },
      currentCompany: { type: String, required: true },
      industry: { 
        type: String, 
        required: true,
        enum: [
          'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
          'Design', 'Consulting', 'Entrepreneurship', 'Non-Profit',
          'Government', 'Real Estate', 'Media', 'Legal', 'Other'
        ]
      },
      experienceLevel: { 
        type: String, 
        required: true,
        enum: ['Junior (1-3 years)', 'Mid-Level (3-6 years)', 'Senior (6-10 years)', 'Expert (10+ years)', 'C-Level/Executive']
      },
      yearsOfExperience: { type: Number, required: true },
      previousRoles: [{
        title: { type: String },
        company: { type: String },
        duration: { type: String },
        description: { type: String }
      }],
      achievements: [{ type: String }],
      certifications: [{ 
        name: { type: String },
        issuer: { type: String },
        dateObtained: { type: Date },
        certificateUrl: { type: String }
      }]
    },
    
    // Education Background (Step 4)
    education: {
      highestDegree: { 
        type: String,
        enum: ['High School', 'Certificate', 'Diploma', 'Bachelor\'s', 'Master\'s', 'PhD', 'Other']
      },
      fieldOfStudy: { type: String },
      institution: { type: String },
      graduationYear: { type: Number },
      additionalEducation: [{
        degree: { type: String },
        field: { type: String },
        institution: { type: String },
        year: { type: Number }
      }],
      onlineCoursesCompleted: [{ 
        courseName: { type: String },
        platform: { type: String },
        completionDate: { type: Date },
        certificateUrl: { type: String }
      }]
    },
    
    // Mentoring Experience & Skills (Step 5)
    mentoringExperience: {
      hasMentoredBefore: { type: Boolean, default: false },
      previousMentoringExperience: { type: String },
      numberOfMentees: { type: Number, default: 0 },
      mentoringDuration: { type: String }, // "6 months", "2 years", etc.
      mentoringStyle: { 
        type: String,
        enum: ['Directive', 'Non-Directive', 'Collaborative', 'Coaching', 'Counseling', 'Mixed']
      },
      preferredMentoringFormat: [{ 
        type: String,
        enum: ['One-on-One', 'Group Mentoring', 'Virtual Sessions', 'In-Person Meetings', 'Project-Based', 'Ad-hoc Support']
      }]
    },
    
    // Expertise & Skills (Step 6)
    expertise: {
      primarySkills: [{ type: String, required: true }], // Must have at least 3
      secondarySkills: [{ type: String }],
      technicalSkills: [{ type: String }],
      softSkills: [{ type: String }],
      specializations: [{ 
        type: String,
        enum: [
          'Web Development', 'Mobile Development', 'Data Science', 'UI/UX Design',
          'Digital Marketing', 'Cybersecurity', 'Project Management', 'Entrepreneurship',
          'Career Development', 'Freelancing', 'Content Creation', 'Graphic Design',
          'Business Strategy', 'Leadership', 'Sales', 'Customer Service', 'Other'
        ]
      }],
      industries: [{ type: String }],
      careerStages: [{ 
        type: String,
        enum: ['Students', 'Recent Graduates', 'Career Changers', 'Mid-Career Professionals', 'Senior Professionals', 'Entrepreneurs']
      }]
    },
    
    // Motivation & Goals (Step 7)
    motivation: {
      whyMentor: { type: String, required: true },
      mentoringGoals: [{ type: String }],
      successDefinition: { type: String },
      challengesToAddress: [{ type: String }],
      idealMenteeProfile: { type: String },
      valuesToShare: [{ type: String }],
      personalGrowthGoals: { type: String }
    },
    
    // Background Check & References (Step 8)
    verification: {
      hasBackgroundCheck: { type: Boolean, default: false },
      backgroundCheckProvider: { type: String },
      backgroundCheckDate: { type: Date },
      references: [{
        name: { type: String },
        relationship: { type: String },
        email: { type: String },
        phone: { type: String },
        hasBeenContacted: { type: Boolean, default: false },
        referenceScore: { type: Number }, // 1-10
        referenceNotes: { type: String }
      }],
      linkedinVerified: { type: Boolean, default: false },
      emailVerified: { type: Boolean, default: false },
      phoneVerified: { type: Boolean, default: false }
    },
    
    // Application Documents
    documents: {
      resume: { type: String }, // File URL
      coverLetter: { type: String },
      portfolio: { type: String },
      idCopy: { type: String },
      recommendations: [{ type: String }], // File URLs
      certificates: [{ type: String }] // File URLs
    },
    
    // Assessment & Evaluation
    assessment: {
      // Uber-like scoring system
      overallScore: { type: Number, default: 0 }, // 0-100
      categoryScores: {
        experience: { type: Number, default: 0 }, // 0-100
        communication: { type: Number, default: 0 },
        availability: { type: Number, default: 0 },
        expertise: { type: Number, default: 0 },
        motivation: { type: Number, default: 0 },
        reliability: { type: Number, default: 0 },
        cultural_fit: { type: Number, default: 0 }
      },
      
      // AI Assessment Results
      aiEvaluation: {
        resumeAnalysis: {
          score: { type: Number },
          strengths: [{ type: String }],
          concerns: [{ type: String }],
          recommendations: [{ type: String }]
        },
        skillsMatch: {
          score: { type: Number },
          matchedSkills: [{ type: String }],
          missingSkills: [{ type: String }],
          marketDemand: { type: String } // High, Medium, Low
        },
        communicationAssessment: {
          score: { type: Number },
          writingQuality: { type: Number },
          clarity: { type: Number },
          professionalism: { type: Number }
        },
        riskFactors: [{
          factor: { type: String },
          severity: { type: String }, // Low, Medium, High
          description: { type: String }
        }],
        recommendation: { 
          type: String,
          enum: ['Strong Approve', 'Approve', 'Conditional Approve', 'Review Needed', 'Reject']
        },
        confidenceLevel: { type: Number } // 0-100
      },
      
      // Manual Review Scores
      humanReview: {
        reviewerId: { type: String },
        reviewerName: { type: String },
        interviewCompleted: { type: Boolean, default: false },
        interviewDate: { type: Date },
        interviewScore: { type: Number },
        interviewNotes: { type: String },
        backgroundCheckPassed: { type: Boolean, default: false },
        referencesChecked: { type: Boolean, default: false },
        finalRecommendation: { 
          type: String,
          enum: ['Approve', 'Conditional Approve', 'Reject', 'Needs More Review']
        },
        reviewNotes: { type: String },
        reviewDate: { type: Date }
      }
    },
    
    // Application Status & Workflow
    applicationStatus: {
      currentStep: { 
        type: String,
        enum: [
          'Started', 'Personal Info', 'Location & Availability', 'Professional Background',
          'Education', 'Mentoring Experience', 'Expertise & Skills', 'Motivation',
          'Documents Upload', 'Submitted', 'Under Review', 'AI Assessment',
          'Interview Scheduled', 'Interview Completed', 'Background Check',
          'Reference Check', 'Final Review', 'Approved', 'Rejected', 'Waitlisted'
        ],
        default: 'Started'
      },
      completionPercentage: { type: Number, default: 0 },
      status: {
        type: String,
        enum: [
          'Draft', 'In Progress', 'Submitted', 'Under Review', 'Interview Scheduled',
          'Interview Completed', 'Approved', 'Rejected', 'Waitlisted', 'Onboarding'
        ],
        default: 'Draft'
      },
      submittedAt: { type: Date },
      reviewStartedAt: { type: Date },
      reviewCompletedAt: { type: Date },
      approvedAt: { type: Date },
      rejectedAt: { type: Date },
      
      // Uber-like approval flow
      autoApproved: { type: Boolean, default: false },
      requiresInterview: { type: Boolean, default: false },
      requiresBackgroundCheck: { type: Boolean, default: false },
      priorityApplication: { type: Boolean, default: false }
    },
    
    // Workflow Tracking
    workflow: {
      steps: [{
        stepName: { type: String },
        completedAt: { type: Date },
        data: { type: mongoose.Schema.Types.Mixed }
      }],
      notifications: [{
        type: { type: String },
        message: { type: String },
        sentAt: { type: Date },
        method: { type: String } // 'email', 'sms', 'in-app'
      }],
      reminders: [{
        type: { type: String },
        scheduledFor: { type: Date },
        sent: { type: Boolean, default: false }
      }]
    },
    
    // Communication Log
    communications: [{
      type: { type: String, enum: ['Email', 'Phone', 'SMS', 'In-App', 'Interview'] },
      direction: { type: String, enum: ['Inbound', 'Outbound'] },
      subject: { type: String },
      message: { type: String },
      sentBy: { type: String },
      sentAt: { type: Date },
      response: { type: String },
      responseAt: { type: Date }
    }],
    
    // Analytics
    analytics: {
      timeToComplete: { type: Number }, // minutes
      dropoffStep: { type: String },
      sourceChannel: { type: String }, // 'website', 'referral', 'social', 'ad'
      referralSource: { type: String },
      deviceUsed: { type: String },
      browserUsed: { type: String },
      sessionCount: { type: Number, default: 1 },
      totalTimeSpent: { type: Number, default: 0 }
    },
    
    // Admin Notes
    adminNotes: [{
      note: { type: String },
      addedBy: { type: String },
      addedAt: { type: Date, default: Date.now },
      category: { type: String, enum: ['General', 'Interview', 'Background', 'Skills', 'Concern', 'Positive'] }
    }],
    
    // Integration Data
    integration: {
      slackChannelNotified: { type: Boolean, default: false },
      calendarInviteSent: { type: Boolean, default: false },
      backgroundCheckTriggered: { type: Boolean, default: false },
      onboardingEmailSent: { type: Boolean, default: false },
      mentorProfileCreated: { type: Boolean, default: false },
      mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentorship' }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
mentorApplicationSchema.index({ applicationId: 1 });
mentorApplicationSchema.index({ 'personalInfo.email': 1 });
mentorApplicationSchema.index({ 'applicationStatus.status': 1, createdAt: -1 });
mentorApplicationSchema.index({ 'applicationStatus.currentStep': 1 });
mentorApplicationSchema.index({ 'assessment.overallScore': -1 });
mentorApplicationSchema.index({ 'expertise.specializations': 1 });
mentorApplicationSchema.index({ 'location.city': 1 });
mentorApplicationSchema.index({ 'professional.industry': 1 });

// Text search index
mentorApplicationSchema.index({
  'personalInfo.firstName': 'text',
  'personalInfo.lastName': 'text',
  'personalInfo.email': 'text',
  'professional.currentRole': 'text',
  'professional.currentCompany': 'text',
  'expertise.primarySkills': 'text'
});

// Virtual for full name
mentorApplicationSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Virtual for application age
mentorApplicationSchema.virtual('applicationAge').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
});

// Virtual for approval readiness
mentorApplicationSchema.virtual('approvalReadiness').get(function() {
  const score = this.assessment.overallScore;
  const status = this.applicationStatus.status;
  
  if (score >= 85 && status === 'Submitted') return 'Auto-Approve Ready';
  if (score >= 70 && status === 'Submitted') return 'Interview Required';
  if (score >= 50 && status === 'Submitted') return 'Manual Review';
  if (score < 50 && status === 'Submitted') return 'Likely Reject';
  return 'Incomplete';
});

// Pre-save middleware to calculate completion percentage
mentorApplicationSchema.pre('save', function(next) {
  const requiredFields = [
    this.personalInfo.firstName,
    this.personalInfo.lastName,
    this.personalInfo.email,
    this.personalInfo.phone,
    this.location.city,
    this.professional.currentRole,
    this.professional.currentCompany,
    this.professional.industry,
    this.professional.experienceLevel,
    this.expertise.primarySkills.length >= 3,
    this.motivation.whyMentor
  ];
  
  const completedFields = requiredFields.filter(field => field).length;
  this.applicationStatus.completionPercentage = Math.round((completedFields / requiredFields.length) * 100);
  
  // Update current step based on completion
  if (this.applicationStatus.completionPercentage === 100 && this.applicationStatus.currentStep !== 'Submitted') {
    this.applicationStatus.currentStep = 'Submitted';
    this.applicationStatus.status = 'Submitted';
    this.applicationStatus.submittedAt = new Date();
  }
  
  next();
});

// Static method to get applications by status
mentorApplicationSchema.statics.getByStatus = function(status, options = {}) {
  const { limit = 50, skip = 0, sortBy = '-createdAt' } = options;
  
  return this.find({ 'applicationStatus.status': status })
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .select('-documents -workflow.steps -communications');
};

// Static method to get applications for AI review
mentorApplicationSchema.statics.getPendingAIReview = function() {
  return this.find({
    'applicationStatus.status': 'Submitted',
    'assessment.aiEvaluation.recommendation': { $exists: false }
  }).sort({ 'applicationStatus.submittedAt': 1 });
};

// Static method to get high-scoring applications
mentorApplicationSchema.statics.getHighScoringApplications = function(minScore = 80) {
  return this.find({
    'assessment.overallScore': { $gte: minScore },
    'applicationStatus.status': { $in: ['Submitted', 'Under Review'] }
  }).sort({ 'assessment.overallScore': -1 });
};

// Instance method to calculate AI score
mentorApplicationSchema.methods.calculateAIScore = function() {
  let score = 0;
  let maxScore = 0;
  
  // Experience Score (30%)
  const expYears = this.professional.yearsOfExperience;
  const expScore = Math.min(expYears * 5, 30); // Max 30 points
  score += expScore;
  maxScore += 30;
  
  // Skills Score (25%)
  const primarySkillsCount = this.expertise.primarySkills.length;
  const skillsScore = Math.min(primarySkillsCount * 3, 25); // Max 25 points
  score += skillsScore;
  maxScore += 25;
  
  // Education Score (15%)
  const degreeScores = {
    'PhD': 15, 'Master\'s': 12, 'Bachelor\'s': 10,
    'Diploma': 8, 'Certificate': 6, 'High School': 4, 'Other': 5
  };
  const eduScore = degreeScores[this.education.highestDegree] || 5;
  score += eduScore;
  maxScore += 15;
  
  // Availability Score (15%)
  const weeklyHours = this.availability.weeklyHoursCommitment;
  const availScore = Math.min(weeklyHours * 2, 15); // Max 15 points
  score += availScore;
  maxScore += 15;
  
  // Mentoring Experience Score (15%)
  const mentorExp = this.mentoringExperience.hasMentoredBefore ? 15 : 5;
  score += mentorExp;
  maxScore += 15;
  
  // Normalize to 100
  const finalScore = Math.round((score / maxScore) * 100);
  
  // Update assessment scores
  this.assessment.overallScore = finalScore;
  this.assessment.categoryScores.experience = Math.round((expScore / 30) * 100);
  this.assessment.categoryScores.expertise = Math.round((skillsScore / 25) * 100);
  this.assessment.categoryScores.availability = Math.round((availScore / 15) * 100);
  
  return finalScore;
};

// Instance method to advance to next step
mentorApplicationSchema.methods.advanceStep = function(nextStep) {
  this.workflow.steps.push({
    stepName: this.applicationStatus.currentStep,
    completedAt: new Date(),
    data: { advancedTo: nextStep }
  });
  
  this.applicationStatus.currentStep = nextStep;
  
  // Update status based on step
  const statusMapping = {
    'Submitted': 'Submitted',
    'Under Review': 'Under Review',
    'AI Assessment': 'Under Review',
    'Interview Scheduled': 'Interview Scheduled',
    'Interview Completed': 'Interview Completed',
    'Approved': 'Approved',
    'Rejected': 'Rejected'
  };
  
  if (statusMapping[nextStep]) {
    this.applicationStatus.status = statusMapping[nextStep];
  }
  
  return this.save();
};

// Instance method to send notification
mentorApplicationSchema.methods.sendNotification = function(type, message, method = 'email') {
  this.workflow.notifications.push({
    type,
    message,
    sentAt: new Date(),
    method
  });
  
  return this.save();
};

// Instance method to add admin note
mentorApplicationSchema.methods.addAdminNote = function(note, addedBy, category = 'General') {
  this.adminNotes.push({
    note,
    addedBy,
    addedAt: new Date(),
    category
  });
  
  return this.save();
};

module.exports = mongoose.model('MentorApplication', mentorApplicationSchema); 