const express = require('express');
const Mentor = require('../models/Mentor');
const MentorApplication = require('../models/MentorApplication');
const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all active mentors (public)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      expertiseLevel, 
      city,
      isFree,
      instantAvailable,
      search,
      featured,
      limit = 20, 
      skip = 0 
    } = req.query;

    let query = {
      isActive: true
    };

    // Add filters
    if (category && category !== 'all') {
      query.category = category;
    }

    if (expertiseLevel && expertiseLevel !== 'all') {
      query.expertiseLevel = expertiseLevel;
    }

    if (city && city !== 'all') {
      query['location.city'] = city;
    }

    if (isFree === 'true') {
      query['pricing.isFree'] = true;
    }

    if (instantAvailable === 'true') {
      query['instantAvailability.enabled'] = true;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { 'mentor.name': { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const mentors = await Mentor.findAll({
      where: query,
      order: [
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(skip)
    });

    const total = await Mentor.count({ where: query });

    res.json({
      mentors,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: skip > 0
      }
    });
  } catch (error) {
    console.error('Get mentors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get mentor by ID
router.get('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('userId', 'username email displayName')
      .select('-__v');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json({ mentor });
  } catch (error) {
    console.error('Get mentor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get mentor by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ slug: req.params.slug })
      .populate('userId', 'username email displayName')
      .select('-__v');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    res.json({ mentor });
  } catch (error) {
    console.error('Get mentor by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create mentor profile (requires approved application)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user has an approved mentor application
    const application = await MentorApplication.findOne({
      userId: req.user.id,
      status: 'approved'
    });

    if (!application) {
      return res.status(403).json({ 
        message: 'You must have an approved mentor application to create a profile' 
      });
    }

    // Check if mentor profile already exists
    const existingMentor = await Mentor.findOne({ userId: req.user.id });
    if (existingMentor) {
      return res.status(400).json({ message: 'Mentor profile already exists' });
    }

    const mentorData = {
      ...req.body,
      userId: req.user.id,
      mentor: {
        name: req.user.displayName || req.user.username,
        bio: req.body.mentor?.bio || 'Experienced professional ready to help others grow.',
        profilePhoto: req.body.mentor?.profilePhoto
      }
    };

    const mentor = new Mentor(mentorData);
    await mentor.save();

    res.status(201).json({
      message: 'Mentor profile created successfully',
      mentor
    });
  } catch (error) {
    console.error('Create mentor error:', error);
    res.status(500).json({ message: 'Failed to create mentor profile' });
  }
});

// Update mentor profile
router.put('/:id', auth, async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if user owns this mentor profile
    if (mentor.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(mentor, req.body);
    await mentor.save();

    res.json({
      message: 'Mentor profile updated successfully',
      mentor
    });
  } catch (error) {
    console.error('Update mentor error:', error);
    res.status(500).json({ message: 'Failed to update mentor profile' });
  }
});

// Delete mentor profile
router.delete('/:id', auth, async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check if user owns this mentor profile
    if (mentor.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Mentor.findByIdAndDelete(req.params.id);

    res.json({ message: 'Mentor profile deleted successfully' });
  } catch (error) {
    console.error('Delete mentor error:', error);
    res.status(500).json({ message: 'Failed to delete mentor profile' });
  }
});

// Get mentor statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Mentor.aggregate([
      { $match: { isActive: true, status: 'active' } },
      {
        $group: {
          _id: null,
          totalMentors: { $sum: 1 },
          averageRating: { $avg: '$ratings.overall' },
          totalSessions: { $sum: '$stats.sessionsCompleted' },
          totalHours: { $sum: '$stats.totalHours' }
        }
      }
    ]);

    const categoryStats = await Mentor.aggregate([
      { $match: { isActive: true, status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const cityStats = await Mentor.aggregate([
      { $match: { isActive: true, status: 'active' } },
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: stats[0] || {
        totalMentors: 0,
        averageRating: 0,
        totalSessions: 0,
        totalHours: 0
      },
      byCategory: categoryStats,
      byCity: cityStats
    });
  } catch (error) {
    console.error('Get mentor stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get meta data for filters
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Mentor.distinct('category');
    const expertiseLevels = await Mentor.distinct('expertiseLevel');
    const cities = await Mentor.distinct('location.city');

    res.json({
      categories: categories.sort(),
      expertiseLevels: expertiseLevels.sort(),
      cities: cities.sort()
    });
  } catch (error) {
    console.error('Get meta data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 