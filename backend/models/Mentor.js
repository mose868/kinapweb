const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Mentor = sequelize.define('Mentor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false },
  expertise: { type: DataTypes.JSON, defaultValue: [] },
  bio: { type: DataTypes.TEXT },
  experience: { type: DataTypes.STRING(100) },
  availability: { type: DataTypes.JSON, defaultValue: {} },
  rates: { type: DataTypes.JSON, defaultValue: {} },
  rating: { type: DataTypes.DECIMAL(3,2), defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'mentors',
  timestamps: true
});

module.exports = Mentor;