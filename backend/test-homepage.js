const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000';

async function testHomePage() {
  console.log('🧪 Testing Home Page API...\n');
  
  try {
    // 1. Test getting home page content
    console.log('1. Testing GET /api/homepage...');
    const homeResponse = await fetch(`${API_BASE_URL}/api/homepage`);
    
    if (homeResponse.ok) {
      const homeData = await homeResponse.json();
      console.log('✅ Home page data fetched successfully');
      console.log(`   Hero Title: ${homeData.heroTitle}`);
      console.log(`   Stats - Students Trained: ${homeData.stats.studentsTrained}`);
      console.log(`   Features Count: ${homeData.features.length}`);
      console.log(`   Testimonials Count: ${homeData.testimonials.length}`);
      console.log(`   News Items Count: ${homeData.newsItems.length}`);
      console.log(`   Programs Count: ${homeData.programs.length}`);
      console.log(`   Partners Count: ${homeData.partners.length}`);
    } else {
      console.log('❌ Failed to fetch home page data');
    }

    // 2. Test getting featured content
    console.log('\n2. Testing GET /api/homepage/featured...');
    const featuredResponse = await fetch(`${API_BASE_URL}/api/homepage/featured`);
    
    if (featuredResponse.ok) {
      const featuredData = await featuredResponse.json();
      console.log('✅ Featured content fetched successfully');
      console.log(`   Featured Testimonials: ${featuredData.testimonials.length}`);
      console.log(`   Featured News: ${featuredData.news.length}`);
      console.log(`   Featured Programs: ${featuredData.programs.length}`);
      console.log(`   Featured Partners: ${featuredData.partners.length}`);
    } else {
      console.log('❌ Failed to fetch featured content');
    }

    // 3. Test getting stats
    console.log('\n3. Testing GET /api/homepage/stats...');
    const statsResponse = await fetch(`${API_BASE_URL}/api/homepage/stats`);
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Stats fetched successfully');
      console.log(`   View Count: ${statsData.viewCount}`);
      console.log(`   Students Trained: ${statsData.stats.studentsTrained}`);
      console.log(`   Success Stories: ${statsData.stats.successStories}`);
    } else {
      console.log('❌ Failed to fetch stats');
    }

    // 4. Test getting analytics (should fail without admin auth)
    console.log('\n4. Testing GET /api/homepage/analytics (should fail without auth)...');
    const analyticsResponse = await fetch(`${API_BASE_URL}/api/homepage/analytics`);
    
    if (analyticsResponse.status === 401) {
      console.log('✅ Analytics endpoint properly protected (requires admin auth)');
    } else {
      console.log('⚠️ Analytics endpoint may not be properly protected');
    }

    console.log('\n🎉 Home page API tests completed!');
    console.log('\n📋 Available endpoints:');
    console.log('   GET /api/homepage - Get home page content');
    console.log('   GET /api/homepage/featured - Get featured content');
    console.log('   GET /api/homepage/stats - Get statistics');
    console.log('   GET /api/homepage/analytics - Get analytics (admin only)');
    console.log('   PUT /api/homepage - Update home page (admin only)');
    console.log('   PUT /api/homepage/section/:section - Update specific section (admin only)');
    console.log('   POST /api/homepage/testimonials - Add testimonial (admin only)');
    console.log('   PUT /api/homepage/testimonials/:id - Update testimonial (admin only)');
    console.log('   DELETE /api/homepage/testimonials/:id - Delete testimonial (admin only)');
    console.log('   POST /api/homepage/news - Add news item (admin only)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testHomePage(); 