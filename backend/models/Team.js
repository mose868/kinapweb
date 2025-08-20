const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Team = sequelize.define('Team', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  role: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  department: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  bio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  email: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
  
  linkedinUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  
  githubUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  
  portfolioUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  experience: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  
  joinedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  
  achievements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  education: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  contact: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  socialMedia: {
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
  
  isFounder: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  isLeadership: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  lastUpdatedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'team_members',
  timestamps: true,
  indexes: [
    {
      fields: ['isActive', 'displayOrder']
    },
    {
      fields: ['department', 'isActive']
    },
    {
      fields: ['isFounder']
    },
    {
      fields: ['isLeadership']
    }
  ]
});

// Static method to get active team members
Team.getActive = function(options = {}) {
  const { department, leadership, limit = 50 } = options;
  
  let whereClause = {
    isActive: true
  };

  if (department) {
    whereClause.department = department;
  }

  if (leadership !== undefined) {
    whereClause.isLeadership = leadership;
  }

  return this.findAll({
    where: whereClause,
    order: [
      ['isFounder', 'DESC'],
      ['isLeadership', 'DESC'],
      ['displayOrder', 'ASC'],
      ['joinedDate', 'ASC']
    ],
    limit
  });
};

// Static method to get leadership team
Team.getLeadership = function() {
  return this.findAll({
    where: {
      isActive: true,
      [sequelize.Op.or]: [
        { isFounder: true },
        { isLeadership: true }
      ]
    },
    order: [
      ['isFounder', 'DESC'],
      ['displayOrder', 'ASC'],
      ['joinedDate', 'ASC']
    ]
  });
};

module.exports = Team;