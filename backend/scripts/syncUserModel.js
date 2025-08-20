const { sequelize } = require('../config/database');
const User = require('../models/User');

async function syncUserModel() {
  try {
    console.log('🔄 Syncing User model with database...');
    
    // Force sync the User model to add missing columns
    await User.sync({ alter: true });
    
    console.log('✅ User model synced successfully!');
    console.log('📋 The following columns should now exist:');
    console.log('- idNumber (VARCHAR)');
    console.log('- ajiraGoals (TEXT)');  
    console.log('- interests (JSON)');
    
    // Test the model by trying to find a user
    console.log('🧪 Testing model...');
    const testUser = await User.findOne({ limit: 1 });
    if (testUser) {
      console.log('✅ Model is working correctly!');
    } else {
      console.log('ℹ️ No users found, but model sync was successful');
    }
    
    await sequelize.close();
    console.log('🎉 Database sync completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing model:', error.message);
    await sequelize.close();
    process.exit(1);
  }
}

syncUserModel();
