const express = require('express');
const Team = require('../models/Team');

const router = express.Router();

// Get all team members (public)
router.get('/', async (req, res) => {
  try {
    const { department, leadership } = req.query;
    
    let filter = { isActive: true };
    
    if (department) {
      filter.department = department;
    }
    
    if (leadership === 'true') {
      filter.isLeadership = true;
    }
    
    const team = await Team.find(filter)
      .sort({ displayOrder: 1, createdAt: -1 })
      .select('-lastUpdatedBy');

    res.json(team);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single team member by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const teamMember = await Team.findById(id)
      .select('-lastUpdatedBy');

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json(teamMember);
  } catch (error) {
    console.error('Get team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new team member (admin)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      role,
      title,
      department,
      bio,
      image,
      email,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      skills,
      experience,
      achievements,
      education,
      contact,
      socialMedia,
      isFounder,
      isLeadership,
      displayOrder,
      lastUpdatedBy
    } = req.body;

    // Validation
    if (!name || !role || !bio) {
      return res.status(400).json({ message: 'Name, role, and bio are required' });
    }

    const teamMember = await Team.create({
      name,
      role,
      title,
      department,
      bio,
      image,
      email,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      skills: Array.isArray(skills) ? skills : [],
      experience,
      achievements: Array.isArray(achievements) ? achievements : [],
      education: education || {},
      contact: contact || {},
      socialMedia: socialMedia || {},
      isFounder: isFounder || false,
      isLeadership: isLeadership || false,
      displayOrder: displayOrder || 0,
      lastUpdatedBy: lastUpdatedBy || 'admin@ajirakinap.com'
    });

    res.status(201).json({ 
      message: 'Team member created successfully', 
      teamMember 
    });
  } catch (error) {
    console.error('Create team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update team member (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const teamMember = await Team.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json({ 
      message: 'Team member updated successfully', 
      teamMember 
    });
  } catch (error) {
    console.error('Update team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete team member (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await Team.findByIdAndDelete(id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Delete team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Soft delete team member (set inactive)
router.patch('/:id/deactivate', async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await Team.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json({ 
      message: 'Team member deactivated successfully', 
      teamMember 
    });
  } catch (error) {
    console.error('Deactivate team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reactivate team member
router.patch('/:id/activate', async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await Team.findByIdAndUpdate(
      id,
      { isActive: true, updatedAt: new Date() },
      { new: true }
    );

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json({ 
      message: 'Team member activated successfully', 
      teamMember 
    });
  } catch (error) {
    console.error('Activate team member error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update team member image
router.patch('/:id/image', async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image data is required' });
    }

    const teamMember = await Team.findByIdAndUpdate(
      id,
      { image, updatedAt: new Date() },
      { new: true }
    );

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    res.json({ 
      message: 'Team member image updated successfully', 
      image: teamMember.image 
    });
  } catch (error) {
    console.error('Update team member image error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get team statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalMembers = await Team.countDocuments({ isActive: true });
    const founders = await Team.countDocuments({ isActive: true, isFounder: true });
    const leadership = await Team.countDocuments({ isActive: true, isLeadership: true });
    
    const departmentStats = await Team.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalMembers,
      founders,
      leadership,
      departments: departmentStats
    });
  } catch (error) {
    console.error('Get team stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 