const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

// Read the current .env file
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.log('❌ .env file not found, creating new one...');
  envContent = '';
}

// Replace the MONGODB_URI line
const newMongoUri = 'MONGODB_URI=mongodb+srv://moseskimani414:moseskim@cluster0.njyg51i.mongodb.net/kinapweb?retryWrites=true&w=majority&appName=Cluster0';

// Remove existing MONGODB_URI line if it exists
const lines = envContent.split('\n');
const filteredLines = lines.filter(line => !line.startsWith('MONGODB_URI='));

// Add the new MONGODB_URI line
filteredLines.unshift(newMongoUri);

// Write back to .env file
const newEnvContent = filteredLines.join('\n');

try {
  fs.writeFileSync(envPath, newEnvContent);
  console.log('✅ MongoDB URI updated successfully!');
  console.log('🔗 New URI:', newMongoUri);
  console.log('📁 File location:', envPath);
} catch (error) {
  console.error('❌ Error updating .env file:', error.message);
} 