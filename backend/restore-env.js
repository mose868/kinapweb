const fs = require('fs');
const path = require('path');

const envContent = `# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/kinapweb

# JWT Secret
JWT_SECRET=kinap-secret-key-2024

# Gemini AI API Key
GEMINI_API_KEY=AIzaSyD6UkUFlqHiL7z5CwqtFY1HX3z0pZ9KvYY

# Server Configuration
PORT=5000
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file restored successfully!');
  console.log('📁 Location:', envPath);
  console.log('🔗 MongoDB URI: mongodb://127.0.0.1:27017/kinapweb');
  console.log('🔑 Gemini API key: Configured');
  console.log('\n🚀 You can now start the server with: npm start');
} catch (error) {
  console.error('❌ Error restoring .env file:', error.message);
} 