const Ambassador = require('../models/Ambassador');
const AmbassadorTask = require('../models/AmbassadorTask');
const AmbassadorSubmission = require('../models/AmbassadorSubmission');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { sanitizeMessage } = require('../utils/sanitizer');

// Register as ambassador
exports.register = async (req, res) => {
  try {
    const { statement } = req.body;
    const ajiraIdUrl = req.files?.ajiraId?.[0]?.path;
    const schoolIdUrl = req.files?.schoolId?.[0]?.path;

    if (!ajiraIdUrl || !schoolIdUrl || !statement) {
      return res.status(400).json({ status: 'error', message: 'All fields are required.' });
    }

    // Prevent duplicate registration
    const exists = await Ambassador.findOne({ user: req.user._id });
    if (exists) {
      return res.status(400).json({ status: 'error', message: 'You have already registered as an ambassador.' });
    }

    const ambassador = await Ambassador.create({
      user: req.user._id,
      ajiraIdUrl,
      schoolIdUrl,
      statement: sanitizeMessage(statement)
    });

    res.status(201).json({ status: 'success', data: { ambassador } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get ambassador profile
exports.getProfile = async (req, res) => {
  try {
    const ambassador = await Ambassador.findOne({ user: req.user._id })
      .populate('user', 'name email profileImage');
    if (!ambassador) {
      return res.status(404).json({ status: 'error', message: 'Not registered as ambassador.' });
    }
    res.status(200).json({ status: 'success', data: { ambassador } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Ambassador.find({ status: 'Approved' })
      .sort('-points')
      .limit(20)
      .populate('user', 'name profileImage');
    res.status(200).json({ status: 'success', data: { leaderboard } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get ambassador points
exports.getPoints = async (req, res) => {
  try {
    const ambassador = await Ambassador.findOne({ user: req.user._id });
    if (!ambassador) {
      return res.status(404).json({ status: 'error', message: 'Not registered as ambassador.' });
    }
    res.status(200).json({ status: 'success', data: { points: ambassador.points } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}; 