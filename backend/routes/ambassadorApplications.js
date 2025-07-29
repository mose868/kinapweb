const express = require('express');
const AmbassadorApplication = require('../models/AmbassadorApplication');

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