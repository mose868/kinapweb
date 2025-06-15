const AmbassadorTask = require('../models/AmbassadorTask');
const AmbassadorSubmission = require('../models/AmbassadorSubmission');

// Admin: Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, points } = req.body;
    const task = await AmbassadorTask.create({
      title,
      description,
      points,
      createdBy: req.user._id
    });
    res.status(201).json({ status: 'success', data: { task } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Admin: Update a task
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, points, isActive } = req.body;
    const task = await AmbassadorTask.findByIdAndUpdate(
      taskId,
      { title, description, points, isActive },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
    res.status(200).json({ status: 'success', data: { task } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Admin: Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    await AmbassadorTask.findByIdAndDelete(taskId);
    res.status(200).json({ status: 'success', message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all active tasks (for ambassadors)
exports.getActiveTasks = async (req, res) => {
  try {
    const tasks = await AmbassadorTask.find({ isActive: true }).sort('-createdAt');
    res.status(200).json({ status: 'success', data: { tasks } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get a single task
exports.getTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await AmbassadorTask.findById(taskId);
    if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
    res.status(200).json({ status: 'success', data: { task } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}; 