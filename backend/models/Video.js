const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  title: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 500]
    }
  },
  
  slug: {
    type: DataTypes.STRING(600),
    allowNull: true,
    unique: true,
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  videoType: {
    type: DataTypes.ENUM('youtube', 'upload'),
    allowNull: false,
    defaultValue: 'youtube',
  },
  
  youtubeUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'YouTube URL must be a valid URL'
      }
    }
  },
  
  videoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  
  thumbnail: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  category: {
    type: DataTypes.ENUM('Tutorial', 'Webinar', 'Resource', 'Showcase', 'Other'),
    allowNull: false,
    defaultValue: 'Other',
  },
  
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  statistics: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      views: 0,
      likes: 0
    },
  },
  
  uploadedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  status: {
    type: DataTypes.ENUM('Draft', 'Published', 'Archived'),
    allowNull: false,
    defaultValue: 'Published',
  },
}, {
  tableName: 'videos',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      fields: ['category', 'status']
    },
    {
      fields: ['videoType']
    },
    {
      fields: ['uploadedBy']
    },
    {
      fields: ['createdAt']
    }
  ],
  hooks: {
    beforeSave: async (video, options) => {
      // Generate slug from title if modified or not set
      if (video.changed('title') || !video.slug) {
        video.slug = video.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }
    }
  }
});

// Instance method to increment view count
Video.prototype.incrementViews = function() {
  const stats = this.statistics || { views: 0, likes: 0 };
  stats.views += 1;
  this.statistics = stats;
  return this.save();
};

// Instance method to increment likes
Video.prototype.incrementLikes = function() {
  const stats = this.statistics || { views: 0, likes: 0 };
  stats.likes += 1;
  this.statistics = stats;
  return this.save();
};

// Static method to get published videos
Video.getPublished = function(options = {}) {
  const { category, limit = 20, offset = 0 } = options;
  
  let whereClause = {
    status: 'Published'
  };

  if (category && category !== 'all') {
    whereClause.category = category;
  }

  return this.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });
};

// Static method to search videos
Video.searchVideos = function(searchTerm, options = {}) {
  const { category, limit = 20 } = options;
  const { Op } = require('sequelize');
  
  let whereClause = {
    status: 'Published',
    [Op.or]: [
      { title: { [Op.like]: `%${searchTerm}%` } },
      { description: { [Op.like]: `%${searchTerm}%` } }
    ]
  };

  if (category && category !== 'all') {
    whereClause.category = category;
  }

  return this.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']],
    limit
  });
};

// Static method to get videos by category
Video.getByCategory = function(category, limit = 20) {
  return this.findAll({
    where: {
      category,
      status: 'Published'
    },
    order: [['createdAt', 'DESC']],
    limit
  });
};

// Static method to get popular videos
Video.getPopular = function(limit = 10) {
  return this.findAll({
    where: {
      status: 'Published'
    },
    order: [
      [sequelize.literal("JSON_EXTRACT(statistics, '$.views')"), 'DESC'],
      [sequelize.literal("JSON_EXTRACT(statistics, '$.likes')"), 'DESC'],
      ['createdAt', 'DESC']
    ],
    limit
  });
};

module.exports = Video;