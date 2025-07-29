const mongoose = require('mongoose');

const portfolioLinkSchema = new mongoose.Schema({
  title: { type: String },
  url: { type: String },
}, { _id: false });

const socialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false });

const showcaseProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String, required: true },
  skills: [{ type: String }],
  achievements: { type: String },
  journey: { type: String },
  portfolioLinks: [portfolioLinkSchema],
  socialLinks: [socialLinkSchema],
  availability: { type: String, enum: ['available', 'busy', 'not_available'], default: 'available' },
  hourlyRate: { type: String },
  preferredWorkTypes: [{ type: String }],
  location: { type: String },
  languages: [{ type: String }],
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ShowcaseProfile', showcaseProfileSchema); 