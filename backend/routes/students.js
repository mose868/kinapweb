const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const crypto = require('crypto');
const { sendVerificationEmail, sendWelcomeEmail } = require('../services/emailService');
const Group = require('../models/Group');

const router = express.Router();

// Test endpoint to verify backend is working
router.get('/test', (req, res) => {
  res.json({ message: 'Students backend is working!', timestamp: new Date() });
});

// Register student
router.post('/register-student', async (req, res) => {
  try {
    const { fullname, idNo, course, year, skills, experience, email, phone, password, interests } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ message: 'Please provide required fields' });
    }

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const safeInterests = Array.isArray(interests) ? interests : [];
    const safeSkills = Array.isArray(skills) ? skills : (typeof skills === 'string' ? [skills] : []);

    const student = await Student.create({
      fullname,
      idNo,
      course,
      year,
      skills: safeSkills,
      experience,
      email,
      phone,
      password,
      isVerified: false,
      interests: safeInterests,
    });

    // Auto-join interest groups
    if (safeInterests.length > 0) {
      for (const interest of safeInterests) {
        let group = await Group.findOne({ name: interest });
        if (!group) {
          group = await Group.create({ name: interest, members: [student._id], admins: [student._id], description: `${interest} group`, createdBy: student._id });
        } else {
          if (!group.members.includes(student._id)) {
            group.members.push(student._id);
            await group.save();
          }
        }
      }
    }

    // Generate verification code (6 digit)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    student.verificationCode = verificationCode;
    student.verificationCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await student.save();

    // Send verification email using Brevo
    try {
      await sendVerificationEmail(student.email, verificationCode, student.fullname);
    } catch (mailErr) {
      console.error('Error sending verification email', mailErr);
    }

    res.status(201).json({ message: 'Registration successful. Verification code sent to email.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify code
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (student.isVerified) {
      return res.json({ message: 'Account already verified' });
    }

    if (student.verificationCode !== code || student.verificationCodeExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    student.isVerified = true;
    student.verificationCode = undefined;
    student.verificationCodeExpires = undefined;
    await student.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(student.email, student.fullname);
    } catch (mailErr) {
      console.error('Error sending welcome email', mailErr);
    }

    res.json({ message: 'Account verified successfully' });
  } catch (error) {
    console.error('Verify code error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Resend verification code
router.post('/resend-code', async (req, res) => {
  try {
    const { email } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: 'Invalid email' });

    if (student.isVerified) return res.json({ message: 'Account already verified' });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    student.verificationCode = verificationCode;
    student.verificationCodeExpires = Date.now() + 15 * 60 * 1000;
    await student.save();

    await sendVerificationEmail(student.email, verificationCode, student.fullname);

    res.json({ message: 'Verification code resent' });
  } catch (error) {
    console.error('Resend code error', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login student
router.post('/login-student', async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!student.isVerified) {
      return res.status(401).json({ message: 'Account not verified. Please check your email for the code.' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: student._id,
        email: student.email,
        fullname: student.fullname,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student profile
router.post('/get-profile', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Get profile request for:', email);
    const student = await Student.findOne({ email }).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    console.log('Profile found, has photoURL:', !!student.photoURL);
    if (student.photoURL) {
      console.log('PhotoURL length:', student.photoURL.length);
    }
    res.json(student);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ajira trainings/interests (sample list)
const AJIRA_TRAININGS = [
  'Web Development',
  'Data Science',
  'Digital Marketing',
  'Graphic Design',
  'Cybersecurity',
  'Entrepreneurship',
  'Mobile App Development',
  'UI/UX Design',
  'Cloud Computing',
  'AI & Machine Learning',
  'Project Management',
  'Business Analytics',
  'E-Commerce',
  'Content Creation',
  'Blockchain',
];

// Endpoint to get Ajira trainings/interests
router.get('/ajira-trainings', (req, res) => {
  res.json({ trainings: AJIRA_TRAININGS });
});

// Update student profile
router.post('/update-profile', async (req, res) => {
  try {
    const { email, ...updateData } = req.body;
    
    console.log('Update profile request for:', email);
    console.log('Update data keys:', Object.keys(updateData));
    console.log('Update data:', updateData);
    
    // Log specific profile completion fields
    const profileFields = ['bio', 'location', 'ajiraGoals', 'linkedinProfile', 'photoURL'];
    profileFields.forEach(field => {
      if (updateData[field]) {
        console.log(`✅ ${field}: ${field === 'photoURL' ? 'Image data (' + updateData[field].length + ' chars)' : updateData[field].substring(0, 50)}${updateData[field].length > 50 ? '...' : ''}`);
      } else {
        console.log(`❌ ${field}: Not provided`);
      }
    });
    
    if (updateData.photoURL) {
      console.log('PhotoURL present, length:', updateData.photoURL.length);
    }
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const student = await Student.findOneAndUpdate(
      { email },
      { $set: { ...updateData, updatedAt: new Date() } },
      { new: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Auto-add to interest groups if interests are updated
    try {
      console.log('🔍 Checking for interests:', updateData.interests);
      if (updateData.interests && Array.isArray(updateData.interests)) {
        console.log('✅ Interests found:', updateData.interests);
        const Group = require('../models/Group');
        console.log('📦 Group model loaded successfully');
        
        for (const interest of updateData.interests) {
          console.log(`🎯 Processing interest: ${interest}`);
          let group = await Group.findOne({ name: interest });
          
          if (!group) {
            console.log(`📝 Creating new group for interest: ${interest}`);
            group = await Group.create({ 
              name: interest, 
              members: [student._id], 
              admins: [student._id], 
              description: `${interest} group`, 
              createdBy: student._id 
            });
            console.log(`✅ Created group: ${interest} with ID: ${group._id}`);
          } else {
            console.log(`📋 Found existing group: ${interest}`);
            let updated = false;
            if (!group.members.includes(student._id)) {
              group.members.push(student._id);
              updated = true;
              console.log(`👤 Added user to group: ${interest}`);
            }
            if (!group.admins.includes(student._id)) {
              group.admins.push(student._id);
              updated = true;
              console.log(`👑 Made user admin of group: ${interest}`);
            }
            if (updated) {
              await group.save();
              console.log(`💾 Saved group updates for: ${interest}`);
            }
          }
        }
      } else {
        console.log('❌ No interests found or interests is not an array');
        console.log('Interests data:', updateData.interests);
      }
    } catch (groupError) {
      console.error('❌ Error adding user to interest groups:', groupError);
      console.error('Error stack:', groupError.stack);
      // Don't fail the profile update if group assignment fails
    }

    // Auto-add to skill-based groups if skills are updated
    try {
      console.log('🔍 Checking for skills:', updateData.skills);
      if (updateData.skills && Array.isArray(updateData.skills)) {
        updateData.skills = updateData.skills.filter(s => s && s.trim());
      }
      console.log('✅ Skills found:', updateData.skills);
      const Group = require('../models/Group');
      console.log('📦 Group model loaded successfully for skills');
      
      for (const skill of updateData.skills) {
        console.log(`🎯 Processing skill: ${skill}`);
        let group = await Group.findOne({ name: skill });
        
        if (!group) {
          console.log(`📝 Creating new group for skill: ${skill}`);
          group = await Group.create({ 
            name: skill, 
            members: [student._id], 
            admins: [student._id], 
            description: `Community group for ${skill} enthusiasts`, 
            createdBy: student._id,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(skill)}&background=1B4F72&color=FFFFFF&bold=true&size=150`
          });
          console.log(`✅ Created skill group: ${skill} with ID: ${group._id}`);
        } else {
          console.log(`📋 Found existing skill group: ${skill}`);
          let updated = false;
          if (!group.members.includes(student._id)) {
            group.members.push(student._id);
            updated = true;
            console.log(`👤 Added user to skill group: ${skill}`);
          }
          if (!group.admins.includes(student._id)) {
            group.admins.push(student._id);
            updated = true;
            console.log(`👑 Made user admin of skill group: ${skill}`);
          }
          if (updated) {
            await group.save();
            console.log(`💾 Saved skill group updates for: ${skill}`);
          }
        }
      }
    } catch (groupError) {
      console.error('❌ Error adding user to skill groups:', groupError);
      console.error('Error stack:', groupError.stack);
      // Don't fail the profile update if group assignment fails
    }
    console.log('Profile updated successfully, photoURL saved:', !!student.photoURL);
    res.json({ message: 'Profile updated successfully', student });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 