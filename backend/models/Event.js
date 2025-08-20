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

// Static method to get upcoming events
Event.getUpcomingEvents = function(limit = 10) {
  const { Op } = require('sequelize');
  return this.findAll({
    where: {
      isPublished: true,
      status: 'Published'
    },
    order: [['createdAt', 'DESC']],
    limit: limit
  });
};

// Static method to get featured events
Event.getFeaturedEvents = function(limit = 5) {
  return this.findAll({
    where: {
      isPublished: true,
      isFeatured: true,
      status: 'Published'
    },
    order: [['schedule.startDate', 'ASC']],
    limit: limit
  });
};

module.exports = Event;
