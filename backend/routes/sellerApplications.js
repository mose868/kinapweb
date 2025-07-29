const express = require('express');
const router = express.Router();
const SellerApplication = require('../models/SellerApplication');
const User = require('../models/User');
const Gig = require('../models/Gig');
const sellerVettingService = require('../services/sellerVettingService');
const { auth, adminAuth } = require('../middleware/auth');

// POST /api/seller-applications - Submit a new seller application
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Check if user already has a pending application
    const existingApplication = await SellerApplication.findOne({
      userId,
      status: { $in: ['pending', 'ai_processing', 'ai_approved', 'manual_review'] }
    });

    if (existingApplication) {
      return res.status(400).json({
        message: 'You already have a pending seller application'
      });
    }

    // Create new application
    const applicationData = {
      userId,
      ...req.body,
      status: 'pending'
    };

    const application = new SellerApplication(applicationData);
    await application.save();

    // Start AI vetting process asynchronously
    setTimeout(async () => {
      try {
        await processAIVetting(application._id);
      } catch (error) {
        console.error('AI vetting failed for application:', application._id, error);
      }
    }, 100); // Reduced from 1000ms to 100ms for faster response

    res.status(201).json({
      message: 'Seller application submitted successfully',
      application: {
        _id: application._id,
        status: application.status,
        submittedAt: application.submittedAt
      }
    });

  } catch (error) {
    console.error('Error submitting seller application:', error);
    res.status(500).json({
      message: 'Failed to submit seller application',
      error: error.message
    });
  }
});

// GET /api/seller-applications/my-application - Get user's own application
router.get('/my-application', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const application = await SellerApplication.findOne({ userId })
      .populate('userId', 'displayName email')
      .populate('review.reviewedBy', 'displayName');

    if (!application) {
      return res.status(404).json({
        message: 'No seller application found'
      });
    }

    res.json({ application });

  } catch (error) {
    console.error('Error fetching user application:', error);
    res.status(500).json({
      message: 'Failed to fetch application',
      error: error.message
    });
  }
});

// GET /api/seller-applications/:id - Get specific application (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const application = await SellerApplication.findById(req.params.id)
      .populate('userId', 'displayName email username')
      .populate('review.reviewedBy', 'displayName');

    if (!application) {
      return res.status(404).json({
        message: 'Application not found'
      });
    }

    // Increment view count
    application.viewCount += 1;
    application.lastViewed = new Date();
    await application.save();

    res.json({ application });

  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      message: 'Failed to fetch application',
      error: error.message
    });
  }
});

// GET /api/seller-applications - Get all applications (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 20,
      sortBy = 'submittedAt',
      sortOrder = 'desc',
      search
    } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } },
        { 'businessInfo.businessName': { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const applications = await SellerApplication.find(query)
      .populate('userId', 'displayName email username')
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await SellerApplication.countDocuments(query);

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
});

// PUT /api/seller-applications/:id/review - Review application (admin only)
router.put('/:id/review', adminAuth, async (req, res) => {
  try {
    const { finalDecision, reviewNotes, rejectionReason } = req.body;
    
    const application = await SellerApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        message: 'Application not found'
      });
    }

    // Update application status based on decision
    let newStatus = 'approved';
    if (finalDecision === 'rejected') {
      newStatus = 'rejected';
    } else if (finalDecision === 'needs_more_info') {
      newStatus = 'manual_review';
    }

    application.status = newStatus;
    application.review = {
      reviewedBy: req.user.userId,
      reviewedAt: new Date(),
      reviewNotes,
      finalDecision,
      rejectionReason
    };

    await application.save();

    // If approved, update user role to seller and create marketplace gig
    if (finalDecision === 'approved') {
      await User.findByIdAndUpdate(application.userId, {
        role: 'seller',
        isVerified: true
      });

      // Create marketplace gig for the approved seller
      try {
        const user = await User.findById(application.userId);
        const gigData = {
          userId: application.userId,
          title: `${application.professionalInfo?.skills?.[0] || 'Professional'} Services by ${user?.displayName || user?.username}`,
          slug: `${user?.username}-services-${Date.now()}`,
          mentor: {
            name: user?.displayName || user?.username,
            bio: application.applicationContent?.motivation || 'Professional seller offering quality services',
            profilePhoto: null
          },
          category: application.businessInfo?.services?.[0] || 'Digital Services',
          expertiseLevel: 'Professional',
          availability: {
            isAvailable: true,
            status: 'Available',
            responseTime: 'Within 24 hours'
          },
          instantAvailability: {
            enabled: false,
            responseTime: 'Within 48 hours'
          },
          pricing: {
            isFree: false,
            sessionRate: parseInt(application.businessInfo?.pricingStrategy?.replace(/[^0-9]/g, '')) || 50,
            currency: 'USD',
            regularPrice: parseInt(application.businessInfo?.pricingStrategy?.replace(/[^0-9]/g, '')) || 50,
            discountPrice: parseInt(application.businessInfo?.pricingStrategy?.replace(/[^0-9]/g, '')) * 0.9 || 45
          },
          location: {
            city: application.personalInfo?.address?.city || 'Remote',
            country: application.personalInfo?.address?.country || 'Global'
          },
          ratings: {
            overall: 0,
            totalRatings: 0,
            average: 0
          },
          verification: {
            isVerified: true,
            verifiedAt: new Date()
          },
          isFeatured: false,
          sessionTypes: ['Project Work', 'Consultation', 'Custom Services'],
          skills: application.professionalInfo?.skills || [],
          experience: {
            years: parseInt(application.professionalInfo?.experience?.match(/\d+/)?.[0]) || 2,
            description: application.professionalInfo?.experience || 'Professional experience in the field'
          },
          education: {
            degree: application.professionalInfo?.education || 'Professional Certification',
            institution: 'Professional Training',
            year: new Date().getFullYear()
          },
          socialLinks: {
            portfolio: application.professionalInfo?.portfolio || '',
            linkedin: '',
            github: application.professionalInfo?.githubProfile || ''
          },
          stats: {
            sessionsCompleted: 0,
            totalHours: 0,
            satisfactionRate: 0,
            responseRate: 0
          },
          status: 'active',
          isActive: true,
          displayOrder: 0
        };

        const gig = new Gig(gigData);
        await gig.save();
        
        console.log(`✅ Created marketplace gig for approved seller: ${user?.displayName || user?.username}`);
      } catch (gigError) {
        console.error('Error creating marketplace gig:', gigError);
        // Don't fail the approval if gig creation fails
      }
    }

    res.json({
      message: 'Application reviewed successfully',
      application: {
        _id: application._id,
        status: application.status,
        review: application.review
      }
    });

  } catch (error) {
    console.error('Error reviewing application:', error);
    res.status(500).json({
      message: 'Failed to review application',
      error: error.message
    });
  }
});

// POST /api/seller-applications/:id/retry-ai - Retry AI vetting (admin only)
router.post('/:id/retry-ai', adminAuth, async (req, res) => {
  try {
    const application = await SellerApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        message: 'Application not found'
      });
    }

    // Reset AI vetting status
    application.status = 'ai_processing';
    application.aiVetting = {
      isProcessed: false,
      processedAt: null,
      confidence: 0,
      riskScore: 0,
      qualityScore: 0,
      recommendations: [],
      flaggedIssues: [],
      aiNotes: '',
      modelUsed: ''
    };

    await application.save();

    // Start AI vetting process
    setTimeout(async () => {
      try {
        await processAIVetting(application._id);
      } catch (error) {
        console.error('AI vetting failed for application:', application._id, error);
      }
    }, 1000);

    res.json({
      message: 'AI vetting restarted successfully',
      application: {
        _id: application._id,
        status: application.status
      }
    });

  } catch (error) {
    console.error('Error retrying AI vetting:', error);
    res.status(500).json({
      message: 'Failed to retry AI vetting',
      error: error.message
    });
  }
});

// GET /api/seller-applications/stats/dashboard - Get dashboard stats (admin only)
router.get('/stats/dashboard', adminAuth, async (req, res) => {
  try {
    const stats = await SellerApplication.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await SellerApplication.countDocuments();
    const pendingAI = await SellerApplication.countDocuments({ status: 'ai_processing' });
    const pendingReview = await SellerApplication.countDocuments({ 
      status: { $in: ['ai_approved', 'manual_review'] } 
    });

    const recentApplications = await SellerApplication.find()
      .sort({ submittedAt: -1 })
      .limit(5)
      .populate('userId', 'displayName email');

    res.json({
      stats: {
        total: totalApplications,
        pendingAI,
        pendingReview,
        byStatus: stats
      },
      recentApplications
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
});

// Helper function to process AI vetting
async function processAIVetting(applicationId) {
  try {
    const application = await SellerApplication.findById(applicationId);
    if (!application) return;

    // Update status to processing
    application.status = 'ai_processing';
    await application.save();

    // Perform AI vetting
    const vettingResults = await sellerVettingService.vetApplication(application);
    
    // Update application with AI results
    application.aiVetting = vettingResults;
    
    // Determine next status based on AI results
    if (vettingResults.confidence > 0.7 && vettingResults.riskScore < 0.3) {
      application.status = 'ai_approved';
    } else if (vettingResults.riskScore > 0.7) {
      application.status = 'ai_rejected';
    } else {
      application.status = 'manual_review';
    }

    await application.save();
    
    console.log(`AI vetting completed for application ${applicationId}: ${application.status}`);

  } catch (error) {
    console.error('Error in AI vetting process:', error);
    
    // Update application with fallback status
    const application = await SellerApplication.findById(applicationId);
    if (application) {
      application.status = 'manual_review';
      application.aiVetting = sellerVettingService.getFallbackResults();
      await application.save();
    }
  }
}

module.exports = router; 