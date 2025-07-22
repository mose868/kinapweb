const express = require('express');
const FAQ = require('../models/FAQ');

const router = express.Router();

// Get all published FAQs (public)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      popular, 
      search, 
      limit = 50, 
      skip = 0 
    } = req.query;

    let query = {
      isPublished: true,
      isActive: true
    };

    // Add filters
    if (category && category !== 'all') {
      query.category = category;
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const faqs = await FAQ.find(query)
      .sort({ 
        priority: -1, 
        helpfulCount: -1, 
        createdAt: -1 
      })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('relatedFAQs', 'question category')
      .select('-lastUpdatedBy -__v');

    const total = await FAQ.countDocuments(query);

    res.json({
      faqs,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: skip > 0
      }
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all FAQs for admin (includes unpublished)
router.get('/admin', async (req, res) => {
  try {
    const { 
      category, 
      isPublished, 
      limit = 100, 
      skip = 0 
    } = req.query;

    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (isPublished !== undefined) {
      query.isPublished = isPublished === 'true';
    }

    const faqs = await FAQ.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('relatedFAQs', 'question category');

    const total = await FAQ.countDocuments(query);

    res.json({
      faqs,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin FAQs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single FAQ by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const faq = await FAQ.findById(id)
      .populate('relatedFAQs', 'question category')
      .select('-lastUpdatedBy -__v');

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    // Check if FAQ is published and active (for public access)
    if (!faq.isPublished || !faq.isActive) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    // Increment view count
    await faq.incrementViews();

    res.json(faq);
  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single FAQ for admin (includes unpublished)
router.get('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const faq = await FAQ.findById(id)
      .populate('relatedFAQs', 'question category');

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.json(faq);
  } catch (error) {
    console.error('Get admin FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new FAQ (admin)
router.post('/', async (req, res) => {
  try {
    const {
      question,
      answer,
      category,
      tags,
      priority,
      isPublished,
      isPopular,
      relatedFAQs,
      seoMeta,
      displayOrder,
      lastUpdatedBy
    } = req.body;

    // Validation
    if (!question || !answer || !category) {
      return res.status(400).json({ 
        message: 'Question, answer, and category are required' 
      });
    }

    const faq = await FAQ.create({
      question,
      answer,
      category,
      tags: Array.isArray(tags) ? tags : [],
      priority: priority || 0,
      isPublished: isPublished !== undefined ? isPublished : true,
      isPopular: isPopular || false,
      relatedFAQs: Array.isArray(relatedFAQs) ? relatedFAQs : [],
      seoMeta: seoMeta || {},
      displayOrder: displayOrder || 0,
      lastUpdatedBy: lastUpdatedBy || 'admin@ajirakinap.com'
    });

    // Populate related FAQs for response
    await faq.populate('relatedFAQs', 'question category');

    res.status(201).json({ 
      message: 'FAQ created successfully', 
      faq 
    });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update existing FAQ (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const faq = await FAQ.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('relatedFAQs', 'question category');

    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.json({ 
      message: 'FAQ updated successfully', 
      faq 
    });
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete FAQ (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Remove this FAQ from any relatedFAQs arrays
    await FAQ.updateMany(
      { relatedFAQs: id },
      { $pull: { relatedFAQs: id } }
    );

    const faq = await FAQ.findByIdAndDelete(id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle publish status (admin)
router.patch('/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findById(id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    faq.isPublished = !faq.isPublished;
    faq.updatedAt = new Date();
    await faq.save();

    res.json({ 
      message: `FAQ ${faq.isPublished ? 'published' : 'unpublished'} successfully`, 
      faq 
    });
  } catch (error) {
    console.error('Toggle publish FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle popular status (admin)
router.patch('/:id/popular', async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findById(id);
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    faq.isPopular = !faq.isPopular;
    faq.updatedAt = new Date();
    await faq.save();

    res.json({ 
      message: `FAQ ${faq.isPopular ? 'marked as popular' : 'unmarked as popular'} successfully`, 
      faq 
    });
  } catch (error) {
    console.error('Toggle popular FAQ error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark FAQ as helpful (public)
router.post('/:id/helpful', async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findById(id);
    
    if (!faq || !faq.isPublished || !faq.isActive) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await faq.markHelpful();

    res.json({ 
      message: 'Thank you for your feedback!',
      helpfulCount: faq.helpfulCount,
      helpfulnessRatio: faq.helpfulnessRatio
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark FAQ as not helpful (public)
router.post('/:id/not-helpful', async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findById(id);
    
    if (!faq || !faq.isPublished || !faq.isActive) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await faq.markNotHelpful();

    res.json({ 
      message: 'Thank you for your feedback!',
      notHelpfulCount: faq.notHelpfulCount,
      helpfulnessRatio: faq.helpfulnessRatio
    });
  } catch (error) {
    console.error('Mark not helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories and statistics (public)
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await FAQ.distinct('category', { 
      isPublished: true, 
      isActive: true 
    });

    const categoriesWithCounts = await FAQ.aggregate([
      { $match: { isPublished: true, isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({ 
      categories,
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

// Get FAQ statistics (admin)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalFAQs = await FAQ.countDocuments();
    const publishedFAQs = await FAQ.countDocuments({ isPublished: true });
    const popularFAQs = await FAQ.countDocuments({ isPopular: true });
    const unpublishedFAQs = await FAQ.countDocuments({ isPublished: false });

    const categoriesStats = await FAQ.aggregate([
      { $match: { isPublished: true, isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const totalViews = await FAQ.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, totalViews: { $sum: '$viewCount' } } }
    ]);

    const totalHelpfulVotes = await FAQ.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: null, totalHelpful: { $sum: '$helpfulCount' }, totalNotHelpful: { $sum: '$notHelpfulCount' } } }
    ]);

    const mostViewedFAQs = await FAQ.find({ isPublished: true })
      .sort({ viewCount: -1 })
      .limit(5)
      .select('question viewCount category');

    const mostHelpfulFAQs = await FAQ.find({ isPublished: true })
      .sort({ helpfulCount: -1 })
      .limit(5)
      .select('question helpfulCount category');

    res.json({
      totalFAQs,
      publishedFAQs,
      unpublishedFAQs,
      popularFAQs,
      categoriesStats,
      totalViews: totalViews[0]?.totalViews || 0,
      totalHelpfulVotes: totalHelpfulVotes[0]?.totalHelpful || 0,
      totalNotHelpfulVotes: totalHelpfulVotes[0]?.totalNotHelpful || 0,
      mostViewedFAQs,
      mostHelpfulFAQs
    });
  } catch (error) {
    console.error('Get FAQ stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search FAQs (public)
router.get('/search', async (req, res) => {
  try {
    const { q, category, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    let query = {
      isPublished: true,
      isActive: true,
      $text: { $search: q }
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    const faqs = await FAQ.find(query, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' }, priority: -1 })
      .limit(parseInt(limit))
      .populate('relatedFAQs', 'question category')
      .select('-lastUpdatedBy -__v');

    res.json({
      query: q,
      results: faqs,
      count: faqs.length
    });
  } catch (error) {
    console.error('Search FAQs error:', error);
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
        updateOperation = { isPublished: true };
        break;
      case 'unpublish':
        updateOperation = { isPublished: false };
        break;
      case 'mark-popular':
        updateOperation = { isPopular: true };
        break;
      case 'unmark-popular':
        updateOperation = { isPopular: false };
        break;
      case 'delete':
        // Remove FAQs from relatedFAQs arrays first
        await FAQ.updateMany(
          { relatedFAQs: { $in: ids } },
          { $pull: { relatedFAQs: { $in: ids } } }
        );
        await FAQ.deleteMany({ _id: { $in: ids } });
        return res.json({ message: `${ids.length} FAQs deleted successfully` });
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    const result = await FAQ.updateMany(
      { _id: { $in: ids } },
      { ...updateOperation, updatedAt: new Date() }
    );

    res.json({ 
      message: `${result.modifiedCount} FAQs updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 