const express = require('express');
const router = express.Router();
const { Group, User } = require('../models');
const { Op } = require('sequelize');

// Create a group
router.post('/create', async (req, res) => {
  try {
    const { name, avatar, members, admins, description, createdById } = req.body;
    
    const group = await Group.create({
      name,
      avatar,
      description,
      createdById,
      members: members || [],
      admins: admins || []
    });
    
    res.status(201).json(group);
  } catch (err) {
    console.error('Error creating group:', err);
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
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${category}%` } },
          { category: category }
        ]
      }
    });

    if (!group) {
      // Create new group for this category
      group = await Group.create({
        name: `${category} Community`,
        description: `${category.toLowerCase()} discussions and community`,
        category: category,
        members: [userId],
        admins: [userId],
        createdById: userId
      });
    } else {
      // Add user to existing group if not already a member
      const members = group.members || [];
      if (!members.includes(userId)) {
        members.push(userId);
        group.members = members;
        await group.save();
      }
    }

    res.json({
      success: true,
      group: group,
      message: `Successfully joined ${group.name}`
    });
  } catch (err) {
    console.error('Error joining group:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(groups);
  } catch (err) {
    console.error('Error fetching groups:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get groups by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const groups = await Group.getByCategory(category);
    res.json(groups);
  } catch (err) {
    console.error('Error fetching groups by category:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get user's groups
router.post('/user', async (req, res) => {
  try {
    const { email, id } = req.body;
    
    // Check if database is connected
    const { sequelize } = require('../config/database');
    try {
      await sequelize.authenticate();
    } catch (dbError) {
      console.warn('Database not connected, returning default groups');
      return res.json([{
        id: 'kinap-ai',
        name: 'Kinap AI',
        description: 'Your AI assistant for programming help, study guidance, and career advice',
        avatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=150',
        members: [1],
        lastMessage: 'Say hello to start chatting! 😊',
        lastMessageTime: new Date(),
        unreadCount: 0,
        admins: [],
        type: 'ai',
        category: 'AI'
      }]);
    }

    let userId = id;
    
    // If no direct ID provided, try to find user by email
    if (!userId && email) {
      const user = await User.findOne({ where: { email } });
      if (user) {
        userId = user.id;
      }
    }

    if (!userId) {
      return res.json([{
        id: 'kinap-ai',
        name: 'Kinap AI',
        description: 'Your AI assistant for programming help, study guidance, and career advice',
        avatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=150',
        members: [1],
        lastMessage: 'Say hello to start chatting! 😊',
        lastMessageTime: new Date(),
        unreadCount: 0,
        admins: [],
        type: 'ai',
        category: 'AI'
      }]);
    }

    // Get user's groups
    const groups = await Group.getUserGroups(userId);
    
    // Always include Kinap AI group
    const defaultGroups = [{
      id: 'kinap-ai',
      name: 'Kinap AI',
      description: 'Your AI assistant for programming help, study guidance, and career advice',
      avatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=150',
      members: [userId],
      lastMessage: 'Say hello to start chatting! 😊',
      lastMessageTime: new Date(),
      unreadCount: 0,
      admins: [],
      type: 'ai',
      category: 'AI'
    }];

    const allGroups = [...defaultGroups, ...groups];
    res.json(allGroups);
  } catch (err) {
    console.error('Error fetching user groups:', err);
    // Return safe default on any error
    res.json([{
      id: 'kinap-ai',
      name: 'Kinap AI',
      description: 'Your AI assistant for programming help, study guidance, and career advice',
      avatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=150',
      members: [1],
      lastMessage: 'Say hello to start chatting! 😊',
      lastMessageTime: new Date(),
      unreadCount: 0,
      admins: [],
      type: 'ai',
      category: 'AI'
    }]);
  }
});

// Get user's groups by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const groups = await Group.getUserGroups(userId);
    res.json(groups);
  } catch (err) {
    console.error('Error fetching user groups by ID:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add user to group
router.post('/:groupId/add-user', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    await group.addMember(userId);
    res.json({ success: true, message: 'User added to group' });
  } catch (err) {
    console.error('Error adding user to group:', err);
    res.status(500).json({ error: err.message });
  }
});

// Remove user from group
router.post('/:groupId/remove-user', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    await group.removeMember(userId);
    res.json({ success: true, message: 'User removed from group' });
  } catch (err) {
    console.error('Error removing user from group:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get group details
router.get('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    
    // Handle AI group special case
    if (groupId === 'kinap-ai') {
      return res.json({
        id: 'kinap-ai',
        name: 'Kinap AI',
        description: 'Your AI assistant for programming help, study guidance, and career advice',
        avatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=150',
        members: [],
        admins: [],
        type: 'ai',
        category: 'AI'
      });
    }

    const group = await Group.findByPk(groupId, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'displayName', 'avatar']
        }
      ]
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (err) {
    console.error('Error fetching group details:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update group
router.put('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const updates = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    await group.update(updates);
    res.json(group);
  } catch (err) {
    console.error('Error updating group:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete group
router.delete('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    await group.destroy();
    res.json({ success: true, message: 'Group deleted successfully' });
  } catch (err) {
    console.error('Error deleting group:', err);
    res.status(500).json({ error: err.message });
  }
});

// Search groups
router.get('/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const groups = await Group.searchGroups(term);
    res.json(groups);
  } catch (err) {
    console.error('Error searching groups:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;