const express = require('express');
const Team = require('../models/Team');
const { sequelize } = require('../config/database');

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
    
    const team = await Team.findAll({
      where: filter,
      order: [
        ['displayOrder', 'ASC'],
        ['createdAt', 'DESC']
      ],
      attributes: { exclude: ['lastUpdatedBy'] }
    });

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
    
    const teamMember = await Team.findByPk(id, {
      attributes: { exclude: ['lastUpdatedBy'] }
    });

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

    const teamMember = await Team.findByPk(id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await teamMember.update({ ...updateData, updatedAt: new Date() });

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

    const teamMember = await Team.findByPk(id);
    
    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await teamMember.destroy();

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

    const teamMember = await Team.findByPk(id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await teamMember.update({ 
      isActive: false, 
      updatedAt: new Date() 
    });

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

    const teamMember = await Team.findByPk(id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await teamMember.update({ 
      isActive: true, 
      updatedAt: new Date() 
    });

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

    const teamMember = await Team.findByPk(id);

    if (!teamMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    await teamMember.update({ 
      image, 
      updatedAt: new Date() 
    });

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
    const [totalMembers, founders, leadership] = await Promise.all([
      Team.count({ where: { isActive: true } }),
      Team.count({ where: { isActive: true, isFounder: true } }),
      Team.count({ where: { isActive: true, isLeadership: true } })
    ]);
    
    // Get department statistics
    const [results] = await sequelize.query(`
      SELECT department, COUNT(*) as count 
      FROM teams 
      WHERE isActive = true AND department IS NOT NULL 
      GROUP BY department 
      ORDER BY count DESC
    `);

    res.json({
      totalMembers,
      founders,
      leadership,
      departments: results
    });
  } catch (error) {
    console.error('Get team stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 