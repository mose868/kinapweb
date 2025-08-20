const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AboutUs = sequelize.define('AboutUs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  mission: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  vision: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  values: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  history: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  teamDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  contactInfo: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    validate: {
      isValidContactInfo(value) {
        if (value && typeof value === 'object') {
          const allowedKeys = ['email', 'phone', 'address'];
          const keys = Object.keys(value);
          const invalidKeys = keys.filter(key => !allowedKeys.includes(key));
          if (invalidKeys.length > 0) {
            throw new Error(`Invalid contact info keys: ${invalidKeys.join(', ')}`);
          }
        }
      }
    }
  },
  
  socialLinks: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    validate: {
      isValidSocialLinks(value) {
        if (value && typeof value === 'object') {
          const allowedKeys = ['facebook', 'twitter', 'linkedin', 'instagram'];
          const keys = Object.keys(value);
          const invalidKeys = keys.filter(key => !allowedKeys.includes(key));
          if (invalidKeys.length > 0) {
            throw new Error(`Invalid social links keys: ${invalidKeys.join(', ')}`);
          }
        }
      }
    }
  },
  
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    validate: {
      isValidImages(value) {
        if (value && typeof value === 'object') {
          const allowedKeys = ['heroImage', 'aboutImage', 'galleryImages'];
          const keys = Object.keys(value);
          const invalidKeys = keys.filter(key => !allowedKeys.includes(key));
          if (invalidKeys.length > 0) {
            throw new Error(`Invalid images keys: ${invalidKeys.join(', ')}`);
          }
        }
      }
    }
  },
  
  stats: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      membersCount: 0,
      projectsCompleted: 0,
      skillsOffered: 0,
      successStories: 0
    },
  },
  
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  
  lastUpdatedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'about_us',
  timestamps: true,
  indexes: [
    {
      fields: ['isActive']
    },
    {
      fields: ['lastUpdatedBy']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Static method to get active about us info
AboutUs.getActive = function() {
  return this.findOne({
    where: {
      isActive: true
    },
    order: [['updatedAt', 'DESC']]
  });
};

// Static method to get latest version
AboutUs.getLatest = function() {
  return this.findOne({
    order: [['updatedAt', 'DESC']]
  });
};

// Instance method to update stats
AboutUs.prototype.updateStats = function(newStats) {
  const currentStats = this.stats || {};
  this.stats = { ...currentStats, ...newStats };
  return this.save();
};

module.exports = AboutUs;