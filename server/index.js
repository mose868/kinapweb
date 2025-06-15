const express = require('express');
const path = require('path');
const compression = require('compression');
const securityMiddleware = require('./middleware/security');
const { errorHandler, logger } = require('./middleware/errorHandler');
const { cache, CACHE_DURATIONS } = require('./middleware/cache');
const chatRoutes = require('./routes/chat');
const clientRoutes = require('./routes/client');
const videoRoutes = require('./routes/video');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('./config/passport');
const helmet = require('helmet');
const ambassadorRoutes = require('./routes/ambassador');
const eventRoutes = require('./routes/events');
const contactRoutes = require('./routes/contact');
const communityRoutes = require('./routes/community');
const testimonialRoutes = require('./routes/testimonials');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Apply security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(securityMiddleware.mongoSanitize);
app.use(securityMiddleware.xss);
app.use(securityMiddleware.hpp);
app.use(securityMiddleware.customSecurity);

// Apply rate limiting
app.use('/api/', securityMiddleware.generalLimiter);
app.use('/api/auth', securityMiddleware.authLimiter);
app.use('/api/upload', securityMiddleware.uploadLimiter);

// Enable gzip compression
app.use(compression());

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
    ttl: 24 * 60 * 60 // 1 day
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files with cache control
app.use(express.static(path.join(__dirname, '../client/dist'), {
  maxAge: '1y',
  etag: true,
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// API routes with caching
app.use('/api/chat', cache(CACHE_DURATIONS.SHORT), chatRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/video', videoRoutes);

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/projects');
const marketplaceRoutes = require('./routes/marketplace');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Ambassador routes
app.use('/api/ambassador', ambassadorRoutes);

// Event routes
app.use('/api/events', eventRoutes);
app.use('/api/contact', contactRoutes);

// Community routes
app.use('/api/community', communityRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Catch-all route for SPA - handle root path explicitly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Handle all other routes for SPA
app.get('*', (req, res) => {
  // Prevent redirection to /app
  if (req.path === '/app') {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid input data',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again!'
    });
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Your token has expired! Please log in again.'
    });
  }

  // Default error
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  logger.info('Received shutdown signal. Closing HTTP server...');
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force close after 10s
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = server; 