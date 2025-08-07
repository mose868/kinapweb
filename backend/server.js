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
<<<<<<< HEAD
const fileUploadRoutes = require('./routes/fileUpload');
const chatRoutes = require('./routes/chat');
const chatMessagesRoutes = require('./routes/chatMessages');
=======
const verificationRoutes = require('./routes/verification');
>>>>>>> e9211fa7b760e0d7aafaab53a5aacf86a3b4640a

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer(server);

<<<<<<< HEAD
// WebSocket server is now handled by the WebSocketServer class
=======
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with their userId
  socket.on('join', (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  // Private message event
  socket.on('private_message', async ({ sender, recipient, content, type }) => {
    const recipientSocketId = onlineUsers.get(recipient);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('private_message', { sender, content, type });
    }
    // Save to DB
    try {
      await Message.create({ sender, recipient, content, type });
    } catch (err) {
      console.error('Error saving private message:', err);
    }
  });

  // Join group event
  socket.on('join_group', ({ groupId, userId }) => {
    socket.join(`group_${groupId}`);
    console.log(`User ${userId} joined group ${groupId}`);
    
    // Notify other users in the group
    socket.to(`group_${groupId}`).emit('user_joined', {
      userId,
      userName: socket.userName || 'Anonymous',
      groupId
    });
  });

  // Leave group event
  socket.on('leave_group', ({ groupId, userId }) => {
    socket.leave(`group_${groupId}`);
    console.log(`User ${userId} left group ${groupId}`);
    
    // Notify other users in the group
    socket.to(`group_${groupId}`).emit('user_left', {
      userId,
      userName: socket.userName || 'Anonymous',
      groupId
    });
  });

  // Group message event
  socket.on('group_message', async ({ sender, groupId, content, type, userName }) => {
    const messageData = {
      id: Date.now().toString(),
      userId: sender,
      userName: userName || 'Anonymous',
      userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=1B4F72&color=fff`,
      message: content,
      timestamp: new Date(),
      messageType: type || 'text',
      status: 'sent'
    };

    // Broadcast to all users in the group (except sender)
    socket.to(`group_${groupId}`).emit('message', messageData);
    
    // Save to DB
    try {
      await Message.create({ sender, group: groupId, content, type });
    } catch (err) {
      console.error('Error saving group message:', err);
    }
  });

  // Typing events
  socket.on('typing_start', ({ groupId, userName }) => {
    socket.to(`group_${groupId}`).emit('typing', { groupId, userName });
  });

  socket.on('typing_stop', ({ groupId, userName }) => {
    socket.to(`group_${groupId}`).emit('stop_typing', { groupId, userName });
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      onlineUsers.delete(socket.userId);
    }
    console.log('User disconnected:', socket.id);
  });

  // Enhanced real-time features for community hub
  socket.on('user_typing', ({ groupId, userId, userName }) => {
    socket.to(`group_${groupId}`).emit('user_typing', { groupId, userId, userName });
  });

  socket.on('user_stop_typing', ({ groupId, userId }) => {
    socket.to(`group_${groupId}`).emit('user_stop_typing', { groupId, userId });
  });

  socket.on('message_read', ({ messageId, groupId, userId }) => {
    socket.to(`group_${groupId}`).emit('message_read', { messageId, userId });
  });

  socket.on('message_delivered', ({ messageId, groupId, userId }) => {
    socket.to(`group_${groupId}`).emit('message_delivered', { messageId, userId });
  });

  socket.on('user_online', ({ userId, userName, userAvatar }) => {
    socket.broadcast.emit('user_online', { userId, userName, userAvatar });
  });

  socket.on('user_offline', ({ userId }) => {
    socket.broadcast.emit('user_offline', { userId });
  });

  socket.on('reaction_added', ({ messageId, groupId, userId, reaction }) => {
    socket.to(`group_${groupId}`).emit('reaction_added', { messageId, userId, reaction });
  });

  socket.on('message_edited', ({ messageId, groupId, newContent, userId }) => {
    socket.to(`group_${groupId}`).emit('message_edited', { messageId, newContent, userId });
  });

  socket.on('message_deleted', ({ messageId, groupId, userId }) => {
    socket.to(`group_${groupId}`).emit('message_deleted', { messageId, userId });
  });

  socket.on('file_upload_progress', ({ groupId, userId, fileName, progress }) => {
    socket.to(`group_${groupId}`).emit('file_upload_progress', { userId, fileName, progress });
  });

  socket.on('voice_message_start', ({ groupId, userId }) => {
    socket.to(`group_${groupId}`).emit('voice_message_start', { groupId, userId });
  });

  socket.on('voice_message_stop', ({ groupId, userId }) => {
    socket.to(`group_${groupId}`).emit('voice_message_stop', { groupId, userId });
  });

  socket.on('call_request', ({ fromUserId, toUserId, callType }) => {
    const recipientSocketId = onlineUsers.get(toUserId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('incoming_call', { fromUserId, callType });
    }
  });

  socket.on('call_accepted', ({ fromUserId, toUserId }) => {
    const recipientSocketId = onlineUsers.get(toUserId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('call_accepted', { fromUserId });
    }
  });

  socket.on('call_rejected', ({ fromUserId, toUserId }) => {
    const recipientSocketId = onlineUsers.get(toUserId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('call_rejected', { fromUserId });
    }
  });

  socket.on('call_ended', ({ fromUserId, toUserId }) => {
    const recipientSocketId = onlineUsers.get(toUserId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('call_ended', { fromUserId });
    }
  });
});
>>>>>>> e9211fa7b760e0d7aafaab53a5aacf86a3b4640a

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
<<<<<<< HEAD
app.use('/api/files', fileUploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat-messages', chatMessagesRoutes);
=======
app.use('/api/verification', verificationRoutes);
>>>>>>> e9211fa7b760e0d7aafaab53a5aacf86a3b4640a

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

// Start server even if MongoDB fails (for Socket.IO and chatbot functionality)
const startServer = () => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('🔌 Socket.IO ready for real-time messaging');
    console.log('🤖 Chatbot and Kinap AI are ready!');
  });
};

// MongoDB connection with retry logic
const connectToMongoDB = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Attempting MongoDB connection (attempt ${i + 1}/${retries})...`);
      
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
    console.log('📝 Starting server without database (Socket.IO and chatbot will still work)');
    console.log('🔧 MongoDB troubleshooting:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify MongoDB Atlas credentials');
    console.log('   3. Check if IP is whitelisted in MongoDB Atlas');
    console.log('   4. Verify connection string format');
  }
  
  startServer();
};

startServerWithMongoDB(); 