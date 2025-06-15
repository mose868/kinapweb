const express = require('express');
const { protect } = require('../middleware/auth');
const testimonialController = require('../controllers/testimonialController');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Public fetch
router.get('/', testimonialController.getTestimonials);

// Create (protected)
router.post('/', protect, rateLimiter(), testimonialController.createTestimonial);

module.exports = router; 