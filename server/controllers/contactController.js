const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const { sanitizeMessage } = require('../utils/sanitizer');

// Submit contact/feedback form
exports.submit = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ status: 'error', message: 'All fields are required.' });
    }
    const contact = await Contact.create({
      name: sanitizeMessage(name),
      email,
      message: sanitizeMessage(message)
    });
    // Send email notification (optional)
    if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: process.env.EMAIL_USERNAME,
        subject: 'New Contact/Feedback Submission',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
      });
    }
    res.status(201).json({ status: 'success', data: { contact } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
}; 