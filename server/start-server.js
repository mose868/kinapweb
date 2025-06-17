// Simple server starter script
const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.NODE_ENV = 'development';
process.env.PORT = '5000';
process.env.MONGODB_URI = 'mongodb://localhost:27017/ajira-digital';
process.env.SESSION_SECRET = 'your-session-secret-key';
process.env.JWT_SECRET = 'your-jwt-secret-key';

// Start the server
console.log('Starting Ajira Digital Server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

try {
  require('./index.js');
} catch (error) {
  console.error('Error starting server:', error.message);
  
  // Try alternative approach
  console.log('Trying alternative startup...');
  const serverProcess = spawn('node', ['index.js'], {
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PORT: '5000'
    },
    stdio: 'inherit'
  });

  serverProcess.on('error', (err) => {
    console.error('Server process error:', err);
  });

  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
} 