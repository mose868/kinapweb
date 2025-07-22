const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FAQ = require('../models/FAQ');
const sampleFAQs = require('../sample-data/faqs');

dotenv.config();

async function populateFAQs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing FAQs (optional - comment out if you want to keep existing data)
    // await FAQ.deleteMany({});
    // console.log('Cleared existing FAQs');

    // Insert sample FAQs
    const createdFAQs = await FAQ.insertMany(sampleFAQs);
    console.log(`Successfully created ${createdFAQs.length} sample FAQs`);

    // Display created FAQs
    createdFAQs.forEach((faq, index) => {
      console.log(`${index + 1}. ${faq.question} (${faq.category}) - ${faq.isPublished ? 'Published' : 'Draft'} ${faq.isPopular ? '⭐' : ''}`);
    });

    // Show statistics
    const stats = await FAQ.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          published: { $sum: { $cond: ['$isPublished', 1, 0] } },
          popular: { $sum: { $cond: ['$isPopular', 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 FAQ Statistics by Category:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} total, ${stat.published} published, ${stat.popular} popular`);
    });

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error populating FAQs:', error);
    process.exit(1);
  }
}

// Run the script
populateFAQs(); 