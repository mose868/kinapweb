const express = require('express');
const MentorApplication = require('../models/MentorApplication');
const MentorVettingService = require('../services/mentorVettingService');
const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');

const router = express.Router();
const mentorVettingService = new MentorVettingService();

// Submit mentor application
router.post('/', auth, async (req, res) => {
  try {
    const {
      personalInfo,
      professionalInfo,
      mentorshipInfo,
      applicationContent,
      documents
    } = req.body;

    // Check if user already has an application
    const existingApplication = await MentorApplication.findOne({ 
      userId: req.user.id,
      status: { $in: ['pending', 'under_review', 'approved'] }
    });

    if (existingApplication) {
      return res.status(400).json({ 
        message: 'You already have an active mentor application' 
      });
    }

    // Create new application
    const application = new MentorApplication({
      userId: req.user.id,
      personalInfo,
      professionalInfo,
      mentorshipInfo,
      applicationContent,
      documents
    });

    // Process AI vetting asynchronously
    processAIVetting(application);

    await application.save();

    res.status(201).json({
      message: 'Mentor application submitted successfully',
      application: {
        id: application._id,
        status: application.status,
        submittedAt: application.submittedAt
      }
    });

  } catch (error) {
    console.error('Submit mentor application error:', error);
    res.status(500).json({ message: 'Failed to submit application' });
  }
});

// Get user's mentor application
router.get('/my-application', auth, async (req, res) => {
  try {
    const application = await MentorApplication.findOne({ 
      userId: req.user.id 
    }).sort({ submittedAt: -1 });

    if (!application) {
      return res.status(404).json({ message: 'No application found' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Get mentor application error:', error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
});

// Get all mentor applications (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const applications = await MentorApplication.find(query)
      .populate('userId', 'username email displayName')
      .sort({ submittedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await MentorApplication.countDocuments(query);

    res.json({
      applications,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get mentor applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// Get specific mentor application (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const application = await MentorApplication.findById(req.params.id)
      .populate('userId', 'username email displayName');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Get mentor application error:', error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
});

// Review mentor application (admin only)
router.put('/:id/review', adminAuth, async (req, res) => {
  try {
    const { status, notes, adminNotes } = req.body;

    const application = await MentorApplication.findById(req.params.id)
      .populate('userId', 'username email displayName');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    application.review = {
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
      notes,
      adminNotes
    };

    await application.save();

    // Send email notification
    if (application.userId && application.userId.email) {
      try {
        await sendApplicationStatusEmail(application);
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }
    }

    res.json({
      message: 'Application reviewed successfully',
      application: {
        id: application._id,
        status: application.status,
        reviewedAt: application.review.reviewedAt
      }
    });

  } catch (error) {
    console.error('Review mentor application error:', error);
    res.status(500).json({ message: 'Failed to review application' });
  }
});

// Retry AI vetting (admin only)
router.post('/:id/retry-ai', adminAuth, async (req, res) => {
  try {
    const application = await MentorApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Process AI vetting
    await processAIVetting(application);

    res.json({
      message: 'AI vetting retried successfully',
      application: {
        id: application._id,
        status: application.status,
        aiVetting: application.aiVetting
      }
    });

  } catch (error) {
    console.error('Retry AI vetting error:', error);
    res.status(500).json({ message: 'Failed to retry AI vetting' });
  }
});

// Get dashboard stats (admin only)
router.get('/stats/dashboard', adminAuth, async (req, res) => {
  try {
    const stats = await MentorApplication.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await MentorApplication.countDocuments();
    const pendingApplications = await MentorApplication.countDocuments({ status: 'pending' });
    const approvedApplications = await MentorApplication.countDocuments({ status: 'approved' });

    const dashboardStats = {
      total: totalApplications,
      pending: pendingApplications,
      approved: approvedApplications,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };

    res.json({ stats: dashboardStats });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

// Process AI vetting asynchronously
async function processAIVetting(application) {
  try {
    console.log(`🤖 Processing AI vetting for application ${application._id}...`);

    const applicationData = {
      personalInfo: application.personalInfo,
      professionalInfo: application.professionalInfo,
      mentorshipInfo: application.mentorshipInfo,
      applicationContent: application.applicationContent
    };

    const vettingResults = await mentorVettingService.vetApplication(applicationData);

    // Update application with AI results
    application.aiVetting = vettingResults;
    application.status = vettingResults.status;

    await application.save();

    console.log(`✅ AI vetting completed for application ${application._id}`);

    // Send email notification if approved
    if (vettingResults.status === 'approved') {
      try {
        await sendApprovalEmail(application);
      } catch (emailError) {
        console.error('Approval email failed:', emailError);
      }
    }

  } catch (error) {
    console.error(`❌ AI vetting failed for application ${application._id}:`, error);
    
    // Set fallback status
    application.status = 'under_review';
    application.aiVetting = mentorVettingService.getFallbackResults();
    
    try {
      await application.save();
    } catch (saveError) {
      console.error('Failed to save application with fallback:', saveError);
    }
  }
}

// Send approval email
async function sendApprovalEmail(application) {
  try {
    const user = await application.populate('userId', 'email displayName');
    
    if (!user.userId || !user.userId.email) {
      console.log('No email found for user');
      return;
    }

    const emailData = {
      to: user.userId.email,
      subject: '🎉 Your Mentor Application Has Been Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1B4F72;">Congratulations! 🎉</h2>
          <p>Dear ${user.userId.displayName || 'there'},</p>
          
          <p>Great news! Your mentor application has been approved by our AI vetting system.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1B4F72; margin-top: 0;">Application Details:</h3>
            <p><strong>Categories:</strong> ${application.mentorshipInfo.categories.join(', ')}</p>
            <p><strong>Expertise Level:</strong> ${application.mentorshipInfo.expertiseLevel}</p>
            <p><strong>AI Score:</strong> ${Math.round(application.aiVetting.overallScore * 100)}%</p>
          </div>
          
          <p>You can now start receiving mentorship requests from students. Here's what happens next:</p>
          
          <ul>
            <li>Your profile will be visible to students seeking mentorship</li>
            <li>You'll receive notifications when students request your help</li>
            <li>You can set your availability and pricing preferences</li>
            <li>Start building your mentoring reputation!</li>
          </ul>
          
          <p>If you have any questions, feel free to reach out to our support team.</p>
          
          <p>Best regards,<br>The Ajira Digital Team</p>
        </div>
      `
    };

    await sendEmail(emailData);
    console.log(`✅ Approval email sent to ${user.userId.email}`);

  } catch (error) {
    console.error('Failed to send approval email:', error);
  }
}

// Send application status email
async function sendApplicationStatusEmail(application) {
  try {
    const user = await application.populate('userId', 'email displayName');
    
    if (!user.userId || !user.userId.email) {
      console.log('No email found for user');
      return;
    }

    let subject = '';
    let message = '';

    switch (application.status) {
      case 'approved':
        subject = '🎉 Your Mentor Application Has Been Approved!';
        message = `
          <p>Congratulations! Your mentor application has been approved by our team.</p>
          <p>You can now start receiving mentorship requests from students.</p>
        `;
        break;
      case 'rejected':
        subject = 'Update on Your Mentor Application';
        message = `
          <p>Thank you for your interest in becoming a mentor.</p>
          <p>After careful review, we regret to inform you that your application has not been approved at this time.</p>
          <p>You're welcome to apply again in the future with additional experience or improved application materials.</p>
        `;
        break;
      case 'under_review':
        subject = 'Your Mentor Application is Under Review';
        message = `
          <p>Your mentor application is currently under review by our team.</p>
          <p>We'll notify you as soon as we have a decision.</p>
        `;
        break;
      default:
        return;
    }

    const emailData = {
      to: user.userId.email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1B4F72;">Mentor Application Update</h2>
          <p>Dear ${user.userId.displayName || 'there'},</p>
          
          ${message}
          
          <p>Best regards,<br>The Ajira Digital Team</p>
        </div>
      `
    };

    await sendEmail(emailData);
    console.log(`✅ Status email sent to ${user.userId.email}`);

  } catch (error) {
    console.error('Failed to send status email:', error);
  }
}

module.exports = router; 