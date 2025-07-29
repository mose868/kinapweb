const fs = require('fs');
const path = require('path');

const envContent = `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/kinapweb

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (if needed)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('📁 Location:', envPath);
  console.log('🔑 Gemini API key has been configured');
  console.log('\n🚀 You can now start the server with: npm start');
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n📝 Please create a .env file manually in the backend directory with the following content:');
  console.log('\n' + envContent);
} 