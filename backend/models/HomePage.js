const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const HomePage = sequelize.define('HomePage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  heroSection: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  ctaButtons: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  stats: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      studentsTrained: 1000,
      successStories: 150,
      skillsPrograms: 50,
      digitalExcellence: 100,
      activeMembers: 500,
      completedProjects: 200,
      partnerOrganizations: 25,
      averageEarnings: 50000
    },
  },
  
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  testimonials: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  newsItems: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  partners: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  socialProof: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  seoMeta: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  customCSS: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  customJS: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  
  version: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: '1.0',
  },
  
  lastUpdatedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'home_pages',
  timestamps: true,
  indexes: [
    {
      fields: ['isActive']
    },
    {
      fields: ['version']
    }
  ]
});

// Static method to get active homepage
HomePage.getActive = function() {
  return this.findOne({
    where: {
      isActive: true
    },
    order: [['updatedAt', 'DESC']]
  });
};

module.exports = HomePage;