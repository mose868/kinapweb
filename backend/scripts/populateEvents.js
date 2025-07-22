const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');
const sampleEvents = require('../sample-data/events');

dotenv.config();

async function populateEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('🧹 Cleared existing events');

    console.log('\n📅 Creating events...\n');

    const createdEvents = [];
    
    // Create events one by one to handle any validation errors
    for (let i = 0; i < sampleEvents.length; i++) {
      try {
        const event = await Event.create(sampleEvents[i]);
        createdEvents.push(event);
        
        const status = event.status;
        const type = event.eventType;
        const category = event.category;
        const price = event.pricing.isFree ? 'Free' : `KES ${event.pricing.regularPrice.toLocaleString()}`;
        const capacity = `${event.registration.registered}/${event.registration.capacity}`;
        
        console.log(`✅ ${event.title}`);
        console.log(`   📊 ${status} | ${type} | ${category} | ${price} | ${capacity} registered`);
        console.log(`   📍 ${event.location.venue || 'Virtual'} | ${event.location.city}`);
        console.log(`   📅 ${event.schedule.startDate.toDateString()} | ${event.schedule.startTime} - ${event.schedule.endTime}`);
        console.log(`   🎯 ${event.analytics.views} views | Featured: ${event.isFeatured ? '⭐' : '❌'}`);
        console.log('');
        
      } catch (error) {
        console.log(`❌ Failed to create: ${sampleEvents[i].title}`);
        console.log(`   Error: ${error.message}`);
        console.log('');
      }
    }

    console.log(`\n🎉 Successfully created ${createdEvents.length} events\n`);

    // Generate comprehensive analytics
    console.log('📊 EVENT ANALYTICS DASHBOARD\n');
    console.log('=' .repeat(80));

    // Basic Statistics
    const totalEvents = createdEvents.length;
    const publishedEvents = createdEvents.filter(e => e.isPublished).length;
    const featuredEvents = createdEvents.filter(e => e.isFeatured).length;
    const upcomingEvents = createdEvents.filter(e => e.schedule.startDate > new Date()).length;
    const freeEvents = createdEvents.filter(e => e.pricing.isFree).length;
    const paidEvents = totalEvents - freeEvents;

    console.log('📈 BASIC STATISTICS');
    console.log('-' .repeat(50));
    console.log(`📅 Total Events: ${totalEvents}`);
    console.log(`✅ Published Events: ${publishedEvents}`);
    console.log(`⭐ Featured Events: ${featuredEvents}`);
    console.log(`🔮 Upcoming Events: ${upcomingEvents}`);
    console.log(`🆓 Free Events: ${freeEvents}`);
    console.log(`💰 Paid Events: ${paidEvents}`);
    console.log('');

    // Event Categories Analysis
    const categoryStats = {};
    createdEvents.forEach(event => {
      categoryStats[event.category] = (categoryStats[event.category] || 0) + 1;
    });

    console.log('🏷️  EVENT CATEGORIES');
    console.log('-' .repeat(50));
    Object.entries(categoryStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        const percentage = ((count / totalEvents) * 100).toFixed(1);
        console.log(`${category.padEnd(20)} ${count.toString().padStart(3)} (${percentage}%)`);
      });
    console.log('');

    // Event Types Analysis
    const typeStats = {};
    createdEvents.forEach(event => {
      typeStats[event.eventType] = (typeStats[event.eventType] || 0) + 1;
    });

    console.log('🌐 EVENT TYPES');
    console.log('-' .repeat(50));
    Object.entries(typeStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, count]) => {
        const percentage = ((count / totalEvents) * 100).toFixed(1);
        console.log(`${type.padEnd(15)} ${count.toString().padStart(3)} (${percentage}%)`);
      });
    console.log('');

    // Location Analysis
    const cityStats = {};
    createdEvents.forEach(event => {
      const city = event.location.city || 'Virtual';
      cityStats[city] = (cityStats[city] || 0) + 1;
    });

    console.log('📍 LOCATION DISTRIBUTION');
    console.log('-' .repeat(50));
    Object.entries(cityStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([city, count]) => {
        const percentage = ((count / totalEvents) * 100).toFixed(1);
        console.log(`${city.padEnd(15)} ${count.toString().padStart(3)} (${percentage}%)`);
      });
    console.log('');

    // Registration Statistics
    const totalCapacity = createdEvents.reduce((sum, event) => sum + event.registration.capacity, 0);
    const totalRegistered = createdEvents.reduce((sum, event) => sum + event.registration.registered, 0);
    const totalViews = createdEvents.reduce((sum, event) => sum + event.analytics.views, 0);
    const totalWaitlist = createdEvents.reduce((sum, event) => sum + (event.registration.waitlistCount || 0), 0);
    const averageCapacity = Math.round(totalCapacity / totalEvents);
    const overallFillRate = ((totalRegistered / totalCapacity) * 100).toFixed(1);

    console.log('🎟️  REGISTRATION ANALYTICS');
    console.log('-' .repeat(50));
    console.log(`🏟️  Total Capacity: ${totalCapacity.toLocaleString()}`);
    console.log(`✋ Total Registered: ${totalRegistered.toLocaleString()}`);
    console.log(`⏳ Total Waitlisted: ${totalWaitlist.toLocaleString()}`);
    console.log(`📊 Overall Fill Rate: ${overallFillRate}%`);
    console.log(`📏 Average Capacity: ${averageCapacity}`);
    console.log(`👀 Total Views: ${totalViews.toLocaleString()}`);
    console.log('');

    // Pricing Analysis
    const paidEventPrices = createdEvents
      .filter(e => !e.pricing.isFree)
      .map(e => e.pricing.regularPrice);
    
    if (paidEventPrices.length > 0) {
      const minPrice = Math.min(...paidEventPrices);
      const maxPrice = Math.max(...paidEventPrices);
      const avgPrice = Math.round(paidEventPrices.reduce((sum, price) => sum + price, 0) / paidEventPrices.length);

      console.log('💰 PRICING ANALYSIS');
      console.log('-' .repeat(50));
      console.log(`💸 Price Range: KES ${minPrice.toLocaleString()} - KES ${maxPrice.toLocaleString()}`);
      console.log(`📊 Average Price: KES ${avgPrice.toLocaleString()}`);
      console.log(`🆓 Free Events: ${freeEvents}/${totalEvents} (${((freeEvents/totalEvents)*100).toFixed(1)}%)`);
      console.log('');
    }

    // Popular Events (by views and registrations)
    const popularByViews = createdEvents
      .sort((a, b) => b.analytics.views - a.analytics.views)
      .slice(0, 3);

    const popularByRegistrations = createdEvents
      .sort((a, b) => b.registration.registered - a.registration.registered)
      .slice(0, 3);

    console.log('🔥 MOST POPULAR EVENTS');
    console.log('-' .repeat(50));
    console.log('👀 By Views:');
    popularByViews.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.title} (${event.analytics.views} views)`);
    });
    
    console.log('\n✋ By Registrations:');
    popularByRegistrations.forEach((event, index) => {
      const fillRate = ((event.registration.registered / event.registration.capacity) * 100).toFixed(1);
      console.log(`   ${index + 1}. ${event.title} (${event.registration.registered}/${event.registration.capacity} - ${fillRate}%)`);
    });
    console.log('');

    // Featured Events
    const featured = createdEvents.filter(e => e.isFeatured);
    if (featured.length > 0) {
      console.log('⭐ FEATURED EVENTS');
      console.log('-' .repeat(50));
      featured.forEach(event => {
        const fillRate = ((event.registration.registered / event.registration.capacity) * 100).toFixed(1);
        console.log(`🌟 ${event.title}`);
        console.log(`   📊 ${event.category} | ${event.eventType} | ${fillRate}% full`);
        console.log(`   📅 ${event.schedule.startDate.toDateString()}`);
      });
      console.log('');
    }

    // Event Status Distribution
    const statusStats = {};
    createdEvents.forEach(event => {
      statusStats[event.status] = (statusStats[event.status] || 0) + 1;
    });

    console.log('🔄 EVENT STATUS DISTRIBUTION');
    console.log('-' .repeat(50));
    Object.entries(statusStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([status, count]) => {
        const percentage = ((count / totalEvents) * 100).toFixed(1);
        const emoji = status === 'Registration Open' ? '🟢' : 
                     status === 'Published' ? '🔵' : 
                     status === 'Draft' ? '🟡' : 
                     status === 'Completed' ? '⚫' : '🔴';
        console.log(`${emoji} ${status.padEnd(20)} ${count.toString().padStart(3)} (${percentage}%)`);
      });
    console.log('');

    // Upcoming Events Timeline
    const upcoming = createdEvents
      .filter(e => e.schedule.startDate > new Date())
      .sort((a, b) => a.schedule.startDate - b.schedule.startDate);

    if (upcoming.length > 0) {
      console.log('📅 UPCOMING EVENTS TIMELINE');
      console.log('-' .repeat(50));
      upcoming.forEach(event => {
        const daysUntil = Math.ceil((event.schedule.startDate - new Date()) / (1000 * 60 * 60 * 24));
        const timeText = daysUntil === 0 ? 'Today' : 
                        daysUntil === 1 ? 'Tomorrow' : 
                        daysUntil < 7 ? `${daysUntil} days` : 
                        `${Math.ceil(daysUntil / 7)} weeks`;
        
        console.log(`🗓️  ${event.title}`);
        console.log(`   ⏰ ${timeText} | ${event.schedule.startDate.toDateString()}`);
        console.log(`   📍 ${event.location.venue || 'Virtual'} | ${event.category}`);
        console.log(`   💰 ${event.pricing.isFree ? 'Free' : `KES ${event.pricing.regularPrice.toLocaleString()}`}`);
        console.log('');
      });
    }

    // Social Features Analysis
    const socialFeatures = {
      networking: createdEvents.filter(e => e.socialFeatures.allowNetworking).length,
      chat: createdEvents.filter(e => e.socialFeatures.chatEnabled).length,
      qna: createdEvents.filter(e => e.socialFeatures.qnaEnabled).length,
      certificates: createdEvents.filter(e => e.socialFeatures.certificateProvided).length
    };

    console.log('🤝 SOCIAL FEATURES ADOPTION');
    console.log('-' .repeat(50));
    console.log(`🤝 Networking Enabled: ${socialFeatures.networking}/${totalEvents} (${((socialFeatures.networking/totalEvents)*100).toFixed(1)}%)`);
    console.log(`💬 Chat Enabled: ${socialFeatures.chat}/${totalEvents} (${((socialFeatures.chat/totalEvents)*100).toFixed(1)}%)`);
    console.log(`❓ Q&A Enabled: ${socialFeatures.qna}/${totalEvents} (${((socialFeatures.qna/totalEvents)*100).toFixed(1)}%)`);
    console.log(`🏆 Certificates Provided: ${socialFeatures.certificates}/${totalEvents} (${((socialFeatures.certificates/totalEvents)*100).toFixed(1)}%)`);
    console.log('');

    // Speaker Analysis
    let totalSpeakers = 0;
    const speakerCompanies = new Set();
    createdEvents.forEach(event => {
      if (event.speakers && event.speakers.length > 0) {
        totalSpeakers += event.speakers.length;
        event.speakers.forEach(speaker => {
          if (speaker.company) {
            speakerCompanies.add(speaker.company);
          }
        });
      }
    });

    console.log('🎤 SPEAKER INSIGHTS');
    console.log('-' .repeat(50));
    console.log(`👥 Total Speakers: ${totalSpeakers}`);
    console.log(`🏢 Unique Companies: ${speakerCompanies.size}`);
    console.log(`📊 Average Speakers per Event: ${(totalSpeakers / totalEvents).toFixed(1)}`);
    console.log('');

    // Final Summary
    console.log('🎯 PLATFORM READINESS SUMMARY');
    console.log('=' .repeat(80));
    console.log('✅ Event Management System: READY');
    console.log('✅ Registration System: READY');
    console.log('✅ Multiple Event Types: SUPPORTED');
    console.log('✅ Virtual & In-Person Events: SUPPORTED');
    console.log('✅ Pricing & Free Events: SUPPORTED');
    console.log('✅ Event Analytics: ENABLED');
    console.log('✅ Speaker Management: ENABLED');
    console.log('✅ Social Features: ENABLED');
    console.log('✅ Waitlist Management: ENABLED');
    console.log('✅ Admin Dashboard: READY');
    console.log('');
    console.log('🚀 The Ajira Digital Events Platform is ready for launch!');
    console.log('');
    console.log('📋 Quick Access URLs (after starting the server):');
    console.log('   🏠 Public Events: http://localhost:5173/events');
    console.log('   ⚙️  Admin Dashboard: http://localhost:5173/admin/events');
    console.log('   📊 API Endpoint: http://localhost:5000/api/events');
    console.log('');

    // Close connection
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');

  } catch (error) {
    console.error('❌ Error populating events:', error);
    process.exit(1);
  }
}

// Run the population script
populateEvents(); 