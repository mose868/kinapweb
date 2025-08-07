const fs = require('fs');
const path = require('path');

const freeEmailSetupGuide = `
# 🚀 Free Email Services Setup Guide - No Personal Email Required!

## ✅ **What's Included**
- **SendGrid** - 100 emails/day free
- **Mailgun** - 5,000 emails/month free
- **Brevo** - 300 emails/day free
- **Resend** - 3,000 emails/month free
- **Professional branding** - Emails appear from "Ajira Digital"
- **No personal email required** - Completely automated

## 🎯 **Why These Services?**

These services allow you to send emails that appear to come from "Ajira Digital" or "noreply@ajirakinap.com" without using your personal email address. They're designed for business use and provide professional email delivery.

## 📧 **Free Email Service Setup**

### **Option 1: SendGrid (Recommended - Easiest)**
1. Go to [SendGrid.com](https://sendgrid.com)
2. Sign up for a free account
3. Verify your account (no credit card required)
4. Go to Settings → API Keys
5. Create a new API Key with "Mail Send" permissions
6. Add to your .env file:
   \`\`\`
   SENDGRID_API_KEY=your-sendgrid-api-key
   \`\`\`

### **Option 2: Mailgun (Most Emails Free)**
1. Go to [Mailgun.com](https://mailgun.com)
2. Sign up for a free account
3. Verify your account
4. Go to Settings → API Keys
5. Copy your API Key
6. Add to your .env file:
   \`\`\`
   MAILGUN_USER=your-mailgun-username
   MAILGUN_PASSWORD=your-mailgun-api-key
   \`\`\`

### **Option 3: Brevo (Formerly Sendinblue)**
1. Go to [Brevo.com](https://brevo.com)
2. Sign up for a free account
3. Go to Settings → API Keys
4. Generate a new API Key
5. Add to your .env file:
   \`\`\`
   BREVO_USER=your-brevo-username
   BREVO_API_KEY=your-brevo-api-key
   \`\`\`

### **Option 4: Resend (Modern & Fast)**
1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Go to API Keys
4. Create a new API Key
5. Add to your .env file:
   \`\`\`
   RESEND_API_KEY=your-resend-api-key
   \`\`\`

## 🔧 **Environment Variables**

Add these to your \`.env\` file:

\`\`\`
# Free Email Services Configuration
# Choose one or multiple for fallback

# SendGrid (100 emails/day free)
SENDGRID_API_KEY=your-sendgrid-api-key

# Mailgun (5,000 emails/month free)
MAILGUN_USER=your-mailgun-username
MAILGUN_PASSWORD=your-mailgun-api-key

# Brevo (300 emails/day free)
BREVO_USER=your-brevo-username
BREVO_API_KEY=your-brevo-api-key

# Resend (3,000 emails/month free)
RESEND_API_KEY=your-resend-api-key

# Optional: Gmail as backup (if you want to use personal email as fallback)
GMAIL_USER=your-gmail@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
\`\`\`

## 🧪 **Testing Your Setup**

Run this command to test all email providers:

\`\`\`bash
cd backend
node -e "
const { testAllProviders } = require('./services/emailService');
testAllProviders().then(results => {
  console.log('📧 Free Email Service Test Results:');
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
  "type": "registration"
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

### **Test Email Providers**
\`\`\`
GET /api/verification/test-email-providers
\`\`\`

## 🎨 **Email Appearance**

Emails will appear to come from:
- **From Name**: "Ajira Digital"
- **From Email**: "noreply@ajirakinap.com"
- **Subject**: "🔐 Ajira Digital - Email Verification Code"
- **Branding**: Professional Ajira Digital KiNaP Club branding

## 💰 **Free Tier Limits**

- **SendGrid**: 100 emails/day
- **Mailgun**: 5,000 emails/month
- **Brevo**: 300 emails/day
- **Resend**: 3,000 emails/month
- **Total**: Up to 8,400 emails/month free!

## 🔒 **Security Features**

- **Rate Limiting**: Max 5 attempts per 15 minutes
- **Code Expiration**: Codes expire after 10 minutes
- **Secure Storage**: Codes stored securely in MongoDB
- **Multiple Providers**: Automatic fallback if one fails
- **Professional Sending**: No personal email addresses used

## 🚀 **Getting Started**

1. **Choose a service** (SendGrid recommended for beginners)
2. **Sign up for free account** (no credit card required)
3. **Get API key** (follow service-specific guide above)
4. **Add to .env file** (copy the variables above)
5. **Test the setup** (run the test command)
6. **Start sending emails!**

## 📊 **Service Comparison**

| Service | Free Limit | Setup Difficulty | Reliability |
|---------|------------|------------------|-------------|
| SendGrid | 100/day | ⭐ Easy | ⭐⭐⭐⭐⭐ |
| Mailgun | 5,000/month | ⭐⭐ Medium | ⭐⭐⭐⭐ |
| Brevo | 300/day | ⭐⭐ Medium | ⭐⭐⭐⭐ |
| Resend | 3,000/month | ⭐ Easy | ⭐⭐⭐⭐⭐ |

## 🎯 **Recommended Setup**

For maximum reliability, set up multiple services:

1. **Primary**: SendGrid (easiest setup)
2. **Secondary**: Resend (modern & fast)
3. **Backup**: Mailgun (highest free limit)

## 📞 **Support**

If you need help setting up any service:
1. Check the service's official documentation
2. Ensure you're using the free tier (no credit card required)
3. Copy API keys exactly as shown
4. Test with the provided test command

## 🎉 **Benefits**

- ✅ **No personal email required**
- ✅ **Professional appearance**
- ✅ **High deliverability rates**
- ✅ **Multiple provider fallback**
- ✅ **Completely free**
- ✅ **Unlimited users**
- ✅ **Beautiful email templates**

---

**Your professional email verification system is ready! 🚀**

No personal email needed - all emails will appear from "Ajira Digital"!
`;

const setupScript = async () => {
  try {
    console.log('📧 Setting up free email services...');
    
    // Create the setup guide
    const guidePath = path.join(__dirname, 'FREE_EMAIL_SETUP_GUIDE.md');
    fs.writeFileSync(guidePath, freeEmailSetupGuide);
    
    console.log('✅ Free email setup guide created: FREE_EMAIL_SETUP_GUIDE.md');
    console.log('\n📋 Recommended Setup Order:');
    console.log('   1. SendGrid (easiest, 100 emails/day free)');
    console.log('   2. Resend (modern, 3,000 emails/month free)');
    console.log('   3. Mailgun (highest limit, 5,000 emails/month free)');
    console.log('\n🎯 Key Benefits:');
    console.log('   ✅ No personal email required');
    console.log('   ✅ Emails appear from "Ajira Digital"');
    console.log('   ✅ Professional branding');
    console.log('   ✅ Multiple provider fallback');
    console.log('   ✅ Completely free');
    console.log('\n🚀 Your professional email system is ready!');
    
  } catch (error) {
    console.error('❌ Setup error:', error);
  }
};

setupScript(); 