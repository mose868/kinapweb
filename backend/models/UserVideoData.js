const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserVideoData = sequelize.define('UserVideoData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  videoId: { type: DataTypes.INTEGER, allowNull: false },
  watchTime: { type: DataTypes.INTEGER, defaultValue: 0 },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  liked: { type: DataTypes.BOOLEAN, defaultValue: false },
  bookmarked: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'user_video_data',
  timestamps: true
});

module.exports = UserVideoData;