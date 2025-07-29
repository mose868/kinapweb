const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const crypto = require('crypto');
const transporter = require('../config/email');
const Group = require('../models/Group');

const router = express.Router();

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
    const safeSkills = typeof skills === 'string' ? skills : '';

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

    // Send verification email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: student.email,
        subject: 'Verify your Ajira Digital account',
        html: `<p>Hello ${student.fullname},</p>
               <p>Your verification code is:</p>
               <h2 style="letter-spacing: 4px;">${verificationCode}</h2>
               <p>This code expires in 15 minutes.</p>`,
      });
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

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: student.email,
      subject: 'Your new Ajira Digital verification code',
      html: `<p>Your new verification code:</p>
             <h2>${verificationCode}</h2>
             <p>Expires in 15 minutes.</p>`,
    });

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

// Update student profile
router.post('/update-profile', async (req, res) => {
  try {
    const { email, ...updateData } = req.body;
    
    console.log('Update profile request for:', email);
    console.log('Update data keys:', Object.keys(updateData));
    
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
    
    const student = await Student.findOneAndUpdate(
      { email },
      { $set: { ...updateData, updatedAt: new Date() } },
      { new: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    console.log('Profile updated successfully, photoURL saved:', !!student.photoURL);
    res.json({ message: 'Profile updated successfully', student });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 