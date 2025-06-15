const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure nodemailer (use your SMTP credentials or a service like Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper to send verification email
async function sendVerificationEmail(client, req) {
  const token = crypto.randomBytes(32).toString('hex');
  client.verificationToken = token;
  await client.save();
  const verifyUrl = `${req.protocol}://${req.get('host')}/api/client/verify-email?token=${token}&email=${client.email}`;
  await transporter.sendMail({
    to: client.email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
  });
}

// Register a new client
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existing = await Client.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    const client = new Client({ name, email, password });
    await sendVerificationEmail(client, req);
    res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Verify email
router.get('/verify-email', async (req, res) => {
  try {
    const { token, email } = req.query;
    const client = await Client.findOne({ email, verificationToken: token });
    if (!client) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }
    client.isVerified = true;
    client.verificationToken = undefined;
    await client.save();
    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (client.isVerified) {
      return res.status(400).json({ message: 'Account already verified.' });
    }
    await sendVerificationEmail(client, req);
    res.json({ message: 'Verification email resent.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login a client (only if verified)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' });
    }
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    if (!client.isVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in.' });
    }
    const isMatch = await client.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    res.json({ message: 'Login successful.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    client.resetPasswordToken = token;
    client.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await client.save();
    const resetUrl = `${req.protocol}://${req.get('host')}/api/client/reset-password?token=${token}&email=${client.email}`;
    await transporter.sendMail({
      to: client.email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
    });
    res.json({ message: 'Password reset email sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    const client = await Client.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!client) {
      return res.status(400).json({ message: 'Invalid or expired reset link.' });
    }
    client.password = newPassword;
    client.resetPasswordToken = undefined;
    client.resetPasswordExpires = undefined;
    await client.save();
    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 