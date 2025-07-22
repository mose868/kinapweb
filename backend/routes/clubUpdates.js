const express = require('express');
const ClubUpdate = require('../models/ClubUpdate');

const router = express.Router();

// Get all updates (public - published only)
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      tags, 
      featured, 
      limit = 10, 
      skip = 0, 
      search 
    } = req.query;

    let query = {
      status: 'Published',
      isActive: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gt: new Date() } }
      ]
    };

    // Add filters
    if (category) {
      query.category = category;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $in: tagArray };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$and = [
        query.$or || {},
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { excerpt: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }

    const updates = await ClubUpdate.find(query)
      .sort({ featured: -1, priority: -1, publishDate: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-lastUpdatedBy -__v');

    const total = await ClubUpdate.countDocuments(query);

    res.json({
      updates,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: skip > 0
      }
    });
  } catch (error) {
    console.error('Get updates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all updates for admin (includes drafts, archived)
router.get('/admin', async (req, res) => {
  try {
    const { status, category, limit = 20, skip = 0 } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    const updates = await ClubUpdate.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await ClubUpdate.countDocuments(query);

    res.json({
      updates,
      pagination: {
        total,
        page: Math.floor(skip / limit) + 1,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin updates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single update by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const update = await ClubUpdate.findById(id)
      .select('-lastUpdatedBy -__v');

    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    // Check if update is published and active (for public access)
    if (update.status !== 'Published' || !update.isActive) {
      return res.status(404).json({ message: 'Update not found' });
    }

    // Check if expired
    if (update.expiryDate && update.expiryDate < new Date()) {
      return res.status(404).json({ message: 'Update has expired' });
    }

    // Increment view count
    await update.incrementViews();

    res.json(update);
  } catch (error) {
    console.error('Get update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single update for admin (includes unpublished)
router.get('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const update = await ClubUpdate.findById(id);

    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    res.json(update);
  } catch (error) {
    console.error('Get admin update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new update (admin)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      author,
      authorEmail,
      category,
      tags,
      featured,
      priority,
      status,
      publishDate,
      expiryDate,
      images,
      attachments,
      eventDetails,
      seoMeta,
      displayOrder,
      lastUpdatedBy
    } = req.body;

    // Validation
    if (!title || !excerpt || !content || !author || !category) {
      return res.status(400).json({ 
        message: 'Title, excerpt, content, author, and category are required' 
      });
    }

    const update = await ClubUpdate.create({
      title,
      excerpt,
      content,
      author,
      authorEmail,
      category,
      tags: Array.isArray(tags) ? tags : [],
      featured: featured || false,
      priority: priority || 'Medium',
      status: status || 'Draft',
      publishDate: publishDate || new Date(),
      expiryDate,
      images: Array.isArray(images) ? images : [],
      attachments: Array.isArray(attachments) ? attachments : [],
      eventDetails: eventDetails || {},
      seoMeta: seoMeta || {},
      displayOrder: displayOrder || 0,
      lastUpdatedBy: lastUpdatedBy || 'admin@ajirakinap.com'
    });

    res.status(201).json({ 
      message: 'Update created successfully', 
      update 
    });
  } catch (error) {
    console.error('Create update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update existing update (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const update = await ClubUpdate.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    res.json({ 
      message: 'Update updated successfully', 
      update 
    });
  } catch (error) {
    console.error('Update update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete update (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const update = await ClubUpdate.findByIdAndDelete(id);
    
    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    res.json({ message: 'Update deleted successfully' });
  } catch (error) {
    console.error('Delete update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Publish update (admin)
router.patch('/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;

    const update = await ClubUpdate.findByIdAndUpdate(
      id,
      { 
        status: 'Published', 
        publishDate: new Date(),
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    res.json({ 
      message: 'Update published successfully', 
      update 
    });
  } catch (error) {
    console.error('Publish update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Archive update (admin)
router.patch('/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;

    const update = await ClubUpdate.findByIdAndUpdate(
      id,
      { 
        status: 'Archived',
        updatedAt: new Date() 
      },
      { new: true }
    );

    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    res.json({ 
      message: 'Update archived successfully', 
      update 
    });
  } catch (error) {
    console.error('Archive update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle featured status (admin)
router.patch('/:id/feature', async (req, res) => {
  try {
    const { id } = req.params;

    const update = await ClubUpdate.findById(id);
    
    if (!update) {
      return res.status(404).json({ message: 'Update not found' });
    }

    update.featured = !update.featured;
    update.updatedAt = new Date();
    await update.save();

    res.json({ 
      message: `Update ${update.featured ? 'featured' : 'unfeatured'} successfully`, 
      update 
    });
  } catch (error) {
    console.error('Feature update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories and tags (for filters)
router.get('/meta/filters', async (req, res) => {
  try {
    const categories = await ClubUpdate.distinct('category', { 
      status: 'Published', 
      isActive: true 
    });

    const tags = await ClubUpdate.distinct('tags', { 
      status: 'Published', 
      isActive: true 
    });

    res.json({ categories, tags });
  } catch (error) {
    console.error('Get filters error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get update statistics (admin)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalUpdates = await ClubUpdate.countDocuments();
    const publishedUpdates = await ClubUpdate.countDocuments({ status: 'Published' });
    const draftUpdates = await ClubUpdate.countDocuments({ status: 'Draft' });
    const featuredUpdates = await ClubUpdate.countDocuments({ featured: true });

    const categoriesStats = await ClubUpdate.aggregate([
      { $match: { status: 'Published', isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const totalViews = await ClubUpdate.aggregate([
      { $match: { status: 'Published' } },
      { $group: { _id: null, totalViews: { $sum: '$engagement.views' } } }
    ]);

    res.json({
      totalUpdates,
      publishedUpdates,
      draftUpdates,
      featuredUpdates,
      categoriesStats,
      totalViews: totalViews[0]?.totalViews || 0
    });
  } catch (error) {
    console.error('Get update stats error:', error);
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
        updateOperation = { status: 'Published', publishDate: new Date() };
        break;
      case 'archive':
        updateOperation = { status: 'Archived' };
        break;
      case 'delete':
        await ClubUpdate.deleteMany({ _id: { $in: ids } });
        return res.json({ message: `${ids.length} updates deleted successfully` });
      case 'feature':
        updateOperation = { featured: true };
        break;
      case 'unfeature':
        updateOperation = { featured: false };
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    const result = await ClubUpdate.updateMany(
      { _id: { $in: ids } },
      { ...updateOperation, updatedAt: new Date() }
    );

    res.json({ 
      message: `${result.modifiedCount} updates updated successfully`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 