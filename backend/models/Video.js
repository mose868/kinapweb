const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String },

    // Either YouTube embed or self-hosted upload
    videoType: {
      type: String,
      enum: ['youtube', 'upload'],
      default: 'youtube'
    },
    youtubeUrl: { type: String }, // e.g. https://www.youtube.com/watch?v=abc123
    videoUrl: { type: String },   // path returned after file upload (uploads/videos/…)

    thumbnail: { type: String },  // custom thumbnail or auto generated
    category: {
      type: String,
      enum: ['Tutorial', 'Webinar', 'Resource', 'Showcase', 'Other'],
      default: 'Other'
    },
    tags: [{ type: String }],

    statistics: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 }
    },

    uploadedBy: { type: String }, // admin email or user id
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Published'
    }
  },
  { timestamps: true }
);

// text index for search
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });

// generate slug before save
videoSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// helper to increment view count
videoSchema.methods.incrementViews = function () {
  this.statistics.views += 1;
  return this.save();
};

module.exports = mongoose.model('Video', videoSchema); 