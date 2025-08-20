const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Kinap Ajira Club Environment Variables...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env file already exists');
  
  // Read existing .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if Gmail credentials are already set
  if (envContent.includes('GMAIL_USER=') && envContent.includes('GMAIL_APP_PASSWORD=')) {
    console.log('✅ Gmail credentials are already configured');
  } else {
    console.log('⚠️  Gmail credentials are not configured');
    console.log('Please add your Gmail credentials to the .env file:');
    console.log('GMAIL_USER=your-kinap-email@gmail.com');
    console.log('GMAIL_APP_PASSWORD=your-app-password');
    console.log('\nTo get an app password:');
    console.log('1. Go to Google Account settings');
    console.log('2. Security > 2-Step Verification > App passwords');
    console.log('3. Generate a new app password for "Mail"');
  }
  
  // Check other required variables
  const requiredVars = [
    'JWT_SECRET',
    'MYSQL_HOST',
    'MYSQL_PORT',
    'MYSQL_DATABASE',
    'MYSQL_USERNAME',
    'MYSQL_PASSWORD',
    'PORT'
  ];
  
  const missingVars = requiredVars.filter(varName => !envContent.includes(`${varName}=`));
  
  if (missingVars.length > 0) {
    console.log('⚠️  Missing required environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\nPlease add these to your .env file.\n');
  } else {
    console.log('✅ All required environment variables are configured\n');
  }
  
} else {
  console.log('📝 Creating new .env file...');
  
  const envTemplate = `# Kinap Ajira Club Environment Variables

# Gmail SMTP Email Service (Required)
GMAIL_USER=kinapajira@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# JWT Secret (Required)
JWT_SECRET=your_jwt_secret_here

# MySQL Database Configuration (Required)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=ajira_digital_kinap
MYSQL_USERNAME=root
MYSQL_PASSWORD=your_mysql_password_here

# Server Configuration
PORT=5000

# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-key-change-this-in-production
BETTER_AUTH_URL=http://localhost:5000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# JWT Configuration (for legacy auth)
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Frontend URL
CLIENT_URL=http://localhost:5173

# Optional: Other email providers (fallback)
SENDGRID_API_KEY=
MAILGUN_USER=
MAILGUN_PASSWORD=
RESEND_API_KEY=

# Optional: Email configuration
EMAIL_FROM=kinapajira@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=kinapajira@gmail.com
EMAIL_PASS=your-app-password
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please update the following variables:');
  console.log('   - BETTER_AUTH_SECRET (generate a secure random string)');
  console.log('   - GOOGLE_CLIENT_ID (from Google Cloud Console)');
  console.log('   - GOOGLE_CLIENT_SECRET (from Google Cloud Console)');
  console.log('   - GMAIL_USER: Your Kinap Ajira Club Gmail address');
  console.log('   - GMAIL_APP_PASSWORD: Your Gmail app password');
  console.log('   - JWT_SECRET: A random secret string');
  console.log('   - MYSQL_HOST: Your MySQL server host (default: localhost)');
  console.log('   - MYSQL_PORT: Your MySQL server port (default: 3306)');
  console.log('   - MYSQL_DATABASE: Your MySQL database name');
  console.log('   - MYSQL_USERNAME: Your MySQL username');
  console.log('   - MYSQL_PASSWORD: Your MySQL password\n');
}

console.log('📖 Gmail Setup Instructions:');
console.log('1. Create a Gmail account for Kinap Ajira Club (e.g., kinapajiraclub@gmail.com)');
console.log('2. Enable 2-Step Verification on the Gmail account');
console.log('3. Generate an App Password:');
console.log('   - Go to Google Account settings');
console.log('   - Security > 2-Step Verification > App passwords');
console.log('   - Generate a new app password for "Mail"');
console.log('4. Add the credentials to your .env file');
console.log('5. Test the email service: npm run test-email\n');

console.log('🎯 Next Steps:');
console.log('- Create a Gmail account for Kinap Ajira Club');
console.log('- Set up 2-Step Verification and App Password');
console.log('- Update your .env file with the credentials');
console.log('- Test the email functionality: npm run test-email');
console.log('- Start your server: npm run dev\n');
