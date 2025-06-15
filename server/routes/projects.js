const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router
  .route('/')
  .get(getAllProjects)
  .post(createProject);

router
  .route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

// Admin only routes
router.use(restrictTo('admin'));

module.exports = router; 