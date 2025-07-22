const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    title: { type: String }, // Job title/position
    department: { type: String }, // e.g., Development, Design, Management
    bio: { type: String, required: true },
    image: { type: String }, // base64 or URL
    email: { type: String },
    linkedinUrl: { type: String },
    githubUrl: { type: String },
    portfolioUrl: { type: String },
    skills: [{ type: String }], // Array of skills
    experience: { type: String }, // Years of experience
    joinedDate: { type: Date, default: Date.now },
    achievements: [{ type: String }], // Notable achievements
    education: {
      degree: { type: String },
      institution: { type: String },
      graduationYear: { type: String }
    },
    contact: {
      phone: { type: String },
      location: { type: String }
    },
    socialMedia: {
      twitter: { type: String },
      instagram: { type: String },
      facebook: { type: String }
    },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }, // For ordering team members
    isFounder: { type: Boolean, default: false },
    isLeadership: { type: Boolean, default: false },
    lastUpdatedBy: { type: String }, // Email of admin who updated
  },
  { timestamps: true }
);

// Index for faster queries
teamSchema.index({ isActive: 1, displayOrder: 1 });
teamSchema.index({ department: 1, isActive: 1 });

module.exports = mongoose.model('Team', teamSchema); 