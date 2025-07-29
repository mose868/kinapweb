const express = require('express');
const router = express.Router();

// Sample metrics data
router.get('/', (req, res) => {
  res.json({
    studentsTrained: 1000,
    successStories: 150,
    skillsPrograms: 50,
    digitalExcellence: 100
  });
});

module.exports = router; 