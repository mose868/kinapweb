const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Training = sequelize.define('Training', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING(500), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING(100), defaultValue: 'Other' },
  level: { type: DataTypes.STRING(50), defaultValue: 'Beginner' },
  duration: { type: DataTypes.JSON, defaultValue: {} },
  schedule: { type: DataTypes.JSON, defaultValue: {} },
  instructor: { type: DataTypes.JSON, defaultValue: {} },
  curriculum: { type: DataTypes.JSON, defaultValue: [] },
  pricing: { type: DataTypes.JSON, defaultValue: {} },
  enrollment: { type: DataTypes.JSON, defaultValue: {} },
  status: { type: DataTypes.STRING(50), defaultValue: 'Draft' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'trainings',
  timestamps: true
});

module.exports = Training;