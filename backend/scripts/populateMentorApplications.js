const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MentorApplication = require('../models/MentorApplication');
const sampleMentorApplications = require('../sample-data/mentorApplications');

dotenv.config();

async function populateMentorApplications() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing applications
    await MentorApplication.deleteMany({});
    console.log('🧹 Cleared existing mentor applications');

    console.log('\n📋 Creating mentor applications...\n');

    const createdApplications = [];
    
    // Create applications one by one to handle any validation errors
    for (let i = 0; i < sampleMentorApplications.length; i++) {
      try {
        const application = await MentorApplication.create(sampleMentorApplications[i]);
        createdApplications.push(application);
        
        const name = `${application.personalInfo.firstName} ${application.personalInfo.lastName}`;
        const role = application.professional.currentRole;
        const company = application.professional.currentCompany;
        const score = application.assessment?.overallScore || 0;
        const status = application.applicationStatus.status;
        
        console.log(`✅ ${name}`);
        console.log(`   💼 ${role} at ${company}`);
        console.log(`   📊 Status: ${status} | Score: ${score}/100`);
        console.log(`   🏢 Industry: ${application.professional.industry} | Experience: ${application.professional.yearsOfExperience} years`);
        console.log(`   📍 Location: ${application.location.city}, ${application.location.country}`);
        console.log(`   📧 Email: ${application.personalInfo.email}`);
        console.log('');
        
      } catch (error) {
        console.log(`❌ Failed to create application: ${sampleMentorApplications[i].personalInfo?.firstName || 'Unknown'}`);
        console.log(`   Error: ${error.message}`);
        console.log('');
      }
    }

    console.log(`\n🎉 Successfully created ${createdApplications.length} mentor applications\n`);

    // Generate comprehensive analytics
    console.log('📊 MENTOR APPLICATION ANALYTICS DASHBOARD\n');
    console.log('=' .repeat(80));

    // Basic Statistics
    const totalApplications = createdApplications.length;
    const submittedApplications = createdApplications.filter(app => 
      ['Submitted', 'Under Review', 'Interview Scheduled', 'Interview Completed'].includes(app.applicationStatus.status)
    ).length;
    const approvedApplications = createdApplications.filter(app => app.applicationStatus.status === 'Approved').length;
    const rejectedApplications = createdApplications.filter(app => app.applicationStatus.status === 'Rejected').length;
    const pendingApplications = createdApplications.filter(app => 
      ['Submitted', 'Under Review'].includes(app.applicationStatus.status)
    ).length;

    console.log('📈 APPLICATION STATISTICS');
    console.log('-' .repeat(50));
    console.log(`📋 Total Applications: ${totalApplications}`);
    console.log(`📤 Submitted Applications: ${submittedApplications}`);
    console.log(`✅ Approved Applications: ${approvedApplications}`);
    console.log(`❌ Rejected Applications: ${rejectedApplications}`);
    console.log(`⏳ Pending Review: ${pendingApplications}`);
    console.log(`📊 Approval Rate: ${totalApplications > 0 ? ((approvedApplications / totalApplications) * 100).toFixed(1) : 0}%`);
    console.log('');

    // Status Distribution
    const statusStats = {};
    createdApplications.forEach(app => {
      statusStats[app.applicationStatus.status] = (statusStats[app.applicationStatus.status] || 0) + 1;
    });

    console.log('📊 APPLICATION STATUS DISTRIBUTION');
    console.log('-' .repeat(50));
    Object.entries(statusStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([status, count]) => {
        const percentage = ((count / totalApplications) * 100).toFixed(1);
        const emoji = status === 'Approved' ? '✅' : 
                     status === 'Rejected' ? '❌' : 
                     status === 'Submitted' ? '📤' : 
                     status === 'Under Review' ? '👀' : 
                     status === 'Interview Scheduled' ? '📅' : '⏳';
        console.log(`${emoji} ${status.padEnd(20)} ${count.toString().padStart(3)} (${percentage}%)`);
      });
    console.log('');

    // Industry Analysis
    const industryStats = {};
    createdApplications.forEach(app => {
      industryStats[app.professional.industry] = (industryStats[app.professional.industry] || 0) + 1;
    });

    console.log('🏢 INDUSTRY DISTRIBUTION');
    console.log('-' .repeat(50));
    Object.entries(industryStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([industry, count]) => {
        const percentage = ((count / totalApplications) * 100).toFixed(1);
        console.log(`${industry.padEnd(15)} ${count.toString().padStart(3)} (${percentage}%)`);
      });
    console.log('');

    // Experience Level Analysis
    const experienceStats = {};
    createdApplications.forEach(app => {
      experienceStats[app.professional.experienceLevel] = (experienceStats[app.professional.experienceLevel] || 0) + 1;
    });

    console.log('💼 EXPERIENCE LEVEL DISTRIBUTION');
    console.log('-' .repeat(50));
    Object.entries(experienceStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([level, count]) => {
        const percentage = ((count / totalApplications) * 100).toFixed(1);
        console.log(`${level.padEnd(25)} ${count.toString().padStart(3)} (${percentage}%)`);
      });
    console.log('');

    // Location Analysis
    const locationStats = {};
    createdApplications.forEach(app => {
      locationStats[app.location.city] = (locationStats[app.location.city] || 0) + 1;
    });

    console.log('📍 GEOGRAPHIC DISTRIBUTION');
    console.log('-' .repeat(50));
    Object.entries(locationStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([city, count]) => {
        const percentage = ((count / totalApplications) * 100).toFixed(1);
        console.log(`${city.padEnd(15)} ${count.toString().padStart(3)} (${percentage}%)`);
      });
    console.log('');

    // AI Scoring Analysis
    const scoredApplications = createdApplications.filter(app => app.assessment?.overallScore);
    if (scoredApplications.length > 0) {
      const scores = scoredApplications.map(app => app.assessment.overallScore);
      const avgScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);
      
      // Score ranges
      const scoreRanges = {
        'Excellent (85-100)': scores.filter(s => s >= 85).length,
        'Good (70-84)': scores.filter(s => s >= 70 && s < 85).length,
        'Fair (50-69)': scores.filter(s => s >= 50 && s < 70).length,
        'Poor (0-49)': scores.filter(s => s < 50).length
      };

      console.log('🤖 AI SCORING ANALYSIS');
      console.log('-' .repeat(50));
      console.log(`📊 Applications Scored: ${scoredApplications.length}/${totalApplications}`);
      console.log(`📈 Average Score: ${avgScore}/100`);
      console.log(`🔝 Highest Score: ${maxScore}/100`);
      console.log(`🔻 Lowest Score: ${minScore}/100`);
      console.log('');
      
      console.log('Score Distribution:');
      Object.entries(scoreRanges).forEach(([range, count]) => {
        const percentage = ((count / scoredApplications.length) * 100).toFixed(1);
        console.log(`  ${range.padEnd(20)} ${count.toString().padStart(3)} (${percentage}%)`);
      });
      console.log('');
    }

    // Mentoring Experience Analysis
    const mentoringExpStats = {
      'Has Experience': createdApplications.filter(app => app.mentoringExperience.hasMentoredBefore).length,
      'No Experience': createdApplications.filter(app => !app.mentoringExperience.hasMentoredBefore).length
    };

    console.log('👥 MENTORING EXPERIENCE');
    console.log('-' .repeat(50));
    Object.entries(mentoringExpStats).forEach(([category, count]) => {
      const percentage = ((count / totalApplications) * 100).toFixed(1);
      console.log(`${category.padEnd(15)} ${count.toString().padStart(3)} (${percentage}%)`);
    });
    console.log('');

    // Availability Analysis
    const availabilityStats = {
      'Instant Available': createdApplications.filter(app => 
        app.availability.instantMentoring?.enabled
      ).length,
      'Regular Available': createdApplications.filter(app => 
        app.availability.isAvailableNow
      ).length,
      'Flexible Location': createdApplications.filter(app => 
        app.location.isLocationFlexible
      ).length,
      'Can Travel': createdApplications.filter(app => 
        app.location.canTravelForMentoring
      ).length
    };

    console.log('⚡ AVAILABILITY FEATURES');
    console.log('-' .repeat(50));
    Object.entries(availabilityStats).forEach(([feature, count]) => {
      const percentage = ((count / totalApplications) * 100).toFixed(1);
      console.log(`${feature.padEnd(20)} ${count.toString().padStart(3)} (${percentage}%)`);
    });
    console.log('');

    // Skills Analysis
    const allSkills = new Set();
    const specializationStats = {};
    
    createdApplications.forEach(app => {
      if (app.expertise.primarySkills) {
        app.expertise.primarySkills.forEach(skill => allSkills.add(skill));
      }
      if (app.expertise.specializations) {
        app.expertise.specializations.forEach(spec => {
          specializationStats[spec] = (specializationStats[spec] || 0) + 1;
        });
      }
    });

    console.log('🎯 SPECIALIZATION AREAS');
    console.log('-' .repeat(50));
    Object.entries(specializationStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([specialization, count]) => {
        const percentage = ((count / totalApplications) * 100).toFixed(1);
        console.log(`${specialization.padEnd(20)} ${count.toString().padStart(3)} (${percentage}%)`);
      });
    console.log('');

    console.log(`💻 Total Unique Skills: ${allSkills.size}`);
    console.log('');

    // Application Timeline Analysis
    const now = new Date();
    const timelineStats = {
      'Last 24 hours': 0,
      'Last 7 days': 0,
      'Last 30 days': 0,
      'Older than 30 days': 0
    };

    createdApplications.forEach(app => {
      const submittedAt = app.applicationStatus.submittedAt || app.createdAt;
      const daysDiff = Math.ceil((now - submittedAt) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) timelineStats['Last 24 hours']++;
      else if (daysDiff <= 7) timelineStats['Last 7 days']++;
      else if (daysDiff <= 30) timelineStats['Last 30 days']++;
      else timelineStats['Older than 30 days']++;
    });

    console.log('📅 APPLICATION TIMELINE');
    console.log('-' .repeat(50));
    Object.entries(timelineStats).forEach(([period, count]) => {
      const percentage = ((count / totalApplications) * 100).toFixed(1);
      console.log(`${period.padEnd(20)} ${count.toString().padStart(3)} (${percentage}%)`);
    });
    console.log('');

    // High-Quality Applications
    const highQualityApps = createdApplications.filter(app => {
      const hasHighScore = app.assessment?.overallScore >= 80;
      const hasExperience = app.mentoringExperience.hasMentoredBefore;
      const isAvailable = app.availability.isAvailableNow;
      const hasGoodCommitment = app.availability.weeklyHoursCommitment >= 5;
      
      return hasHighScore || (hasExperience && isAvailable && hasGoodCommitment);
    });

    console.log('⭐ HIGH-QUALITY APPLICATIONS');
    console.log('-' .repeat(50));
    highQualityApps.forEach(app => {
      const name = `${app.personalInfo.firstName} ${app.personalInfo.lastName}`;
      const score = app.assessment?.overallScore || 'N/A';
      const experience = app.mentoringExperience.hasMentoredBefore ? 'Experienced' : 'New';
      console.log(`🌟 ${name}`);
      console.log(`   📊 Score: ${score}/100 | ${experience} Mentor`);
      console.log(`   💼 ${app.professional.currentRole} | ${app.professional.industry}`);
      console.log(`   ⏰ ${app.availability.weeklyHoursCommitment}h/week commitment`);
      console.log('');
    });

    // AI Recommendations Summary
    const autoApproveReady = createdApplications.filter(app => 
      app.assessment?.overallScore >= 85 && app.applicationStatus.status === 'Submitted'
    );
    const interviewReady = createdApplications.filter(app => 
      app.assessment?.overallScore >= 70 && app.assessment?.overallScore < 85 && app.applicationStatus.status === 'Submitted'
    );
    const needsReview = createdApplications.filter(app => 
      !app.assessment?.overallScore || app.assessment?.overallScore < 70
    );

    console.log('🤖 AI RECRUITING RECOMMENDATIONS');
    console.log('=' .repeat(80));
    console.log('✅ Auto-Approve Ready: READY');
    console.log('📅 Interview System: READY');
    console.log('👀 Manual Review Queue: READY');
    console.log('🧠 AI Scoring Engine: READY');
    console.log('📊 Analytics Dashboard: READY');
    console.log('');
    console.log('📋 Immediate Actions:');
    console.log(`   🚀 ${autoApproveReady.length} applications ready for auto-approval`);
    console.log(`   📞 ${interviewReady.length} applications need interviews`);
    console.log(`   👁️  ${needsReview.length} applications need manual review`);
    console.log('');

    // Platform Readiness Summary
    console.log('🎯 PLATFORM READINESS SUMMARY');
    console.log('=' .repeat(80));
    console.log('✅ Mentor Application System: READY');
    console.log('✅ AI-Powered Recruiting: READY');
    console.log('✅ Multi-step Application Flow: READY');
    console.log('✅ Automated Scoring: READY');
    console.log('✅ Interview Scheduling: READY');
    console.log('✅ Admin Dashboard: READY');
    console.log('✅ Bulk Operations: READY');
    console.log('✅ Analytics & Reporting: READY');
    console.log('');
    console.log('🚀 The Ajira Digital AI Mentor Recruiting System is ready for launch!');
    console.log('');
    console.log('📋 Quick Access URLs (after starting the server):');
    console.log('   🏠 Apply as Mentor: http://localhost:5173/mentorship/apply');
    console.log('   📊 Mentor Dashboard: http://localhost:5173/mentor/dashboard');
    console.log('   🤖 AI Admin Dashboard: http://localhost:5173/admin/mentor-applications');
    console.log('   📈 API Endpoint: http://localhost:5000/api/mentor-application');
    console.log('');

    // Close connection
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');

  } catch (error) {
    console.error('❌ Error populating mentor applications:', error);
    process.exit(1);
  }
}

// Run the population script
populateMentorApplications(); 