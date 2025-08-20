const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SuccessStory = sequelize.define('SuccessStory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING(500), allowNull: false },
  author: { type: DataTypes.STRING(255), allowNull: false },
  authorImage: { type: DataTypes.TEXT },
  excerpt: { type: DataTypes.TEXT },
  content: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING(100) },
  tags: { type: DataTypes.JSON, defaultValue: [] },
  earnings: { type: DataTypes.DECIMAL(10,2) },
  timeframe: { type: DataTypes.STRING(100) },
  images: { type: DataTypes.JSON, defaultValue: [] },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
  views: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'success_stories',
  timestamps: true
});

module.exports = SuccessStory;