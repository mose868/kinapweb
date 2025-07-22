const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ClubUpdate = require('../models/ClubUpdate');
const sampleUpdates = require('../sample-data/clubUpdates');

dotenv.config();

async function populateUpdates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing updates (optional - comment out if you want to keep existing data)
    // await ClubUpdate.deleteMany({});
    // console.log('Cleared existing updates');

    // Insert sample updates
    const createdUpdates = await ClubUpdate.insertMany(sampleUpdates);
    console.log(`Successfully created ${createdUpdates.length} sample updates`);

    // Display created updates
    createdUpdates.forEach((update, index) => {
      console.log(`${index + 1}. ${update.title} (${update.category}) - ${update.status}`);
    });

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error populating updates:', error);
    process.exit(1);
  }
}

// Run the script
populateUpdates(); 