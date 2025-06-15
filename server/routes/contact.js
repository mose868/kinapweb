const express = require('express');
const contactController = require('../controllers/contactController');
const router = express.Router();

// Public: Submit contact/feedback form
router.post('/', contactController.submit);

module.exports = router; 