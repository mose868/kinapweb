const Ambassador = require('../models/Ambassador');
const AmbassadorTask = require('../models/AmbassadorTask');
const AmbassadorSubmission = require('../models/AmbassadorSubmission');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Submit proof for a task
exports.submitProof = async (req, res) => {
  try {
    const { taskId } = req.body;
    const proofType = req.body.proofType;
    let proofUrl = req.body.proofUrl;
    if (req.file) {
      proofUrl = req.file.path;
    }
    if (!taskId || !proofType || !proofUrl) {
      return res.status(400).json({ status: 'error', message: 'All fields are required.' });
    }
    const ambassador = await Ambassador.findOne({ user: req.user._id });
    if (!ambassador) {
      return res.status(400).json({ status: 'error', message: 'You must register as an ambassador first.' });
    }
    // Prevent duplicate submission for the same task
    const exists = await AmbassadorSubmission.findOne({ ambassador: ambassador._id, task: taskId });
    if (exists) {
      return res.status(400).json({ status: 'error', message: 'You have already submitted proof for this task.' });
    }
    const submission = await AmbassadorSubmission.create({
      ambassador: ambassador._id,
      task: taskId,
      proofUrl,
      proofType
    });
    res.status(201).json({ status: 'success', data: { submission } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Get all submissions for the current ambassador
exports.getMySubmissions = async (req, res) => {
  try {
    const ambassador = await Ambassador.findOne({ user: req.user._id });
    if (!ambassador) {
      return res.status(400).json({ status: 'error', message: 'You must register as an ambassador first.' });
    }
    const submissions = await AmbassadorSubmission.find({ ambassador: ambassador._id })
      .populate('task')
      .sort('-createdAt');
    res.status(200).json({ status: 'success', data: { submissions } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Admin: Review a submission
exports.reviewSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, feedback } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Invalid status.' });
    }
    const submission = await AmbassadorSubmission.findById(submissionId).populate('ambassador');
    if (!submission) {
      return res.status(404).json({ status: 'error', message: 'Submission not found.' });
    }
    submission.status = status;
    submission.feedback = feedback;
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    await submission.save();
    // Update ambassador points if approved
    if (status === 'Approved') {
      const task = await AmbassadorTask.findById(submission.task);
      await Ambassador.findByIdAndUpdate(submission.ambassador._id, { $inc: { points: task.points } });
    }
    // Optionally: send email notification to ambassador
    res.status(200).json({ status: 'success', data: { submission } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}; 