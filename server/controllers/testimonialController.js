const Testimonial = require('../models/Testimonial');
const logger = require('../utils/logger');

// Get testimonials with optional filters
exports.getTestimonials = async (req, res) => {
  try {
    const { category = 'all', rating = 0, search = '' } = req.query;

    const query = {};
    if (category !== 'all') query.category = category;
    if (rating > 0) query.rating = { $gte: Number(rating) };
    if (search) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { userRole: { $regex: search, $options: 'i' } },
      ];
    }

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: { testimonials } });
  } catch (error) {
    logger.error('Error fetching testimonials:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch testimonials' });
  }
};

// Create testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { content, rating = 5, category, userRole, impact, projectLink } = req.body;
    if (!content || !userRole) {
      return res.status(400).json({ status: 'error', message: 'Required fields missing' });
    }

    const testimonial = await Testimonial.create({
      userId: req.user._id,
      userName: req.user.name || req.user.email,
      userRole,
      content,
      rating,
      category,
      impact,
      projectLink,
    });

    res.status(201).json({ status: 'success', data: { testimonial } });
  } catch (error) {
    logger.error('Error creating testimonial:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create testimonial' });
  }
}; 