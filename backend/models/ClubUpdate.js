const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const ClubUpdate = sequelize.define('ClubUpdate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  title: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  
  excerpt: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  author: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  authorEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  
  category: {
    type: DataTypes.ENUM('Announcement', 'Event', 'Achievement', 'Training', 'Partnership', 'General'),
    allowNull: false,
    defaultValue: 'General',
  },
  
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
    allowNull: false,
    defaultValue: 'Medium',
  },
  
  status: {
    type: DataTypes.ENUM('Draft', 'Published', 'Archived'),
    allowNull: false,
    defaultValue: 'Draft',
  },
  
  publishDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
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
  
  eventDetails: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  engagement: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      views: 0,
      likes: 0,
      shares: 0
    },
  },
  
  seoMeta: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  lastUpdatedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'club_updates',
  timestamps: true,
  indexes: [
    {
      fields: ['status', 'publishDate']
    },
    {
      fields: ['category', 'isActive']
    },
    {
      fields: ['featured', 'priority', 'publishDate']
    },
    {
      fields: ['expiryDate']
    }
  ]
});

// Virtual for checking if update is expired
ClubUpdate.prototype.getIsExpired = function() {
  return this.expiryDate && this.expiryDate < new Date();
};

// Static method to get published updates
ClubUpdate.getPublished = function(options = {}) {
  const { category, tags, limit = 10, offset = 0 } = options;
  
  let whereClause = {
    status: 'Published',
    isActive: true,
    [Op.or]: [
      { expiryDate: null },
      { expiryDate: { [Op.gt]: new Date() } }
    ]
  };

  if (category) {
    whereClause.category = category;
  }

  if (tags && tags.length > 0) {
    whereClause.tags = {
      [Op.contains]: tags
    };
  }

  return this.findAll({
    where: whereClause,
    order: [
      ['featured', 'DESC'],
      ['priority', 'DESC'],
      ['publishDate', 'DESC']
    ],
    limit,
    offset
  });
};

// Instance method to increment view count
ClubUpdate.prototype.incrementViews = function() {
  const engagement = this.engagement || { views: 0, likes: 0, shares: 0 };
  engagement.views += 1;
  this.engagement = engagement;
  return this.save();
};

module.exports = ClubUpdate;