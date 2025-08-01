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
const betterAuthRoutes = require('./routes/betterAuth');
const biometricAuthRoutes = require('./routes/biometricAuth');
const sellerApplicationRoutes = require('./routes/sellerApplications');
const fileUploadRoutes = require('./routes/fileUpload');
const chatRoutes = require('./routes/chat');
const chatMessagesRoutes = require('./routes/chatMessages');

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

  // User joins community
  socket.on('join_community', ({ userId, userName }) => {
    onlineUsers.set(userId, socket.id);
    socket.userId = userId;
    socket.userName = userName;
    console.log(`User ${userName} (${userId}) joined community with socket ${socket.id}`);
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

  // Send group message event (new format)
  socket.on('send_group_message', async (messageData) => {
    const { groupId, userId, userName, content, messageType, mediaUrl, fileSize, duration } = messageData;
    
    try {
      // Handle AI messages with special avatar
      let userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=1B4F72&color=fff`;
      if (userId === 'kinap-ai') {
        userAvatar = 'https://via.placeholder.com/40/8B5CF6/FFFFFF?text=AI';
      }

      // Save to MongoDB first
      const savedMessage = await Message.create({ 
        sender: userId, 
        senderName: userName || 'Anonymous',
        senderAvatar: userAvatar,
        group: groupId, 
        content: content, 
        messageType: messageType || 'text',
        mediaUrl: mediaUrl,
        fileSize: fileSize,
        duration: duration,
        status: 'sent'
      });

      const broadcastMessage = {
        id: savedMessage._id.toString(),
        groupId: groupId,
        userId: userId,
        userName: userName || 'Anonymous',
        userAvatar: userAvatar,
        content: content,
        messageType: messageType || 'text',
        mediaUrl: mediaUrl,
        fileSize: fileSize,
        duration: duration,
        timestamp: savedMessage.createdAt.toISOString(),
        status: 'sent'
      };

      // Join the group if not already joined
      socket.join(`group_${groupId}`);
      
      // Broadcast to all users in the group (including sender for confirmation)
      io.to(`group_${groupId}`).emit('group_message', broadcastMessage);
      
      console.log(`Message saved and broadcasted: ${savedMessage._id} in group ${groupId}`);
    } catch (err) {
      console.error('Error saving group message:', err);
      // Send error back to sender
      socket.emit('message_error', { error: 'Failed to save message' });
    }
  });

  // Load group messages
  socket.on('load_group_messages', async ({ groupId, limit = 50, offset = 0 }) => {
    try {
      const messages = await Message.find({ 
        group: groupId, 
        isDeleted: false 
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

      // Format messages for frontend
      const formattedMessages = messages.reverse().map(msg => ({
        id: msg._id.toString(),
        groupId: msg.group,
        userId: msg.sender,
        userName: msg.senderName,
        userAvatar: msg.senderAvatar,
        content: msg.content,
        messageType: msg.messageType,
        mediaUrl: msg.mediaUrl,
        fileSize: msg.fileSize,
        duration: msg.duration,
        timestamp: msg.createdAt.toISOString(),
        status: msg.status,
        isEdited: msg.isEdited,
        reactions: msg.reactions || []
      }));

      socket.emit('group_messages_loaded', {
        groupId,
        messages: formattedMessages,
        hasMore: messages.length === limit
      });
    } catch (err) {
      console.error('Error loading group messages:', err);
      socket.emit('load_messages_error', { error: 'Failed to load messages' });
    }
  });

  // Delete message
  socket.on('delete_message', async ({ messageId, userId }) => {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        socket.emit('delete_message_error', { error: 'Message not found' });
        return;
      }

      // Check if user can delete this message (sender or admin)
      if (message.sender.toString() !== userId) {
        socket.emit('delete_message_error', { error: 'You can only delete your own messages' });
        return;
      }

      // Soft delete - mark as deleted
      message.isDeleted = true;
      message.deletedBy.push(userId);
      message.deletedAt = new Date();
      await message.save();

      // Broadcast deletion to all users in the group
      socket.to(`group_${message.group}`).emit('message_deleted', {
        messageId: messageId,
        groupId: message.group
      });

      socket.emit('message_deleted_success', { messageId });
    } catch (err) {
      console.error('Error deleting message:', err);
      socket.emit('delete_message_error', { error: 'Failed to delete message' });
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