const fs = require('fs');
const path = require('path');

const emailSetupGuide = `
# 🚀 Free Email Verification Setup Guide

## ✅ **What's Included**
- Multiple free email providers (Gmail, Outlook, Yahoo, ProtonMail)
- Automatic fallback system
- Beautiful email templates
- Rate limiting and security
- No cost - completely free!

## 📧 **Free Email Provider Setup**

### **Option 1: Gmail (Recommended)**
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → App passwords
   - Select "Mail" and your device
   - Copy the generated password
4. Add to your .env file:
   \`\`\`
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   \`\`\`

### **Option 2: Outlook/Hotmail**
1. Go to Outlook.com settings
2. Enable 2-Factor Authentication
3. Generate an App Password
4. Add to your .env file:
   \`\`\`
   OUTLOOK_USER=your-email@outlook.com
   OUTLOOK_PASSWORD=your-app-password
   \`\`\`

### **Option 3: Yahoo**
1. Go to Yahoo Account Security
2. Enable 2-Factor Authentication
3. Generate an App Password
4. Add to your .env file:
   \`\`\`
   YAHOO_USER=your-email@yahoo.com
   YAHOO_APP_PASSWORD=your-app-password
   \`\`\`

### **Option 4: ProtonMail**
1. Go to ProtonMail settings
2. Enable SMTP access
3. Generate SMTP password
4. Add to your .env file:
   \`\`\`
   PROTON_USER=your-email@protonmail.com
   PROTON_PASSWORD=your-smtp-password
   \`\`\`

## 🔧 **Environment Variables**

Add these to your \`.env\` file:

\`\`\`
# Email Configuration - Free Providers
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

OUTLOOK_USER=your-outlook@outlook.com
OUTLOOK_PASSWORD=your-outlook-app-password

YAHOO_USER=your-yahoo@yahoo.com
YAHOO_APP_PASSWORD=your-yahoo-app-password

PROTON_USER=your-proton@protonmail.com
PROTON_PASSWORD=your-proton-smtp-password
\`\`\`

## 🧪 **Testing Your Setup**

Run this command to test all email providers:

\`\`\`bash
cd backend
node -e "
const { testAllProviders } = require('./services/emailService');
testAllProviders().then(results => {
  console.log('📧 Email Provider Test Results:');
  results.forEach(provider => {
    console.log(\`\${provider.name}: \${provider.configured ? '✅ Configured' : '❌ Not Configured'} | \${provider.working ? '✅ Working' : '❌ Not Working'}\`);
  });
});
"
\`\`\`

## 📋 **API Endpoints**

### **Send Verification Code**
\`\`\`
POST /api/verification/send-code
{
  "email": "user@example.com",
  "type": "registration" // or "password-reset"
}
\`\`\`

### **Verify Code**
\`\`\`
POST /api/verification/verify-code
{
  "email": "user@example.com",
  "code": "123456",
  "type": "registration"
}
\`\`\`

### **Resend Code**
\`\`\`
POST /api/verification/resend-code
{
  "email": "user@example.com",
  "type": "registration"
}
\`\`\`

### **Test Email Providers**
\`\`\`
GET /api/verification/test-email-providers
\`\`\`

### **Get Verification Status**
\`\`\`
GET /api/verification/status/user@example.com
\`\`\`

## 🎨 **Email Templates**

The system includes beautiful, responsive email templates:

- **Verification Email**: Professional verification code email
- **Password Reset**: Secure password reset functionality
- **Welcome Email**: Welcoming new users to the platform

## 🔒 **Security Features**

- **Rate Limiting**: Max 5 attempts per 15 minutes
- **Code Expiration**: Codes expire after 10 minutes
- **Secure Storage**: Codes stored securely in database
- **Multiple Providers**: Automatic fallback if one fails

## 💰 **Cost: $0**

This system is completely free to use:
- ✅ No monthly fees
- ✅ No per-email charges
- ✅ No API costs
- ✅ Unlimited emails (within provider limits)

## 🚀 **Getting Started**

1. **Choose a provider** (Gmail recommended for beginners)
2. **Set up App Password** (follow provider guide above)
3. **Add to .env file** (copy the variables above)
4. **Test the setup** (run the test command)
5. **Start sending emails!**

## 📞 **Support**

If you need help setting up any provider:
1. Check the provider's official documentation
2. Ensure 2-Factor Authentication is enabled
3. Use App Passwords, not regular passwords
4. Test with the provided test command

---

**Your free email verification system is ready to go! 🎉**
`;

const setupScript = async () => {
  try {
    console.log('📧 Setting up free email verification system...');
    
    // Create the setup guide
    const guidePath = path.join(__dirname, 'EMAIL_SETUP_GUIDE.md');
    fs.writeFileSync(guidePath, emailSetupGuide);
    
    console.log('✅ Email setup guide created: EMAIL_SETUP_GUIDE.md');
    console.log('📋 Next steps:');
    console.log('   1. Choose a free email provider (Gmail recommended)');
    console.log('   2. Set up App Password following the guide');
    console.log('   3. Add credentials to your .env file');
    console.log('   4. Test the setup with the provided commands');
    console.log('\n🎉 Your free email verification system is ready!');
    
  } catch (error) {
    console.error('❌ Setup error:', error);
  }
};

setupScript(); 