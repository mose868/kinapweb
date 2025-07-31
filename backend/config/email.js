const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  debug: true,
  logger: true,
  tls: {
    rejectUnauthorized: false
  }
});

// Email sending function using Gmail SMTP
const sendEmail = async (to, subject, html, text = null) => {
  const mailOptions = {
    from: `"Kinap Ajira Club" <${process.env.GMAIL_USER}>`,
    to: to,
    subject: subject,
    html: html,
    text: text
  };

  try {
    const data = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = { transporter, sendEmail }; 