const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TeamApplication = sequelize.define('TeamApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  // Personal Information
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  
  phone: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  
  location: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  // Position Applied For
  positionInterested: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  department: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  // Professional Information
  currentRole: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  currentCompany: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  experience: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  experienceLevel: {
    type: DataTypes.ENUM('Entry Level', 'Junior (1-2 years)', 'Mid-Level (3-5 years)', 'Senior (6-10 years)', 'Expert (10+ years)'),
    allowNull: false,
    defaultValue: 'Entry Level',
  },
  
  // Education
  education: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  // Skills and Qualifications
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  certifications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  // Application Content
  motivation: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  whyJoinTeam: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  relevantExperience: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  valueProposition: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  // Portfolio and Links
  portfolioLinks: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  socialLinks: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  // Documents
  resumeUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  coverLetterUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  additionalDocuments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  // Availability
  availability: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  expectedSalary: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // Application Status
  status: {
    type: DataTypes.ENUM('pending', 'under_review', 'interview_scheduled', 'rejected', 'accepted', 'hired'),
    allowNull: false,
    defaultValue: 'pending',
  },
  
  // Review Information
  review: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  reviewedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  // Interview Information
  interviewScheduled: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  // Application Metadata
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  
  source: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'website',
  },
  
  referredBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  // Notes
  applicantNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  internalNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'team_applications',
  timestamps: true,
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['positionInterested']
    },
    {
      fields: ['status']
    },
    {
      fields: ['submittedAt']
    },
    {
      fields: ['department']
    }
  ]
});

module.exports = TeamApplication;
