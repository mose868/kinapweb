const express = require('express');
const ShowcaseProfile = require('../models/ShowcaseProfile');

const router = express.Router();

// Get all showcase profiles
router.get('/', async (req, res) => {
  try {
    let profiles;
    if (req.query.all === '1') {
      profiles = await ShowcaseProfile.find();
    } else {
      profiles = await ShowcaseProfile.find({ approved: true });
    }
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// Get a profile by userId
router.get('/:id', async (req, res) => {
  try {
    const profile = await ShowcaseProfile.findOne({ userId: req.params.id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Create a new profile
router.post('/', async (req, res) => {
  try {
    const profile = new ShowcaseProfile(req.body);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create profile', details: err.message });
  }
});

// Update a profile by userId
router.put('/:id', async (req, res) => {
  try {
    const update = { ...req.body, updatedAt: Date.now() };
    const profile = await ShowcaseProfile.findOneAndUpdate(
      { userId: req.params.id },
      update,
      { new: true, runValidators: true }
    );
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update profile', details: err.message });
  }
});

// Delete a profile by userId
router.delete('/:id', async (req, res) => {
  try {
    const result = await ShowcaseProfile.findOneAndDelete({ userId: req.params.id });
    if (!result) return res.status(404).json({ error: 'Profile not found' });
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

module.exports = router; 