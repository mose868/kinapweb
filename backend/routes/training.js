const express = require('express');
const Training = require('../models/Training');

const router = express.Router();

// Get all published training programs (public)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      level, 
      isFree,
      search,
      featured,
      limit = 20, 
      skip = 0 
    } = req.query;

    let query = {
      status: 'Published',
      isActive: true
    };

    // Add filters
    if (category && category !== 'all') {
      query.category = category;
    }

    if (level && level !== 'all') {
      query.level = level;
    }

    if (isFree !== undefined) {
      query['pricing.isFree'] = isFree === 'true';
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const trainings = await Training.find(query)
      .sort({ 
        isFeatured: -1, 
        displayOrder: -1, 
        'ratings.average': -1,
        createdAt: -1 
      })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-reviews -notes -lastUpdatedBy -__v');

    const total = await Training.countDocuments(query);

    res.json({
      trainings,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: skip > 0
      }
    });
  } catch (error) {
    console.error('Get trainings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all training programs for admin (includes unpublished)
router.get('/admin', async (req, res) => {
  try {
    const { 
      category, 
      level, 
      status,
      limit = 100, 
      skip = 0 
    } = req.query;

    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (level && level !== 'all') {
      query.level = level;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const trainings = await Training.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Training.countDocuments(query);

    res.json({
      trainings,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin trainings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single training by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const training = await Training.findOne({ 
      slug, 
      status: 'Published', 
      isActive: true 
    }).select('-notes -lastUpdatedBy -__v');

    if (!training) {
      return res.status(404).json({ message: 'Training program not found' });
    }

    // Increment view count
    await training.incrementViews();

    res.json(training);
  } catch (error) {
    console.error('Get training by slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single training by ID (admin)
router.get('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const training = await Training.findById(id);

    if (!training) {
      return res.status(404).json({ message: 'Training program not found' });
    }

    res.json(training);
  } catch (error) {
    console.error('Get admin training error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new training program (admin)
router.post('/', async (req, res) => {
  try {
    const trainingData = {
      ...req.body,
      lastUpdatedBy: req.body.lastUpdatedBy || 'admin@ajirakinap.com'
    };

    // Validation
    if (!trainingData.title || !trainingData.description || !trainingData.category) {
      return res.status(400).json({ 
        message: 'Title, description, and category are required' 
      });
    }

    const training = await Training.create(trainingData);

    res.status(201).json({ 
      message: 'Training program created successfully', 
      training 
    });
  } catch (error) {
    console.error('Create training error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Training program with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update existing training program (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      lastUpdatedBy: req.body.lastUpdatedBy || 'admin@ajirakinap.com',
      updatedAt: new Date()
    };

    const training = await Training.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!training) {
      return res.status(404).json({ message: 'Training program not found' });
    }

    res.json({ 
      message: 'Training program updated successfully', 
      training 
    });
  } catch (error) {
    console.error('Update training error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Training program with this slug already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete training program (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const training = await Training.findByIdAndDelete(id);
    
    if (!training) {
      return res.status(404).json({ message: 'Training program not found' });
    }

    res.json({ message: 'Training program deleted successfully' });
  } catch (error) {
    console.error('Delete training error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle publish status (admin)
router.patch('/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;

    const training = await Training.findById(id);
    
    if (!training) {
      return res.status(404).json({ message: 'Training program not found' });
    }

    training.status = training.status === 'Published' ? 'Draft' : 'Published';
    training.lastUpdatedBy = req.body.lastUpdatedBy || 'admin@ajirakinap.com';
    training.updatedAt = new Date();
    await training.save();

    res.json({ 
      message: `Training program ${training.status.toLowerCase()} successfully`, 
      training 
    });
  } catch (error) {
    console.error('Toggle publish training error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle featured status (admin)
router.patch('/:id/feature', async (req, res) => {
  try {
    const { id } = req.params;

    const training = await Training.findById(id);
    
    if (!training) {
      return res.status(404).json({ message: 'Training program not found' });
    }

    training.isFeatured = !training.isFeatured;
    training.lastUpdatedBy = req.body.lastUpdatedBy || 'admin@ajirakinap.com';
    training.updatedAt = new Date();
    await training.save();

    res.json({ 
      message: `Training program ${training.isFeatured ? 'featured' : 'unfeatured'} successfully`, 
      training 
    });
  } catch (error) {
    console.error('Toggle feature training error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review to training program (public)
router.post('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, rating, comment } = req.body;

    if (!studentName || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Student name and valid rating (1-5) are required' });
    }

    const training = await Training.findById(id);
    
    if (!training || !training.isActive || training.status !== 'Published') {
      return res.status(404).json({ message: 'Training program not found' });
    }

    const reviewData = {
      studentName,
      rating: parseInt(rating),
      comment: comment || '',
      date: new Date(),
      isVerified: false
    };

    await training.addReview(reviewData);

    res.json({ 
      message: 'Review added successfully',
      rating: training.ratings
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update enrollment count (admin)
router.patch('/:id/enrollment', async (req, res) => {
  try {
    const { id } = req.params;
    const { change } = req.body; // +1 for enrollment, -1 for withdrawal

    const training = await Training.findById(id);
    
    if (!training) {
      return res.status(404).json({ message: 'Training program not found' });
    }

    await training.updateEnrollment(parseInt(change) || 1);

    res.json({ 
      message: 'Enrollment updated successfully',
      enrollment: training.enrollment
    });
  } catch (error) {
    console.error('Update enrollment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories and statistics (public)
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Training.distinct('category', { 
      status: 'Published', 
      isActive: true 
    });

    const categoriesWithCounts = await Training.aggregate([
      { $match: { status: 'Published', isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const levels = await Training.distinct('level', { 
      status: 'Published', 
      isActive: true 
    });

    res.json({ 
      categories,
      levels,
      categoriesWithCounts: categoriesWithCounts.map(cat => ({
        category: cat._id,
        count: cat.count
      }))
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get training statistics (admin)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalTrainings = await Training.countDocuments();
    const publishedTrainings = await Training.countDocuments({ status: 'Published' });
    const draftTrainings = await Training.countDocuments({ status: 'Draft' });
    const featuredTrainings = await Training.countDocuments({ isFeatured: true });

    const categoriesStats = await Training.aggregate([
      { $match: { status: 'Published', isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const levelsStats = await Training.aggregate([
      { $match: { status: 'Published', isActive: true } },
      { $group: { _id: '$level', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const totalViews = await Training.aggregate([
      { $match: { status: 'Published' } },
      { $group: { _id: null, totalViews: { $sum: '$statistics.views' } } }
    ]);

    const totalEnrollments = await Training.aggregate([
      { $match: { status: 'Published' } },
      { $group: { _id: null, totalEnrollments: { $sum: '$enrollment.enrolled' } } }
    ]);

    const averageRating = await Training.aggregate([
      { $match: { status: 'Published', 'ratings.totalRatings': { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: '$ratings.average' } } }
    ]);

    const topRatedTrainings = await Training.find({ 
      status: 'Published',
      'ratings.totalRatings': { $gte: 5 }
    })
      .sort({ 'ratings.average': -1, 'ratings.totalRatings': -1 })
      .limit(5)
      .select('title ratings.average ratings.totalRatings category');

    const mostPopularTrainings = await Training.find({ 
      status: 'Published'
    })
      .sort({ 'statistics.views': -1, 'enrollment.enrolled': -1 })
      .limit(5)
      .select('title statistics.views enrollment.enrolled category');

    res.json({
      totalTrainings,
      publishedTrainings,
      draftTrainings,
      featuredTrainings,
      categoriesStats,
      levelsStats,
      totalViews: totalViews[0]?.totalViews || 0,
      totalEnrollments: totalEnrollments[0]?.totalEnrollments || 0,
      averageRating: averageRating[0]?.avgRating ? Number(averageRating[0].avgRating.toFixed(1)) : 0,
      topRatedTrainings,
      mostPopularTrainings
    });
  } catch (error) {
    console.error('Get training stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search training programs (public)
router.get('/search', async (req, res) => {
  try {
    const { q, category, level, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    let query = {
      status: 'Published',
      isActive: true,
      $text: { $search: q }
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (level && level !== 'all') {
      query.level = level;
    }

    const trainings = await Training.find(query, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' }, 'ratings.average': -1 })
      .limit(parseInt(limit))
      .select('-reviews -notes -lastUpdatedBy -__v');

    res.json({
      query: q,
      results: trainings,
      count: trainings.length
    });
  } catch (error) {
    console.error('Search trainings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured training programs (public)
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const trainings = await Training.getFeatured(parseInt(limit));

    res.json({
      trainings,
      count: trainings.length
    });
  } catch (error) {
    console.error('Get featured trainings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk operations (admin)
router.post('/bulk', async (req, res) => {
  try {
    const { action, ids } = req.body;

    if (!action || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Action and IDs are required' });
    }

    let updateOperation = {};

    switch (action) {
      case 'publish':
        updateOperation = { status: 'Published' };
        break;
      case 'unpublish':
        updateOperation = { status: 'Draft' };
        break;
      case 'feature':
        updateOperation = { isFeatured: true };
        break;
      case 'unfeature':
        updateOperation = { isFeatured: false };
        break;
      case 'activate':
        updateOperation = { isActive: true };
        break;
      case 'deactivate':
        updateOperation = { isActive: false };
        break;
      case 'delete':
        await Training.deleteMany({ _id: { $in: ids } });
        return res.json({ message: `${ids.length} training programs deleted successfully` });
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    const result = await Training.updateMany(
      { _id: { $in: ids } },
      { ...updateOperation, lastUpdatedBy: 'admin@ajirakinap.com', updatedAt: new Date() }
    );

    res.json({ 
      message: `${result.modifiedCount} training programs updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 