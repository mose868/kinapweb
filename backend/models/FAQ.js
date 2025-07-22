const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { 
      type: String, 
      required: true,
      enum: ['General', 'Membership', 'Events', 'Training', 'Technical', 'Certification', 'Career', 'Payment'],
      default: 'General'
    },
    tags: [{ type: String }], // Array of tags for better searchability
    priority: { 
      type: Number, 
      default: 0 
    }, // Higher number = higher priority (for ordering)
    isPublished: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false }, // Mark as popular/featured FAQ
    viewCount: { type: Number, default: 0 },
    helpfulCount: { type: Number, default: 0 }, // Number of "helpful" votes
    notHelpfulCount: { type: Number, default: 0 }, // Number of "not helpful" votes
    relatedFAQs: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'FAQ' 
    }], // References to related FAQs
    lastUpdatedBy: { type: String }, // Email of admin who last updated
    seoMeta: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }]
    },
    displayOrder: { type: Number, default: 0 }, // For manual ordering within categories
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes for better query performance
faqSchema.index({ category: 1, isPublished: 1, isActive: 1 });
faqSchema.index({ isPopular: 1, priority: -1 });
faqSchema.index({ tags: 1 });
faqSchema.index({ question: 'text', answer: 'text' }); // Full-text search

// Virtual for calculating helpfulness ratio
faqSchema.virtual('helpfulnessRatio').get(function() {
  const total = this.helpfulCount + this.notHelpfulCount;
  if (total === 0) return 0;
  return (this.helpfulCount / total) * 100;
});

// Static method to get published FAQs
faqSchema.statics.getPublished = function(options = {}) {
  const { category, popular, limit = 50, skip = 0 } = options;
  
  let query = {
    isPublished: true,
    isActive: true
  };

  if (category && category !== 'all') {
    query.category = category;
  }

  if (popular) {
    query.isPopular = true;
  }

  return this.find(query)
    .sort({ priority: -1, helpfulCount: -1, createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('relatedFAQs', 'question category');
};

// Method to increment view count
faqSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to mark as helpful
faqSchema.methods.markHelpful = function() {
  this.helpfulCount += 1;
  return this.save();
};

// Method to mark as not helpful
faqSchema.methods.markNotHelpful = function() {
  this.notHelpfulCount += 1;
  return this.save();
};

// Pre-save middleware to generate SEO meta if not provided
faqSchema.pre('save', function(next) {
  if (!this.seoMeta.metaTitle) {
    this.seoMeta.metaTitle = this.question.length > 60 
      ? this.question.substring(0, 57) + '...' 
      : this.question;
  }
  
  if (!this.seoMeta.metaDescription) {
    this.seoMeta.metaDescription = this.answer.length > 160 
      ? this.answer.substring(0, 157) + '...' 
      : this.answer;
  }
  
  next();
});

module.exports = mongoose.model('FAQ', faqSchema); 