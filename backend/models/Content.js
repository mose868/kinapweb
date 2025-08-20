const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Content = sequelize.define('Content', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  title: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  author: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: 'contents',
  timestamps: true,
  indexes: [
    {
      fields: ['author']
    },
    {
      fields: ['createdAt']
    }
  ]
});

module.exports = Content;