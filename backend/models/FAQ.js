const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FAQ = sequelize.define('FAQ', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
  category: {
    type: DataTypes.ENUM('General', 'Membership', 'Events', 'Training', 'Technical', 'Certification', 'Career', 'Payment'),
    allowNull: false,
    defaultValue: 'General',
  },
  
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  isPublished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  
  isPopular: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  viewCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  helpfulCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  notHelpfulCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  relatedFAQs: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    comment: 'Array of FAQ IDs that are related to this FAQ'
  },
  
  lastUpdatedBy: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  seoMeta: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
  },
  
  displayOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'faqs',
  timestamps: true,
  indexes: [
    {
      fields: ['category', 'isPublished', 'isActive']
    },
    {
      fields: ['isPopular', 'priority']
    },
    {
      fields: ['tags']
    },
    {
      fields: ['viewCount']
    },
    {
      fields: ['helpfulCount']
    },
    {
      fields: ['displayOrder']
    }
  ],
  hooks: {
    beforeSave: async (faq, options) => {
      // Generate SEO meta if not provided
      const seoMeta = faq.seoMeta || {};
      
      if (!seoMeta.metaTitle) {
        seoMeta.metaTitle = faq.question.length > 60 
          ? faq.question.substring(0, 57) + '...' 
          : faq.question;
      }
      
      if (!seoMeta.metaDescription) {
        seoMeta.metaDescription = faq.answer.length > 160 
          ? faq.answer.substring(0, 157) + '...' 
          : faq.answer;
      }
      
      faq.seoMeta = seoMeta;
    }
  }
});

// Virtual for calculating helpfulness ratio
FAQ.prototype.getHelpfulnessRatio = function() {
  const total = this.helpfulCount + this.notHelpfulCount;
  if (total === 0) return 0;
  return (this.helpfulCount / total) * 100;
};

// Static method to get published FAQs
FAQ.getPublished = function(options = {}) {
  const { category, popular, limit = 50, offset = 0 } = options;
  
  let whereClause = {
    isPublished: true,
    isActive: true
  };

  if (category && category !== 'all') {
    whereClause.category = category;
  }

  if (popular) {
    whereClause.isPopular = true;
  }

  return this.findAll({
    where: whereClause,
    order: [
      ['priority', 'DESC'],
      ['helpfulCount', 'DESC'],
      ['createdAt', 'DESC']
    ],
    limit,
    offset
  });
};

// Static method to search FAQs
FAQ.searchFAQs = function(searchTerm, options = {}) {
  const { category, limit = 20 } = options;
  const { Op } = require('sequelize');
  
  let whereClause = {
    isPublished: true,
    isActive: true,
    [Op.or]: [
      { question: { [Op.like]: `%${searchTerm}%` } },
      { answer: { [Op.like]: `%${searchTerm}%` } },
      { tags: { [Op.like]: `%${searchTerm}%` } }
    ]
  };

  if (category && category !== 'all') {
    whereClause.category = category;
  }

  return this.findAll({
    where: whereClause,
    order: [
      ['priority', 'DESC'],
      ['helpfulCount', 'DESC']
    ],
    limit
  });
};

// Static method to get popular FAQs
FAQ.getPopular = function(limit = 10) {
  return this.findAll({
    where: {
      isPublished: true,
      isActive: true,
      isPopular: true
    },
    order: [
      ['priority', 'DESC'],
      ['viewCount', 'DESC'],
      ['helpfulCount', 'DESC']
    ],
    limit
  });
};

// Static method to get FAQs by category
FAQ.getByCategory = function(category, limit = 50) {
  return this.findAll({
    where: {
      category,
      isPublished: true,
      isActive: true
    },
    order: [
      ['displayOrder', 'ASC'],
      ['priority', 'DESC'],
      ['helpfulCount', 'DESC']
    ],
    limit
  });
};

// Instance method to increment view count
FAQ.prototype.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Instance method to mark as helpful
FAQ.prototype.markHelpful = function() {
  this.helpfulCount += 1;
  return this.save();
};

// Instance method to mark as not helpful
FAQ.prototype.markNotHelpful = function() {
  this.notHelpfulCount += 1;
  return this.save();
};

// Instance method to add related FAQ
FAQ.prototype.addRelatedFAQ = function(faqId) {
  const relatedFAQs = this.relatedFAQs || [];
  if (!relatedFAQs.includes(faqId)) {
    relatedFAQs.push(faqId);
    this.relatedFAQs = relatedFAQs;
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove related FAQ
FAQ.prototype.removeRelatedFAQ = function(faqId) {
  const relatedFAQs = this.relatedFAQs || [];
  const index = relatedFAQs.indexOf(faqId);
  if (index > -1) {
    relatedFAQs.splice(index, 1);
    this.relatedFAQs = relatedFAQs;
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = FAQ;