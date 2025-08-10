# Better Auth Email Integration Setup Guide

This guide covers the complete integration of Better Auth to handle all email functionality for the Ajira Digital KiNaP Club application.

## 🎯 **What Better Auth Now Handles**

### **Email Types Managed by Better Auth:**
- ✅ **Welcome emails** - Sent to new users upon registration
- ✅ **Password reset emails** - Secure password reset functionality
- ✅ **Ambassador application emails** - Application confirmations and status updates
- ✅ **Mentor application emails** - Application confirmations and notifications
- ✅ **Contact form emails** - User inquiries and admin notifications
- ✅ **Custom template emails** - Flexible email system for future needs

## 🔧 **Backend Configuration**

### **1. Better Auth Configuration (`backend/auth.js`)**

The Better Auth configuration now includes:

```javascript
// Email configuration
email: {
  from: `"Ajira Digital KiNaP Club" <${process.env.GMAIL_USER}>`,
  transport: {
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  },
  templates: {
    // All email templates are defined here
    passwordReset: { /* template */ },
    welcome: { /* template */ },
    ambassadorApplication: { /* template */ },
    ambassadorStatusUpdate: { /* template */ },
  },
},

// Callbacks for automatic email sending
callbacks: {
  onSignUp: async (user) => {
    // Automatically sends welcome email
  },
  onPasswordReset: async (user, resetUrl) => {
    // Automatically sends password reset email
  },
}
```

### **2. Environment Variables Required**

```env
# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Admin email for contact form notifications
ADMIN_EMAIL=admin@yourdomain.com

# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=your-secret-key-change-this-in-production
```

### **3. Database Schema Updates**

The User model now includes all necessary fields:

```javascript
// Password reset fields
resetPasswordToken: { type: "string", required: false },
resetPasswordExpires: { type: "date", required: false },

// Biometric fields
biometricEnabled: { type: "boolean", required: false, default: false },
biometricCredentials: { type: "array", required: false },
biometricAuthHistory: { type: "array", required: false },

// Login history
loginHistory: { type: "array", required: false },
```

## 📧 **Email Templates**

### **1. Password Reset Email**
- **Subject**: "Reset Your Password - Ajira Digital KiNaP Club"
- **Features**: Professional design, secure reset link, 1-hour expiration
- **Triggers**: When user requests password reset

### **2. Welcome Email**
- **Subject**: "Welcome to Ajira Digital KiNaP Club!"
- **Features**: Personalized welcome, next steps guide, profile completion link
- **Triggers**: Automatically sent on user registration

### **3. Ambassador Application Email**
- **Subject**: "Ambassador Application Received - Ajira Digital KiNaP Club"
- **Features**: Application confirmation, details summary, tracking information
- **Triggers**: When ambassador application is submitted

### **4. Ambassador Status Update Email**
- **Subject**: "Ambassador Application Update - Ajira Digital KiNaP Club"
- **Features**: Status-specific messaging, congratulations/feedback sections
- **Triggers**: When application status changes (approved/rejected/under review)

### **5. Mentor Application Email**
- **Subject**: "Mentor Application Received - Ajira Digital KiNaP Club"
- **Features**: Application confirmation, skills summary, mentorship program link
- **Triggers**: When mentor application is submitted

### **6. Contact Form Email**
- **Subject**: "New Contact Form Submission: [Subject]"
- **Features**: Admin notification + user confirmation, message details
- **Triggers**: When contact form is submitted

## 🚀 **API Integration**

### **1. Password Reset Routes**
```javascript
// Forgot Password
POST /api/auth/forgot-password
// Uses Better Auth's forgotPassword method

// Reset Password
POST /api/auth/reset-password
// Uses Better Auth's resetPassword method

// Verify Token
GET /api/auth/verify-reset-token/:token
// Uses Better Auth's verifyResetToken method
```

### **2. Ambassador Application Routes**
```javascript
// Submit Application
POST /api/ambassador/applications
// Automatically sends confirmation email

// Update Application Status
PUT /api/ambassador/applications/:id
// Automatically sends status update email
```

### **3. Email Service Functions**
```javascript
const betterAuthEmailService = require('./services/betterAuthEmailService');

// Send welcome email
await betterAuthEmailService.sendWelcomeEmail(user);

// Send ambassador application email
await betterAuthEmailService.sendAmbassadorApplicationEmail(application);

// Send status update email
await betterAuthEmailService.sendAmbassadorStatusUpdateEmail(application, status, message, feedback);

// Send contact form email
await betterAuthEmailService.sendContactFormEmail(contactData);

// Send custom email
await betterAuthEmailService.sendCustomEmail(to, subject, templateName, data);

// Send bulk email
await betterAuthEmailService.sendBulkEmail(recipients, subject, templateName, data);
```

## 🧪 **Testing the Email System**

### **1. Test Welcome Email**
1. Register a new user account
2. Check email for welcome message
3. Verify all links work correctly

### **2. Test Password Reset**
1. Go to login page → Click "Forgot password?"
2. Enter email address
3. Check email for reset link
4. Click link and reset password
5. Verify new password works

### **3. Test Ambassador Application**
1. Submit ambassador application
2. Check email for confirmation
3. Update application status (admin)
4. Check email for status update

### **4. Test Contact Form**
1. Submit contact form
2. Check admin email for notification
3. Check user email for confirmation

## 🔒 **Security Features**

### **1. Email Security**
- ✅ **HTTPS links** - All email links use HTTPS
- ✅ **Token expiration** - Password reset tokens expire in 1 hour
- ✅ **Single-use tokens** - Reset tokens are cleared after use
- ✅ **No user enumeration** - Same response for all email requests

### **2. Template Security**
- ✅ **XSS protection** - All user data is properly escaped
- ✅ **Professional branding** - Consistent Ajira Digital design
- ✅ **Fallback text** - Plain text versions for all emails

### **3. Rate Limiting** (Recommended)
```javascript
const rateLimit = require('express-rate-limit');

const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 email requests per windowMs
  message: 'Too many email requests, please try again later'
});

app.use('/api/auth/forgot-password', emailLimiter);
app.use('/api/ambassador/applications', emailLimiter);
```

## 📊 **Email Analytics & Monitoring**

### **1. Logging**
All email operations are logged:
```javascript
console.log(`Welcome email sent to ${user.email}`);
console.log(`Password reset email sent to ${user.email}`);
console.log(`Ambassador application email sent to ${application.email}`);
```

### **2. Error Handling**
Failed emails are logged but don't break the application:
```javascript
try {
  await sendEmail(/* ... */);
} catch (error) {
  console.error('Failed to send email:', error);
  // Continue with application flow
}
```

### **3. Success Tracking**
Email success/failure tracking for monitoring:
```javascript
const results = await betterAuthEmailService.sendBulkEmail(recipients, subject, templateName, data);
// Returns array of { email, success, error? }
```

## 🚀 **Deployment Considerations**

### **1. Production Environment Variables**
```env
# Production
FRONTEND_URL=https://your-domain.com
GMAIL_USER=your-production-email@gmail.com
GMAIL_APP_PASSWORD=your-production-app-password
ADMIN_EMAIL=admin@yourdomain.com
BETTER_AUTH_URL=https://your-domain.com
BETTER_AUTH_SECRET=your-production-secret-key
```

### **2. Email Service Options**
For production, consider upgrading from Gmail to:
- **SendGrid** - Professional email delivery
- **Mailgun** - Reliable email API
- **AWS SES** - Cost-effective for high volume

### **3. Monitoring Setup**
- Set up email delivery monitoring
- Configure bounce handling
- Monitor spam complaints
- Track email open rates

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"Email not sending"**
   - Check Gmail credentials
   - Verify 2FA is enabled
   - Check app password is correct
   - Verify environment variables

2. **"Template not found"**
   - Check template name spelling
   - Verify template exists in auth.email.templates
   - Check template function syntax

3. **"Better Auth not working"**
   - Verify Better Auth is properly configured
   - Check database connection
   - Verify secret key is set

### **Debug Steps:**
1. Check server logs for email errors
2. Verify Gmail SMTP settings
3. Test email templates individually
4. Check environment variables
5. Verify database schema

## 📝 **Usage Examples**

### **Sending Custom Emails:**
```javascript
// Add new template to auth.js
templates: {
  newsletter: {
    subject: 'Monthly Newsletter - Ajira Digital KiNaP Club',
    html: (data) => `/* HTML template */`,
    text: (data) => `/* Text template */`
  }
}

// Use in your application
await betterAuthEmailService.sendCustomEmail(
  user.email,
  'Monthly Newsletter',
  'newsletter',
  { user, content: 'Newsletter content...' }
);
```

### **Bulk Email Campaigns:**
```javascript
const users = await User.find({ role: 'student' });
const results = await betterAuthEmailService.sendBulkEmail(
  users,
  'Important Update',
  'welcome',
  { announcement: 'Important announcement...' }
);
```

---

## ✅ **Setup Complete!**

Better Auth is now fully integrated to handle all email functionality for your Ajira Digital KiNaP Club application. The system provides:

- **Centralized email management** through Better Auth
- **Professional email templates** with consistent branding
- **Automatic email sending** for key user actions
- **Comprehensive error handling** and logging
- **Flexible template system** for future needs
- **Security best practices** for all email operations

All emails now go through Better Auth, providing a unified, secure, and professional email experience for your users!
