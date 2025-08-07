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

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer(server);

// WebSocket server is now handled by the WebSocketServer class

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
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

// MongoDB Connection & Server start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 