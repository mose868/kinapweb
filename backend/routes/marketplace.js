const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');
const Order = require('../models/Order');
const Review = require('../models/Review');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// ==================== GIG ROUTES ====================

// Get all gigs with filters
router.get('/gigs', async (req, res) => {
  try {
    const {
      category,
      subcategory,
      minPrice,
      maxPrice,
      rating,
      deliveryTime,
      search,
      sort = 'newest',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = { status: 'active' };
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (minPrice || maxPrice) {
      query['pricing.amount'] = {};
      if (minPrice) query['pricing.amount'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.amount'].$lte = Number(maxPrice);
    }
    if (rating) query['stats.rating'] = { $gte: Number(rating) };
    if (deliveryTime) query['packages.deliveryTime'] = { $lte: Number(deliveryTime) };
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    let sortQuery = {};
    switch (sort) {
      case 'price-low':
        sortQuery = { 'pricing.amount': 1 };
        break;
      case 'price-high':
        sortQuery = { 'pricing.amount': -1 };
        break;
      case 'rating':
        sortQuery = { 'stats.rating': -1 };
        break;
      case 'orders':
        sortQuery = { 'stats.orders': -1 };
        break;
      case 'newest':
      default:
        sortQuery = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const gigs = await Gig.find(query)
      .populate('seller', 'displayName avatar rating')
      .sort(sortQuery)
      .limit(Number(limit))
      .skip(skip);

    const total = await Gig.countDocuments(query);

    res.json({
      gigs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching gigs:', error);
    res.status(500).json({ error: 'Failed to fetch gigs' });
  }
});

// Get featured gigs
router.get('/gigs/featured', async (req, res) => {
  try {
    const gigs = await Gig.getFeatured();
    res.json(gigs);
  } catch (error) {
    console.error('Error fetching featured gigs:', error);
    res.status(500).json({ error: 'Failed to fetch featured gigs' });
  }
});

// Get gig by ID
router.get('/gigs/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('seller', 'displayName avatar rating bio skills languages')
      .populate('portfolio');

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Increment views
    gig.stats.views += 1;
    await gig.save();

    res.json(gig);
  } catch (error) {
    console.error('Error fetching gig:', error);
    res.status(500).json({ error: 'Failed to fetch gig' });
  }
});

// Create new gig (protected)
router.post('/gigs', auth, async (req, res) => {
  try {
    const gigData = {
      ...req.body,
      seller: req.user.id
    };

    const gig = new Gig(gigData);
    await gig.save();

    res.status(201).json(gig);
  } catch (error) {
    console.error('Error creating gig:', error);
    res.status(400).json({ error: 'Failed to create gig' });
  }
});

// Update gig (protected)
router.put('/gigs/:id', auth, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    if (gig.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    Object.assign(gig, req.body);
    await gig.save();

    res.json(gig);
  } catch (error) {
    console.error('Error updating gig:', error);
    res.status(400).json({ error: 'Failed to update gig' });
  }
});

// Delete gig (protected)
router.delete('/gigs/:id', auth, async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    if (gig.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await gig.remove();
    res.json({ message: 'Gig deleted successfully' });
  } catch (error) {
    console.error('Error deleting gig:', error);
    res.status(500).json({ error: 'Failed to delete gig' });
  }
});

// ==================== ORDER ROUTES ====================

// Create new order (protected)
router.post('/orders', auth, async (req, res) => {
  try {
    const { gigId, packageName, requirements, paymentMethod } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    const package = gig.packages.find(p => p.name === packageName);
    if (!package) {
      return res.status(400).json({ error: 'Invalid package' });
    }

    // Calculate due date
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + package.deliveryTime);

    const orderData = {
      buyer: req.user.id,
      seller: gig.seller,
      gig: gigId,
      package: {
        name: package.name,
        title: package.title,
        price: package.price,
        deliveryTime: package.deliveryTime,
        revisions: package.revisions,
        features: package.features
      },
      requirements,
      payment: {
        amount: package.price,
        method: paymentMethod,
        status: 'pending'
      },
      delivery: {
        dueDate
      }
    };

    const order = new Order(orderData);
    await order.save();

    // Update gig stats
    gig.stats.orders += 1;
    await gig.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ error: 'Failed to create order' });
  }
});

// Get user orders (protected)
router.get('/orders', auth, async (req, res) => {
  try {
    const { role = 'buyer', status, page = 1, limit = 20 } = req.query;
    
    const orders = await Order.getByUser(req.user.id, role, status);
    const skip = (page - 1) * limit;
    
    const paginatedOrders = orders.slice(skip, skip + Number(limit));
    
    res.json({
      orders: paginatedOrders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: orders.length,
        pages: Math.ceil(orders.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID (protected)
router.get('/orders/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'displayName avatar')
      .populate('seller', 'displayName avatar')
      .populate('gig', 'title images');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is authorized
    if (order.buyer.toString() !== req.user.id && order.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (protected)
router.patch('/orders/:id/status', auth, async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is authorized
    if (order.buyer.toString() !== req.user.id && order.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await order.updateStatus(status, note);
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ error: 'Failed to update order status' });
  }
});

// Add message to order (protected)
router.post('/orders/:id/messages', auth, async (req, res) => {
  try {
    const { message, attachments } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is authorized
    if (order.buyer.toString() !== req.user.id && order.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await order.addMessage(req.user.id, message, attachments);
    res.json(order);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(400).json({ error: 'Failed to add message' });
  }
});

// ==================== REVIEW ROUTES ====================

// Create review (protected)
router.post('/reviews', auth, async (req, res) => {
  try {
    const { orderId, rating, title, comment, images } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (order.status !== 'completed') {
      return res.status(400).json({ error: 'Order must be completed to review' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ order: orderId });
    if (existingReview) {
      return res.status(400).json({ error: 'Review already exists for this order' });
    }

    const reviewData = {
      order: orderId,
      gig: order.gig,
      reviewer: req.user.id,
      seller: order.seller,
      rating,
      title,
      comment,
      images
    };

    const review = new Review(reviewData);
    await review.save();

    // Update gig stats
    const gig = await Gig.findById(order.gig);
    if (gig) {
      const reviews = await Review.find({ gig: order.gig, status: 'approved' });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating.overall, 0) / reviews.length;
      
      gig.stats.rating = avgRating;
      gig.stats.reviews = reviews.length;
      await gig.save();
    }

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(400).json({ error: 'Failed to create review' });
  }
});

// Get reviews by gig
router.get('/gigs/:gigId/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const reviews = await Review.getByGig(req.params.gigId, Number(limit), Number(page));
    const total = await Review.countDocuments({ gig: req.params.gigId, status: 'approved' });

    res.json({
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get reviews by seller
router.get('/sellers/:sellerId/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const reviews = await Review.getBySeller(req.params.sellerId, Number(limit), Number(page));
    const total = await Review.countDocuments({ seller: req.params.sellerId, status: 'approved' });

    res.json({
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching seller reviews:', error);
    res.status(500).json({ error: 'Failed to fetch seller reviews' });
  }
});

// ==================== SEARCH ROUTES ====================

// Search gigs
router.get('/search', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, rating, sort = 'relevance' } = req.query;

    const query = { status: 'active' };
    
    if (q) {
      query.$text = { $search: q };
    }
    
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query['pricing.amount'] = {};
      if (minPrice) query['pricing.amount'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.amount'].$lte = Number(maxPrice);
    }
    if (rating) query['stats.rating'] = { $gte: Number(rating) };

    let sortQuery = {};
    switch (sort) {
      case 'price-low':
        sortQuery = { 'pricing.amount': 1 };
        break;
      case 'price-high':
        sortQuery = { 'pricing.amount': -1 };
        break;
      case 'rating':
        sortQuery = { 'stats.rating': -1 };
        break;
      case 'relevance':
      default:
        if (q) {
          sortQuery = { score: { $meta: 'textScore' } };
        } else {
          sortQuery = { createdAt: -1 };
        }
    }

    const gigs = await Gig.find(query)
      .populate('seller', 'displayName avatar rating')
      .sort(sortQuery)
      .limit(50);

    res.json(gigs);
  } catch (error) {
    console.error('Error searching gigs:', error);
    res.status(500).json({ error: 'Failed to search gigs' });
  }
});

// ==================== STATISTICS ROUTES ====================

// Get marketplace statistics
router.get('/stats', async (req, res) => {
  try {
    const totalGigs = await Gig.countDocuments({ status: 'active' });
    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments({ status: 'approved' });
    
    // Get top categories
    const topCategories = await Gig.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get average gig price
    const avgPrice = await Gig.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, avgPrice: { $avg: '$pricing.amount' } } }
    ]);

    res.json({
      totalGigs,
      totalOrders,
      totalReviews,
      topCategories,
      averagePrice: avgPrice[0]?.avgPrice || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router; 