require('dotenv').config();
const mongoose = require('mongoose');
const { populateMarketplace } = require('../sample-data/marketplace');

const populateData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔄 Populating marketplace with sample data...');
    await populateMarketplace();
    
    console.log('✅ Marketplace populated successfully!');
    console.log('🎉 You can now test the marketplace API endpoints:');
    console.log('   - GET /api/marketplace/gigs');
    console.log('   - GET /api/marketplace/gigs/featured');
    console.log('   - GET /api/marketplace/search?q=web');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating marketplace:', error);
    process.exit(1);
  }
};

populateData(); 