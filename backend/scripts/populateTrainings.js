const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Training = require('../models/Training');
const sampleTrainings = require('../sample-data/trainings');

dotenv.config();

async function populateTrainings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing trainings to avoid conflicts
    await Training.deleteMany({});
    console.log('Cleared existing training programs');

    // Insert sample trainings
    const createdTrainings = [];
    
    // Insert trainings one by one to identify issues
    for (let i = 0; i < sampleTrainings.length; i++) {
      try {
        const training = await Training.create(sampleTrainings[i]);
        createdTrainings.push(training);
        console.log(`✅ Created: ${training.title}`);
      } catch (error) {
        console.log(`❌ Failed to create: ${sampleTrainings[i].title}`);
        console.log(`   Error: ${error.message}`);
      }
    }
    
    console.log(`Successfully created ${createdTrainings.length} sample training programs`);

    // Display created trainings
    createdTrainings.forEach((training, index) => {
      const enrollmentStatus = training.enrollment.enrolled >= training.enrollment.capacity ? '🔴 FULL' : 
                              training.enrollment.enrolled >= training.enrollment.capacity * 0.8 ? '🟡 ALMOST FULL' : 
                              '🟢 AVAILABLE';
      
      console.log(`${index + 1}. ${training.title}`);
      console.log(`   Category: ${training.category} | Level: ${training.level} | Status: ${training.status}`);
      console.log(`   Duration: ${training.duration.totalHours}h | Price: ${training.pricing.isFree ? 'FREE' : `KES ${training.pricing.regularPrice.toLocaleString()}`}`);
      console.log(`   Enrollment: ${training.enrollment.enrolled}/${training.enrollment.capacity} ${enrollmentStatus}`);
      console.log(`   Rating: ${training.ratings.average > 0 ? `⭐ ${training.ratings.average} (${training.ratings.totalRatings} reviews)` : 'No ratings yet'}`);
      console.log(`   Featured: ${training.isFeatured ? '⭐ YES' : 'No'}`);
      console.log('');
    });

    // Show statistics
    const categoryStats = await Training.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          published: { $sum: { $cond: [{ $eq: ['$status', 'Published'] }, 1, 0] } },
          featured: { $sum: { $cond: ['$isFeatured', 1, 0] } },
          totalEnrollments: { $sum: '$enrollment.enrolled' },
          avgRating: { $avg: '$ratings.average' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('📊 Training Programs Statistics by Category:');
    categoryStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} total, ${stat.published} published, ${stat.featured} featured`);
      console.log(`   Enrollments: ${stat.totalEnrollments}, Avg Rating: ${stat.avgRating ? stat.avgRating.toFixed(1) : '0'}`);
    });

    const levelStats = await Training.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
          published: { $sum: { $cond: [{ $eq: ['$status', 'Published'] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📈 Training Programs by Level:');
    levelStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} total, ${stat.published} published`);
    });

    const statusStats = await Training.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📋 Training Programs by Status:');
    statusStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} programs`);
    });

    // Overall statistics
    const totalPrograms = createdTrainings.length;
    const publishedPrograms = createdTrainings.filter(t => t.status === 'Published').length;
    const featuredPrograms = createdTrainings.filter(t => t.isFeatured).length;
    const freePrograms = createdTrainings.filter(t => t.pricing.isFree).length;
    const totalEnrollments = createdTrainings.reduce((sum, t) => sum + t.enrollment.enrolled, 0);
    const totalCapacity = createdTrainings.reduce((sum, t) => sum + t.enrollment.capacity, 0);
    const avgRating = createdTrainings
      .filter(t => t.ratings.totalRatings > 0)
      .reduce((sum, t, _, arr) => sum + t.ratings.average / arr.length, 0);

    console.log('\n📝 Overall Summary:');
    console.log(`Total Programs: ${totalPrograms}`);
    console.log(`Published Programs: ${publishedPrograms}`);
    console.log(`Featured Programs: ${featuredPrograms}`);
    console.log(`Free Programs: ${freePrograms}`);
    console.log(`Total Enrollments: ${totalEnrollments}/${totalCapacity} (${Math.round((totalEnrollments/totalCapacity)*100)}% capacity)`);
    console.log(`Average Rating: ${avgRating ? avgRating.toFixed(1) : '0'} ⭐`);
    console.log(`Enrollment Rate: ${Math.round((totalEnrollments/totalCapacity)*100)}%`);

    // Most popular programs
    const popularPrograms = createdTrainings
      .filter(t => t.status === 'Published')
      .sort((a, b) => b.enrollment.enrolled - a.enrollment.enrolled)
      .slice(0, 3);

    console.log('\n🔥 Most Popular Programs:');
    popularPrograms.forEach((program, index) => {
      console.log(`${index + 1}. ${program.title} - ${program.enrollment.enrolled}/${program.enrollment.capacity} enrolled`);
    });

    // Top rated programs
    const topRatedPrograms = createdTrainings
      .filter(t => t.ratings.totalRatings > 0)
      .sort((a, b) => b.ratings.average - a.ratings.average)
      .slice(0, 3);

    console.log('\n⭐ Top Rated Programs:');
    topRatedPrograms.forEach((program, index) => {
      console.log(`${index + 1}. ${program.title} - ${program.ratings.average} ⭐ (${program.ratings.totalRatings} reviews)`);
    });

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error populating training programs:', error);
    process.exit(1);
  }
}

// Run the script
populateTrainings(); 