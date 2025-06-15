const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const ambassadorController = require('../controllers/ambassadorController');
const ambassadorTaskController = require('../controllers/ambassadorTaskController');
const ambassadorSubmissionController = require('../controllers/ambassadorSubmissionController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Ambassador registration
router.post('/register', protect, upload.fields([
  { name: 'ajiraId', maxCount: 1 },
  { name: 'schoolId', maxCount: 1 }
]), ambassadorController.register);

// Ambassador profile
router.get('/profile', protect, ambassadorController.getProfile);

// Ambassador points
router.get('/points', protect, ambassadorController.getPoints);

// Leaderboard
router.get('/leaderboard', ambassadorController.getLeaderboard);

// Ambassador: Get active tasks
router.get('/tasks', protect, ambassadorTaskController.getActiveTasks);

// Ambassador: Get a single task
router.get('/tasks/:taskId', protect, ambassadorTaskController.getTask);

// Ambassador: Submit proof for a task
router.post('/submissions', protect, upload.single('proof'), ambassadorSubmissionController.submitProof);

// Ambassador: Get my submissions
router.get('/submissions', protect, ambassadorSubmissionController.getMySubmissions);

// Admin: Create, update, delete tasks
router.post('/admin/tasks', protect, restrictTo('admin'), ambassadorTaskController.createTask);
router.patch('/admin/tasks/:taskId', protect, restrictTo('admin'), ambassadorTaskController.updateTask);
router.delete('/admin/tasks/:taskId', protect, restrictTo('admin'), ambassadorTaskController.deleteTask);

// Admin: Review a submission
router.patch('/admin/submissions/:submissionId', protect, restrictTo('admin'), ambassadorSubmissionController.reviewSubmission);

module.exports = router; 