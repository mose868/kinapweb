const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    overall: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    onTime: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  title: {
    type: String,
    maxlength: 100,
    trim: true
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000,
    trim: true
  },
  images: [{
    url: String,
    alt: String
  }],
  helpful: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    helpful: {
      type: Boolean,
      default: true
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  response: {
    seller: {
      comment: String,
      respondedAt: Date
    }
  }
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ gig: 1, status: 1 });
reviewSchema.index({ seller: 1, status: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ order: 1 }, { unique: true });
reviewSchema.index({ createdAt: -1 });

// Virtual for average rating
reviewSchema.virtual('averageRating').get(function() {
  const ratings = [
    this.rating.overall,
    this.rating.communication,
    this.rating.quality,
    this.rating.value,
    this.rating.onTime
  ].filter(r => r);
  
  return ratings.length > 0 ? 
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 
    this.rating.overall;
});

// Method to mark as helpful
reviewSchema.methods.markHelpful = function(userId, helpful = true) {
  const existingIndex = this.helpful.findIndex(h => h.user.toString() === userId.toString());
  
  if (existingIndex >= 0) {
    this.helpful[existingIndex].helpful = helpful;
  } else {
    this.helpful.push({ user: userId, helpful });
  }
  
  return this.save();
};

// Static method to get reviews by gig
reviewSchema.statics.getByGig = function(gigId, limit = 10, page = 1) {
  return this.find({ gig: gigId, status: 'approved' })
    .populate('reviewer', 'displayName avatar')
    .populate('response.seller')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
};

// Static method to get reviews by seller
reviewSchema.statics.getBySeller = function(sellerId, limit = 10, page = 1) {
  return this.find({ seller: sellerId, status: 'approved' })
    .populate('reviewer', 'displayName avatar')
    .populate('gig', 'title images')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
};

// Static method to get average rating for seller
reviewSchema.statics.getSellerRating = function(sellerId) {
  return this.aggregate([
    { $match: { seller: mongoose.Types.ObjectId(sellerId), status: 'approved' } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating.overall' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating.overall'
        }
      }
    }
  ]);
};

// Static method to get rating distribution
reviewSchema.statics.getRatingDistribution = function(sellerId) {
  return this.aggregate([
    { $match: { seller: mongoose.Types.ObjectId(sellerId), status: 'approved' } },
    {
      $group: {
        _id: '$rating.overall',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: -1 } }
  ]);
};

module.exports = mongoose.model('Review', reviewSchema); 