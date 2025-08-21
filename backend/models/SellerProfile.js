const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SellerProfile = sequelize.define('SellerProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Personal Information
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  professionalTitle: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  bio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  profileImageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  languages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: ['English'],
  },
  
  // Professional Information
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  experience: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  
  education: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  certifications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  // Portfolio & Showcase
  portfolio: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  showcaseVideoUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  // Services & Pricing
  services: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 25.00,
  },
  
  availability: {
    type: DataTypes.ENUM('full-time', 'part-time', 'weekends', 'evenings'),
    allowNull: false,
    defaultValue: 'part-time',
  },
  
  responseTime: {
    type: DataTypes.ENUM('within-1-hour', 'within-6-hours', 'within-24-hours', 'within-3-days'),
    allowNull: false,
    defaultValue: 'within-24-hours',
  },
  
  // Social & Links
  websiteUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  linkedinUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  githubUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  portfolioUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  // Business Information
  businessDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  uniqueSellingPoint: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  targetAudience: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  // AI Analysis Results
  aiScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  
  contentQuality: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  
  marketplaceReadiness: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  aiRecommendations: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  // Status & Verification
  status: {
    type: DataTypes.ENUM('draft', 'pending-review', 'approved', 'rejected', 'suspended'),
    allowNull: false,
    defaultValue: 'draft',
  },
  
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // Analytics
  views: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  bookings: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  
  totalReviews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  completedOrders: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  totalEarnings: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  
  // Metadata
  lastActive: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  
  profileCompleteness: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  featuredUntil: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  isFeatured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'seller_profiles',
  timestamps: true,
  indexes: [
    {
      fields: ['sellerId']
    },
    {
      fields: ['status', 'isVerified']
    },
    {
      fields: ['rating', 'totalReviews']
    },
    {
      fields: ['aiScore', 'marketplaceReadiness']
    },
    {
      fields: ['isFeatured', 'featuredUntil']
    },
    {
      fields: ['experience', 'hourlyRate']
    }
  ]
});

// Instance methods
SellerProfile.prototype.updateProfileCompleteness = function() {
  const requiredFields = [
    'fullName', 'professionalTitle', 'bio', 'skills', 'experience'
  ];
  
  const optionalFields = [
    'profileImageUrl', 'location', 'languages', 'education', 
    'certifications', 'portfolio', 'showcaseVideoUrl', 'services'
  ];
  
  let completeness = 0;
  const totalFields = requiredFields.length + optionalFields.length;
  
  // Required fields (60% weight)
  requiredFields.forEach(field => {
    if (this[field] && (Array.isArray(this[field]) ? this[field].length > 0 : this[field].trim())) {
      completeness += 60 / requiredFields.length;
    }
  });
  
  // Optional fields (40% weight)
  optionalFields.forEach(field => {
    if (this[field] && (Array.isArray(this[field]) ? this[field].length > 0 : this[field].trim())) {
      completeness += 40 / optionalFields.length;
    }
  });
  
  this.profileCompleteness = Math.round(completeness);
  return this.profileCompleteness;
};

SellerProfile.prototype.updateMarketplaceReadiness = function() {
  const readinessScore = this.aiScore * 0.4 + this.contentQuality * 0.3 + this.profileCompleteness * 0.3;
  this.marketplaceReadiness = readinessScore >= 75;
  return this.marketplaceReadiness;
};

SellerProfile.prototype.incrementViews = function() {
  this.views += 1;
  return this.save();
};

SellerProfile.prototype.updateRating = function(newRating) {
  const currentTotal = this.rating * this.totalReviews;
  this.totalReviews += 1;
  this.rating = (currentTotal + newRating) / this.totalReviews;
  return this.save();
};

// Static methods
SellerProfile.getTopSellers = function(limit = 10) {
  return this.findAll({
    where: {
      status: 'approved',
      isVerified: true,
      marketplaceReadiness: true
    },
    order: [
      ['rating', 'DESC'],
      ['totalReviews', 'DESC'],
      ['completedOrders', 'DESC']
    ],
    limit
  });
};

SellerProfile.getFeaturedSellers = function(limit = 6) {
  return this.findAll({
    where: {
      isFeatured: true,
      status: 'approved',
      featuredUntil: {
        [require('sequelize').Op.gt]: new Date()
      }
    },
    order: [
      ['rating', 'DESC'],
      ['totalReviews', 'DESC']
    ],
    limit
  });
};

SellerProfile.searchSellers = function(query, filters = {}) {
  const whereClause = {
    status: 'approved',
    marketplaceReadiness: true
  };
  
  if (query) {
    whereClause[require('sequelize').Op.or] = [
      { fullName: { [require('sequelize').Op.iLike]: `%${query}%` } },
      { professionalTitle: { [require('sequelize').Op.iLike]: `%${query}%` } },
      { bio: { [require('sequelize').Op.iLike]: `%${query}%` } }
    ];
  }
  
  if (filters.skills && filters.skills.length > 0) {
    whereClause.skills = {
      [require('sequelize').Op.overlap]: filters.skills
    };
  }
  
  if (filters.experience) {
    whereClause.experience = filters.experience;
  }
  
  if (filters.minRate && filters.maxRate) {
    whereClause.hourlyRate = {
      [require('sequelize').Op.between]: [filters.minRate, filters.maxRate]
    };
  }
  
  if (filters.location) {
    whereClause.location = {
      [require('sequelize').Op.iLike]: `%${filters.location}%`
    };
  }
  
  return this.findAll({
    where: whereClause,
    order: [
      ['isFeatured', 'DESC'],
      ['rating', 'DESC'],
      ['totalReviews', 'DESC']
    ],
    limit: filters.limit || 20,
    offset: filters.offset || 0
  });
};

module.exports = SellerProfile;
