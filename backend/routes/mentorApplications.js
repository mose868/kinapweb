const express = require('express');
const MentorApplication = require('../models/MentorApplication');
const MentorVettingService = require('../services/mentorVettingService');
const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/auth');
const { sendVerificationEmail } = require('../services/emailService');

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
      where: {
        userId: req.user.id,
        status: ['pending', 'under_review', 'approved']
      }
    });

    if (existingApplication) {
      return res.status(400).json({ 
        message: 'You already have an active mentor application' 
      });
    }

    // Create new application
    const application = await MentorApplication.create({
      userId: req.user.id,
      personalInfo,
      professionalInfo,
      mentorshipInfo,
      applicationContent,
      documents,
      status: 'pending',
      submittedAt: new Date(),
      updatedAt: new Date()
    });

    // Process AI vetting asynchronously
    processAIVetting(application);

    res.status(201).json({
      message: 'Mentor application submitted successfully',
      application: {
        id: application.id,
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
      where: { userId: req.user.id },
      order: [['submittedAt', 'DESC']]
    });

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
    
    let whereClause = {};
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const applications = await MentorApplication.findAndCountAll({
      where: whereClause,
      order: [['submittedAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({
      applications: applications.rows,
      pagination: {
        total: applications.count,
        page: parseInt(page),
        pages: Math.ceil(applications.count / parseInt(limit)),
        hasNext: page * limit < applications.count,
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
    const application = await MentorApplication.findByPk(req.params.id);

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

    const application = await MentorApplication.findByPk(req.params.id);

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
    application.updatedAt = new Date();

    await application.save();

    // Send email notification if email is available
    if (application.personalInfo && application.personalInfo.email) {
      try {
        if (status === 'approved') {
          // Send approval email
          const approvalHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1B4F72;">Congratulations! 🎉</h2>
              <p>Dear ${application.personalInfo.firstName || 'there'},</p>
              <p>Great news! Your mentor application has been approved.</p>
              <p>You can now start receiving mentorship requests from students.</p>
              <p>Best regards,<br>The Ajira Digital Team</p>
            </div>
          `;
          
          await sendVerificationEmail(
            application.personalInfo.email,
            'APPROVED',
            application.personalInfo.firstName || 'there'
          );
        } else if (status === 'rejected') {
          // Send rejection email
          const rejectionHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1B4F72;">Application Update</h2>
              <p>Dear ${application.personalInfo.firstName || 'there'},</p>
              <p>Thank you for your interest in becoming a mentor.</p>
              <p>After careful review, we regret to inform you that your application has not been approved at this time.</p>
              <p>You're welcome to apply again in the future with additional experience or improved application materials.</p>
              <p>Best regards,<br>The Ajira Digital Team</p>
            </div>
          `;
          
          await sendVerificationEmail(
            application.personalInfo.email,
            'REJECTED',
            application.personalInfo.firstName || 'there'
          );
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the review process if email fails
      }
    }

    res.json({ 
      message: 'Application reviewed successfully',
      application 
    });
  } catch (error) {
    console.error('Review mentor application error:', error);
    res.status(500).json({ message: 'Failed to review application' });
  }
});

// Delete mentor application (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const application = await MentorApplication.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await application.destroy();

    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete mentor application error:', error);
    res.status(500).json({ message: 'Failed to delete application' });
  }
});

// Get dashboard stats (admin only)
router.get('/stats/dashboard', adminAuth, async (req, res) => {
  try {
    const [total, pending, approved, rejected, underReview] = await Promise.all([
      MentorApplication.count(),
      MentorApplication.count({ where: { status: 'pending' } }),
      MentorApplication.count({ where: { status: 'approved' } }),
      MentorApplication.count({ where: { status: 'rejected' } }),
      MentorApplication.count({ where: { status: 'under_review' } })
    ]);

    const stats = {
      total,
      pending,
      approved,
      rejected,
      underReview
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get mentor application stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// AI vetting process
async function processAIVetting(application) {
  try {
    const vettingResult = await mentorVettingService.vetApplication(application);
    
    application.aiVetting = vettingResult;
    application.status = vettingResult.confidence > 0.7 ? 'under_review' : 'pending';
    application.updatedAt = new Date();
    
    await application.save();
  } catch (error) {
    console.error('AI vetting error:', error);
    // Don't fail the application submission if AI vetting fails
  }
}

module.exports = router; 