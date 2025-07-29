const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

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
const sellerApplicationRoutes = require('./routes/sellerApplications');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// In-memory map for userId <-> socket.id
const onlineUsers = new Map();

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

  // More events (typing, read, etc.) can be added here
});

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
app.use('/api/seller-applications', sellerApplicationRoutes);
app.use('/api/mentor-applications', require('./routes/mentorApplications'));

// Root health check
app.get('/', (req, res) => {
  res.send('Ajira Digital Backend API running');
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