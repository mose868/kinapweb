# Forgot Password Setup Guide

This guide will help you set up the forgot password functionality for your Ajira Digital KiNaP Club application.

## 🔧 **Backend Setup**

### 1. **Email Configuration**

The application uses Gmail SMTP for sending password reset emails. You need to configure your Gmail credentials in the `.env` file:

```env
# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Frontend URL (for reset links)
FRONTEND_URL=http://localhost:5173
```

### 2. **Gmail App Password Setup**

To get a Gmail app password:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Go to Google Account Settings** → Security → 2-Step Verification
3. **Generate App Password**:
   - Click "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Name it "KiNaP Club"
   - Copy the generated 16-character password
4. **Use this password** in your `GMAIL_APP_PASSWORD` environment variable

### 3. **Database Schema**

The User model has been updated with password reset fields:

```javascript
// Password reset fields
resetPasswordToken: { type: String },
resetPasswordExpires: { type: Date }
```

## 🚀 **Frontend Setup**

### 1. **Components Created**

- ✅ `ForgotPassword.tsx` - Forgot password form
- ✅ `ResetPassword.tsx` - Password reset form
- ✅ Updated `AuthPage.tsx` - Added forgot password link
- ✅ Added routes for reset password functionality

### 2. **API Functions**

- ✅ `forgotPassword(email)` - Send reset email
- ✅ `resetPassword(token, password)` - Reset password
- ✅ `verifyResetToken(token)` - Verify reset token

## 📧 **Email Template**

The password reset email includes:

- ✅ **Professional design** with Ajira Digital branding
- ✅ **Secure reset link** with 1-hour expiration
- ✅ **Clear instructions** for the user
- ✅ **Fallback text link** in case the button doesn't work
- ✅ **Security notice** about link expiration

## 🔒 **Security Features**

### 1. **Token Security**
- ✅ **Cryptographically secure** random tokens
- ✅ **1-hour expiration** for reset links
- ✅ **Single-use tokens** (cleared after use)
- ✅ **No user enumeration** (same response for existing/non-existing emails)

### 2. **Password Requirements**
- ✅ **Minimum 6 characters** for new passwords
- ✅ **Password confirmation** to prevent typos
- ✅ **Secure hashing** with bcrypt (12 rounds)

### 3. **Rate Limiting** (Recommended)
Consider adding rate limiting to prevent abuse:

```javascript
// Example rate limiting (implement as needed)
const rateLimit = require('express-rate-limit');

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many password reset requests, please try again later'
});

app.use('/api/auth/forgot-password', forgotPasswordLimiter);
```

## 🧪 **Testing the Functionality**

### 1. **Test the Complete Flow**

1. **Start your servers**:
   ```bash
   # Backend
   cd backend && npm start
   
   # Frontend
   cd client && npm run dev
   ```

2. **Test forgot password**:
   - Go to `http://localhost:5173/auth`
   - Click "Forgot password?"
   - Enter your email address
   - Check your email for the reset link

3. **Test password reset**:
   - Click the reset link in your email
   - Enter a new password
   - Confirm the password
   - Verify you can log in with the new password

### 2. **Test Edge Cases**

- ✅ **Invalid email** - Should show same success message
- ✅ **Expired token** - Should show error message
- ✅ **Invalid token** - Should show error message
- ✅ **Password mismatch** - Should show validation error
- ✅ **Short password** - Should show validation error

## 🚀 **Deployment Considerations**

### 1. **Environment Variables**

For production, update your environment variables:

```env
# Production
FRONTEND_URL=https://your-domain.com
GMAIL_USER=your-production-email@gmail.com
GMAIL_APP_PASSWORD=your-production-app-password
```

### 2. **Email Service**

For production, consider using a dedicated email service:

- **SendGrid** - Professional email delivery
- **Mailgun** - Reliable email API
- **AWS SES** - Cost-effective for high volume

### 3. **HTTPS Requirement**

Password reset links require HTTPS in production. Make sure your domain has a valid SSL certificate.

## 🔧 **Troubleshooting**

### Common Issues:

1. **"Email not sending"**
   - Check Gmail credentials
   - Verify 2FA is enabled
   - Check app password is correct

2. **"Reset link not working"**
   - Check `FRONTEND_URL` environment variable
   - Verify token expiration (1 hour)
   - Check database connection

3. **"Invalid token error"**
   - Token may have expired
   - Check if token was already used
   - Verify database is saving tokens correctly

### Debug Steps:

1. **Check server logs** for email sending errors
2. **Verify database** has reset token fields
3. **Test email delivery** with a test email
4. **Check frontend console** for API errors

## 📝 **Usage Instructions for Users**

### For Users:

1. **Forgot Password**:
   - Click "Forgot password?" on the login page
   - Enter your email address
   - Check your email for the reset link
   - Click the link to reset your password

2. **Reset Password**:
   - Enter your new password (minimum 6 characters)
   - Confirm your new password
   - Click "Reset Password"
   - You'll be redirected to login

3. **Security Notes**:
   - Reset links expire in 1 hour
   - Each link can only be used once
   - If you didn't request a reset, ignore the email

---

## ✅ **Setup Complete!**

Your forgot password functionality is now ready to use. Users can securely reset their passwords via email, and the system includes proper security measures to protect against abuse.

For any issues or questions, check the troubleshooting section above or review the server logs for specific error messages.
