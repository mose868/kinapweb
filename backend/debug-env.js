require('dotenv').config();

console.log('🔍 Environment Variables Debug:');
console.log('================================');
console.log('GMAIL_USER:', process.env.GMAIL_USER ? `"${process.env.GMAIL_USER}"` : 'NOT SET');
console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 
  `"${process.env.GMAIL_APP_PASSWORD.substring(0, 4)}****" (${process.env.GMAIL_APP_PASSWORD.length} chars)` : 
  'NOT SET');

console.log('\n🔍 Checking .env file location...');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found at:', envPath);
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  console.log('📄 .env file contents:');
  lines.forEach((line, index) => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key === 'GMAIL_APP_PASSWORD') {
        console.log(`  ${key}=${value.substring(0, 4)}****`);
      } else {
        console.log(`  ${key}=${value}`);
      }
    }
  });
} else {
  console.log('❌ .env file not found at:', envPath);
}

console.log('\n🔍 Current working directory:', process.cwd());
console.log('🔍 __dirname:', __dirname); 