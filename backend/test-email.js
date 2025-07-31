const { testGmailConnection, sendVerificationEmail } = require('./services/emailService');
require('dotenv').config();

async function testEmailService() {
  console.log('🧪 Testing Kinap Ajira Club Email Service (Gmail SMTP)...\n');

  // Check if Gmail credentials are configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('❌ Gmail credentials are not configured in .env file');
    console.log('Please add your Gmail credentials to the .env file:');
    console.log('GMAIL_USER=kinapajira@gmail.com');
    console.log('GMAIL_APP_PASSWORD=your-app-password');
    console.log('\nTo get an app password:');
    console.log('1. Go to Google Account settings');
    console.log('2. Security > 2-Step Verification > App passwords');
    console.log('3. Generate a new app password for "Mail"');
    return;
  }

  console.log('✅ Gmail credentials are configured');
  console.log('📧 Gmail User:', process.env.GMAIL_USER);
  console.log('🔑 App Password Length:', process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.length + ' characters' : 'NOT SET');
  console.log('🔑 App Password Preview:', process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.substring(0, 4) + '****' : 'NOT SET');

  // Check if credentials look correct
  if (!process.env.GMAIL_USER.includes('@gmail.com')) {
    console.log('⚠️  Warning: GMAIL_USER should be a Gmail address');
  }
  
  if (process.env.GMAIL_APP_PASSWORD && process.env.GMAIL_APP_PASSWORD.length !== 16) {
    console.log('⚠️  Warning: GMAIL_APP_PASSWORD should be 16 characters long');
  }

  try {
    // Test Gmail SMTP connection
    console.log('\n🔍 Testing Gmail SMTP connection...');
    const connectionTest = await testGmailConnection();
    
    if (connectionTest.working) {
      console.log('✅ Gmail SMTP connection successful');
    } else {
      console.log('❌ Gmail SMTP connection failed:', connectionTest.message);
      console.log('\n🔧 Common Solutions:');
      console.log('1. Make sure 2-Step Verification is enabled on your Gmail account');
      console.log('2. Generate a new app password (16 characters)');
      console.log('3. Check that GMAIL_USER and GMAIL_APP_PASSWORD are correct in .env file');
      return;
    }

    // Test sending a verification email
    console.log('\n📧 Testing verification email...');
    
    // Ask user for their email
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Enter your email address to test: ', async (testEmail) => {
      rl.close();
      
      if (!testEmail || !testEmail.includes('@')) {
        console.log('❌ Please enter a valid email address');
        return;
      }

      console.log(`📬 Sending test email to: ${testEmail}`);
      
      const testCode = '123456';
      const testName = 'Test User';

      try {
        await sendVerificationEmail(testEmail, testCode, testName);
        console.log('✅ Verification email sent successfully');
        console.log(`📬 Check your email: ${testEmail}`);
        console.log('📧 Check your spam/junk folder if you don\'t see it in your inbox');
        console.log('\n🎉 Email service is working perfectly!');
        console.log('You can now use the registration and verification features.');

      } catch (emailError) {
        console.error('❌ Failed to send test email:', emailError.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check if your Gmail credentials are correct');
        console.log('2. Make sure 2-Step Verification is enabled');
        console.log('3. Verify your app password is correct (16 characters)');
        console.log('4. Check if your Gmail account allows less secure apps');
        console.log('5. Try a different email address');
      }
    });

  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if your Gmail credentials are correct');
    console.log('2. Make sure 2-Step Verification is enabled');
    console.log('3. Verify your app password is correct (16 characters)');
    console.log('4. Check if your Gmail account allows less secure apps');
  }
}

// Run the test
testEmailService(); 