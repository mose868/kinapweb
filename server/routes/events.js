const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const eventController = require('../controllers/eventController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Public: Get all events/news
router.get('/', eventController.getAll);

// Public: Get single event/news
router.get('/:id', eventController.getOne);

// Admin: Create event/news
router.post('/', protect, restrictTo('admin'), upload.single('image'), eventController.create);

// Admin: Update event/news
router.patch('/:id', protect, restrictTo('admin'), upload.single('image'), eventController.update);

// Admin: Delete event/news
router.delete('/:id', protect, restrictTo('admin'), eventController.delete);

module.exports = router; 