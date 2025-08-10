const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const http = require('http');
const WebSocketServer = require('./websocketServer');

const studentRoutes = require('./routes/students');
const aboutUsRoutes = require('./routes/aboutUs');
const teamRoutes = require('./routes/team');
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
const Message = require('./models/Message');
const homePageRoutes = require('./routes/homePage');
const contentRoutes = require('./routes/content');
const chatbotRoutes = require('./routes/chatbot');
const marketplaceRoutes = require('./routes/marketplace');
const authRoutes = require('./routes/auth');
const betterAuthRoutes = require('./routes/betterAuth');
const biometricAuthRoutes = require('./routes/biometricAuth');
const sellerApplicationRoutes = require('./routes/sellerApplications');
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



// Middleware
app.use(cors({ 
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:4173',
    'https://kinapweb.vercel.app',
    'https://kinapweb-git-main-mose868s-projects.vercel.app',
    'https://kinapweb-mose868s-projects.vercel.app'
  ], 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/about-us', aboutUsRoutes);
app.use('/api/team', teamRoutes);
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
app.use('/api/mentor-applications', require('./routes/mentorApplications'));
app.use('/api/files', fileUploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat-messages', chatMessagesRoutes);
app.use('/api/verification', verificationRoutes);

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

// MongoDB Connection & Server start
const PORT = process.env.PORT || 5000;

// Start server even if MongoDB fails (for WebSocket and chatbot functionality)
const startServer = () => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('🔌 WebSocket server ready for real-time messaging');
    console.log('🤖 Chatbot and Kinap AI are ready!');
  });
};

// MongoDB connection with retry logic
const connectToMongoDB = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Attempting MongoDB connection (attempt ${i + 1}/${retries})...`);
      
      // Check if MONGODB_URI is set
      if (!process.env.MONGODB_URI) {
        console.warn('⚠️ MONGODB_URI not set, skipping database connection');
        return false;
      }
      
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000, // 30 second timeout
        socketTimeoutMS: 45000, // 45 second timeout
        connectTimeoutMS: 30000, // 30 second connection timeout
        maxPoolSize: 10, // Maximum number of connections in the pool
        minPoolSize: 1, // Minimum number of connections in the pool
        maxIdleTimeMS: 30000, // Maximum time a connection can remain idle
        retryWrites: true,
        w: 'majority',
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      
      console.log('✅ MongoDB connected successfully');
      return true;
    } catch (err) {
      console.warn(`⚠️ MongoDB connection attempt ${i + 1} failed:`, err.message);
      
      if (i < retries - 1) {
        console.log(`⏳ Retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  return false;
};

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Start server with MongoDB connection
const startServerWithMongoDB = async () => {
  const mongoConnected = await connectToMongoDB();
  
  if (!mongoConnected) {
    console.warn('⚠️ Failed to connect to MongoDB after multiple attempts');
    console.log('📝 Starting server without database (WebSocket and chatbot will still work)');
    console.log('🔧 MongoDB troubleshooting:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify MongoDB Atlas credentials');
    console.log('   3. Check if IP is whitelisted in MongoDB Atlas');
    console.log('   4. Verify connection string format');
  }
  
  startServer();
};

startServerWithMongoDB();