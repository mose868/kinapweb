const express = require('express');
const AmbassadorApplication = require('../models/AmbassadorApplication');
const { sendAmbassadorApplicationEmail, sendAmbassadorStatusUpdateEmail } = require('../auth');

const router = express.Router();

// Submit a new application (AI vetting placeholder)
router.post('/', async (req, res) => {
  try {
    const appData = req.body;
    // Simulate AI vetting (placeholder)
    const aiAnalysis = {
      tiktok: appData.tiktokHandle ? 'Looks active and relevant.' : 'No TikTok provided.',
      instagram: appData.instagramHandle ? 'Good engagement.' : 'No Instagram provided.',
      // ... more analysis could be added
      overall: 'AI analysis placeholder: ready for admin review.'
    };
    const application = await AmbassadorApplication.create({
      ...appData,
      aiAnalysis,
      status: 'pending',
    });

    // Send application confirmation email
    try {
      await sendAmbassadorApplicationEmail(application);
    } catch (emailError) {
      console.error('Failed to send ambassador application email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: 'Failed to submit application', details: err.message });
  }
});

// Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await AmbassadorApplication.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get one application by ID
router.get('/:id', async (req, res) => {
  try {
    const application = await AmbassadorApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ error: 'Not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Update application (AI/admin)
router.put('/:id', async (req, res) => {
  try {
    const update = { ...req.body, updatedAt: Date.now() };
    const application = await AmbassadorApplication.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!application) return res.status(404).json({ error: 'Not found' });

    // Send status update email if status changed
    if (req.body.status && req.body.status !== application.status) {
      let message = '';
      let feedback = null;

      switch (req.body.status) {
        case 'approved':
          message = 'Congratulations! Your ambassador application has been approved. Welcome to our elite community of student leaders!';
          break;
        case 'rejected':
          message = 'Thank you for your interest in the Ambassador Program. Unfortunately, we are unable to approve your application at this time.';
          feedback = req.body.feedback || 'We encourage you to apply again in the future.';
          break;
        case 'under_review':
          message = 'Your application is currently under review by our team. We will get back to you soon.';
          break;
        default:
          message = 'Your application status has been updated.';
      }

      try {
        await sendAmbassadorStatusUpdateEmail(application, req.body.status, message, feedback);
      } catch (emailError) {
        console.error('Failed to send ambassador status update email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.json(application);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update application', details: err.message });
  }
});

// Delete application
router.delete('/:id', async (req, res) => {
  try {
    const result = await AmbassadorApplication.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

module.exports = router; 