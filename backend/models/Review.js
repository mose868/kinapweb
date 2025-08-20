const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  
  gigId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'gigs',
      key: 'id'
    }
  },
  
  reviewerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  rating: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    validate: {
      isValidRating(value) {
        if (value && typeof value === 'object') {
          const overall = value.overall;
          if (!overall || overall < 1 || overall > 5) {
            throw new Error('Overall rating must be between 1 and 5');
          }
        }
      }
    }
  },
  
  title: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  
  sellerResponse: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  sellerResponseDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  helpfulVotes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  reportedCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  isHidden: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'reviews',
  timestamps: true,
  indexes: [
    {
      fields: ['gigId']
    },
    {
      fields: ['sellerId']
    },
    {
      fields: ['reviewerId']
    },
    {
      fields: ['orderId']
    },
    {
      fields: ['isPublic', 'isHidden']
    }
  ]
});

module.exports = Review;