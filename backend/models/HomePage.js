const mongoose = require('mongoose');

const ctaButtonSchema = new mongoose.Schema({
  label: String,
  url: String,
  type: { type: String, enum: ['primary', 'secondary', 'external'], default: 'primary' }
}, { _id: false });

const statsSchema = new mongoose.Schema({
  studentsTrained: { type: Number, default: 1000 },
  successStories: { type: Number, default: 150 },
  skillsPrograms: { type: Number, default: 50 },
  digitalExcellence: { type: Number, default: 100 },
  activeMembers: { type: Number, default: 500 },
  completedProjects: { type: Number, default: 200 },
  partnerOrganizations: { type: Number, default: 25 },
  averageEarnings: { type: Number, default: 50000 }
}, { _id: false });

const featureSchema = new mongoose.Schema({
  icon: String,
  title: String,
  description: String,
  color: String,
  bgColor: String,
  order: { type: Number, default: 0 }
}, { _id: false });

const testimonialSchema = new mongoose.Schema({
  name: String,
  role: String,
  company: String,
  content: String,
  rating: { type: Number, min: 1, max: 5, default: 5 },
  image: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { _id: false });

const newsItemSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  content: String,
  image: String,
  category: String,
  author: String,
  publishedAt: { type: Date, default: Date.now },
  featured: { type: Boolean, default: false },
  tags: [String],
  readTime: Number,
  order: { type: Number, default: 0 }
}, { _id: false });

const programSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
  duration: String,
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  category: String,
  enrollmentCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { _id: false });

const partnerSchema = new mongoose.Schema({
  name: String,
  logo: String,
  website: String,
  description: String,
  category: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { _id: false });

const homePageSchema = new mongoose.Schema({
  // Hero Section
  heroTitle: { type: String, default: "Empowering Kenya's Digital Generation" },
  heroSubtitle: { type: String, default: "KiNaP Ajira Digital Club – Innovation & Excellence" },
  heroImage: { type: String, default: "/logo.jpeg" },
  heroVideo: String,
  heroBackground: String,
  
  // Stats Section
  stats: statsSchema,
  
  // Call to Action Buttons
  ctaButtons: [ctaButtonSchema],
  
  // Features Section
  features: [featureSchema],
  
  // Testimonials Section
  testimonials: [testimonialSchema],
  
  // News & Updates Section
  newsItems: [newsItemSchema],
  
  // Programs Section
  programs: [programSchema],
  
  // Partners Section
  partners: [partnerSchema],
  
  // SEO & Meta
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  
  // Content Sections
  aboutSection: {
    title: String,
    content: String,
    image: String,
    showStats: { type: Boolean, default: true }
  },
  
  servicesSection: {
    title: String,
    subtitle: String,
    description: String,
    showCTA: { type: Boolean, default: true }
  },
  
  communitySection: {
    title: String,
    subtitle: String,
    description: String,
    memberCount: { type: Number, default: 0 },
    showJoinCTA: { type: Boolean, default: true }
  },
  
  // Configuration
  isActive: { type: Boolean, default: true },
  showHero: { type: Boolean, default: true },
  showStats: { type: Boolean, default: true },
  showFeatures: { type: Boolean, default: true },
  showTestimonials: { type: Boolean, default: true },
  showNews: { type: Boolean, default: true },
  showPrograms: { type: Boolean, default: true },
  showPartners: { type: Boolean, default: true },
  
  // Analytics
  viewCount: { type: Number, default: 0 },
  lastViewed: Date,
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save middleware to update the updatedAt field
homePageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for formatted stats
homePageSchema.virtual('formattedStats').get(function() {
  return {
    studentsTrained: this.stats.studentsTrained.toLocaleString(),
    successStories: this.stats.successStories.toLocaleString(),
    skillsPrograms: this.stats.skillsPrograms.toLocaleString(),
    digitalExcellence: this.stats.digitalExcellence,
    activeMembers: this.stats.activeMembers.toLocaleString(),
    completedProjects: this.stats.completedProjects.toLocaleString(),
    partnerOrganizations: this.stats.partnerOrganizations.toLocaleString(),
    averageEarnings: this.stats.averageEarnings.toLocaleString()
  };
});

// Method to increment view count
homePageSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  this.lastViewed = new Date();
  return this.save();
};

// Method to get featured content
homePageSchema.methods.getFeaturedContent = function() {
  return {
    testimonials: this.testimonials.filter(t => t.featured).sort((a, b) => a.order - b.order),
    news: this.newsItems.filter(n => n.featured).sort((a, b) => a.order - b.order),
    programs: this.programs.filter(p => p.featured).sort((a, b) => a.order - b.order),
    partners: this.partners.filter(p => p.featured).sort((a, b) => a.order - b.order)
  };
};

// Static method to get active home page
homePageSchema.statics.getActive = function() {
  return this.findOne({ isActive: true }).sort({ updatedAt: -1 });
};

module.exports = mongoose.model('HomePage', homePageSchema); 