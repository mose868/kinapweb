const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'web-development',
      'mobile-development', 
      'graphic-design',
      'digital-marketing',
      'content-writing',
      'data-entry',
      'video-editing',
      'translation',
      'virtual-assistant',
      'other'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  pricing: {
    type: {
      type: String,
      enum: ['fixed', 'hourly'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    currency: {
      type: String,
      default: 'KES',
      enum: ['KES', 'USD', 'EUR']
    }
  },
  packages: [{
    name: {
      type: String,
      required: true,
      enum: ['basic', 'standard', 'premium']
    },
    title: {
      type: String,
      required: true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    deliveryTime: {
      type: Number,
      required: true,
      min: 1
    },
    revisions: {
      type: Number,
      default: 0
    },
    features: [String]
  }],
  images: [{
    url: String,
    alt: String
  }],
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  requirements: [{
    question: String,
    type: {
      type: String,
      enum: ['text', 'file', 'choice'],
      default: 'text'
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [String]
  }],
  stats: {
    views: {
      type: Number,
      default: 0
    },
    orders: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'rejected'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  location: {
    country: String,
    city: String
  },
  languages: [{
    type: String,
    enum: ['English', 'Swahili', 'French', 'Spanish', 'Arabic', 'Chinese', 'Other']
  }],
  skills: [String],
  portfolio: [{
    title: String,
    description: String,
    image: String,
    url: String
  }],
  availability: {
    type: String,
    enum: ['available', 'busy', 'unavailable'],
    default: 'available'
  },
  responseTime: {
    type: Number, // in hours
    default: 24
  },
  completionRate: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Indexes for better performance
gigSchema.index({ seller: 1, status: 1 });
gigSchema.index({ category: 1, status: 1 });
gigSchema.index({ title: 'text', description: 'text', tags: 'text' });
gigSchema.index({ 'pricing.amount': 1 });
gigSchema.index({ featured: 1, status: 1 });
gigSchema.index({ createdAt: -1 });

// Virtual for average rating
gigSchema.virtual('averageRating').get(function() {
  return this.stats.rating;
});

// Method to update stats
gigSchema.methods.updateStats = function() {
  return this.save();
};

// Static method to get featured gigs
gigSchema.statics.getFeatured = function() {
  return this.find({ 
    status: 'active', 
    featured: true 
  }).populate('seller', 'displayName avatar rating');
};

// Static method to get gigs by category
gigSchema.statics.getByCategory = function(category, limit = 20) {
  return this.find({ 
    category, 
    status: 'active' 
  })
  .populate('seller', 'displayName avatar rating')
  .limit(limit)
  .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Gig', gigSchema); 