const mongoose = require('mongoose');
const UserVideoData = require('../models/UserVideoData');
const User = require('../models/User');
const Student = require('../models/Student');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

const migrationScript = async () => {
  try {
    console.log('🔄 Starting data migration to MongoDB...');
    
    // Check if we have any existing data
    const existingUsers = await User.countDocuments();
    const existingStudents = await Student.countDocuments();
    const existingVideoData = await UserVideoData.countDocuments();
    
    console.log(`📊 Current database state:`);
    console.log(`   - Users: ${existingUsers}`);
    console.log(`   - Students: ${existingStudents}`);
    console.log(`   - Video Data: ${existingVideoData}`);
    
    if (existingUsers === 0 && existingStudents === 0) {
      console.log('📝 No existing data found. Creating sample data...');
      
      // Create sample user data
      const sampleUser = await User.create({
        username: 'demo_user',
        email: 'demo@ajirakinap.com',
        password: 'hashedpassword123',
        displayName: 'Demo User',
        role: 'student',
        isVerified: true,
        skills: ['Web Development', 'Digital Marketing'],
        bio: 'Sample user for demonstration',
        location: {
          country: 'Kenya',
          city: 'Nairobi'
        }
      });
      
      console.log('✅ Sample user created');
      
      // Create sample video data
      const sampleVideoData = await UserVideoData.create({
        userId: sampleUser._id.toString(),
        watchLater: [],
        likedVideos: [],
        playlists: [],
        history: [],
        subscriptions: [],
        likes: {},
        dislikes: {},
        comments: {}
      });
      
      console.log('✅ Sample video data created');
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Update your frontend to use the new API endpoints');
    console.log('   2. Remove localStorage usage for video data');
    console.log('   3. Test all functionality with permanent storage');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run migration
migrationScript(); 