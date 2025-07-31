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

// Join group by category
router.post('/join/:category', async (req, res) => {
  try {
    const { userId } = req.body;
    const { category } = req.params;

    // Find or create group by category
    let group = await Group.findOne({ 
      name: { $regex: new RegExp(category, 'i') },
      category: category 
    });

    if (!group) {
      // Create new group for this category
      group = new Group({
        name: `${category} Community`,
        description: `${category.toLowerCase()} discussions and community`,
        category: category,
        members: [userId],
        admins: [userId],
        createdBy: userId
      });
      await group.save();
    } else {
      // Add user to existing group if not already a member
      if (!group.members.includes(userId)) {
        group.members.push(userId);
        await group.save();
      }
    }

    // Add group to user's groups
    await User.findByIdAndUpdate(userId, { 
      $addToSet: { groups: group._id } 
    });

    res.json({ 
      success: true, 
      group,
      message: `Successfully joined ${category} group`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leave group
router.post('/leave/:groupId', async (req, res) => {
  try {
    const { userId } = req.body;
    const { groupId } = req.params;

    // Remove user from group
    const group = await Group.findByIdAndUpdate(
      groupId,
      { $pull: { members: userId } },
      { new: true }
    );

    // Remove group from user's groups
    await User.findByIdAndUpdate(userId, { 
      $pull: { groups: groupId } 
    });

    res.json({ 
      success: true, 
      message: 'Successfully left the group'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's groups
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate({
      path: 'groups',
      populate: {
        path: 'members',
        select: 'displayName avatar'
      }
    });
    
    res.json(user.groups || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get groups by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const groups = await Group.find({ 
      category: category 
    }).populate('members', 'displayName avatar');
    
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Check if user is member of group
router.get('/:groupId/member/:userId', async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const isMember = group.members.includes(userId);
    res.json({ isMember });
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
    const groups = await Group.find().populate('members', 'displayName avatar');
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 