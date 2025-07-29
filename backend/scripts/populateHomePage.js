const mongoose = require('mongoose');
const HomePage = require('../models/HomePage');
const sampleHomePageData = require('../sample-data/homePage');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kinapweb';

async function populateHomePage() {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    console.log('🧹 Clearing existing home page data...');
    await HomePage.deleteMany({});
    console.log('✅ Existing data cleared');

    console.log('📝 Creating new home page with sample data...');
    const homePage = new HomePage(sampleHomePageData);
    await homePage.save();
    console.log('✅ Home page created successfully');

    console.log('📊 Home page statistics:');
    console.log(`   - Features: ${homePage.features.length}`);
    console.log(`   - Testimonials: ${homePage.testimonials.length}`);
    console.log(`   - News Items: ${homePage.newsItems.length}`);
    console.log(`   - Programs: ${homePage.programs.length}`);
    console.log(`   - Partners: ${homePage.partners.length}`);
    console.log(`   - CTA Buttons: ${homePage.ctaButtons.length}`);

    console.log('🎯 Sample data includes:');
    console.log('   - Hero section with title and subtitle');
    console.log('   - Comprehensive statistics');
    console.log('   - 6 feature cards with icons and descriptions');
    console.log('   - 5 testimonials from community members');
    console.log('   - 4 news items with categories and tags');
    console.log('   - 6 training programs with different levels');
    console.log('   - 5 partner organizations');
    console.log('   - About, Services, and Community sections');

    console.log('\n🎉 Home page population completed successfully!');
    console.log('🌐 You can now access the home page at: http://localhost:5000/api/homepage');

  } catch (error) {
    console.error('❌ Error populating home page:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the population script
populateHomePage(); 