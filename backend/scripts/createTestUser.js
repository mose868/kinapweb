require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createTestUser = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@kinap.com' });
    if (existingUser) {
      console.log('✅ Test user already exists');
      return existingUser;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const testUser = new User({
      username: 'testseller',
      displayName: 'Test Seller',
      email: 'test@kinap.com',
      password: hashedPassword,
      phoneNumber: '+254700000000',
      course: 'Computer Science',
      year: '3rd Year',
      experienceLevel: 'Intermediate',
      skills: ['Web Development', 'React', 'Node.js', 'MongoDB'],
      bio: 'Experienced web developer with 3+ years of experience in modern web technologies.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      role: 'student',
      isVerified: true,
      rating: 4.8,
      location: {
        country: 'Kenya',
        city: 'Nairobi'
      },
      languages: ['English', 'Swahili'],
      portfolio: [
        {
          title: 'E-commerce Website',
          description: 'Modern e-commerce platform built with React and Node.js',
          image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300',
          url: 'https://example.com/project1'
        },
        {
          title: 'Mobile App',
          description: 'Cross-platform mobile app for food delivery',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300',
          url: 'https://example.com/project2'
        }
      ]
    });

    await testUser.save();
    console.log('✅ Test user created successfully');
    console.log('Email: test@kinap.com');
    console.log('Password: password123');
    
    return testUser;
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  createTestUser()
    .then(() => {
      console.log('🎉 Test user setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createTestUser }; 