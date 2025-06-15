const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const rateLimiter = require('socket.io-rate-limiter');

let io;

// Rate limiter: max 20 messages per 10 seconds
const limiter = rateLimiter.create({
  points: 20,
  duration: 10
});

// Initialize socket.io
const initialize = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.user.name}`);

    // Join main chat room
    socket.join('main');

    // Broadcast user joined message
    socket.to('main').emit('user:joined', {
      user: {
        id: socket.user._id,
        name: socket.user.name,
        avatar: socket.user.profileImage
      },
      timestamp: new Date()
    });

    // Handle new message
    socket.on('message:new', async (data) => {
      try {
        // Apply rate limiting
        if (limiter.tryRemoveTokens(socket.handshake.address, 1) === false) {
          socket.emit('error', { message: 'Rate limit exceeded' });
          return;
        }

        // Sanitize message content
        const sanitizedContent = require('xss')(data.content);

        const messageData = {
          id: require('crypto').randomBytes(16).toString('hex'),
          content: sanitizedContent,
          user: {
            id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.profileImage
          },
          timestamp: new Date(),
          reactions: {}
        };

        // Store message in database
        await require('../models/Message').create({
          content: sanitizedContent,
          user: socket.user._id,
          reactions: []
        });

        // Broadcast message to all users in main room
        io.to('main').emit('message:new', messageData);

      } catch (error) {
        logger.error('Error handling new message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle message reaction
    socket.on('message:react', async (data) => {
      try {
        const { messageId, reaction } = data;
        
        // Validate reaction emoji
        const validReactions = ['👍', '❤️', '🚀'];
        if (!validReactions.includes(reaction)) {
          socket.emit('error', { message: 'Invalid reaction' });
          return;
        }

        // Update message reactions
        const message = await require('../models/Message').findById(messageId);
        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        // Toggle reaction
        const userReactionIndex = message.reactions.findIndex(
          r => r.user.toString() === socket.user._id.toString() && r.emoji === reaction
        );

        if (userReactionIndex > -1) {
          message.reactions.splice(userReactionIndex, 1);
        } else {
          message.reactions.push({
            user: socket.user._id,
            emoji: reaction
          });
        }

        await message.save();

        // Broadcast reaction update
        io.to('main').emit('message:reaction', {
          messageId,
          reactions: message.reactions
        });

      } catch (error) {
        logger.error('Error handling reaction:', error);
        socket.emit('error', { message: 'Failed to add reaction' });
      }
    });

    // Handle message deletion (admin/moderator only)
    socket.on('message:delete', async (data) => {
      try {
        if (!['admin', 'moderator'].includes(socket.user.role)) {
          socket.emit('error', { message: 'Unauthorized' });
          return;
        }

        const { messageId } = data;
        await require('../models/Message').findByIdAndDelete(messageId);

        // Broadcast deletion to all users
        io.to('main').emit('message:deleted', { messageId });

      } catch (error) {
        logger.error('Error deleting message:', error);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // Handle user typing indicator
    socket.on('user:typing', (data) => {
      socket.to('main').emit('user:typing', {
        user: {
          id: socket.user._id,
          name: socket.user.name
        }
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user.name}`);
      socket.to('main').emit('user:left', {
        user: {
          id: socket.user._id,
          name: socket.user.name
        },
        timestamp: new Date()
      });
    });
  });

  return io;
};

module.exports = {
  initialize,
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized');
    }
    return io;
  }
}; 