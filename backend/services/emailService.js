const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create Gmail SMTP transporter with explicit settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
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

// Email templates with simple, reliable HTML
const EMAIL_TEMPLATES = {
  verification: {
    subject: 'Kinap Ajira Club - Email Verification Code',
    html: (code, userName) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B4F72; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Kinap Ajira Club</h1>
          <p style="margin: 10px 0 0 0;">Email Verification</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2>Hello ${userName || 'there'}!</h2>
          <p>Welcome to <strong>Kinap Ajira Club</strong>! To complete your registration, please use the verification code below:</p>
          
          <div style="background: #1B4F72; color: white; font-size: 24px; font-weight: bold; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0; letter-spacing: 5px; font-family: monospace;">
            ${code}
          </div>
          
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 20px 0;">
            <h3>What's Next?</h3>
            <ul>
              <li>Enter this code in the verification form</li>
              <li>Complete your profile setup</li>
              <li>Start exploring our marketplace and mentorship programs</li>
            </ul>
          </div>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <strong>Security Notice:</strong>
            <ul>
              <li>This code expires in 15 minutes</li>
              <li>Never share this code with anyone</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>
          
          <p>Best regards,<br><strong>Kinap Ajira Club Team</strong></p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>© 2024 Kinap Ajira Club. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    `,
    text: (code, userName) => `
Kinap Ajira Club - Email Verification

Hello ${userName || 'there'}!

Welcome to Kinap Ajira Club! To complete your registration, please use the verification code below:

${code}

What's Next?
- Enter this code in the verification form
- Complete your profile setup
- Start exploring our marketplace and mentorship programs

Security Notice:
- This code expires in 15 minutes
- Never share this code with anyone
- If you didn't request this, please ignore this email

Best regards,
Kinap Ajira Club Team

© 2024 Kinap Ajira Club. All rights reserved.
This is an automated message, please do not reply.
    `
  },
  passwordReset: {
    subject: 'Kinap Ajira Club - Password Reset Code',
    html: (code, userName) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B4F72; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Kinap Ajira Club</h1>
          <p style="margin: 10px 0 0 0;">Password Reset</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2>Hello ${userName || 'there'}!</h2>
          <p>We received a request to reset your password for your <strong>Kinap Ajira Club</strong> account.</p>
          
          <div style="background: #1B4F72; color: white; font-size: 24px; font-weight: bold; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0; letter-spacing: 5px; font-family: monospace;">
            ${code}
          </div>
          
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <strong>Security Notice:</strong>
            <ul>
              <li>This code expires in 15 minutes</li>
              <li>Never share this code with anyone</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password will remain unchanged if you don't use this code</li>
            </ul>
          </div>
          
          <p>Best regards,<br><strong>Kinap Ajira Club Team</strong></p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>© 2024 Kinap Ajira Club. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    `,
    text: (code, userName) => `
Kinap Ajira Club - Password Reset

Hello ${userName || 'there'}!

We received a request to reset your password for your Kinap Ajira Club account.

Your verification code is: ${code}

Security Notice:
- This code expires in 15 minutes
- Never share this code with anyone
- If you didn't request this reset, please ignore this email
- Your password will remain unchanged if you don't use this code

Best regards,
Kinap Ajira Club Team

© 2024 Kinap Ajira Club. All rights reserved.
This is an automated message, please do not reply.
    `
  },
  welcome: {
    subject: 'Welcome to Kinap Ajira Club!',
    html: (userName) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1B4F72; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Kinap Ajira Club</h1>
          <p style="margin: 10px 0 0 0;">Welcome!</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2>Welcome ${userName}!</h2>
          <p>Congratulations! Your account has been successfully verified and you're now a member of the <strong>Kinap Ajira Club</strong> community!</p>
          
          <h3>What You Can Do Now:</h3>
          <ul>
            <li><strong>Marketplace:</strong> Browse and purchase services from fellow students</li>
            <li><strong>Mentorship:</strong> Connect with experienced mentors</li>
            <li><strong>Community:</strong> Join interest groups and participate in discussions</li>
            <li><strong>Training:</strong> Access educational content and resources</li>
            <li><strong>Showcase:</strong> Display your projects and skills</li>
          </ul>
          
          <p>Ready to get started? Complete your profile to unlock all features!</p>
          
          <p>Best regards,<br><strong>Kinap Ajira Club Team</strong></p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>© 2024 Kinap Ajira Club. All rights reserved.</p>
        </div>
      </div>
    `,
    text: (userName) => `
Welcome to Kinap Ajira Club!

Hello ${userName}!

Congratulations! Your account has been successfully verified and you're now a member of the Kinap Ajira Club community!

What You Can Do Now:
- Marketplace: Browse and purchase services from fellow students
- Mentorship: Connect with experienced mentors
- Community: Join interest groups and participate in discussions
- Training: Access educational content and resources
- Showcase: Display your projects and skills

Ready to get started? Complete your profile to unlock all features!

Best regards,
Kinap Ajira Club Team

© 2024 Kinap Ajira Club. All rights reserved.
    `
  }
};

// Generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send email using Gmail SMTP
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
    console.log('✅ Email sent successfully via Gmail SMTP');
    return data;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

// Send verification email
const sendVerificationEmail = async (email, code, userName = null) => {
  const template = EMAIL_TEMPLATES.verification;
  const html = template.html(code, userName);
  const text = template.text(code, userName);
  
  return await sendEmail(email, template.subject, html, text);
};

// Send password reset email
const sendPasswordResetEmail = async (email, code, userName = null) => {
  const template = EMAIL_TEMPLATES.passwordReset;
  const html = template.html(code, userName);
  const text = template.text(code, userName);
  
  return await sendEmail(email, template.subject, html, text);
};

// Send welcome email
const sendWelcomeEmail = async (email, userName) => {
  const template = EMAIL_TEMPLATES.welcome;
  const html = template.html(userName);
  const text = template.text(userName);
  
  return await sendEmail(email, template.subject, html, text);
};

// Test Gmail SMTP connection
const testGmailConnection = async () => {
  try {
    // Test by sending a test email to ourselves
    const testMailOptions = {
      from: `"Kinap Ajira Club Test" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to ourselves
      subject: 'Kinap Ajira Club - SMTP Test',
      html: '<h1>SMTP Test Successful!</h1><p>Your Gmail SMTP configuration is working correctly.</p>',
      text: 'SMTP Test Successful! Your Gmail SMTP configuration is working correctly.'
    };

    await transporter.sendMail(testMailOptions);
    return { working: true, message: 'Gmail SMTP connection and authentication successful' };
  } catch (error) {
    return { working: false, message: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  generateVerificationCode,
  testGmailConnection,
  EMAIL_TEMPLATES
}; 