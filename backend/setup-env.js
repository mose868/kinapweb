const fs = require('fs');
const path = require('path');

const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ajira_digital_kinap

# Better Auth Configuration
BETTER_AUTH_SECRET=your-super-secret-key-change-this-in-production
BETTER_AUTH_URL=http://localhost:5000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# JWT Configuration (for legacy auth)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Frontend URL
CLIENT_URL=http://localhost:5173

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=kinapajira@gmail.com
EMAIL_PASS=your-email-password
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📝 Please update the following variables:');
  console.log('   - BETTER_AUTH_SECRET (generate a secure random string)');
  console.log('   - GOOGLE_CLIENT_ID (from Google Cloud Console)');
  console.log('   - GOOGLE_CLIENT_SECRET (from Google Cloud Console)');
  console.log('   - EMAIL_PASS (your Gmail app password)');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
} 