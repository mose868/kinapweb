const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  
  fullname: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  idNo: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  
  course: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  year: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  experience: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  
  verificationCode: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  
  verificationCodeExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  
  interests: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  
  // Additional profile fields (not collected during signup)
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  
  ajiraGoals: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  linkedinProfile: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  
  photoURL: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  
  lastActive: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'students',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['isVerified']
    },
    {
      fields: ['course']
    },
    {
      fields: ['year']
    }
  ],
  hooks: {
    // Hash password before saving
    beforeSave: async (student, options) => {
      if (student.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(student.password, salt);
      }
    }
  }
});

// Instance method to match password
Student.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Static method to find by email
Student.findByEmail = function(email) {
  return this.findOne({
    where: {
      email: email
    }
  });
};

// Static method to find verified students
Student.findVerified = function() {
  return this.findAll({
    where: {
      isVerified: true
    }
  });
};

module.exports = Student;