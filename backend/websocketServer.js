const WebSocket = require('ws');
const ChatMessage = require('./models/ChatMessage');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // Map of client connections
    this.groups = new Map(); // Map of group rooms
    this.userStatus = new Map(); // Map of user online status and last seen
    this.setupWebSocketServer();
  }

  setupWebSocketServer() {
    console.log('🚀 WebSocket server initialized and listening for connections...');
    
    this.wss.on('connection', (ws, req) => {
      console.log('✅ New WebSocket connection established');
      
      const clientId = this.generateClientId();
      this.clients.set(clientId, {
        ws,
        userId: null,
        userName: null,
        groups: new Set()
      });

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data);
          await this.handleMessage(clientId, message);
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
          this.sendToClient(clientId, {
            type: 'error',
            data: { message: 'Invalid message format' }
          });
        }
      });

      ws.on('close', (code, reason) => {
        console.log(`❌ Client ${clientId} disconnected: ${code} - ${reason}`);
        this.handleClientDisconnect(clientId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.handleClientDisconnect(clientId);
      });
    });
  }

  generateClientId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  async handleMessage(clientId, message) {
    const { type, data } = message;
    const client = this.clients.get(clientId);

    if (!client) {
      console.error('Client not found:', clientId);
      return;
    }

    switch (type) {
      case 'join_community':
        await this.handleJoinCommunity(clientId, data);
        break;
      
      case 'join_group':
        await this.handleJoinGroup(clientId, data);
        break;
      
      case 'leave_group':
        await this.handleLeaveGroup(clientId, data);
        break;
      
      case 'send_group_message':
        await this.handleSendGroupMessage(clientId, data);
        break;
      
      case 'load_group_messages':
        await this.handleLoadGroupMessages(clientId, data);
        break;
      
      case 'delete_message':
        await this.handleDeleteMessage(clientId, data);
        break;
      
      case 'typing_start':
        await this.handleTypingStart(clientId, data);
        break;
      
      case 'typing_stop':
        await this.handleTypingStop(clientId, data);
        break;
      
      case 'update_status':
        await this.handleUpdateStatus(clientId, data);
        break;
      
      case 'get_user_status':
        await this.handleGetUserStatus(clientId, data);
        break;
      
      default:
        console.warn('Unknown message type:', type);
        this.sendToClient(clientId, {
          type: 'error',
          data: { message: 'Unknown message type' }
        });
    }
  }

  async handleJoinCommunity(clientId, data) {
    const { userId, userName } = data;
    const client = this.clients.get(clientId);
    
    if (client) {
      client.userId = userId;
      client.userName = userName;
      
      // Update user online status
      this.userStatus.set(userId, {
        status: 'online',
        lastSeen: new Date(),
        userName: userName,
        clientId: clientId
      });
      
      console.log(`👤 User ${userName} (${userId}) joined community`);
      console.log(`📊 Current stats: ${this.getStats().totalClients} clients connected`);
      
      // Broadcast user online status to all groups they're in
      this.broadcastUserStatusUpdate(userId, 'online');
    }
  }

  async handleJoinGroup(clientId, data) {
    const { groupId, userId } = data;
    const client = this.clients.get(clientId);
    
    if (!client) return;

    // Add client to group
    if (!this.groups.has(groupId)) {
      this.groups.set(groupId, new Set());
    }
    this.groups.get(groupId).add(clientId);
    client.groups.add(groupId);

    console.log(`User ${client.userName} joined group ${groupId}`);

    // Notify other users in the group
    this.broadcastToGroup(groupId, {
      type: 'user_joined',
      data: {
        userId: client.userId,
        userName: client.userName,
        groupId
      }
    }, clientId);
  }

  async handleLeaveGroup(clientId, data) {
    const { groupId, userId } = data;
    const client = this.clients.get(clientId);
    
    if (!client) return;

    // Remove client from group
    if (this.groups.has(groupId)) {
      this.groups.get(groupId).delete(clientId);
      if (this.groups.get(groupId).size === 0) {
        this.groups.delete(groupId);
      }
    }
    client.groups.delete(groupId);

    console.log(`User ${client.userName} left group ${groupId}`);

    // Notify other users in the group
    this.broadcastToGroup(groupId, {
      type: 'user_left',
      data: {
        userId: client.userId,
        userName: client.userName,
        groupId
      }
    }, clientId);
  }

  async handleSendGroupMessage(clientId, data) {
    const { groupId, userId, userName, content, messageType, mediaUrl, fileSize, duration, replyTo } = data;
    const client = this.clients.get(clientId);
    
    if (!client) return;

    try {
      // Handle AI messages with special avatar
      let userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=1B4F72&color=fff`;
      if (userId === 'kinap-ai') {
        userAvatar = 'https://ui-avatars.com/api/?name=Kinap+AI&background=8B5CF6&color=FFFFFF&bold=true&size=40';
      }

      // Save to MongoDB
      const messageId = Date.now().toString();
      const savedMessage = await ChatMessage.create({
        messageId,
        groupId,
        userId,
        userName: userName || 'Anonymous',
        userAvatar,
        message: content,
        content,
        messageType: messageType || 'text',
        status: 'sent',
        mediaUrl,
        fileSize,
        duration,
        replyTo
      });

      const broadcastMessage = {
        type: 'group_message',
        data: {
          id: savedMessage._id.toString(),
          groupId,
          userId,
          userName: userName || 'Anonymous',
          userAvatar,
          content,
          messageType: messageType || 'text',
          mediaUrl,
          fileSize,
          duration,
          replyTo,
          timestamp: savedMessage.createdAt.toISOString(),
          status: 'sent'
        }
      };

      // Broadcast to all users in the group
      this.broadcastToGroup(groupId, broadcastMessage);
      
      console.log(`💬 Message saved and broadcasted: ${savedMessage._id} in group ${groupId}`);
      console.log(`📤 Broadcasting to ${this.groups.get(groupId)?.size || 0} clients in group ${groupId}`);
    } catch (error) {
      console.error('❌ Error saving group message:', error);
      this.sendToClient(clientId, {
        type: 'message_error',
        data: { error: 'Failed to save message' }
      });
    }
  }

  async handleLoadGroupMessages(clientId, data) {
    const { groupId, limit = 50, offset = 0 } = data;
    
    try {
      const messages = await ChatMessage.find({
        groupId,
        isDeleted: false
      })
      .sort({ timestamp: 1 })
      .limit(limit)
      .skip(offset)
      .lean();

      // Format messages for frontend
      const formattedMessages = messages.map(msg => ({
        id: msg._id.toString(),
        groupId: msg.groupId,
        userId: msg.userId,
        userName: msg.userName,
        userAvatar: msg.userAvatar,
        content: msg.content,
        messageType: msg.messageType,
        mediaUrl: msg.mediaUrl,
        fileSize: msg.fileSize,
        duration: msg.duration,
        timestamp: msg.timestamp.toISOString(),
        status: msg.status,
        isEdited: msg.isEdited,
        reactions: msg.reactions || []
      }));

      this.sendToClient(clientId, {
        type: 'group_messages_loaded',
        data: {
          groupId,
          messages: formattedMessages,
          hasMore: messages.length === limit
        }
      });
    } catch (error) {
      console.error('Error loading group messages:', error);
      this.sendToClient(clientId, {
        type: 'load_messages_error',
        data: { error: 'Failed to load messages' }
      });
    }
  }

  async handleDeleteMessage(clientId, data) {
    const { messageId, userId } = data;
    
    try {
      const message = await ChatMessage.findOne({ messageId, isDeleted: false });
      if (!message) {
        this.sendToClient(clientId, {
          type: 'delete_message_error',
          data: { error: 'Message not found' }
        });
        return;
      }

      // Check if user can delete this message (sender or admin)
      if (message.userId !== userId) {
        this.sendToClient(clientId, {
          type: 'delete_message_error',
          data: { error: 'You can only delete your own messages' }
        });
        return;
      }

      // Soft delete - mark as deleted
      message.isDeleted = true;
      message.deletedBy.push(userId);
      message.deletedAt = new Date();
      await message.save();

      // Broadcast deletion to all users in the group
      this.broadcastToGroup(message.groupId, {
        type: 'message_deleted',
        data: {
          messageId,
          groupId: message.groupId
        }
      });

      this.sendToClient(clientId, {
        type: 'message_deleted_success',
        data: { messageId }
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      this.sendToClient(clientId, {
        type: 'delete_message_error',
        data: { error: 'Failed to delete message' }
      });
    }
  }

  async handleTypingStart(clientId, data) {
    const { groupId, userName } = data;
    const client = this.clients.get(clientId);
    
    if (!client) return;

    this.broadcastToGroup(groupId, {
      type: 'typing',
      data: { groupId, userName }
    }, clientId);
  }

  async handleTypingStop(clientId, data) {
    const { groupId, userName } = data;
    const client = this.clients.get(clientId);
    
    if (!client) return;

    this.broadcastToGroup(groupId, {
      type: 'stop_typing',
      data: { groupId, userName }
    }, clientId);
  }

  async handleUpdateStatus(clientId, data) {
    const { userId, status } = data; // status: 'online', 'away', 'offline'
    const client = this.clients.get(clientId);
    
    if (!client || !userId) return;

    // Update user status
    const userStatusInfo = this.userStatus.get(userId);
    if (userStatusInfo) {
      userStatusInfo.status = status;
      userStatusInfo.lastSeen = new Date();
      
      // Broadcast status update
      this.broadcastUserStatusUpdate(userId, status, userStatusInfo.lastSeen);
    }
  }

  async handleGetUserStatus(clientId, data) {
    const { userIds } = data; // Array of user IDs to get status for
    
    const statusInfo = {};
    userIds.forEach(userId => {
      const userStatus = this.userStatus.get(userId);
      if (userStatus) {
        statusInfo[userId] = {
          status: userStatus.status,
          lastSeen: userStatus.lastSeen,
          userName: userStatus.userName
        };
      } else {
        statusInfo[userId] = {
          status: 'offline',
          lastSeen: null,
          userName: null
        };
      }
    });

    this.sendToClient(clientId, {
      type: 'user_status_info',
      data: statusInfo
    });
  }

  handleClientDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Update user status to offline if this was their only connection
    if (client.userId) {
      const userStatusInfo = this.userStatus.get(client.userId);
      if (userStatusInfo && userStatusInfo.clientId === clientId) {
        userStatusInfo.status = 'offline';
        userStatusInfo.lastSeen = new Date();
        
        // Broadcast user offline status
        this.broadcastUserStatusUpdate(client.userId, 'offline', userStatusInfo.lastSeen);
      }
    }

    // Remove client from all groups
    client.groups.forEach(groupId => {
      if (this.groups.has(groupId)) {
        this.groups.get(groupId).delete(clientId);
        if (this.groups.get(groupId).size === 0) {
          this.groups.delete(groupId);
        }
      }
    });

    // Remove client
    this.clients.delete(clientId);
  }

  sendToClient(clientId, message) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending message to client:', error);
      }
    }
  }

  broadcastToGroup(groupId, message, excludeClientId = null) {
    if (!this.groups.has(groupId)) return;

    this.groups.get(groupId).forEach(clientId => {
      if (clientId !== excludeClientId) {
        this.sendToClient(clientId, message);
      }
    });
  }

  broadcastUserStatusUpdate(userId, status, lastSeen = null) {
    const statusMessage = {
      type: 'user_status_update',
      data: {
        userId,
        status,
        lastSeen: lastSeen || new Date()
      }
    };

    // Broadcast to all connected clients
    this.clients.forEach((client, clientId) => {
      this.sendToClient(clientId, statusMessage);
    });
  }

  getStats() {
    return {
      totalClients: this.clients.size,
      totalGroups: this.groups.size,
      groups: Array.from(this.groups.entries()).map(([groupId, clients]) => ({
        groupId,
        clientCount: clients.size
      }))
    };
  }
}

module.exports = WebSocketServer; 