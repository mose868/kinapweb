const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MentorApplication = sequelize.define('MentorApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  personalInfo: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  professionalInfo: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  mentorshipInfo: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  applicationContent: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  aiVetting: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'under_review'),
    allowNull: false,
    defaultValue: 'pending'
  },
  review: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'mentor_applications',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['submittedAt']
    }
  ]
});

module.exports = MentorApplication;