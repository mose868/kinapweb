const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, sparse: true }, // URL-friendly version of title
    description: { type: String, required: true },
    shortDescription: { type: String }, // Brief summary for cards
    category: { 
      type: String, 
      required: true,
      enum: ['Web Development', 'Digital Marketing', 'Graphic Design', 'Data Science', 'Mobile Development', 'UI/UX Design', 'Cybersecurity', 'Content Writing', 'Project Management', 'Other'],
      default: 'Other'
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner'
    },
    duration: {
      weeks: { type: Number, default: 0 },
      hours: { type: Number, default: 0 },
      totalHours: { type: Number, required: true } // Total course hours
    },
    schedule: {
      format: { 
        type: String, 
        enum: ['In-Person', 'Online', 'Hybrid'], 
        default: 'Online' 
      },
      days: [{ type: String }], // ['Monday', 'Wednesday', 'Friday']
      timeSlot: { type: String }, // '9:00 AM - 12:00 PM'
      startDate: { type: Date },
      endDate: { type: Date }
    },
    instructor: {
      name: { type: String, required: true },
      bio: { type: String },
      email: { type: String },
      image: { type: String }, // Base64 or URL
      linkedinProfile: { type: String },
      experience: { type: String },
      specialization: [{ type: String }]
    },
    curriculum: [{
      week: { type: Number },
      title: { type: String },
      topics: [{ type: String }],
      learningObjectives: [{ type: String }],
      assignments: [{ type: String }]
    }],
    learningOutcomes: [{ type: String }], // What students will learn
    prerequisites: [{ type: String }], // Required knowledge/skills
    tools: [{ type: String }], // Software/tools used
    certification: {
      provided: { type: Boolean, default: true },
      title: { type: String },
      accreditation: { type: String },
      validityPeriod: { type: String } // e.g., 'Lifetime', '2 years'
    },
    pricing: {
      isFree: { type: Boolean, default: false },
      regularPrice: { type: Number, default: 0 },
      discountPrice: { type: Number },
      currency: { type: String, default: 'KES' },
      paymentPlans: [{
        name: { type: String }, // 'Full Payment', 'Installments'
        amount: { type: Number },
        description: { type: String }
      }]
    },
    enrollment: {
      capacity: { type: Number, default: 50 },
      enrolled: { type: Number, default: 0 },
      waitlist: { type: Number, default: 0 },
      isOpen: { type: Boolean, default: true },
      registrationDeadline: { type: Date }
    },
    media: {
      thumbnailImage: { type: String }, // Course card image
      heroImage: { type: String }, // Main course page image
      videoIntro: { type: String }, // Introduction video URL
      gallery: [{ type: String }] // Additional images
    },
    features: [{ type: String }], // Course highlights/features
    materials: [{
      name: { type: String },
      type: { type: String }, // 'PDF', 'Video', 'Software', 'Book'
      description: { type: String },
      isRequired: { type: Boolean, default: false }
    }],
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Coming Soon', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Draft'
    },
    tags: [{ type: String }], // SEO and search tags
    seoMeta: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }]
    },
    ratings: {
      average: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
      breakdown: {
        five: { type: Number, default: 0 },
        four: { type: Number, default: 0 },
        three: { type: Number, default: 0 },
        two: { type: Number, default: 0 },
        one: { type: Number, default: 0 }
      }
    },
    reviews: [{
      studentName: { type: String },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      date: { type: Date, default: Date.now },
      isVerified: { type: Boolean, default: false }
    }],
    statistics: {
      views: { type: Number, default: 0 },
      inquiries: { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 }, // Percentage
      jobPlacementRate: { type: Number, default: 0 } // Percentage
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    lastUpdatedBy: { type: String }, // Admin email
    notes: { type: String } // Internal admin notes
  },
  { timestamps: true }
);

// Indexes for better query performance
trainingSchema.index({ category: 1, status: 1, isActive: 1 });
trainingSchema.index({ level: 1, isActive: 1 });
trainingSchema.index({ 'pricing.isFree': 1, status: 1 });
trainingSchema.index({ 'schedule.startDate': 1, status: 1 });
trainingSchema.index({ slug: 1 });
trainingSchema.index({ tags: 1 });
trainingSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Full-text search

// Virtual for course URL slug
trainingSchema.virtual('url').get(function() {
  return `/training/${this.slug}`;
});

// Virtual for enrollment percentage
trainingSchema.virtual('enrollmentPercentage').get(function() {
  if (this.enrollment.capacity === 0) return 0;
  return Math.round((this.enrollment.enrolled / this.enrollment.capacity) * 100);
});

// Virtual for availability status
trainingSchema.virtual('availabilityStatus').get(function() {
  if (!this.enrollment.isOpen) return 'Closed';
  if (this.enrollment.enrolled >= this.enrollment.capacity) return 'Full';
  if (this.enrollment.enrolled >= this.enrollment.capacity * 0.9) return 'Almost Full';
  return 'Available';
});

// Virtual for pricing display
trainingSchema.virtual('displayPrice').get(function() {
  if (this.pricing.isFree) return 'Free';
  if (this.pricing.discountPrice && this.pricing.discountPrice < this.pricing.regularPrice) {
    return `${this.pricing.currency} ${this.pricing.discountPrice.toLocaleString()}`;
  }
  return `${this.pricing.currency} ${this.pricing.regularPrice.toLocaleString()}`;
});

// Pre-save middleware to generate slug
trainingSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }
  
  // Auto-generate SEO meta if not provided
  if (!this.seoMeta.metaTitle) {
    this.seoMeta.metaTitle = this.title.length > 60 
      ? this.title.substring(0, 57) + '...' 
      : this.title;
  }
  
  if (!this.seoMeta.metaDescription) {
    const desc = this.shortDescription || this.description;
    this.seoMeta.metaDescription = desc.length > 160 
      ? desc.substring(0, 157) + '...' 
      : desc;
  }
  
  next();
});

// Static method to get published courses
trainingSchema.statics.getPublished = function(options = {}) {
  const { category, level, isFree, limit = 20, skip = 0 } = options;
  
  let query = {
    status: 'Published',
    isActive: true
  };

  if (category && category !== 'all') {
    query.category = category;
  }

  if (level && level !== 'all') {
    query.level = level;
  }

  if (isFree !== undefined) {
    query['pricing.isFree'] = isFree;
  }

  return this.find(query)
    .sort({ isFeatured: -1, displayOrder: -1, createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .select('-reviews -notes -lastUpdatedBy');
};

// Static method to get featured courses
trainingSchema.statics.getFeatured = function(limit = 6) {
  return this.find({
    status: 'Published',
    isActive: true,
    isFeatured: true
  })
    .sort({ displayOrder: -1, createdAt: -1 })
    .limit(limit)
    .select('-reviews -notes -lastUpdatedBy');
};

// Method to increment view count
trainingSchema.methods.incrementViews = function() {
  this.statistics.views += 1;
  return this.save();
};

// Method to add review
trainingSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  this.ratings.totalRatings += 1;
  this.ratings.breakdown[`${reviewData.rating === 5 ? 'five' : reviewData.rating === 4 ? 'four' : reviewData.rating === 3 ? 'three' : reviewData.rating === 2 ? 'two' : 'one'}`] += 1;
  
  // Recalculate average rating
  const totalStars = (this.ratings.breakdown.five * 5) + 
                    (this.ratings.breakdown.four * 4) + 
                    (this.ratings.breakdown.three * 3) + 
                    (this.ratings.breakdown.two * 2) + 
                    (this.ratings.breakdown.one * 1);
  
  this.ratings.average = Number((totalStars / this.ratings.totalRatings).toFixed(1));
  
  return this.save();
};

// Method to update enrollment
trainingSchema.methods.updateEnrollment = function(change = 1) {
  this.enrollment.enrolled = Math.max(0, this.enrollment.enrolled + change);
  return this.save();
};

module.exports = mongoose.model('Training', trainingSchema); 