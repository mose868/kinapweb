const mongoose = require('mongoose');
const Training = require('../models/Training');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kinapweb';

async function clearTrainingData() {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    console.log('🧹 Clearing all training data...');
    const result = await Training.deleteMany({});
    console.log(`✅ Cleared ${result.deletedCount} training programs from database`);

    console.log('📊 Training database status:');
    const count = await Training.countDocuments();
    console.log(`   - Remaining training programs: ${count}`);

    if (count === 0) {
      console.log('✅ Training area is now completely blank');
    } else {
      console.log('⚠️ Some training data still exists');
    }

    console.log('\n🎉 Training data clearing completed successfully!');

  } catch (error) {
    console.error('❌ Error clearing training data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the clearing script
clearTrainingData(); 