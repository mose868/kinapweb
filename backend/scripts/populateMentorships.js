const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Mentorship = require('../models/Mentorship');
const sampleMentorships = require('../sample-data/mentorships');

dotenv.config();

async function populateMentorships() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing mentorships to avoid conflicts
    await Mentorship.deleteMany({});
    console.log('Cleared existing mentorship programs');

    // Insert sample mentorships one by one to identify issues
    const createdMentorships = [];
    
    for (let i = 0; i < sampleMentorships.length; i++) {
      try {
        const mentorship = await Mentorship.create(sampleMentorships[i]);
        createdMentorships.push(mentorship);
        console.log(`✅ Created: ${mentorship.mentor.name} - ${mentorship.title}`);
      } catch (error) {
        console.log(`❌ Failed to create: ${sampleMentorships[i].mentor.name} - ${sampleMentorships[i].title}`);
        console.log(`   Error: ${error.message}`);
      }
    }
    
    console.log(`\n🎉 Successfully created ${createdMentorships.length} mentorship programs`);

    // Display created mentorships with detailed information
    console.log('\n📋 MENTOR DIRECTORY:');
    console.log('='.repeat(80));
    
    createdMentorships.forEach((mentorship, index) => {
      const availabilityStatus = !mentorship.availability.isAvailable ? '🔴 UNAVAILABLE' : 
                                 mentorship.availability.status === 'Available' ? '🟢 AVAILABLE' : 
                                 mentorship.availability.status === 'Busy' ? '🟡 BUSY' : 
                                 mentorship.availability.status === 'Away' ? '🟠 AWAY' : 
                                 '⚪ OFFLINE';
      
      const instantStatus = mentorship.instantAvailability.enabled ? '⚡ INSTANT' : '📅 SCHEDULED';
      const priceDisplay = mentorship.pricing.isFree ? '🆓 FREE' : `💰 KES ${mentorship.pricing.sessionRate}/session`;
      
      console.log(`\n${index + 1}. ${mentorship.mentor.name} (${mentorship.expertiseLevel})`);
      console.log(`   📧 ${mentorship.mentor.email} | 📱 ${mentorship.mentor.phone}`);
      console.log(`   🏢 ${mentorship.mentor.title} at ${mentorship.mentor.company}`);
      console.log(`   🎯 ${mentorship.category} | ⭐ ${mentorship.verification.badgeLevel} Badge`);
      console.log(`   ${availabilityStatus} | ${instantStatus} | ${priceDisplay}`);
      console.log(`   👥 ${mentorship.availability.currentMentees}/${mentorship.availability.maxMentees} mentees | ⏱️ ${mentorship.availability.responseTime}`);
      console.log(`   📊 ${mentorship.statistics.totalSessions} sessions | ⭐ ${mentorship.ratings.overall} rating (${mentorship.ratings.totalRatings} reviews)`);
      console.log(`   🎓 Featured: ${mentorship.isFeatured ? '⭐ YES' : 'No'} | 🔍 Verified: ${mentorship.verification.isVerified ? '✅ YES' : '❌ No'}`);
      console.log(`   🛠️ Skills: ${mentorship.skills.slice(0, 4).join(', ')}${mentorship.skills.length > 4 ? ` +${mentorship.skills.length - 4} more` : ''}`);
    });

    // Show comprehensive statistics
    console.log('\n📊 MENTORSHIP ECOSYSTEM ANALYTICS:');
    console.log('='.repeat(50));

    // Category distribution
    const categoryStats = await Mentorship.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgSessionRate: { $avg: { $cond: [{ $eq: ['$pricing.isFree', false] }, '$pricing.sessionRate', null] } },
          availableMentors: { $sum: { $cond: [{ $eq: ['$availability.isAvailable', true] }, 1, 0] } },
          instantMentors: { $sum: { $cond: [{ $eq: ['$instantAvailability.enabled', true] }, 1, 0] } },
          totalSessions: { $sum: '$statistics.totalSessions' },
          avgRating: { $avg: '$ratings.overall' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n🎯 Categories & Market Analysis:');
    categoryStats.forEach(stat => {
      console.log(`${stat._id}:`);
      console.log(`   📈 ${stat.count} mentors | 🟢 ${stat.availableMentors} available | ⚡ ${stat.instantMentors} instant`);
      console.log(`   💰 Avg Rate: ${stat.avgSessionRate ? `KES ${Math.round(stat.avgSessionRate)}` : 'Varies'} | ⭐ Avg Rating: ${stat.avgRating ? stat.avgRating.toFixed(1) : 'N/A'}`);
      console.log(`   📊 Total Sessions: ${stat.totalSessions}`);
    });

    // Expertise level distribution
    const expertiseStats = await Mentorship.aggregate([
      {
        $group: {
          _id: '$expertiseLevel',
          count: { $sum: 1 },
          avgPrice: { $avg: { $cond: [{ $eq: ['$pricing.isFree', false] }, '$pricing.sessionRate', null] } },
          avgRating: { $avg: '$ratings.overall' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n🏆 Expertise Level Distribution:');
    expertiseStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} mentors | Avg Price: ${stat.avgPrice ? `KES ${Math.round(stat.avgPrice)}` : 'Varies'} | Avg Rating: ${stat.avgRating ? stat.avgRating.toFixed(1) : 'N/A'}`);
    });

    // Availability analysis
    const availabilityStats = await Mentorship.aggregate([
      {
        $group: {
          _id: '$availability.status',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n🚦 Mentor Availability Status:');
    availabilityStats.forEach(stat => {
      const emoji = stat._id === 'Available' ? '🟢' : 
                   stat._id === 'Busy' ? '🟡' : 
                   stat._id === 'Away' ? '🟠' : '🔴';
      console.log(`${emoji} ${stat._id}: ${stat.count} mentors`);
    });

    // Pricing analysis
    const pricingStats = await Mentorship.aggregate([
      {
        $group: {
          _id: '$pricing.isFree',
          count: { $sum: 1 },
          avgPrice: { $avg: { $cond: [{ $eq: ['$pricing.isFree', false] }, '$pricing.sessionRate', null] } },
          minPrice: { $min: { $cond: [{ $eq: ['$pricing.isFree', false] }, '$pricing.sessionRate', null] } },
          maxPrice: { $max: { $cond: [{ $eq: ['$pricing.isFree', false] }, '$pricing.sessionRate', null] } }
        }
      }
    ]);

    console.log('\n💰 Pricing Structure:');
    pricingStats.forEach(stat => {
      if (stat._id) {
        console.log(`🆓 Free Mentors: ${stat.count}`);
      } else {
        console.log(`💰 Paid Mentors: ${stat.count}`);
        console.log(`   💵 Price Range: KES ${stat.minPrice} - ${stat.maxPrice}`);
        console.log(`   📊 Average Rate: KES ${Math.round(stat.avgPrice)}`);
      }
    });

    // Instant availability analysis (Uber-like features)
    const instantStats = await Mentorship.aggregate([
      {
        $match: { 'instantAvailability.enabled': true }
      },
      {
        $group: {
          _id: null,
          totalInstantMentors: { $sum: 1 },
          availableInstantMentors: { $sum: { $cond: [{ $eq: ['$availability.isAvailable', true] }, 1, 0] } },
          maxConcurrentSessions: { $sum: '$instantAvailability.maxInstantRequests' },
          currentActiveSessions: { $sum: '$instantAvailability.currentInstantSessions' },
          avgResponseTime: { $avg: {
            $switch: {
              branches: [
                { case: { $eq: ['$availability.responseTime', 'Within 1 hour'] }, then: 30 },
                { case: { $eq: ['$availability.responseTime', 'Within 4 hours'] }, then: 120 },
                { case: { $eq: ['$availability.responseTime', 'Within 24 hours'] }, then: 720 }
              ],
              default: 1440
            }
          }}
        }
      }
    ]);

    console.log('\n⚡ UBER-LIKE INSTANT MENTORSHIP CAPACITY:');
    if (instantStats.length > 0) {
      const stats = instantStats[0];
      console.log(`🚀 Instant Mentors: ${stats.totalInstantMentors} total | ${stats.availableInstantMentors} available now`);
      console.log(`🎯 Capacity: ${stats.maxConcurrentSessions} max concurrent sessions | ${stats.currentActiveSessions} active now`);
      console.log(`⏱️ Average Response Time: ${Math.round(stats.avgResponseTime)} minutes`);
      console.log(`📈 System Utilization: ${Math.round((stats.currentActiveSessions / stats.maxConcurrentSessions) * 100)}%`);
    }

    // Verification and quality metrics
    const qualityStats = await Mentorship.aggregate([
      {
        $group: {
          _id: null,
          totalMentors: { $sum: 1 },
          verifiedMentors: { $sum: { $cond: [{ $eq: ['$verification.isVerified', true] }, 1, 0] } },
          featuredMentors: { $sum: { $cond: [{ $eq: ['$isFeatured', true] }, 1, 0] } },
          avgOverallRating: { $avg: '$ratings.overall' },
          totalSessions: { $sum: '$statistics.totalSessions' },
          totalMentees: { $sum: '$statistics.totalMentees' },
          totalReviews: { $sum: '$ratings.totalRatings' }
        }
      }
    ]);

    console.log('\n🏅 QUALITY & VERIFICATION METRICS:');
    if (qualityStats.length > 0) {
      const stats = qualityStats[0];
      console.log(`✅ Verification Rate: ${Math.round((stats.verifiedMentors / stats.totalMentors) * 100)}% (${stats.verifiedMentors}/${stats.totalMentors})`);
      console.log(`⭐ Featured Mentors: ${stats.featuredMentors} (${Math.round((stats.featuredMentors / stats.totalMentors) * 100)}%)`);
      console.log(`📊 Platform Rating: ${stats.avgOverallRating.toFixed(1)}⭐ overall`);
      console.log(`🎯 Total Impact: ${stats.totalSessions} sessions | ${stats.totalMentees} mentees helped | ${stats.totalReviews} reviews`);
    }

    // Geographic distribution
    const locationStats = await Mentorship.aggregate([
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 },
          availableCount: { $sum: { $cond: [{ $eq: ['$availability.isAvailable', true] }, 1, 0] } },
          locationEnabled: { $sum: { $cond: [{ $eq: ['$location.isLocationEnabled', true] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📍 Geographic Distribution:');
    locationStats.forEach(stat => {
      if (stat._id) {
        console.log(`${stat._id}: ${stat.count} mentors | ${stat.availableCount} available | ${stat.locationEnabled} location-enabled`);
      }
    });

    // Most popular mentors (for Uber-like matching)
    const popularMentors = createdMentorships
      .filter(m => m.availability.isAvailable)
      .sort((a, b) => (b.ratings.overall * b.ratings.totalRatings) - (a.ratings.overall * a.ratings.totalRatings))
      .slice(0, 5);

    console.log('\n🔥 TOP-RATED AVAILABLE MENTORS (For Instant Matching):');
    popularMentors.forEach((mentor, index) => {
      console.log(`${index + 1}. ${mentor.mentor.name} - ${mentor.category}`);
      console.log(`   ⭐ ${mentor.ratings.overall} rating (${mentor.ratings.totalRatings} reviews) | ${mentor.statistics.totalSessions} sessions`);
      console.log(`   💰 ${mentor.pricing.isFree ? 'FREE' : `KES ${mentor.pricing.sessionRate}/session`} | ⚡ ${mentor.instantAvailability.enabled ? 'Instant Available' : 'Scheduled Only'}`);
    });

    // Uber-like availability simulation
    const uberLikeAvailable = createdMentorships.filter(m => 
      m.availability.isAvailable && 
      m.instantAvailability.enabled &&
      m.availability.currentMentees < m.availability.maxMentees
    );

    console.log('\n🚗 UBER-LIKE INSTANT AVAILABILITY:');
    console.log(`🟢 ${uberLikeAvailable.length} mentors available for instant requests right now!`);
    
    if (uberLikeAvailable.length > 0) {
      console.log('\n📲 Ready for instant mentoring:');
      uberLikeAvailable.forEach(mentor => {
        const responseEmoji = mentor.availability.responseTime === 'Within 1 hour' ? '🚀' : 
                            mentor.availability.responseTime === 'Within 4 hours' ? '⚡' : '📅';
        console.log(`   ${responseEmoji} ${mentor.mentor.name} (${mentor.category}) - ${mentor.availability.responseTime}`);
      });
    }

    // System readiness summary
    console.log('\n🎯 MENTORSHIP PLATFORM READINESS:');
    console.log('='.repeat(40));
    console.log(`✅ Total Mentors: ${createdMentorships.length}`);
    console.log(`🟢 Available Now: ${createdMentorships.filter(m => m.availability.isAvailable).length}`);
    console.log(`⚡ Instant Ready: ${uberLikeAvailable.length}`);
    console.log(`🆓 Free Options: ${createdMentorships.filter(m => m.pricing.isFree).length}`);
    console.log(`✅ Verified: ${createdMentorships.filter(m => m.verification.isVerified).length}`);
    console.log(`⭐ Featured: ${createdMentorships.filter(m => m.isFeatured).length}`);
    console.log(`📊 Average Rating: ${(createdMentorships.reduce((sum, m) => sum + m.ratings.overall, 0) / createdMentorships.length).toFixed(1)}⭐`);
    
    console.log('\n🚀 The Uber-like mentorship matching system is ready!');
    console.log('   📱 Mentees can now request instant help');
    console.log('   🔔 Mentors will receive real-time notifications');
    console.log('   ⚡ Average response time: 1-4 hours');
    console.log('   🎯 Multiple categories and expertise levels available');

    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    console.log('🎉 Mentorship ecosystem successfully populated!');
    
  } catch (error) {
    console.error('❌ Error populating mentorship programs:', error);
    process.exit(1);
  }
}

// Run the script
populateMentorships(); 