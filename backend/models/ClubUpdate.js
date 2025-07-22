const mongoose = require('mongoose');

const clubUpdateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true }, // Short description/summary
    content: { type: String, required: true }, // Full content (HTML or Markdown)
    author: { type: String, required: true }, // Author name
    authorEmail: { type: String }, // Author email
    category: { 
      type: String, 
      required: true,
      enum: ['Announcement', 'Event', 'Achievement', 'Training', 'Partnership', 'General'],
      default: 'General'
    },
    tags: [{ type: String }], // Array of tags for categorization
    featured: { type: Boolean, default: false }, // Featured updates appear first
    priority: { 
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Archived'],
      default: 'Draft'
    },
    publishDate: { type: Date, default: Date.now },
    expiryDate: { type: Date }, // Optional expiry date
    images: [{ type: String }], // Array of base64 images or URLs
    attachments: [{ 
      name: { type: String },
      url: { type: String },
      type: { type: String } // file type
    }],
    eventDetails: {
      eventDate: { type: Date },
      location: { type: String },
      registrationLink: { type: String },
      capacity: { type: Number }
    },
    engagement: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      shares: { type: Number, default: 0 }
    },
    seoMeta: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }]
    },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }, // For manual ordering
    lastUpdatedBy: { type: String }, // Email of admin who last updated
  },
  { timestamps: true }
);

// Indexes for better query performance
clubUpdateSchema.index({ status: 1, publishDate: -1 });
clubUpdateSchema.index({ category: 1, isActive: 1 });
clubUpdateSchema.index({ featured: 1, priority: 1, publishDate: -1 });
clubUpdateSchema.index({ tags: 1 });
clubUpdateSchema.index({ expiryDate: 1 });

// Virtual for checking if update is expired
clubUpdateSchema.virtual('isExpired').get(function() {
  return this.expiryDate && this.expiryDate < new Date();
});

// Static method to get published updates
clubUpdateSchema.statics.getPublished = function(options = {}) {
  const { category, tags, limit = 10, skip = 0 } = options;
  
  let query = {
    status: 'Published',
    isActive: true,
    $or: [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gt: new Date() } }
    ]
  };

  if (category) {
    query.category = category;
  }

  if (tags && tags.length > 0) {
    query.tags = { $in: tags };
  }

  return this.find(query)
    .sort({ featured: -1, priority: -1, publishDate: -1 })
    .limit(limit)
    .skip(skip);
};

// Method to increment view count
clubUpdateSchema.methods.incrementViews = function() {
  this.engagement.views += 1;
  return this.save();
};

module.exports = mongoose.model('ClubUpdate', clubUpdateSchema); 