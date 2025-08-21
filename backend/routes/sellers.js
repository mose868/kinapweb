const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
const SellerProfile = require('../models/SellerProfile');
const Booking = require('../models/Booking');
const { User } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/sellers');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for videos
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profileImage') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for profile picture'));
      }
    } else if (file.fieldname === 'showcaseVideo') {
      if (file.mimetype.startsWith('video/')) {
        cb(null, true);
      } else {
        cb(new Error('Only video files are allowed for showcase video'));
      }
    } else {
      cb(null, true);
    }
  }
});

// Enhanced AI Content Analysis Service
const analyzeContent = async (profileData, files = {}) => {
  console.log('🤖 Starting enhanced AI content analysis...');
  
  try {
    // Parse JSON fields safely
    const portfolio = JSON.parse(profileData.portfolio || '[]');
    const services = JSON.parse(profileData.services || '[]');
    const skills = JSON.parse(profileData.skills || '[]');
    const education = JSON.parse(profileData.education || '[]');
    const certifications = JSON.parse(profileData.certifications || '[]');
    const languages = JSON.parse(profileData.languages || '["English"]');
    
    // Analyze text content comprehensively
    const textContent = [
      profileData.bio || '',
      profileData.businessDescription || '',
      profileData.uniqueSellingPoint || '',
      profileData.professionalTitle || '',
      ...portfolio.map(p => (p.description || '') + ' ' + (p.title || '')),
      ...services.map(s => (s.description || '') + ' ' + (s.name || ''))
    ].join(' ').toLowerCase();
    
    // Initialize scoring
    let contentQuality = 30; // Base score
    let aiScore = 30;
    const recommendations = [];
    const strengths = [];
    
    // === Content Quality Analysis ===
    
    // 1. Content Length & Detail (25 points)
    const contentLength = textContent.length;
    if (contentLength > 2000) {
      contentQuality += 25;
      strengths.push('Comprehensive and detailed profile content');
    } else if (contentLength > 1000) {
      contentQuality += 20;
      strengths.push('Good amount of detail in profile');
    } else if (contentLength > 500) {
      contentQuality += 15;
    } else if (contentLength > 200) {
      contentQuality += 10;
      recommendations.push('Add more detailed descriptions to your bio, services, and portfolio items');
    } else {
      recommendations.push('Your profile needs much more detail. Add comprehensive descriptions, portfolio details, and service information');
    }
    
    // 2. Professional Language Analysis (20 points)
    const professionalKeywords = [
      'experience', 'expertise', 'professional', 'certified', 'skilled', 'proficient',
      'quality', 'deliver', 'client', 'project', 'solution', 'innovative', 'creative',
      'efficient', 'reliable', 'results', 'success', 'achievement', 'accomplished',
      'dedicated', 'passionate', 'committed', 'strategic', 'analytical', 'detail-oriented'
    ];
    
    const keywordMatches = professionalKeywords.filter(keyword => 
      textContent.includes(keyword)
    );
    const keywordScore = Math.min(keywordMatches.length * 2, 20);
    contentQuality += keywordScore;
    
    if (keywordScore >= 15) {
      strengths.push('Professional and compelling language used throughout');
    } else if (keywordScore < 10) {
      recommendations.push('Use more professional keywords to highlight your expertise and achievements');
    }
    
    // 3. Industry-Specific Analysis (15 points)
    const industryKeywords = {
      'web-development': ['react', 'vue', 'angular', 'javascript', 'html', 'css', 'node', 'api', 'responsive', 'frontend', 'backend'],
      'mobile-development': ['ios', 'android', 'react native', 'flutter', 'swift', 'kotlin', 'mobile app', 'responsive'],
      'graphic-design': ['photoshop', 'illustrator', 'design', 'creative', 'visual', 'branding', 'logo', 'ui', 'ux'],
      'digital-marketing': ['seo', 'sem', 'social media', 'marketing', 'analytics', 'campaigns', 'conversion'],
      'content-writing': ['writing', 'content', 'copywriting', 'blog', 'seo', 'articles', 'storytelling']
    };
    
    let industryRelevance = 0;
    Object.entries(industryKeywords).forEach(([category, keywords]) => {
      const matches = keywords.filter(keyword => textContent.includes(keyword));
      if (matches.length > 0) {
        industryRelevance = Math.max(industryRelevance, Math.min(matches.length * 3, 15));
      }
    });
    
    contentQuality += industryRelevance;
    if (industryRelevance >= 10) {
      strengths.push('Strong industry-specific expertise demonstrated');
    } else {
      recommendations.push('Include more industry-specific terms and technologies in your descriptions');
    }
    
    // 4. Portfolio Quality (10 points)
    if (portfolio.length >= 5) {
      contentQuality += 10;
      strengths.push('Excellent portfolio showcasing diverse projects');
    } else if (portfolio.length >= 3) {
      contentQuality += 8;
      strengths.push('Good portfolio demonstrating your capabilities');
    } else if (portfolio.length >= 1) {
      contentQuality += 5;
      recommendations.push('Add more portfolio items to better showcase your range of skills');
    } else {
      recommendations.push('Create portfolio items to demonstrate your work and capabilities');
    }
    
    // === Overall AI Score Calculation ===
    aiScore = contentQuality;
    
    // 5. Profile Completeness (20 points)
    const completenessFactors = [
      { field: 'bio', weight: 4, check: () => (profileData.bio || '').length > 100 },
      { field: 'professionalTitle', weight: 3, check: () => !!(profileData.professionalTitle || '').trim() },
      { field: 'skills', weight: 3, check: () => skills.length >= 3 },
      { field: 'experience', weight: 2, check: () => !!(profileData.experience || '').trim() },
      { field: 'services', weight: 3, check: () => services.length >= 1 },
      { field: 'portfolio', weight: 3, check: () => portfolio.length >= 1 },
      { field: 'languages', weight: 1, check: () => languages.length >= 1 },
      { field: 'education', weight: 1, check: () => education.length >= 0 } // Optional
    ];
    
    const completenessScore = completenessFactors.reduce((score, factor) => {
      return score + (factor.check() ? factor.weight : 0);
    }, 0);
    
    aiScore += completenessScore;
    
    // 6. Media & Visual Elements (10 points)
    if (profileData.hasShowcaseVideo || files.showcaseVideo) {
      aiScore += 6;
      strengths.push('Professional showcase video enhances your profile');
    } else {
      recommendations.push('Upload a showcase video to significantly boost your profile appeal and client trust');
    }
    
    if (profileData.hasProfileImage || files.profileImage) {
      aiScore += 4;
      strengths.push('Professional profile image adds credibility');
    } else {
      recommendations.push('Upload a professional profile picture to build trust with potential clients');
    }
    
    // 7. Service Structure (10 points)
    if (services.length >= 3) {
      aiScore += 10;
      strengths.push('Well-structured service offerings with multiple packages');
    } else if (services.length >= 1) {
      aiScore += 6;
      recommendations.push('Create additional service packages to offer clients more options');
    } else {
      recommendations.push('Define clear service packages with pricing and delivery timeframes');
    }
    
    // === Advanced Analysis ===
    
    // Check for unique selling propositions
    const uspIndicators = ['unique', 'different', 'special', 'exclusive', 'custom', 'personalized'];
    const hasUSP = uspIndicators.some(indicator => textContent.includes(indicator));
    if (hasUSP) {
      aiScore += 5;
      strengths.push('Clear unique selling proposition identified');
    } else {
      recommendations.push('Clearly articulate what makes you unique compared to other sellers');
    }
    
    // Check for client focus
    const clientFocusTerms = ['client', 'customer', 'satisfaction', 'needs', 'requirements', 'goals'];
    const clientFocusScore = clientFocusTerms.filter(term => textContent.includes(term)).length;
    if (clientFocusScore >= 3) {
      aiScore += 3;
      strengths.push('Client-focused approach clearly communicated');
    } else {
      recommendations.push('Emphasize your client-focused approach and commitment to meeting their needs');
    }
    
    // Grammar and readability check (basic)
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = textContent.length / Math.max(sentences.length, 1);
    if (avgSentenceLength > 20 && avgSentenceLength < 100) {
      aiScore += 2;
    } else if (avgSentenceLength > 150) {
      recommendations.push('Break down long sentences to improve readability');
    }
    
    // Clamp scores to realistic ranges
    aiScore = Math.max(35, Math.min(100, Math.round(aiScore)));
    contentQuality = Math.max(30, Math.min(100, Math.round(contentQuality)));
    
    // Generate overall recommendations based on score
    if (aiScore >= 90) {
      recommendations.unshift('🌟 Exceptional profile! You\'re ready to attract premium clients');
    } else if (aiScore >= 80) {
      recommendations.unshift('🚀 Great profile! Minor improvements will make it outstanding');
    } else if (aiScore >= 70) {
      recommendations.unshift('👍 Good foundation! Follow the suggestions to reach the next level');
    } else if (aiScore >= 60) {
      recommendations.unshift('📈 Decent start! Several improvements needed for better results');
    } else {
      recommendations.unshift('🔧 Significant improvements needed to create a competitive profile');
    }
    
    // Marketplace readiness assessment
    const marketplaceReadiness = aiScore >= 75 && contentQuality >= 70 && portfolio.length >= 1;
    
    const result = {
      aiScore,
      contentQuality,
      recommendations: recommendations.slice(0, 8), // Limit to top 8 recommendations
      strengths: strengths.slice(0, 5), // Limit to top 5 strengths
      marketplaceReadiness,
      analysis: {
        contentLength,
        keywordMatches: keywordMatches.length,
        portfolioItems: portfolio.length,
        servicePackages: services.length,
        completenessScore,
        industryRelevance
      }
    };
    
    console.log('✅ Enhanced AI analysis completed:', result);
    return result;
    
  } catch (error) {
    console.error('❌ AI Analysis Error:', error);
    throw new Error('AI analysis failed: ' + error.message);
  }
};

// AI Content Analysis API endpoint
router.post('/analyze-content', auth, async (req, res) => {
  try {
    console.log('📊 AI Analysis API called');
    
    const analysisResult = await analyzeContent(req.body, {});
    
    res.json({
      success: true,
      message: 'AI analysis completed successfully',
      aiScore: analysisResult.aiScore,
      contentQuality: analysisResult.contentQuality,
      recommendations: analysisResult.recommendations,
      strengths: analysisResult.strengths || [],
      marketplaceReadiness: analysisResult.marketplaceReadiness,
      analysis: analysisResult.analysis
    });
    
  } catch (error) {
    console.error('❌ AI Analysis API Error:', error);
    res.status(500).json({
      success: false,
      message: 'AI analysis failed',
      error: error.message
    });
  }
});

// Create seller profile
router.post('/create-profile', auth, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'showcaseVideo', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('📝 Creating seller profile...');
    
    const {
      fullName,
      professionalTitle,
      bio,
      location,
      languages,
      skills,
      experience,
      education,
      certifications,
      portfolio,
      services,
      hourlyRate,
      availability,
      responseTime,
      websiteUrl,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      businessDescription,
      uniqueSellingPoint,
      targetAudience
    } = req.body;
    
    // Use authenticated user's ID
    const sellerId = req.user.id;
    
    // Check if seller profile already exists
    const existingProfile = await SellerProfile.findOne({ where: { sellerId } });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Seller profile already exists'
      });
    }
    
    // Process uploaded files
    const files = req.files || {};
    let profileImageUrl = '';
    let showcaseVideoUrl = '';
    
    if (files.profileImage && files.profileImage[0]) {
      profileImageUrl = `/uploads/sellers/${files.profileImage[0].filename}`;
    }
    
    if (files.showcaseVideo && files.showcaseVideo[0]) {
      showcaseVideoUrl = `/uploads/sellers/${files.showcaseVideo[0].filename}`;
    }
    
    // Perform AI analysis
    const aiAnalysis = await analyzeContent(req.body, files);
    
    // Create seller profile
    const sellerProfile = await SellerProfile.create({
      sellerId,
      fullName,
      professionalTitle,
      bio,
      profileImageUrl,
      location,
      languages: JSON.parse(languages || '["English"]'),
      skills: JSON.parse(skills || '[]'),
      experience,
      education: JSON.parse(education || '[]'),
      certifications: JSON.parse(certifications || '[]'),
      portfolio: JSON.parse(portfolio || '[]'),
      showcaseVideoUrl,
      services: JSON.parse(services || '[]'),
      hourlyRate: parseFloat(hourlyRate) || 25,
      availability,
      responseTime,
      websiteUrl,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      businessDescription,
      uniqueSellingPoint,
      targetAudience,
      aiScore: aiAnalysis.aiScore,
      contentQuality: aiAnalysis.contentQuality,
      marketplaceReadiness: aiAnalysis.marketplaceReadiness,
      aiRecommendations: aiAnalysis.recommendations,
      status: aiAnalysis.marketplaceReadiness ? 'approved' : 'pending-review'
    });
    
    // Update profile completeness
    sellerProfile.updateProfileCompleteness();
    await sellerProfile.save();
    
    console.log('✅ Seller profile created successfully');
    
    res.json({
      success: true,
      message: 'Seller profile created successfully',
      sellerId: sellerProfile.sellerId,
      profile: sellerProfile,
      aiAnalysis
    });
    
  } catch (error) {
    console.error('❌ Error creating seller profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create seller profile',
      error: error.message
    });
  }
});

// Get seller profile
router.get('/profile/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    const profile = await SellerProfile.findOne({
      where: { sellerId }
    });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }
    
    // Increment views
    await profile.incrementViews();
    
    res.json({
      success: true,
      profile
    });
    
  } catch (error) {
    console.error('❌ Error fetching seller profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch seller profile',
      error: error.message
    });
  }
});

// Update seller profile
router.put('/profile/:sellerId', auth, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'showcaseVideo', maxCount: 1 }
]), async (req, res) => {
  try {
    const { sellerId } = req.params;
    
    const profile = await SellerProfile.findOne({ where: { sellerId } });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }
    
    // Process updated files
    const files = req.files || {};
    const updateData = { ...req.body };
    
    if (files.profileImage && files.profileImage[0]) {
      updateData.profileImageUrl = `/uploads/sellers/${files.profileImage[0].filename}`;
    }
    
    if (files.showcaseVideo && files.showcaseVideo[0]) {
      updateData.showcaseVideoUrl = `/uploads/sellers/${files.showcaseVideo[0].filename}`;
    }
    
    // Parse JSON fields
    if (updateData.languages) updateData.languages = JSON.parse(updateData.languages);
    if (updateData.skills) updateData.skills = JSON.parse(updateData.skills);
    if (updateData.education) updateData.education = JSON.parse(updateData.education);
    if (updateData.certifications) updateData.certifications = JSON.parse(updateData.certifications);
    if (updateData.portfolio) updateData.portfolio = JSON.parse(updateData.portfolio);
    if (updateData.services) updateData.services = JSON.parse(updateData.services);
    
    // Re-analyze content
    const aiAnalysis = await analyzeContent(updateData, files);
    updateData.aiScore = aiAnalysis.aiScore;
    updateData.contentQuality = aiAnalysis.contentQuality;
    updateData.marketplaceReadiness = aiAnalysis.marketplaceReadiness;
    updateData.aiRecommendations = aiAnalysis.recommendations;
    
    // Update profile
    await profile.update(updateData);
    
    // Update completeness
    profile.updateProfileCompleteness();
    await profile.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile,
      aiAnalysis
    });
    
  } catch (error) {
    console.error('❌ Error updating seller profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update seller profile',
      error: error.message
    });
  }
});

// Search sellers
router.get('/search', async (req, res) => {
  try {
    const {
      q: query,
      skills,
      experience,
      minRate,
      maxRate,
      location,
      availability,
      page = 1,
      limit = 20
    } = req.query;
    
    const filters = {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    };
    
    if (skills) {
      filters.skills = skills.split(',');
    }
    
    if (experience) {
      filters.experience = experience;
    }
    
    if (minRate && maxRate) {
      filters.minRate = parseFloat(minRate);
      filters.maxRate = parseFloat(maxRate);
    }
    
    if (location) {
      filters.location = location;
    }
    
    const sellers = await SellerProfile.searchSellers(query, filters);
    
    // Get total count for pagination
    const totalCount = await SellerProfile.count({
      where: {
        status: 'approved',
        marketplaceReadiness: true
      }
    });
    
    res.json({
      success: true,
      sellers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('❌ Error searching sellers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search sellers',
      error: error.message
    });
  }
});

// Get featured sellers
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    
    const featuredSellers = await SellerProfile.getFeaturedSellers(parseInt(limit));
    
    res.json({
      success: true,
      sellers: featuredSellers
    });
    
  } catch (error) {
    console.error('❌ Error fetching featured sellers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured sellers',
      error: error.message
    });
  }
});

// Get top sellers
router.get('/top', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const topSellers = await SellerProfile.getTopSellers(parseInt(limit));
    
    res.json({
      success: true,
      sellers: topSellers
    });
    
  } catch (error) {
    console.error('❌ Error fetching top sellers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top sellers',
      error: error.message
    });
  }
});

// Create booking
router.post('/book/:sellerId', auth, async (req, res) => {
  try {
    const { sellerId } = req.params;
    const {
      serviceId,
      projectTitle,
      projectDescription,
      requirements,
      expectedDelivery,
      agreedPrice,
      urgency = 'medium',
      paymentMethod,
      attachments = []
    } = req.body;
    
    // Use authenticated user's ID as client
    const clientId = req.user.id;
    
    // Validate seller exists and is available
    const seller = await SellerProfile.findOne({
      where: { 
        sellerId,
        status: 'approved',
        marketplaceReadiness: true
      }
    });
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found or not available'
      });
    }
    
    // Validate service exists
    const service = seller.services.find(s => s.id === serviceId);
    if (!service) {
      return res.status(400).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Create booking
    const booking = new Booking({
      clientId,
      sellerId,
      serviceId,
      projectTitle,
      projectDescription,
      requirements: requirements || [],
      expectedDelivery: new Date(expectedDelivery),
      agreedPrice: parseFloat(agreedPrice),
      urgency,
      paymentMethod,
      attachments,
      maxRevisions: service.revisions || 2
    });
    
    // Generate booking ID
    booking.generateBookingId();
    
    // Calculate platform fee
    booking.calculatePlatformFee();
    
    await booking.save();
    
    // Create conversation in community hub
    const conversationId = `booking_${booking.bookingId}_${Date.now()}`;
    booking.conversationId = conversationId;
    await booking.save();
    
    // Add initial message
    await booking.addMessage({
      type: 'system',
      content: `New booking created: ${projectTitle}`,
      senderId: 'system'
    });
    
    res.json({
      success: true,
      message: 'Booking created successfully',
      booking,
      conversationId
    });
    
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
});

// Get seller bookings
router.get('/:sellerId/bookings', auth, async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    // Ensure user can only see their own bookings or bookings for their seller profile
    const whereClause = { 
      [Op.or]: [
        { sellerId },
        { clientId: req.user.id }
      ]
    };
    if (status) {
      whereClause.status = status;
    }
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const bookings = await Booking.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });
    
    const totalCount = await Booking.count({ where: whereClause });
    
    res.json({
      success: true,
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching seller bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
});

// Update booking status
router.put('/booking/:bookingId/status', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, updatedBy } = req.body;
    
    const booking = await Booking.findOne({ where: { bookingId } });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    await booking.updateStatus(status, updatedBy);
    
    res.json({
      success: true,
      message: 'Booking status updated',
      booking
    });
    
  } catch (error) {
    console.error('❌ Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
});

// Get seller analytics
router.get('/:sellerId/analytics', auth, async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { period = '30' } = req.query; // days
    
    // Ensure user can only see their own analytics
    if (sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own analytics.'
      });
    }
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    const stats = await Booking.getBookingStats(sellerId, {
      start: startDate,
      end: new Date()
    });
    
    const profile = await SellerProfile.findOne({ where: { sellerId } });
    
    res.json({
      success: true,
      analytics: {
        profile: {
          views: profile?.views || 0,
          rating: profile?.rating || 0,
          totalReviews: profile?.totalReviews || 0,
          completedOrders: profile?.completedOrders || 0,
          totalEarnings: profile?.totalEarnings || 0,
          profileCompleteness: profile?.profileCompleteness || 0
        },
        bookings: stats,
        period: parseInt(period)
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching seller analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

module.exports = router;
