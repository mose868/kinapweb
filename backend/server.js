const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize, testConnection } = require('./config/database');
const cookieParser = require('cookie-parser');
const http = require('http');
const path = require('path');
const WebSocketServer = require('./websocketServer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const xssClean = require('xss-clean');

const studentRoutes = require('./routes/students');
const aboutUsRoutes = require('./routes/aboutUs');
const teamRoutes = require('./routes/team');
const teamApplicationRoutes = require('./routes/teamApplications');
const clubUpdatesRoutes = require('./routes/clubUpdates');
const faqRoutes = require('./routes/faq');
const contactRoutes = require('./routes/contact');
const trainingRoutes = require('./routes/training');
const mentorshipRoutes = require('./routes/mentorship');
const eventsRoutes = require('./routes/events');
const mentorApplicationRoutes = require('./routes/mentorApplication');
const videosRoutes = require('./routes/videos');
const userVideosRouter = require('./routes/userVideos');
const usersRoutes = require('./routes/users');
const groupsRoutes = require('./routes/groups');
const messagesRoutes = require('./routes/messages');
const successStoriesRoutes = require('./routes/successStories');
const showcaseProfilesRoutes = require('./routes/showcaseProfiles');
const ambassadorApplicationsRoutes = require('./routes/ambassadorApplications');
const metricsRoutes = require('./routes/metrics');
// Import models to ensure they're registered
require('./models');
const homePageRoutes = require('./routes/homePage');
const contentRoutes = require('./routes/content');
const chatbotRoutes = require('./routes/chatbot');
const marketplaceRoutes = require('./routes/marketplace');
const authRoutes = require('./routes/auth');
const betterAuthRoutes = require('./routes/betterAuth');
const biometricAuthRoutes = require('./routes/biometricAuth');
const sellerApplicationRoutes = require('./routes/sellerApplications');
const sellersRoutes = require('./routes/sellers');
const fileUploadRoutes = require('./routes/fileUpload');
const chatRoutes = require('./routes/chat');
const chatMessagesRoutes = require('./routes/chatMessages');
const verificationRoutes = require('./routes/verification');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer(server);

// WebSocket server is now handled by the WebSocketServer class
// Real-time communication is handled by the custom WebSocket server

// WebSocket server handles upgrades automatically on the same port



// Security: trust proxy (needed for secure cookies and HTTPS detection behind proxies)
app.set('trust proxy', 1);
// Hide tech stack header
app.disable('x-powered-by');

// Global security headers via Helmet (with a conservative CSP)
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "font-src": ["'self'", "https:", "data:"],
        "img-src": ["'self'", "data:", "https:"],
        "object-src": ["'none'"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
        "connect-src": [
          "'self'",
          process.env.CLIENT_ORIGIN || 'http://localhost:5173',
          'https://kinapweb.vercel.app',
          'https://kinapweb.onrender.com'
        ],
        "media-src": ["'self'", "https:"],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    referrerPolicy: { policy: 'no-referrer' },
    frameguard: { action: 'deny' },
  })
);

// Basic hardening middlewares
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(xssClean()); // Sanitize user input from XSS

// Optional: Enforce HTTPS in production (behind proxy)
if (process.env.NODE_ENV === 'production' && process.env.FORCE_HTTPS === 'true') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
  });
}

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // max requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors({ 
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://kinapweb.vercel.app',
    'https://kinapweb.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Serve static files
app.use('/videos', express.static('uploads'));
app.use('/uploads', express.static('uploads'));

// Serve specific video files
app.get('/videos/digital-transformation.mp4', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploads', 'digital-transformation.mp4'));
});

app.get('/videos/kinap-promo.webm', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploads', 'kinap-promo.webm'));
});

// Routes
// Apply stricter rate limits to sensitive endpoints
app.use('/api/auth', authLimiter);
app.use('/api/better-auth', authLimiter);
app.use('/api/verification', authLimiter);
app.use('/api/files', writeLimiter);
app.use('/api/sellers', writeLimiter);
app.use('/api/marketplace', writeLimiter);

app.use('/api/students', studentRoutes);
app.use('/api/about-us', aboutUsRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/team-applications', teamApplicationRoutes);
app.use('/api/updates', clubUpdatesRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/mentor-application', mentorApplicationRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/user-videos', userVideosRouter);
app.use('/api/users', usersRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/success-stories', successStoriesRoutes);
app.use('/showcase/profiles', showcaseProfilesRoutes);
app.use('/ambassador/applications', ambassadorApplicationsRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/homepage', homePageRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/better-auth', betterAuthRoutes);
app.use('/api/biometric', biometricAuthRoutes);
app.use('/api/seller-applications', sellerApplicationRoutes);
app.use('/api/sellers', sellersRoutes);
app.use('/api/mentor-applications', require('./routes/mentorApplications'));
app.use('/api/files', fileUploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat-messages', chatMessagesRoutes);
app.use('/api/verification', verificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KiNaP API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint for Railway
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root health check
app.get('/', (req, res) => {
  res.send('Ajira Digital Backend API running');
});

// WebSocket status endpoint
app.get('/api/websocket-status', (req, res) => {
  const stats = wss.getStats();
  res.json({
    status: 'running',
    websocket: {
      totalClients: stats.totalClients,
      totalGroups: stats.totalGroups,
      groups: stats.groups
    },
    timestamp: new Date().toISOString()
  });
});

// Gemini AI status endpoint
app.get('/api/gemini-status', (req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  res.json({
    status: geminiKey ? 'configured' : 'not_configured',
    hasKey: !!geminiKey,
    keyLength: geminiKey ? geminiKey.length : 0,
    timestamp: new Date().toISOString()
  });
});

// Chatbot debug endpoint
app.get('/api/chatbot-debug', (req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
  res.json({
    geminiKey: {
      configured: !!geminiKey,
      length: geminiKey ? geminiKey.length : 0,
      preview: geminiKey ? `${geminiKey.substring(0, 10)}...` : 'not_set'
    },
    geminiUrl: geminiUrl,
    apiTimeout: 30000,
    timestamp: new Date().toISOString()
  });
});

// MySQL Connection & Server start
const PORT = process.env.PORT || 5000;

// Start server even if MySQL fails (for WebSocket and chatbot functionality)
const startServer = () => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('🔌 WebSocket server ready for real-time messaging');
    console.log('🤖 Chatbot and Kinap AI are ready!');
  });
};

// MySQL connection with retry logic
const connectToMySQL = async (retries = 3) => {
  return await testConnection(retries);
};

// Start server with MySQL connection
const startServerWithMySQL = async () => {
  const mysqlConnected = await connectToMySQL();
  
  if (!mysqlConnected) {
    console.warn('⚠️ Failed to connect to MySQL after multiple attempts');
    console.log('📝 Starting server without database (WebSocket and chatbot will still work)');
    console.log('🔧 MySQL troubleshooting:');
    console.log('   1. Check if MySQL server is running');
    console.log('   2. Verify MySQL credentials (MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD)');
    console.log('   3. Check if database exists (MYSQL_DATABASE)');
    console.log('   4. Verify firewall/network settings');
  }
  
  startServer();
};

startServerWithMySQL();