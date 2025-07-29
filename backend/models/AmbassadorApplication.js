const mongoose = require('mongoose');

const ambassadorApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  tiktokHandle: { type: String },
  instagramHandle: { type: String },
  twitterHandle: { type: String },
  facebookHandle: { type: String },
  linkedinHandle: { type: String },
  applicationText: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  aiAnalysis: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AmbassadorApplication', ambassadorApplicationSchema); 