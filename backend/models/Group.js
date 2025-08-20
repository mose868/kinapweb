const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  category: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Store member and admin IDs as JSON arrays
  members: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  admins: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  // Group settings
  isPrivate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  maxMembers: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null, // null means unlimited
  },
  
  settings: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  }
}, {
  tableName: 'groups',
  timestamps: true,
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['createdById']
    },
    {
      fields: ['isPrivate']
    }
  ]
});

// Instance methods
Group.prototype.addMember = function(userId) {
  const members = this.members || [];
  if (!members.includes(userId)) {
    members.push(userId);
    this.members = members;
    return this.save();
  }
  return Promise.resolve(this);
};

Group.prototype.removeMember = function(userId) {
  const members = this.members || [];
  const updatedMembers = members.filter(id => id !== userId);
  this.members = updatedMembers;
  
  // Also remove from admins if they were an admin
  const admins = this.admins || [];
  const updatedAdmins = admins.filter(id => id !== userId);
  this.admins = updatedAdmins;
  
  return this.save();
};

Group.prototype.addAdmin = function(userId) {
  const admins = this.admins || [];
  if (!admins.includes(userId)) {
    admins.push(userId);
    this.admins = admins;
    
    // Also ensure they're a member
    this.addMember(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

Group.prototype.removeAdmin = function(userId) {
  const admins = this.admins || [];
  const updatedAdmins = admins.filter(id => id !== userId);
  this.admins = updatedAdmins;
  return this.save();
};

Group.prototype.isMember = function(userId) {
  const members = this.members || [];
  return members.includes(userId);
};

Group.prototype.isAdmin = function(userId) {
  const admins = this.admins || [];
  return admins.includes(userId);
};

Group.prototype.getMemberCount = function() {
  return (this.members || []).length;
};

// Static methods
Group.getByCategory = function(category) {
  return this.findAll({
    where: {
      category: category,
      isPrivate: false
    },
    order: [['createdAt', 'DESC']]
  });
};

Group.getPublicGroups = function() {
  return this.findAll({
    where: {
      isPrivate: false
    },
    order: [['createdAt', 'DESC']]
  });
};

Group.getUserGroups = function(userId) {
  const { Op } = sequelize.Sequelize;
  
  // Use proper JSON search for MySQL - handle both string and number IDs
  return this.findAll({
    where: {
      [Op.or]: [
        sequelize.literal(`JSON_CONTAINS(members, '"${userId}"')`),
        sequelize.literal(`JSON_CONTAINS(members, '${userId}')`),
        sequelize.literal(`JSON_SEARCH(members, 'one', '${userId}') IS NOT NULL`),
        // Fallback for cases where JSON functions might not work
        sequelize.literal(`members LIKE '%"${userId}"%'`),
        sequelize.literal(`members LIKE '%${userId}%'`)
      ]
    },
    order: [['createdAt', 'DESC']]
  });
};

Group.searchGroups = function(searchTerm) {
  const { Op } = sequelize.Sequelize;
  return this.findAll({
    where: {
      isPrivate: false,
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${searchTerm}%`
          }
        },
        {
          description: {
            [Op.like]: `%${searchTerm}%`
          }
        },
        {
          category: {
            [Op.like]: `%${searchTerm}%`
          }
        }
      ]
    },
    order: [['createdAt', 'DESC']]
  });
};

module.exports = Group;