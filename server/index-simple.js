const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple API routes for testing
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Backend server is working!',
    timestamp: new Date().toISOString()
  });
});

// Chat API endpoint (simple mock)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  // Simple response logic
  let response = "Thank you for your message. Our support team will get back to you soon.";
  
  if (message && message.toLowerCase().includes('help')) {
    response = "I'm here to help! You can contact our support team via WhatsApp at +254 792 343 958 or email at support@ajiradigital.kinap.ac.ke";
  }
  
  res.json({
    status: 'success',
    response: response,
    timestamp: new Date().toISOString()
  });
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  console.log('Contact form submission:', { name, email, message });
  
  res.json({
    status: 'success',
    message: 'Thank you for your message. We will get back to you soon!',
    timestamp: new Date().toISOString()
  });
});

// Events API endpoint
app.get('/api/events', (req, res) => {
  const events = [
    {
      id: 1,
      title: 'Financial Markets & Trading Fundamentals',
      date: '2025-02-15',
      endDate: '2025-02-16',
      location: 'KiNaP Finance Lab',
      participants: 40,
      description: 'Learn the basics of financial markets and trading strategies.',
      category: 'Finance'
    },
    {
      id: 2,
      title: 'Graphic Design Mastery Workshop',
      date: '2025-03-08',
      endDate: '2025-03-09',
      location: 'KiNaP Design Studio',
      participants: 35,
      description: 'Master the art of graphic design with industry professionals.',
      category: 'Design'
    }
  ];
  
  res.json({
    status: 'success',
    data: events
  });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

module.exports = app; 