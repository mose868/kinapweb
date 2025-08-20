const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ShowcaseProfile = sequelize.define('ShowcaseProfile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING(255), allowNull: false },
  title: { type: DataTypes.STRING(255) },
  bio: { type: DataTypes.TEXT },
  skills: { type: DataTypes.JSON, defaultValue: [] },
  portfolio: { type: DataTypes.JSON, defaultValue: [] },
  achievements: { type: DataTypes.JSON, defaultValue: [] },
  image: { type: DataTypes.TEXT },
  socialLinks: { type: DataTypes.JSON, defaultValue: {} },
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: true },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
  views: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'showcase_profiles',
  timestamps: true
});

module.exports = ShowcaseProfile;