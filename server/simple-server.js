const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Ajira Digital Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Basic API routes for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

// Authentication routes
app.post('/api/auth/signup', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'User registered successfully', 
    user: { id: '123', email: req.body.email, name: req.body.name }
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Login successful', 
    user: { id: '123', email: req.body.email, name: 'Demo User' },
    token: 'demo-jwt-token'
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ status: 'success', message: 'Logged out successfully' });
});

// Marketplace routes
app.get('/api/marketplace/gigs', (req, res) => {
  res.json({ 
    status: 'success',
    data: [],
    message: 'Using client-side sample data' 
  });
});

app.get('/api/marketplace/gigs/:id', (req, res) => {
  res.json({ 
    status: 'success',
    data: {
      id: req.params.id,
      title: 'Sample Gig',
      description: 'This is a sample gig description',
      price: 1000,
      seller: { name: 'Demo Seller' }
    }
  });
});

// Community routes
app.get('/api/community/posts', (req, res) => {
  res.json({ status: 'success', data: [] });
});

// Video routes
app.get('/api/videos', (req, res) => {
  res.json({ status: 'success', data: [] });
});

// Catch all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ajira Digital Server running on port ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:5173`);
  console.log(`🔧 Backend: http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app; 