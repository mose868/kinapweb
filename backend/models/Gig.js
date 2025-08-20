const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Gig = sequelize.define('Gig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  category: {
    type: DataTypes.ENUM(
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
    ),
    allowNull: false,
  },
  
  subcategory: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  pricing: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  
  packages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  stats: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      views: 0,
      orders: 0,
      rating: 0,
      reviews: 0
    },
  },
  
  status: {
    type: DataTypes.ENUM('draft', 'active', 'paused', 'rejected'),
    allowNull: false,
    defaultValue: 'draft',
  },
  
  featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  location: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  languages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  portfolio: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  availability: {
    type: DataTypes.ENUM('available', 'busy', 'unavailable'),
    allowNull: false,
    defaultValue: 'available',
  },
  
  responseTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 24, // in hours
  },
  
  completionRate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
    validate: {
      min: 0,
      max: 100,
    },
  },
}, {
  tableName: 'gigs',
  timestamps: true,
  indexes: [
    {
      fields: ['sellerId', 'status']
    },
    {
      fields: ['category', 'status']
    },
    {
      fields: ['featured', 'status']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['status']
    }
  ]
});

// Virtual for average rating
Gig.prototype.getAverageRating = function() {
  return this.stats?.rating || 0;
};

// Method to update stats
Gig.prototype.updateStats = function(newStats) {
  this.stats = { ...this.stats, ...newStats };
  return this.save();
};

// Static method to get featured gigs
Gig.getFeatured = function() {
  return this.findAll({
    where: { 
      status: 'active', 
      featured: true 
    },
    include: [
      {
        model: sequelize.models.User,
        as: 'seller',
        attributes: ['id', 'displayName', 'avatar', 'rating']
      }
    ]
  });
};

// Static method to get gigs by category
Gig.getByCategory = function(category, limit = 20) {
  return this.findAll({
    where: { 
      category, 
      status: 'active' 
    },
    include: [
      {
        model: sequelize.models.User,
        as: 'seller',
        attributes: ['id', 'displayName', 'avatar', 'rating']
      }
    ],
    limit: limit,
    order: [['createdAt', 'DESC']]
  });
};

// Static method to search gigs
Gig.searchGigs = function(searchTerm, limit = 20, offset = 0) {
  const { Op } = sequelize.Sequelize;
  
  return this.findAll({
    where: {
      status: 'active',
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${searchTerm}%`
          }
        },
        {
          description: {
            [Op.like]: `%${searchTerm}%`
          }
        }
      ]
    },
    include: [
      {
        model: sequelize.models.User,
        as: 'seller',
        attributes: ['id', 'displayName', 'avatar', 'rating']
      }
    ],
    limit: limit,
    offset: offset,
    order: [['createdAt', 'DESC']]
  });
};

module.exports = Gig;