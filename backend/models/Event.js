const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING(500), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING(100) },
  eventType: { type: DataTypes.STRING(50), defaultValue: 'Hybrid' },
  schedule: { type: DataTypes.JSON, defaultValue: {} },
  location: { type: DataTypes.JSON, defaultValue: {} },
  organizer: { type: DataTypes.JSON, defaultValue: {} },
  status: { type: DataTypes.STRING(50), defaultValue: 'Draft' },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'events',
  timestamps: true
});

module.exports = Event;
