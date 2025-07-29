const express = require('express');
const router = express.Router();
const HomePage = require('../models/HomePage');
const { auth, adminAuth } = require('../middleware/auth');

// Get home page content
router.get('/', async (req, res) => {
  try {
    let homePage = await HomePage.getActive();
    
    if (!homePage) {
      // Create default home page content
      homePage = await HomePage.create({
        heroTitle: 'Empowering Kenya\'s Digital Generation',
        heroSubtitle: 'KiNaP Ajira Digital Club – Innovation & Excellence',
        heroImage: '/logo.jpeg',
        stats: {
          studentsTrained: 1000,
          successStories: 150,
          skillsPrograms: 50,
          digitalExcellence: 100,
          activeMembers: 500,
          completedProjects: 200,
          partnerOrganizations: 25,
          averageEarnings: 50000
        },
        ctaButtons: [
          { label: 'Get Started', url: '/auth?mode=register', type: 'primary' },
          { label: 'Official Portal', url: 'https://ajiradigital.go.ke', type: 'external' }
        ],
        features: [
          {
            icon: 'Users',
            title: 'Community Driven',
            description: 'Join a thriving community of digital professionals and learners across Kenya',
            color: 'from-ajira-primary to-ajira-blue-600',
            bgColor: 'bg-ajira-primary/10',
            order: 1
          },
          {
            icon: 'Award',
            title: 'Certified Training',
            description: 'Industry-recognized certifications and skill development programs',
            color: 'from-ajira-secondary to-ajira-green-600',
            bgColor: 'bg-ajira-secondary/10',
            order: 2
          },
          {
            icon: 'TrendingUp',
            title: 'Career Growth',
            description: 'Track your progress and unlock new opportunities in the digital economy',
            color: 'from-ajira-accent to-ajira-orange-600',
            bgColor: 'bg-ajira-accent/10',
            order: 3
          },
          {
            icon: 'Globe',
            title: 'Global Reach',
            description: 'Connect with international markets and opportunities worldwide',
            color: 'from-ajira-info to-ajira-blue-500',
            bgColor: 'bg-ajira-info/10',
            order: 4
          }
        ],
        testimonials: [
          {
            name: 'Sarah Mwangi',
            role: 'Digital Marketing Specialist',
            company: 'Tech Solutions Kenya',
            content: 'KiNaP transformed my career. The community support and training programs are exceptional.',
            rating: 5,
            image: '/images/testimonials/sarah.jpg',
            featured: true,
            order: 1
          },
          {
            name: 'John Kamau',
            role: 'Web Developer',
            company: 'Freelance',
            content: 'The marketplace helped me start my freelance career. Great platform for digital professionals.',
            rating: 5,
            image: '/images/testimonials/john.jpg',
            featured: true,
            order: 2
          }
        ],
        newsItems: [
          {
            title: 'New Digital Skills Program Launch',
            excerpt: 'We are excited to announce the launch of our comprehensive digital skills training program.',
            content: 'The new program covers web development, digital marketing, and data analysis...',
            image: '/images/news/program-launch.jpg',
            category: 'Announcements',
            author: 'KiNaP Team',
            featured: true,
            tags: ['training', 'skills', 'launch'],
            readTime: 3,
            order: 1
          }
        ],
        programs: [
          {
            title: 'Web Development Fundamentals',
            description: 'Learn the basics of web development with HTML, CSS, and JavaScript',
            icon: 'Code',
            duration: '8 weeks',
            level: 'beginner',
            category: 'Development',
            enrollmentCount: 150,
            rating: 4.8,
            featured: true,
            order: 1
          },
          {
            title: 'Digital Marketing Mastery',
            description: 'Master digital marketing strategies and tools',
            icon: 'TrendingUp',
            duration: '6 weeks',
            level: 'intermediate',
            category: 'Marketing',
            enrollmentCount: 120,
            rating: 4.7,
            featured: true,
            order: 2
          }
        ],
        partners: [
          {
            name: 'Ajira Digital',
            logo: '/images/partners/ajira-digital.png',
            website: 'https://ajiradigital.go.ke',
            description: 'Official government digital skills program',
            category: 'Government',
            featured: true,
            order: 1
          }
        ],
        aboutSection: {
          title: 'About KiNaP Ajira Digital Club',
          content: 'We are a community-driven platform dedicated to empowering Kenyans with digital skills and opportunities.',
          image: '/images/about/team.jpg',
          showStats: true
        },
        servicesSection: {
          title: 'Our Services',
          subtitle: 'Comprehensive Digital Solutions',
          description: 'From training to marketplace opportunities, we provide everything you need for digital success.',
          showCTA: true
        },
        communitySection: {
          title: 'Join Our Community',
          subtitle: 'Connect with Digital Professionals',
          description: 'Be part of Kenya\'s fastest-growing digital community.',
          memberCount: 500,
          showJoinCTA: true
        }
      });
    }

    // Increment view count
    await homePage.incrementViewCount();

    res.json(homePage);
  } catch (err) {
    console.error('Error fetching home page:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get home page analytics (admin only)
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const homePage = await HomePage.getActive();
    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    const analytics = {
      viewCount: homePage.viewCount,
      lastViewed: homePage.lastViewed,
      createdAt: homePage.createdAt,
      updatedAt: homePage.updatedAt,
      sections: {
        hero: homePage.showHero,
        stats: homePage.showStats,
        features: homePage.showFeatures,
        testimonials: homePage.showTestimonials,
        news: homePage.showNews,
        programs: homePage.showPrograms,
        partners: homePage.showPartners
      },
      contentCounts: {
        testimonials: homePage.testimonials.length,
        newsItems: homePage.newsItems.length,
        programs: homePage.programs.length,
        partners: homePage.partners.length,
        features: homePage.features.length
      }
    };

    res.json(analytics);
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update home page content (admin only)
router.put('/', adminAuth, async (req, res) => {
  try {
    const update = req.body;
    const homePage = await HomePage.findOneAndUpdate(
      { isActive: true },
      update,
      { new: true, upsert: true }
    );
    res.json(homePage);
  } catch (err) {
    console.error('Error updating home page:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update specific section (admin only)
router.put('/section/:section', adminAuth, async (req, res) => {
  try {
    const { section } = req.params;
    const update = req.body;
    
    const homePage = await HomePage.findOne({ isActive: true });
    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    // Update specific section
    if (section === 'hero') {
      homePage.heroTitle = update.heroTitle;
      homePage.heroSubtitle = update.heroSubtitle;
      homePage.heroImage = update.heroImage;
      homePage.heroVideo = update.heroVideo;
      homePage.heroBackground = update.heroBackground;
    } else if (section === 'stats') {
      homePage.stats = { ...homePage.stats, ...update };
    } else if (section === 'cta') {
      homePage.ctaButtons = update.ctaButtons;
    } else if (section === 'features') {
      homePage.features = update.features;
    } else if (section === 'testimonials') {
      homePage.testimonials = update.testimonials;
    } else if (section === 'news') {
      homePage.newsItems = update.newsItems;
    } else if (section === 'programs') {
      homePage.programs = update.programs;
    } else if (section === 'partners') {
      homePage.partners = update.partners;
    } else if (section === 'about') {
      homePage.aboutSection = update;
    } else if (section === 'services') {
      homePage.servicesSection = update;
    } else if (section === 'community') {
      homePage.communitySection = update;
    } else if (section === 'config') {
      homePage.showHero = update.showHero;
      homePage.showStats = update.showStats;
      homePage.showFeatures = update.showFeatures;
      homePage.showTestimonials = update.showTestimonials;
      homePage.showNews = update.showNews;
      homePage.showPrograms = update.showPrograms;
      homePage.showPartners = update.showPartners;
    }

    await homePage.save();
    res.json(homePage);
  } catch (err) {
    console.error('Error updating section:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add testimonial (admin only)
router.post('/testimonials', adminAuth, async (req, res) => {
  try {
    const homePage = await HomePage.findOne({ isActive: true });
    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    const newTestimonial = {
      ...req.body,
      order: homePage.testimonials.length + 1
    };

    homePage.testimonials.push(newTestimonial);
    await homePage.save();

    res.status(201).json(newTestimonial);
  } catch (err) {
    console.error('Error adding testimonial:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update testimonial (admin only)
router.put('/testimonials/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const homePage = await HomePage.findOne({ isActive: true });
    
    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    const testimonialIndex = homePage.testimonials.findIndex(t => t._id.toString() === id);
    if (testimonialIndex === -1) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    homePage.testimonials[testimonialIndex] = { ...homePage.testimonials[testimonialIndex], ...req.body };
    await homePage.save();

    res.json(homePage.testimonials[testimonialIndex]);
  } catch (err) {
    console.error('Error updating testimonial:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete testimonial (admin only)
router.delete('/testimonials/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const homePage = await HomePage.findOne({ isActive: true });
    
    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    homePage.testimonials = homePage.testimonials.filter(t => t._id.toString() !== id);
    await homePage.save();

    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add news item (admin only)
router.post('/news', adminAuth, async (req, res) => {
  try {
    const homePage = await HomePage.findOne({ isActive: true });
    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    const newNewsItem = {
      ...req.body,
      order: homePage.newsItems.length + 1,
      publishedAt: new Date()
    };

    homePage.newsItems.push(newNewsItem);
    await homePage.save();

    res.status(201).json(newNewsItem);
  } catch (err) {
    console.error('Error adding news item:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get featured content
router.get('/featured', async (req, res) => {
  try {
    const homePage = await HomePage.getActive();
    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    const featuredContent = homePage.getFeaturedContent();
    res.json(featuredContent);
  } catch (err) {
    console.error('Error fetching featured content:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get home page stats
router.get('/stats', async (req, res) => {
  try {
    const homePage = await HomePage.getActive();
    if (!homePage) {
      return res.status(404).json({ message: 'Home page not found' });
    }

    res.json({
      stats: homePage.stats,
      formattedStats: homePage.formattedStats,
      viewCount: homePage.viewCount
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 