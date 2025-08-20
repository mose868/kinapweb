const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  name: {
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
    allowNull: true,
  },
  
  subject: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  category: {
    type: DataTypes.ENUM('General Inquiry', 'Technical Support', 'Partnership', 'Training', 'Complaint', 'Suggestion', 'Other'),
    allowNull: false,
    defaultValue: 'General Inquiry',
  },
  
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Urgent'),
    allowNull: false,
    defaultValue: 'Medium',
  },
  
  status: {
    type: DataTypes.ENUM('New', 'In Progress', 'Responded', 'Resolved', 'Closed'),
    allowNull: false,
    defaultValue: 'New',
  },
  
  source: {
    type: DataTypes.ENUM('Website', 'WhatsApp', 'Email', 'Phone', 'Social Media'),
    allowNull: false,
    defaultValue: 'Website',
  },
  
  emailSent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  emailSentAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  responseNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  assignedTo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  followUpDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  isRead: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  isArchived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
}, {
  tableName: 'contacts',
  timestamps: true,
  indexes: [
    {
      fields: ['status', 'createdAt']
    },
    {
      fields: ['category', 'priority']
    },
    {
      fields: ['isRead', 'isArchived']
    },
    {
      fields: ['email']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['assignedTo']
    }
  ],
  hooks: {
    beforeSave: async (contact, options) => {
      // Set emailSentAt when emailSent is true
      if (contact.changed('emailSent') && contact.emailSent && !contact.emailSentAt) {
        contact.emailSentAt = new Date();
      }
    }
  }
});

// Virtual for formatted date
Contact.prototype.getFormattedDate = function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Static method to get unread messages count
Contact.getUnreadCount = function() {
  return this.count({ 
    where: { 
      isRead: false, 
      isArchived: false 
    } 
  });
};

// Static method to get messages by status
Contact.getByStatus = function(status, limit = 50) {
  return this.findAll({ 
    where: { 
      status, 
      isArchived: false 
    },
    order: [['createdAt', 'DESC']],
    limit 
  });
};

// Static method to get messages by category
Contact.getByCategory = function(category, limit = 50) {
  return this.findAll({ 
    where: { 
      category, 
      isArchived: false 
    },
    order: [['createdAt', 'DESC']],
    limit 
  });
};

// Static method to get urgent messages
Contact.getUrgent = function(limit = 20) {
  return this.findAll({ 
    where: { 
      priority: 'Urgent',
      status: ['New', 'In Progress'],
      isArchived: false 
    },
    order: [['createdAt', 'DESC']],
    limit 
  });
};

// Instance method to mark as read
Contact.prototype.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Instance method to update status
Contact.prototype.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  if (notes) {
    this.responseNotes = notes;
  }
  return this.save();
};

// Instance method to assign to admin
Contact.prototype.assignTo = function(adminEmail) {
  this.assignedTo = adminEmail;
  if (this.status === 'New') {
    this.status = 'In Progress';
  }
  return this.save();
};

// Instance method to archive
Contact.prototype.archive = function() {
  this.isArchived = true;
  return this.save();
};

module.exports = Contact;