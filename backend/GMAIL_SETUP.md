# Gmail SMTP Email Service Setup Guide

## 🚀 Quick Setup

### 1. Create Gmail Account for Kinap Ajira Club

1. Go to [Gmail](https://gmail.com) and create a new account
2. Use a professional name like: `kinapajira@gmail.com`
3. Complete the account setup

### 2. Enable 2-Step Verification

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification for your account

### 3. Generate App Password

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** → **App passwords**
3. Click **Generate** for "Mail"
4. Copy the generated 16-character password

### 4. Configure Environment Variables

Add these to your `.env` file:

```bash
GMAIL_USER=kinapajira@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

### 5. Test the Email Service

```bash
npm run test-email
```

## 📧 Email Features

### What's Included

- ✅ **Verification Emails**: Professional HTML templates for account verification
- ✅ **Welcome Emails**: Beautiful welcome messages for new users
- ✅ **Password Reset**: Secure password reset functionality
- ✅ **Professional Branding**: Kinap Ajira Club themed emails

### Email Templates

All emails include:
- 🎨 Professional HTML design
- 📱 Mobile-responsive layout
- 🎯 Clear call-to-action
- 🔒 Security notices
- 📧 Proper sender information

## 🔧 Configuration

### Environment Variables

```bash
# Required
GMAIL_USER=kinapajira@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Optional (for fallback)
SENDGRID_API_KEY=
MAILGUN_USER=
MAILGUN_PASSWORD=
RESEND_API_KEY=
```

### Email Settings

- **Sender Name**: Kinap Ajira Club
- **Sender Email**: kinapajira@gmail.com
- **Template**: Professional HTML with Kinap Ajira Club branding
- **Security**: 15-minute expiration for codes

## 📊 Gmail SMTP Benefits

### What You Get

- **Unlimited emails** (within Gmail's daily limits)
- **High deliverability** to all email providers
- **Professional sender address**
- **No third-party dependencies**
- **Reliable and trusted service**

### Usage Limits

- Daily limit: ~500 emails (Gmail's limit)
- Monthly limit: ~15,000 emails
- Perfect for verification codes and notifications

## 🧪 Testing

### Test Email Service

```bash
npm run test-email
```

### Manual Testing

1. Register a new user
2. Check email for verification code
3. Verify the account
4. Check for welcome email

### Troubleshooting

**Common Issues:**

1. **App Password Error**
   - Make sure 2-Step Verification is enabled
   - Verify the app password is correct (16 characters)
   - Generate a new app password if needed

2. **Email Not Sending**
   - Check if Gmail credentials are correct
   - Verify app password is valid
   - Check Gmail account status

3. **Template Issues**
   - Check HTML syntax in templates
   - Verify CSS compatibility

## 🔒 Security

### Best Practices

- ✅ App passwords stored in environment variables
- ✅ No hardcoded credentials
- ✅ Secure email templates
- ✅ Rate limiting on verification codes
- ✅ 15-minute code expiration

### Email Security

- 🔐 Verification codes expire in 15 minutes
- 🚫 No sensitive data in email content
- 📧 Professional sender information
- ⚠️ Security notices in all emails

## 📈 Monitoring

### Gmail Dashboard

Monitor your email service at:
- [Gmail](https://gmail.com)
- [Google Account Activity](https://myaccount.google.com/activity)
- [Gmail Settings](https://mail.google.com/mail/u/0/#settings)

### Key Metrics

- Email delivery rate
- Bounce rates
- Spam reports
- Daily/monthly usage

## 🚀 Production Deployment

### Environment Setup

1. Set production Gmail credentials
2. Configure sender information
3. Set up email templates
4. Test all email flows

### Monitoring

- Set up email alerts for failures
- Monitor daily usage
- Track delivery rates
- Check for SMTP errors

## 📞 Support

### Gmail Support

- [Gmail Help](https://support.google.com/mail/)
- [Google Account Help](https://support.google.com/accounts/)
- [App Passwords Guide](https://support.google.com/accounts/answer/185833)

### Troubleshooting

If you encounter issues:

1. Check your Gmail account status
2. Verify your app password is correct
3. Test with the provided test script
4. Check Gmail's daily sending limits
5. Contact Gmail support if needed

## 🔄 Migration from Brevo

### What Changed

- ✅ **Removed Brevo**: No more third-party email service
- ✅ **Gmail SMTP**: Direct Gmail integration
- ✅ **Better Deliverability**: Higher success rate
- ✅ **Simplified Setup**: No domain verification needed

### Benefits of Gmail SMTP

- **Reliability**: Gmail is one of the most trusted email services
- **Deliverability**: High success rate to all email providers
- **Simplicity**: No complex configuration needed
- **Cost**: Free with Gmail account

---

**🎉 You're all set! Your Kinap Ajira Club platform now has reliable email capabilities with Gmail SMTP!** 