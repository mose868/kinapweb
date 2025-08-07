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

// Get user's groups based on email
router.post('/user', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // First fetch both collections
    const Student = require('../models/Student');
    const User = require('../models/User');

    let userDoc = await User.findOne({ email });
    let studentDoc = await Student.findOne({ email });

    // Prefer studentDoc for group membership (because Group refs Student)
    const primaryDoc = studentDoc || userDoc;
    if (!primaryDoc) {
      return res.status(404).json({ error: 'User not found in either collection' });
    }

    // Merge skills / interests
    let mergedSkills = [];
    let mergedInterests = [];
    if (studentDoc && Array.isArray(studentDoc.skills)) mergedSkills = mergedSkills.concat(studentDoc.skills);
    if (userDoc && Array.isArray(userDoc.skills)) mergedSkills = mergedSkills.concat(userDoc.skills);
    if (studentDoc && Array.isArray(studentDoc.interests)) mergedInterests = mergedInterests.concat(studentDoc.interests);
    if (userDoc && Array.isArray(userDoc.interests)) mergedInterests = mergedInterests.concat(userDoc.interests);
    mergedSkills = [...new Set(mergedSkills.filter(Boolean))];
    mergedInterests = [...new Set(mergedInterests.filter(Boolean))];

    console.log('👤 Email:', email, '\n   Skills:', mergedSkills, '\n   Interests:', mergedInterests);

    // replace uses of user with primaryDoc, userSkills with mergedSkills, userInterests with mergedInterests, and user._id with primaryDoc._id

    // Find groups where the user is a member
    const groups = await Group.find({ 
      members: primaryDoc._id 
    }).populate('members', 'fullname email photoURL');

    // Always ensure Kinap AI group exists and user is a member
    let kinapAIGroup = await Group.findOne({ name: 'Kinap AI' });
    if (!kinapAIGroup) {
      kinapAIGroup = new Group({
        name: 'Kinap AI',
        description: 'Your AI assistant for programming help, study guidance, and career advice',
        members: [primaryDoc._id],
        admins: [primaryDoc._id],
        createdBy: primaryDoc._id,
        avatar: 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=150',
        type: 'ai'
      });
      await kinapAIGroup.save();
    } else {
      // Add user to Kinap AI group if not already a member
      if (!kinapAIGroup.members.includes(primaryDoc._id)) {
        kinapAIGroup.members.push(primaryDoc._id);
        await kinapAIGroup.save();
      }
    }

    // Always include Kinap AI group
    const allGroups = [...groups];
    
    // Check if Kinap AI is already in the groups list
    const hasKinapAI = allGroups.some(group => group.name === 'Kinap AI');
    if (!hasKinapAI) {
      allGroups.unshift(kinapAIGroup); // Add Kinap AI at the beginning
    }
    
    console.log('📊 Current groups for user:', allGroups.map(g => g.name));

    // Always ensure user is added to groups based on their skills
    let userSkills = [];
    if (mergedSkills.length > 0) {
      console.log('🎯 Processing user skills:', mergedSkills);
      
      for (const skill of mergedSkills) {
        let group = await Group.findOne({ name: skill });
        
        if (!group) {
          // Create new group for this skill
          console.log('📝 Creating new group for skill:', skill);
          group = new Group({
            name: skill,
            description: `Community group for ${skill} enthusiasts`,
            members: [primaryDoc._id],
            admins: [primaryDoc._id],
            createdBy: primaryDoc._id,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(skill)}&background=1B4F72&color=FFFFFF&bold=true&size=150`
          });
          await group.save();
          
          // Add to allGroups if not already there
          if (!allGroups.some(g => g._id.equals(group._id))) {
            allGroups.push(group);
          }
        } else {
          // Add user to existing group if not already a member
          if (!group.members.includes(primaryDoc._id)) {
            console.log('👤 Adding user to existing group:', skill);
            group.members.push(primaryDoc._id);
            await group.save();
          }
          
          // Add to allGroups if not already there
          if (!allGroups.some(g => g._id.equals(group._id))) {
            allGroups.push(group);
          }
        }
      }
    }

    // Always ensure user is added to groups based on their interests
    let userInterests = [];
    if (mergedInterests.length > 0) {
      console.log('🎯 Processing user interests:', mergedInterests);
      
      for (const interest of mergedInterests) {
        let group = await Group.findOne({ name: interest });
        
        if (!group) {
          // Create new group for this interest
          console.log('📝 Creating new group for interest:', interest);
          group = new Group({
            name: interest,
            description: `Community group for ${interest} enthusiasts`,
            members: [primaryDoc._id],
            admins: [primaryDoc._id],
            createdBy: primaryDoc._id,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(interest)}&background=1B4F72&color=FFFFFF&bold=true&size=150`
          });
          await group.save();
          
          // Add to allGroups if not already there
          if (!allGroups.some(g => g._id.equals(group._id))) {
            allGroups.push(group);
          }
        } else {
          // Add user to existing group if not already a member
          if (!group.members.includes(primaryDoc._id)) {
            console.log('👤 Adding user to existing interest group:', interest);
            group.members.push(primaryDoc._id);
            await group.save();
          }
          
          // Add to allGroups if not already there
          if (!allGroups.some(g => g._id.equals(group._id))) {
            allGroups.push(group);
          }
        }
      }
    }

    // Always return all groups (including skill-based ones we just processed)
    const finalGroups = await Group.find({ 
      _id: { $in: allGroups.map(g => g._id) }
    }).populate('members', 'fullname email photoURL');
    
    console.log('📤 Returning', finalGroups.length, 'final groups for user:', email);
    res.json({ groups: finalGroups });
  } catch (err) {
    console.error('Error fetching user groups:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 