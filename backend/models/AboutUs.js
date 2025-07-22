const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    mission: { type: String },
    vision: { type: String },
    values: [{ type: String }],
    history: { type: String },
    teamDescription: { type: String },
    contactInfo: {
      email: { type: String },
      phone: { type: String },
      address: { type: String }
    },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
      instagram: { type: String }
    },
    images: {
      heroImage: { type: String }, // base64 or URL
      aboutImage: { type: String }, // base64 or URL
      galleryImages: [{ type: String }] // array of base64 or URLs
    },
    stats: {
      membersCount: { type: Number, default: 0 },
      projectsCompleted: { type: Number, default: 0 },
      skillsOffered: { type: Number, default: 0 },
      successStories: { type: Number, default: 0 }
    },
    isActive: { type: Boolean, default: true },
    lastUpdatedBy: { type: String }, // email of admin who updated
  },
  { timestamps: true }
);

module.exports = mongoose.model('AboutUs', aboutUsSchema); 