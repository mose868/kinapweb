const express = require('express');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const TeamApplication = require('../models/TeamApplication');
const { auth, adminAuth } = require('../middleware/auth');
const { sendVerificationEmail } = require('../services/emailService');

const router = express.Router();

// Available positions configuration for Ajira Digital KiNaP Club
const AVAILABLE_POSITIONS = {
  // Technical Development Roles
  'Frontend Developer': {
    department: 'Technology',
    requirements: ['React', 'JavaScript', 'CSS', 'HTML', 'Responsive Design'],
    description: 'Develop and maintain user-facing web applications for our digital platforms'
  },
  'Backend Developer': {
    department: 'Technology',
    requirements: ['Node.js', 'JavaScript', 'MySQL/MongoDB', 'API Development', 'Server Management'],
    description: 'Build and maintain server-side applications, APIs, and database systems'
  },
  'Full Stack Developer': {
    department: 'Technology',
    requirements: ['React', 'Node.js', 'JavaScript', 'Database', 'Git', 'Cloud Services'],
    description: 'Work on both frontend and backend development for complete web solutions'
  },
  'Mobile App Developer': {
    department: 'Technology',
    requirements: ['React Native', 'Flutter', 'Android/iOS', 'Mobile UI/UX', 'App Store Deployment'],
    description: 'Develop mobile applications for our digital learning platform'
  },

  // Design and User Experience
  'UI/UX Designer': {
    department: 'Design',
    requirements: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems'],
    description: 'Design user interfaces and experiences for our digital platforms'
  },
  'Graphic Designer': {
    department: 'Design',
    requirements: ['Adobe Photoshop', 'Illustrator', 'Canva', 'Brand Design', 'Print Design'],
    description: 'Create visual content for marketing materials, social media, and branding'
  },
  'Video Editor': {
    department: 'Media Production',
    requirements: ['Adobe Premiere Pro', 'After Effects', 'Video Production', 'Motion Graphics'],
    description: 'Edit and produce video content for educational and promotional purposes'
  },

  // Digital Marketing and Growth
  'Digital Marketing Specialist': {
    department: 'Marketing',
    requirements: ['Social Media Marketing', 'Content Creation', 'SEO', 'Google Analytics', 'PPC Campaigns'],
    description: 'Develop and execute digital marketing strategies to grow our community'
  },
  'Social Media Manager': {
    department: 'Marketing',
    requirements: ['Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'Content Planning', 'Community Engagement'],
    description: 'Manage our social media presence and engage with our digital community'
  },
  'Content Creator': {
    department: 'Content',
    requirements: ['Writing', 'Video Creation', 'Photography', 'Storytelling', 'Content Strategy'],
    description: 'Create engaging educational and promotional content across multiple platforms'
  },
  'SEO Specialist': {
    department: 'Marketing',
    requirements: ['SEO Tools', 'Keyword Research', 'Google Analytics', 'Content Optimization'],
    description: 'Optimize our digital presence for search engines and online visibility'
  },

  // Community and Education
  'Community Manager': {
    department: 'Community',
    requirements: ['Community Building', 'Event Management', 'Communication', 'Conflict Resolution'],
    description: 'Build and nurture our online and offline student communities'
  },
  'Student Ambassador': {
    department: 'Community',
    requirements: ['Leadership', 'Communication', 'Event Coordination', 'Peer Mentoring'],
    description: 'Represent the club in universities and help recruit new members'
  },
  'Workshop Facilitator': {
    department: 'Education',
    requirements: ['Public Speaking', 'Technical Skills', 'Teaching', 'Curriculum Development'],
    description: 'Lead technical workshops and training sessions for club members'
  },
  'Mentor Coordinator': {
    department: 'Education',
    requirements: ['Mentorship Experience', 'Program Management', 'Communication', 'Relationship Building'],
    description: 'Coordinate mentorship programs and connect students with industry professionals'
  },

  // Business and Operations
  'Project Manager': {
    department: 'Operations',
    requirements: ['Project Management', 'Agile/Scrum', 'Leadership', 'Communication', 'Risk Management'],
    description: 'Manage digital projects and coordinate team activities across departments'
  },
  'Business Development Representative': {
    department: 'Business',
    requirements: ['Sales', 'Relationship Building', 'Market Research', 'Partnership Development'],
    description: 'Identify and develop partnerships with companies and educational institutions'
  },
  'Partnership Manager': {
    department: 'Business',
    requirements: ['Partnership Development', 'Negotiation', 'Relationship Management', 'Strategic Planning'],
    description: 'Build strategic partnerships with tech companies and educational organizations'
  },

  // Data and Analytics
  'Data Analyst': {
    department: 'Analytics',
    requirements: ['SQL', 'Excel', 'Python/R', 'Data Visualization', 'Google Analytics'],
    description: 'Analyze member engagement and platform performance data'
  },
  'Research Analyst': {
    department: 'Research',
    requirements: ['Research Methods', 'Data Collection', 'Report Writing', 'Statistical Analysis'],
    description: 'Conduct research on digital skills trends and industry needs'
  },

  // Specialized Digital Roles
  'Cybersecurity Specialist': {
    department: 'Technology',
    requirements: ['Network Security', 'Ethical Hacking', 'Risk Assessment', 'Security Protocols'],
    description: 'Ensure security of our digital platforms and educate members on cybersecurity'
  },
  'Digital Learning Coordinator': {
    department: 'Education',
    requirements: ['E-learning Platforms', 'Curriculum Design', 'Educational Technology', 'Learning Analytics'],
    description: 'Develop and manage our digital learning programs and online courses'
  },
  'Tech Support Specialist': {
    department: 'Support',
    requirements: ['Technical Troubleshooting', 'Customer Service', 'Documentation', 'Problem Solving'],
    description: 'Provide technical support to club members and maintain our digital systems'
  },

  // Creative and Innovation
  'Innovation Lead': {
    department: 'Innovation',
    requirements: ['Creative Thinking', 'Technology Trends', 'Product Development', 'Research'],
    description: 'Lead innovation initiatives and explore new technologies for the club'
  },
  'Digital Content Strategist': {
    department: 'Strategy',
    requirements: ['Content Strategy', 'Market Analysis', 'Digital Trends', 'Brand Development'],
    description: 'Develop comprehensive content strategies for our digital presence'
  },

  // Entry-Level and Volunteer Positions
  'Digital Skills Tutor': {
    department: 'Education',
    requirements: ['Teaching Skills', 'Patience', 'Basic Tech Knowledge', 'Communication'],
    description: 'Help fellow students learn basic digital skills and computer literacy'
  },
  'Event Coordinator': {
    department: 'Events',
    requirements: ['Event Planning', 'Organization', 'Communication', 'Time Management'],
    description: 'Plan and coordinate digital skills workshops, hackathons, and networking events'
  },
  'Marketing Assistant': {
    department: 'Marketing',
    requirements: ['Social Media', 'Content Creation', 'Basic Design', 'Communication'],
    description: 'Assist with marketing campaigns and social media content creation'
  },
  'Administrative Assistant': {
    department: 'Administration',
    requirements: ['Organization', 'Communication', 'Microsoft Office', 'Time Management'],
    description: 'Support daily operations and administrative tasks for the club'
  }
};

// Submit team application
router.post('/apply', async (req, res) => {
  try {
    const {
      // Personal Information
      fullName,
      email,
      phone,
      location,
      
      // Position Applied For
      positionInterested,
      
      // Professional Information
      currentRole,
      currentCompany,
      experience,
      experienceLevel,
      
      // Education
      education,
      
      // Skills and Qualifications
      skills,
      certifications,
      
      // Application Content
      motivation,
      whyJoinTeam,
      relevantExperience,
      valueProposition,
      
      // Portfolio and Links
      portfolioLinks,
      socialLinks,
      
      // Documents
      resumeUrl,
      coverLetterUrl,
      additionalDocuments,
      
      // Availability
      availability,
      expectedSalary,
      startDate,
      
      // Additional Information
      applicantNotes,
      referredBy
    } = req.body;

    // Validation
    if (!fullName || !email || !phone || !positionInterested || !motivation || !whyJoinTeam) {
      return res.status(400).json({ 
        message: 'Required fields: fullName, email, phone, positionInterested, motivation, whyJoinTeam' 
      });
    }

    // Check if position exists
    if (!AVAILABLE_POSITIONS[positionInterested]) {
      return res.status(400).json({ 
        message: 'Invalid position. Please select from available positions.' 
      });
    }

    // Check for existing application
    const existingApplication = await TeamApplication.findOne({
      where: {
        email: email,
        positionInterested: positionInterested,
        status: ['pending', 'under_review', 'interview_scheduled']
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        message: 'You already have an active application for this position'
      });
    }

    // Create the application
    const application = await TeamApplication.create({
      fullName,
      email,
      phone,
      location: location || {},
      positionInterested,
      department: AVAILABLE_POSITIONS[positionInterested].department,
      currentRole,
      currentCompany,
      experience,
      experienceLevel: experienceLevel || 'Entry Level',
      education: education || {},
      skills: Array.isArray(skills) ? skills : [],
      certifications: Array.isArray(certifications) ? certifications : [],
      motivation,
      whyJoinTeam,
      relevantExperience,
      valueProposition,
      portfolioLinks: Array.isArray(portfolioLinks) ? portfolioLinks : [],
      socialLinks: socialLinks || {},
      resumeUrl,
      coverLetterUrl,
      additionalDocuments: Array.isArray(additionalDocuments) ? additionalDocuments : [],
      availability: availability || {},
      expectedSalary,
      startDate,
      applicantNotes,
      referredBy,
      status: 'pending',
      submittedAt: new Date()
    });

    // Send confirmation email to applicant
    await sendApplicationConfirmationEmail(application);

    // Send notification email to HR/Admin
    await sendApplicationNotificationEmail(application);

    res.status(201).json({
      message: 'Application submitted successfully! You will receive a confirmation email shortly.',
      application: {
        id: application.id,
        fullName: application.fullName,
        positionInterested: application.positionInterested,
        status: application.status,
        submittedAt: application.submittedAt
      }
    });

  } catch (error) {
    console.error('Submit team application error:', error);
    res.status(500).json({ message: 'Failed to submit application. Please try again.' });
  }
});

// Get available positions
router.get('/positions', (req, res) => {
  try {
    const positions = Object.keys(AVAILABLE_POSITIONS).map(position => ({
      name: position,
      ...AVAILABLE_POSITIONS[position]
    }));

    res.json({ positions });
  } catch (error) {
    console.error('Get positions error:', error);
    res.status(500).json({ message: 'Failed to fetch positions' });
  }
});

// Get user's applications (if they provide email)
router.get('/my-applications', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' });
    }

    const applications = await TeamApplication.findAll({
      where: { email },
      order: [['submittedAt', 'DESC']],
      attributes: { exclude: ['internalNotes'] }
    });

    res.json({ applications });
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// Get all applications (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { 
      status, 
      position, 
      department, 
      page = 1, 
      limit = 20,
      search 
    } = req.query;

    let whereClause = {};

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (position && position !== 'all') {
      whereClause.positionInterested = position;
    }

    if (department && department !== 'all') {
      whereClause.department = department;
    }

    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { positionInterested: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const applications = await TeamApplication.findAndCountAll({
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
    console.error('Get team applications error:', error);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
});

// Get specific application (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const application = await TeamApplication.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Get team application error:', error);
    res.status(500).json({ message: 'Failed to fetch application' });
  }
});

// Review application (admin only)
router.put('/:id/review', adminAuth, async (req, res) => {
  try {
    const { status, reviewNotes, interviewScheduled } = req.body;
    const application = await TeamApplication.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const updateData = {
      status,
      reviewedBy: req.user.email || req.user.displayName,
      reviewedAt: new Date(),
      review: {
        notes: reviewNotes,
        reviewedBy: req.user.email || req.user.displayName,
        reviewedAt: new Date()
      }
    };

    if (interviewScheduled) {
      updateData.interviewScheduled = interviewScheduled;
    }

    await application.update(updateData);

    // Send status update email to applicant
    await sendStatusUpdateEmail(application, status);

    res.json({
      message: 'Application reviewed successfully',
      application
    });
  } catch (error) {
    console.error('Review application error:', error);
    res.status(500).json({ message: 'Failed to review application' });
  }
});

// Get application statistics (admin only)
router.get('/stats/dashboard', adminAuth, async (req, res) => {
  try {
    const [total, pending, underReview, interviewed, accepted, rejected] = await Promise.all([
      TeamApplication.count(),
      TeamApplication.count({ where: { status: 'pending' } }),
      TeamApplication.count({ where: { status: 'under_review' } }),
      TeamApplication.count({ where: { status: 'interview_scheduled' } }),
      TeamApplication.count({ where: { status: 'accepted' } }),
      TeamApplication.count({ where: { status: 'rejected' } })
    ]);

    // Get applications by position
    const [positionStats] = await sequelize.query(`
      SELECT positionInterested, COUNT(*) as count 
      FROM team_applications 
      GROUP BY positionInterested 
      ORDER BY count DESC
    `);

    // Get applications by department
    const [departmentStats] = await sequelize.query(`
      SELECT department, COUNT(*) as count 
      FROM team_applications 
      GROUP BY department 
      ORDER BY count DESC
    `);

    const stats = {
      total,
      pending,
      underReview,
      interviewed,
      accepted,
      rejected,
      byPosition: positionStats,
      byDepartment: departmentStats
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get team application stats error:', error);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Email functions
async function sendApplicationConfirmationEmail(application) {
  try {
    const position = AVAILABLE_POSITIONS[application.positionInterested];
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B4F72; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Ajira Digital KiNaP Club</h1>
          <p style="margin: 10px 0 0 0;">Application Received</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2>Hello ${application.fullName}!</h2>
          <p>Thank you for your interest in joining our team! We've received your application for the <strong>${application.positionInterested}</strong> position.</p>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Application Details:</h3>
            <p><strong>Position:</strong> ${application.positionInterested}</p>
            <p><strong>Department:</strong> ${position.department}</p>
            <p><strong>Application ID:</strong> #${application.id}</p>
            <p><strong>Submitted:</strong> ${new Date(application.submittedAt).toLocaleDateString()}</p>
          </div>
          
          <div style="background: #f8f9fa; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What's Next?</h3>
            <ul>
              <li>Our HR team will review your application within 5-7 business days</li>
              <li>If shortlisted, we'll contact you to schedule an interview</li>
              <li>You'll receive email updates about your application status</li>
              <li>Feel free to continue exploring our programs and community</li>
            </ul>
          </div>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Position Overview:</h3>
            <p><strong>Department:</strong> ${position.department}</p>
            <p><strong>Description:</strong> ${position.description}</p>
            <p><strong>Key Requirements:</strong> ${position.requirements.join(', ')}</p>
          </div>
          
          <p>We appreciate your interest in contributing to our mission of empowering students with digital skills.</p>
          
          <p>Best regards,<br><strong>Ajira Digital KiNaP Club HR Team</strong></p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>© 2024 Ajira Digital KiNaP Club. All rights reserved.</p>
          <p>This is an automated message, please do not reply directly to this email.</p>
          <p>For questions, contact us at hr@ajirakinap.com</p>
        </div>
      </div>
    `;

    // Use verification email service (we'll adapt it for team applications)
    await sendVerificationEmail(
      application.email,
      `TEAM_APP_${application.id}`,
      application.fullName
    );
    
    console.log(`✅ Confirmation email sent to ${application.email}`);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
}

async function sendApplicationNotificationEmail(application) {
  try {
    const position = AVAILABLE_POSITIONS[application.positionInterested];
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B4F72; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">New Team Application</h1>
          <p style="margin: 10px 0 0 0;">HR Notification</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2>New Application Received</h2>
          <p>A new team application has been submitted and requires review.</p>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Applicant Details:</h3>
            <p><strong>Name:</strong> ${application.fullName}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Phone:</strong> ${application.phone}</p>
            <p><strong>Position:</strong> ${application.positionInterested}</p>
            <p><strong>Department:</strong> ${position.department}</p>
            <p><strong>Experience Level:</strong> ${application.experienceLevel}</p>
          </div>
          
          <div style="background: #f8f9fa; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Application Summary:</h3>
            <p><strong>Current Role:</strong> ${application.currentRole || 'Not specified'}</p>
            <p><strong>Current Company:</strong> ${application.currentCompany || 'Not specified'}</p>
            <p><strong>Skills:</strong> ${application.skills.join(', ') || 'Not specified'}</p>
            <p><strong>Motivation:</strong> ${application.motivation.substring(0, 200)}${application.motivation.length > 200 ? '...' : ''}</p>
          </div>
          
          <p>Please log in to the admin dashboard to review the full application and take action.</p>
          
          <p><strong>Application ID:</strong> #${application.id}</p>
          <p><strong>Submitted:</strong> ${new Date(application.submittedAt).toLocaleString()}</p>
        </div>
      </div>
    `;

    // Send to HR team (you can configure this email in environment variables)
    const hrEmail = process.env.HR_EMAIL || 'hr@ajirakinap.com';
    await sendVerificationEmail(
      hrEmail,
      `NEW_APPLICATION_${application.id}`,
      'HR Team'
    );
    
    console.log(`✅ Notification email sent to HR team`);
  } catch (error) {
    console.error('Failed to send HR notification email:', error);
  }
}

async function sendStatusUpdateEmail(application, newStatus) {
  try {
    let subject = '';
    let message = '';
    let color = '#1B4F72';

    switch (newStatus) {
      case 'under_review':
        subject = 'Application Under Review';
        message = `
          <p>Great news! Your application for the <strong>${application.positionInterested}</strong> position is now under review.</p>
          <p>Our team is carefully evaluating your qualifications and experience. We'll be in touch soon with the next steps.</p>
        `;
        color = '#2196f3';
        break;
        
      case 'interview_scheduled':
        subject = 'Interview Scheduled';
        message = `
          <p>Congratulations! We'd like to invite you for an interview for the <strong>${application.positionInterested}</strong> position.</p>
          <p>Our HR team will contact you soon with the interview details and schedule.</p>
        `;
        color = '#ff9800';
        break;
        
      case 'accepted':
        subject = 'Application Accepted - Welcome to the Team!';
        message = `
          <p>🎉 Congratulations! We're excited to offer you the <strong>${application.positionInterested}</strong> position at Ajira Digital KiNaP Club.</p>
          <p>Our HR team will reach out to you with the next steps, including onboarding information and your start date.</p>
          <p>Welcome to the team!</p>
        `;
        color = '#4caf50';
        break;
        
      case 'rejected':
        subject = 'Application Update';
        message = `
          <p>Thank you for your interest in the <strong>${application.positionInterested}</strong> position.</p>
          <p>After careful consideration, we've decided to move forward with other candidates for this role.</p>
          <p>We encourage you to apply for other positions in the future and stay connected with our community.</p>
        `;
        color = '#f44336';
        break;
        
      default:
        return;
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${color}; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Application Update</h1>
          <p style="margin: 10px 0 0 0;">${subject}</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2>Hello ${application.fullName}!</h2>
          ${message}
          
          <div style="background: #f8f9fa; border-left: 4px solid ${color}; padding: 15px; margin: 20px 0;">
            <p><strong>Application ID:</strong> #${application.id}</p>
            <p><strong>Position:</strong> ${application.positionInterested}</p>
            <p><strong>Status:</strong> ${newStatus.replace('_', ' ').toUpperCase()}</p>
          </div>
          
          <p>Thank you for your continued interest in Ajira Digital KiNaP Club.</p>
          
          <p>Best regards,<br><strong>Ajira Digital KiNaP Club HR Team</strong></p>
        </div>
      </div>
    `;

    await sendVerificationEmail(
      application.email,
      `STATUS_UPDATE_${application.id}`,
      application.fullName
    );
    
    console.log(`✅ Status update email sent to ${application.email}`);
  } catch (error) {
    console.error('Failed to send status update email:', error);
  }
}

module.exports = router;
