const mongoose = require('mongoose');
require('dotenv').config();

const testMongoDBConnection = async () => {
  console.log('🔍 Testing MongoDB connection...');
  console.log('📡 Connection string:', process.env.MONGODB_URI ? 'Present' : 'Missing');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in .env file');
    return;
  }
  
  try {
    console.log('🔄 Attempting to connect...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      w: 'majority',
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Host:', mongoose.connection.host);
    console.log('🚪 Port:', mongoose.connection.port);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections found:', collections.length);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 This usually means:');
      console.log('   - Network connectivity issues');
      console.log('   - MongoDB Atlas is down');
      console.log('   - IP not whitelisted in MongoDB Atlas');
    } else if (error.message.includes('Authentication failed')) {
      console.log('💡 This usually means:');
      console.log('   - Wrong username/password');
      console.log('   - User not authorized for this database');
    } else if (error.message.includes('Invalid scheme')) {
      console.log('💡 This usually means:');
      console.log('   - Malformed connection string');
      console.log('   - Missing protocol (mongodb+srv://)');
    }
  }
};

testMongoDBConnection(); 