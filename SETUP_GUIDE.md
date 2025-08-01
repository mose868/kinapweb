# Setup Guide - Email Verification System

## 🎉 Quick Start

The system now works with **email verification only** by default. No complex setup required!

## 🚀 Current Status

✅ **Email Verification** - Working and ready
⚠️ **SMS Verification** - Disabled (requires Twilio setup)

## 📧 Email Verification (Default)

The system automatically sends verification codes via email using your existing Brevo configuration.

### **What You Need:**
- ✅ Brevo API key (already configured)
- ✅ Email service (already working)

### **How It Works:**
1. User registers with email and phone number
2. System sends 6-digit verification code via email
3. User enters code to verify account
4. Account is activated and user can log in

## 📱 SMS Verification (Optional)

If you want to add SMS verification later:

### **1. Install Twilio:**
```bash
cd backend
npm install twilio
```

### **2. Get Twilio Credentials:**
- Sign up at [twilio.com](https://twilio.com)
- Get your Account SID and Auth Token
- Get a Twilio phone number

### **3. Add to .env file:**
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### **4. Enable SMS in config:**
Edit `backend/config/verification.js`:
```javascript
methods: {
  sms: true,         // Enable SMS
  email: true        // Keep email as fallback
},
priority: ['sms', 'email']  // Try SMS first
```

## 🎯 Benefits of Current Setup

### **Email-Only System:**
- ✅ **No dependencies** - Works immediately
- ✅ **Reliable** - Email always works
- ✅ **Professional** - Clean email templates
- ✅ **Simple** - No complex setup required

### **Future SMS Option:**
- 📱 **Instant delivery** - SMS arrives immediately
- 📱 **Worldwide** - Works in all countries
- 📱 **Professional** - Branded SMS messages

## 🚀 Start the Server

```bash
cd backend
npm start
```

The server will start and email verification will work immediately!

## 📋 Test the System

1. **Register a new user** with email and phone number
2. **Check your email** for the verification code
3. **Enter the code** in the verification form
4. **Login** with your new account

## 🔧 Configuration

### **Email Settings:**
- Provider: Brevo (already configured)
- Templates: Professional HTML emails
- Fallback: Always available

### **SMS Settings (when enabled):**
- Provider: Twilio
- Message: "KINAP AJIRA CLUB: Your verification code is [CODE]"
- Priority: SMS first, email fallback

The system is now clean, simple, and ready to use! 🎉 