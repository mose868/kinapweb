const express = require('express');
const MentorApplication = require('../models/MentorApplication');
const MentorSession = require('../models/MentorSession');
const Mentorship = require('../models/Mentorship');

const router = express.Router();

// ================== PUBLIC APPLICATION ROUTES ==================

// Start new mentor application
router.post('/apply', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if application already exists
    const existingApplication = await MentorApplication.findOne({ 'personalInfo.email': email });
    if (existingApplication) {
      return res.status(400).json({ 
        message: 'Application already exists',
        applicationId: existingApplication.applicationId,
        status: existingApplication.applicationStatus.status,
        currentStep: existingApplication.applicationStatus.currentStep
      });
    }
    
    // Create new application
    const applicationData = {
      personalInfo: { email },
      applicationStatus: {
        currentStep: 'Personal Info',
        status: 'In Progress'
      },
      analytics: {
        sourceChannel: req.body.sourceChannel || 'website',
        deviceUsed: req.headers['user-agent'],
        sessionCount: 1
      }
    };
    
    const application = await MentorApplication.create(applicationData);
    
    res.status(201).json({
      message: 'Application started successfully',
      applicationId: application.applicationId,
      currentStep: application.applicationStatus.currentStep,
      completionPercentage: application.applicationStatus.completionPercentage
    });
  } catch (error) {
    console.error('Start application error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get application by ID or email
router.get('/application/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    let application;
    if (identifier.startsWith('APP_')) {
      application = await MentorApplication.findOne({ applicationId: identifier });
    } else {
      application = await MentorApplication.findOne({ 'personalInfo.email': identifier });
    }
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Remove sensitive data for public access
    const publicApplication = {
      applicationId: application.applicationId,
      currentStep: application.applicationStatus.currentStep,
      status: application.applicationStatus.status,
      completionPercentage: application.applicationStatus.completionPercentage,
      personalInfo: {
        firstName: application.personalInfo.firstName,
        lastName: application.personalInfo.lastName,
        email: application.personalInfo.email
      },
      submittedAt: application.applicationStatus.submittedAt,
      applicationAge: application.applicationAge
    };
    
    res.json(publicApplication);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application step
router.put('/application/:applicationId/step/:step', async (req, res) => {
  try {
    const { applicationId, step } = req.params;
    const updateData = req.body;
    
    const application = await MentorApplication.findOne({ applicationId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    // Update based on step
    switch (step) {
      case 'personal-info':
        application.personalInfo = { ...application.personalInfo, ...updateData };
        application.applicationStatus.currentStep = 'Location & Availability';
        break;
        
      case 'location-availability':
        application.location = { ...application.location, ...updateData.location };
        application.availability = { ...application.availability, ...updateData.availability };
        application.applicationStatus.currentStep = 'Professional Background';
        break;
        
      case 'professional':
        application.professional = { ...application.professional, ...updateData };
        application.applicationStatus.currentStep = 'Education';
        break;
        
      case 'education':
        application.education = { ...application.education, ...updateData };
        application.applicationStatus.currentStep = 'Mentoring Experience';
        break;
        
      case 'mentoring-experience':
        application.mentoringExperience = { ...application.mentoringExperience, ...updateData };
        application.applicationStatus.currentStep = 'Expertise & Skills';
        break;
        
      case 'expertise':
        application.expertise = { ...application.expertise, ...updateData };
        application.applicationStatus.currentStep = 'Motivation';
        break;
        
      case 'motivation':
        application.motivation = { ...application.motivation, ...updateData };
        application.applicationStatus.currentStep = 'Documents Upload';
        break;
        
      case 'documents':
        application.documents = { ...application.documents, ...updateData };
        application.applicationStatus.currentStep = 'Submitted';
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid step' });
    }
    
    // Track step completion
    application.workflow.steps.push({
      stepName: step,
      completedAt: new Date(),
      data: updateData
    });
    
    await application.save();
    
    res.json({
      message: 'Application updated successfully',
      currentStep: application.applicationStatus.currentStep,
      completionPercentage: application.applicationStatus.completionPercentage,
      status: application.applicationStatus.status
    });
  } catch (error) {
    console.error('Update application step error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit completed application
router.post('/application/:applicationId/submit', async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await MentorApplication.findOne({ applicationId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    if (application.applicationStatus.completionPercentage < 100) {
      return res.status(400).json({ 
        message: 'Application is not complete',
        completionPercentage: application.applicationStatus.completionPercentage
      });
    }
    
    // Calculate AI score
    const aiScore = application.calculateAIScore();
    
    // Update status
    application.applicationStatus.status = 'Submitted';
    application.applicationStatus.submittedAt = new Date();
    application.applicationStatus.reviewStartedAt = new Date();
    
    // Determine approval flow based on score
    if (aiScore >= 85) {
      application.applicationStatus.autoApproved = true;
      application.applicationStatus.requiresInterview = false;
    } else if (aiScore >= 70) {
      application.applicationStatus.requiresInterview = true;
    } else {
      application.applicationStatus.requiresBackgroundCheck = true;
    }
    
    await application.save();
    
    // Trigger AI evaluation (this would be async in production)
    setTimeout(() => {
      performAIEvaluation(applicationId);
    }, 1000);
    
    res.json({
      message: 'Application submitted successfully',
      applicationId: application.applicationId,
      aiScore: aiScore,
      estimatedReviewTime: aiScore >= 85 ? '24 hours' : '3-5 business days',
      nextSteps: aiScore >= 85 ? 
        ['AI evaluation', 'Background check', 'Approval'] :
        ['AI evaluation', 'Manual review', 'Interview', 'Final decision']
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get application status
router.get('/application/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await MentorApplication.findOne({ applicationId })
      .select('applicationStatus assessment workflow');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json({
      status: application.applicationStatus.status,
      currentStep: application.applicationStatus.currentStep,
      completionPercentage: application.applicationStatus.completionPercentage,
      overallScore: application.assessment.overallScore,
      submittedAt: application.applicationStatus.submittedAt,
      estimatedDecision: getEstimatedDecisionTime(application),
      nextSteps: getNextSteps(application),
      lastUpdate: application.updatedAt
    });
  } catch (error) {
    console.error('Get application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================== ADMIN ROUTES ==================

// Get all applications with filtering
router.get('/admin/applications', async (req, res) => {
  try {
    const { 
      status, 
      step,
      minScore,
      industry,
      experience,
      limit = 50, 
      skip = 0,
      sortBy = '-createdAt'
    } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') query['applicationStatus.status'] = status;
    if (step && step !== 'all') query['applicationStatus.currentStep'] = step;
    if (minScore) query['assessment.overallScore'] = { $gte: parseInt(minScore) };
    if (industry && industry !== 'all') query['professional.industry'] = industry;
    if (experience && experience !== 'all') query['professional.experienceLevel'] = experience;
    
    const applications = await MentorApplication.find(query)
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-documents -workflow.steps -communications');
    
    const total = await MentorApplication.countDocuments(query);
    
    res.json({
      applications,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: skip > 0
      }
    });
  } catch (error) {
    console.error('Get admin applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single application (full details for admin)
router.get('/admin/applications/:applicationId', async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await MentorApplication.findOne({ applicationId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    console.error('Get admin application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (admin)
router.patch('/admin/applications/:applicationId/status', async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes, reviewerId } = req.body;
    
    const application = await MentorApplication.findOne({ applicationId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    const previousStatus = application.applicationStatus.status;
    application.applicationStatus.status = status;
    
    // Update timestamps based on status
    if (status === 'Approved') {
      application.applicationStatus.approvedAt = new Date();
      application.applicationStatus.reviewCompletedAt = new Date();
    } else if (status === 'Rejected') {
      application.applicationStatus.rejectedAt = new Date();
      application.applicationStatus.reviewCompletedAt = new Date();
    }
    
    // Add admin note
    if (notes) {
      application.addAdminNote(notes, reviewerId || 'admin', 'Status Change');
    }
    
    // Track status change
    application.workflow.steps.push({
      stepName: `Status changed from ${previousStatus} to ${status}`,
      completedAt: new Date(),
      data: { reviewerId, notes }
    });
    
    await application.save();
    
    // If approved, create mentor profile
    if (status === 'Approved') {
      await createMentorProfileFromApplication(application);
    }
    
    res.json({
      message: `Application ${status.toLowerCase()} successfully`,
      application: {
        applicationId: application.applicationId,
        status: application.applicationStatus.status,
        approvalReadiness: application.approvalReadiness
      }
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk approve applications
router.post('/admin/applications/bulk-approve', async (req, res) => {
  try {
    const { applicationIds, reviewerId, notes } = req.body;
    
    const results = {
      approved: [],
      failed: []
    };
    
    for (const applicationId of applicationIds) {
      try {
        const application = await MentorApplication.findOne({ applicationId });
        if (application && application.assessment.overallScore >= 70) {
          application.applicationStatus.status = 'Approved';
          application.applicationStatus.approvedAt = new Date();
          application.applicationStatus.reviewCompletedAt = new Date();
          
          if (notes) {
            application.addAdminNote(notes, reviewerId, 'Bulk Approval');
          }
          
          await application.save();
          await createMentorProfileFromApplication(application);
          
          results.approved.push(applicationId);
        } else {
          results.failed.push({ applicationId, reason: 'Score too low or application not found' });
        }
      } catch (error) {
        results.failed.push({ applicationId, reason: error.message });
      }
    }
    
    res.json({
      message: 'Bulk approval completed',
      results
    });
  } catch (error) {
    console.error('Bulk approve error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get AI recommendations
router.get('/admin/applications/ai-recommendations', async (req, res) => {
  try {
    const highScoring = await MentorApplication.getHighScoringApplications(80);
    const pendingReview = await MentorApplication.getPendingAIReview();
    
    const recommendations = {
      autoApprove: highScoring.filter(app => 
        app.assessment.overallScore >= 85 && 
        app.applicationStatus.status === 'Submitted'
      ).slice(0, 10),
      
      interviewRequired: highScoring.filter(app => 
        app.assessment.overallScore >= 70 && 
        app.assessment.overallScore < 85
      ).slice(0, 10),
      
      needsReview: pendingReview.slice(0, 10),
      
      summary: {
        totalPendingReview: pendingReview.length,
        autoApproveReady: highScoring.filter(app => app.assessment.overallScore >= 85).length,
        interviewsNeeded: highScoring.filter(app => 
          app.assessment.overallScore >= 70 && app.assessment.overallScore < 85
        ).length
      }
    };
    
    res.json(recommendations);
  } catch (error) {
    console.error('Get AI recommendations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Trigger AI evaluation
router.post('/admin/applications/:applicationId/ai-evaluate', async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await MentorApplication.findOne({ applicationId });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    const aiEvaluation = await performAIEvaluation(applicationId);
    
    res.json({
      message: 'AI evaluation completed',
      evaluation: aiEvaluation
    });
  } catch (error) {
    console.error('AI evaluation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get application statistics
router.get('/admin/stats/applications', async (req, res) => {
  try {
    const totalApplications = await MentorApplication.countDocuments();
    const submittedApplications = await MentorApplication.countDocuments({ 'applicationStatus.status': 'Submitted' });
    const approvedApplications = await MentorApplication.countDocuments({ 'applicationStatus.status': 'Approved' });
    const rejectedApplications = await MentorApplication.countDocuments({ 'applicationStatus.status': 'Rejected' });
    
    // Status distribution
    const statusStats = await MentorApplication.aggregate([
      { $group: { _id: '$applicationStatus.status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Industry distribution
    const industryStats = await MentorApplication.aggregate([
      { $group: { _id: '$professional.industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Experience level distribution
    const experienceStats = await MentorApplication.aggregate([
      { $group: { _id: '$professional.experienceLevel', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Score distribution
    const scoreStats = await MentorApplication.aggregate([
      {
        $bucket: {
          groupBy: '$assessment.overallScore',
          boundaries: [0, 50, 70, 85, 100],
          default: 'unscored',
          output: { count: { $sum: 1 } }
        }
      }
    ]);
    
    // Monthly applications
    const monthlyStats = await MentorApplication.aggregate([
      {
        $group: {
          _id: { 
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    res.json({
      overview: {
        totalApplications,
        submittedApplications,
        approvedApplications,
        rejectedApplications,
        approvalRate: totalApplications > 0 ? ((approvedApplications / totalApplications) * 100).toFixed(1) : 0
      },
      distributions: {
        status: statusStats,
        industry: industryStats,
        experience: experienceStats,
        scores: scoreStats
      },
      trends: {
        monthly: monthlyStats
      }
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ================== HELPER FUNCTIONS ==================

// AI Evaluation Function (simulated)
async function performAIEvaluation(applicationId) {
  try {
    const application = await MentorApplication.findOne({ applicationId });
    if (!application) throw new Error('Application not found');
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate AI scores (this would be actual AI in production)
    const resumeScore = calculateResumeScore(application);
    const skillsScore = calculateSkillsScore(application);
    const communicationScore = calculateCommunicationScore(application);
    const riskScore = calculateRiskScore(application);
    
    const aiEvaluation = {
      resumeAnalysis: {
        score: resumeScore,
        strengths: generateStrengths(application),
        concerns: generateConcerns(application),
        recommendations: generateRecommendations(application)
      },
      skillsMatch: {
        score: skillsScore,
        matchedSkills: application.expertise.primarySkills.slice(0, 5),
        missingSkills: ['Communication', 'Leadership'],
        marketDemand: skillsScore > 80 ? 'High' : skillsScore > 60 ? 'Medium' : 'Low'
      },
      communicationAssessment: {
        score: communicationScore,
        writingQuality: communicationScore,
        clarity: communicationScore + 5,
        professionalism: communicationScore - 3
      },
      riskFactors: generateRiskFactors(application, riskScore),
      recommendation: getAIRecommendation(resumeScore, skillsScore, communicationScore, riskScore),
      confidenceLevel: Math.min(85 + Math.random() * 10, 95)
    };
    
    // Update application with AI evaluation
    application.assessment.aiEvaluation = aiEvaluation;
    await application.save();
    
    return aiEvaluation;
  } catch (error) {
    console.error('AI evaluation error:', error);
    throw error;
  }
}

// Helper functions for AI evaluation
function calculateResumeScore(application) {
  let score = 50; // Base score
  
  // Experience bonus
  score += Math.min(application.professional.yearsOfExperience * 5, 25);
  
  // Education bonus
  const educationBonus = {
    'PhD': 15, 'Master\'s': 10, 'Bachelor\'s': 8,
    'Diploma': 5, 'Certificate': 3, 'High School': 1
  };
  score += educationBonus[application.education.highestDegree] || 0;
  
  // Previous mentoring experience
  if (application.mentoringExperience.hasMentoredBefore) score += 10;
  
  return Math.min(score, 100);
}

function calculateSkillsScore(application) {
  const primarySkillsCount = application.expertise.primarySkills.length;
  const specializationsCount = application.expertise.specializations.length;
  
  let score = Math.min(primarySkillsCount * 8, 60); // Max 60 for skills
  score += Math.min(specializationsCount * 5, 25); // Max 25 for specializations
  score += Math.min(application.professional.yearsOfExperience * 2, 15); // Max 15 for experience
  
  return Math.min(score, 100);
}

function calculateCommunicationScore(application) {
  let score = 70; // Base score
  
  // Quality of written responses
  const motivationLength = application.motivation.whyMentor?.length || 0;
  if (motivationLength > 200) score += 10;
  if (motivationLength > 500) score += 10;
  
  // Professional background description
  if (application.professional.achievements?.length > 2) score += 10;
  
  return Math.min(score, 100);
}

function calculateRiskScore(application) {
  let riskScore = 0;
  
  // No previous mentoring experience
  if (!application.mentoringExperience.hasMentoredBefore) riskScore += 20;
  
  // Very new to industry
  if (application.professional.yearsOfExperience < 2) riskScore += 30;
  
  // Limited availability
  if (application.availability.weeklyHoursCommitment < 3) riskScore += 15;
  
  return riskScore;
}

function generateStrengths(application) {
  const strengths = [];
  
  if (application.professional.yearsOfExperience >= 5) {
    strengths.push('Extensive professional experience');
  }
  
  if (application.expertise.primarySkills.length >= 5) {
    strengths.push('Diverse skill set');
  }
  
  if (application.mentoringExperience.hasMentoredBefore) {
    strengths.push('Previous mentoring experience');
  }
  
  if (application.availability.weeklyHoursCommitment >= 5) {
    strengths.push('Strong time commitment');
  }
  
  return strengths.length > 0 ? strengths : ['Motivated to contribute'];
}

function generateConcerns(application) {
  const concerns = [];
  
  if (!application.mentoringExperience.hasMentoredBefore) {
    concerns.push('No previous mentoring experience');
  }
  
  if (application.professional.yearsOfExperience < 3) {
    concerns.push('Limited professional experience');
  }
  
  if (application.availability.weeklyHoursCommitment < 3) {
    concerns.push('Limited time availability');
  }
  
  return concerns;
}

function generateRecommendations(application) {
  const recommendations = [];
  
  if (!application.mentoringExperience.hasMentoredBefore) {
    recommendations.push('Consider mentoring training program');
  }
  
  if (application.expertise.primarySkills.length < 5) {
    recommendations.push('Expand skill documentation');
  }
  
  recommendations.push('Conduct interview to assess communication skills');
  
  return recommendations;
}

function generateRiskFactors(application, riskScore) {
  const riskFactors = [];
  
  if (riskScore > 50) {
    riskFactors.push({
      factor: 'High Risk Profile',
      severity: 'High',
      description: 'Multiple risk indicators present'
    });
  } else if (riskScore > 25) {
    riskFactors.push({
      factor: 'Moderate Risk',
      severity: 'Medium',
      description: 'Some concerns identified'
    });
  }
  
  return riskFactors;
}

function getAIRecommendation(resumeScore, skillsScore, communicationScore, riskScore) {
  const averageScore = (resumeScore + skillsScore + communicationScore) / 3;
  
  if (averageScore >= 85 && riskScore < 20) return 'Strong Approve';
  if (averageScore >= 75 && riskScore < 30) return 'Approve';
  if (averageScore >= 65 && riskScore < 40) return 'Conditional Approve';
  if (averageScore >= 50) return 'Review Needed';
  return 'Reject';
}

function getEstimatedDecisionTime(application) {
  const score = application.assessment.overallScore;
  const status = application.applicationStatus.status;
  
  if (status === 'Approved' || status === 'Rejected') return 'Decision made';
  if (score >= 85) return '1-2 business days';
  if (score >= 70) return '3-5 business days';
  return '5-7 business days';
}

function getNextSteps(application) {
  const status = application.applicationStatus.status;
  const score = application.assessment.overallScore;
  
  switch (status) {
    case 'Submitted':
      if (score >= 85) return ['AI evaluation', 'Auto-approval'];
      if (score >= 70) return ['AI evaluation', 'Interview scheduling'];
      return ['AI evaluation', 'Manual review'];
    case 'Under Review':
      return ['Manual review', 'Interview or decision'];
    case 'Interview Scheduled':
      return ['Complete interview', 'Final decision'];
    case 'Approved':
      return ['Onboarding', 'Profile creation'];
    case 'Rejected':
      return ['Reapplication possible in 6 months'];
    default:
      return ['Continue application'];
  }
}

// Create mentor profile from approved application
async function createMentorProfileFromApplication(application) {
  try {
    const mentorData = {
      title: `${application.expertise.specializations[0] || 'Professional'} Mentor`,
      description: application.motivation.whyMentor,
      mentor: {
        name: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
        email: application.personalInfo.email,
        bio: `${application.professional.currentRole} at ${application.professional.currentCompany}. ${application.professional.yearsOfExperience} years of experience.`,
        experience: `${application.professional.yearsOfExperience} years`
      },
      category: application.expertise.specializations[0] || 'Other',
      expertiseLevel: application.professional.experienceLevel.includes('Senior') ? 'Senior' : 
                     application.professional.experienceLevel.includes('Expert') ? 'Expert' :
                     application.professional.experienceLevel.includes('Mid') ? 'Mid-Level' : 'Junior',
      
      availability: {
        isAvailable: true,
        status: 'Available',
        responseTime: application.availability.responseTimeCommitment,
        maxMentees: application.availability.maxMentees,
        currentMentees: 0
      },
      
      pricing: {
        isFree: true, // Start with free mentoring
        sessionRate: 0,
        currency: 'KES'
      },
      
      instantAvailability: {
        enabled: application.availability.instantMentoring.enabled,
        radius: application.location.preferredRadius,
        maxInstantRequests: application.availability.instantMentoring.maxInstantSessions
      },
      
      location: {
        city: application.location.city,
        country: application.location.country,
        coordinates: application.location.coordinates,
        isLocationEnabled: !!application.location.coordinates.latitude
      },
      
      verification: {
        isVerified: true,
        badgeLevel: 'Bronze'
      },
      
      status: 'Active',
      isFeatured: false
    };
    
    const mentor = await Mentorship.create(mentorData);
    
    // Link the mentor profile to the application
    application.integration.mentorProfileCreated = true;
    application.integration.mentorId = mentor._id;
    await application.save();
    
    return mentor;
  } catch (error) {
    console.error('Create mentor profile error:', error);
    throw error;
  }
}

module.exports = router; 