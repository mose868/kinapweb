const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const Group = require('../models/Group');

// Send a message (private or group)
router.post('/send', async (req, res) => {
  try {
    const { sender, recipient, group, content, type } = req.body;
    const message = new Message({ sender, recipient, group, content, type });
    await message.save();
    // Optionally push to group.messages
    if (group) {
      await Group.findByIdAndUpdate(group, { $push: { messages: message._id } });
    }
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch private messages between two users
router.get('/private/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { otherUserId } = req.query;
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch group messages
router.get('/group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await Message.find({ group: groupId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 