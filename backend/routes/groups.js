const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');

// Create a group
router.post('/create', async (req, res) => {
  try {
    const { name, avatar, members, admins, description, createdBy } = req.body;
    const group = new Group({ name, avatar, members, admins, description, createdBy });
    await group.save();
    // Add group to users
    await User.updateMany({ _id: { $in: members } }, { $push: { groups: group._id } });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add member to group
router.post('/:groupId/add', async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findByIdAndUpdate(
      req.params.groupId,
      { $addToSet: { members: userId } },
      { new: true }
    );
    await User.findByIdAndUpdate(userId, { $addToSet: { groups: group._id } });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove member from group
router.post('/:groupId/remove', async (req, res) => {
  try {
    const { userId } = req.body;
    const group = await Group.findByIdAndUpdate(
      req.params.groupId,
      { $pull: { members: userId } },
      { new: true }
    );
    await User.findByIdAndUpdate(userId, { $pull: { groups: group._id } });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get group info
router.get('/:groupId', async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('members admins messages');
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 