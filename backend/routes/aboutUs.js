const express = require('express');
const AboutUs = require('../models/AboutUs');

const router = express.Router();

// Get About Us content (public)
router.get('/', async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne({ isActive: true }).sort({ createdAt: -1 });
    
    if (!aboutUs) {
      // Return default content if none exists
      return res.json({
        title: "Welcome to Ajira Digital KiNaP Club",
        description: "Empowering students with digital skills for the future.",
        mission: "To bridge the digital skills gap and create opportunities for students.",
        vision: "A digitally empowered generation of skilled professionals.",
        values: ["Innovation", "Excellence", "Collaboration", "Growth"],
        history: "Founded to help students succeed in the digital economy.",
        teamDescription: "A passionate team of educators and industry professionals.",
        contactInfo: {
          email: "info@ajirakinap.com",
          phone: "+254 700 000 000",
          address: "Nairobi, Kenya"
        },
        socialLinks: {
          facebook: "",
          twitter: "",
          linkedin: "",
          instagram: ""
        },
        images: {
          heroImage: "",
          aboutImage: "",
          galleryImages: []
        },
        stats: {
          membersCount: 0,
          projectsCompleted: 0,
          skillsOffered: 0,
          successStories: 0
        }
      });
    }
    
    res.json(aboutUs);
  } catch (error) {
    console.error('Get About Us error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or Update About Us content (admin)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      mission,
      vision,
      values,
      history,
      teamDescription,
      contactInfo,
      socialLinks,
      images,
      stats,
      lastUpdatedBy
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // Deactivate previous entries
    await AboutUs.updateMany({}, { isActive: false });

    // Create new entry
    const aboutUs = await AboutUs.create({
      title,
      description,
      mission,
      vision,
      values: Array.isArray(values) ? values : [],
      history,
      teamDescription,
      contactInfo: contactInfo || {},
      socialLinks: socialLinks || {},
      images: images || {},
      stats: stats || {},
      lastUpdatedBy: lastUpdatedBy || 'admin@ajirakinap.com',
      isActive: true
    });

    res.status(201).json({ 
      message: 'About Us content created successfully', 
      aboutUs 
    });
  } catch (error) {
    console.error('Create About Us error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update existing About Us content
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const aboutUs = await AboutUs.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!aboutUs) {
      return res.status(404).json({ message: 'About Us content not found' });
    }

    res.json({ 
      message: 'About Us content updated successfully', 
      aboutUs 
    });
  } catch (error) {
    console.error('Update About Us error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete About Us content (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const aboutUs = await AboutUs.findByIdAndDelete(id);
    
    if (!aboutUs) {
      return res.status(404).json({ message: 'About Us content not found' });
    }

    res.json({ message: 'About Us content deleted successfully' });
  } catch (error) {
    console.error('Delete About Us error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload images for About Us
router.post('/upload-images', async (req, res) => {
  try {
    const { aboutUsId, images } = req.body;
    
    if (!aboutUsId || !images) {
      return res.status(400).json({ message: 'About Us ID and images are required' });
    }

    const aboutUs = await AboutUs.findByIdAndUpdate(
      aboutUsId,
      { 
        $set: { 
          'images': images,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!aboutUs) {
      return res.status(404).json({ message: 'About Us content not found' });
    }

    res.json({ 
      message: 'Images uploaded successfully', 
      images: aboutUs.images 
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update stats only
router.patch('/stats', async (req, res) => {
  try {
    const { stats } = req.body;
    
    const aboutUs = await AboutUs.findOneAndUpdate(
      { isActive: true },
      { 
        $set: { 
          'stats': stats,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!aboutUs) {
      return res.status(404).json({ message: 'About Us content not found' });
    }

    res.json({ 
      message: 'Stats updated successfully', 
      stats: aboutUs.stats 
    });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 