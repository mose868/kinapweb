const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FileUpload = sequelize.define('FileUpload', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  fileName: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  
  originalName: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  
  fileType: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  
  mimeType: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  
  fileSize: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  
  fileSizeFormatted: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  
  storagePath: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  downloadUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  thumbnailUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  uploadedBy: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  uploadContext: {
    type: DataTypes.ENUM('chat', 'profile', 'marketplace', 'general'),
    allowNull: false,
    defaultValue: 'general',
  },
  
  relatedId: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in seconds for audio/video files'
  },
  
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  
  accessToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  status: {
    type: DataTypes.ENUM('uploading', 'processing', 'completed', 'failed', 'deleted'),
    allowNull: false,
    defaultValue: 'uploading',
  },
  
  processingError: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'file_uploads',
  timestamps: true,
  indexes: [
    {
      fields: ['uploadedBy', 'uploadContext']
    },
    {
      fields: ['relatedId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['expiresAt']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Static method to get files by user
FileUpload.getByUser = function(uploadedBy, options = {}) {
  const { uploadContext, status = 'completed', limit = 50 } = options;
  
  let whereClause = {
    uploadedBy,
    status
  };

  if (uploadContext) {
    whereClause.uploadContext = uploadContext;
  }

  return this.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']],
    limit
  });
};

// Static method to clean expired files
FileUpload.cleanExpired = function() {
  const now = new Date();
  return this.update(
    { status: 'deleted' },
    {
      where: {
        expiresAt: { [sequelize.Op.lt]: now },
        status: { [sequelize.Op.not]: 'deleted' }
      }
    }
  );
};

// Instance method to mark as completed
FileUpload.prototype.markCompleted = function() {
  this.status = 'completed';
  return this.save();
};

// Instance method to mark as failed
FileUpload.prototype.markFailed = function(error) {
  this.status = 'failed';
  this.processingError = error;
  return this.save();
};

module.exports = FileUpload;