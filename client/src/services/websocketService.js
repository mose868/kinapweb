class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
    this.messageQueue = [];
    this.reconnectTimer = null;
  }

  connect(userId, userName) {
    if (this.socket && this.isConnected) {
      console.log('✅ Already connected to WebSocket');
      return Promise.resolve();
    }

    // Store user info for reconnection
    this.currentUserId = userId;
    this.currentUserName = userName;

    console.log('🔌 Attempting to connect to WebSocket at ws://localhost:5000...');
    console.log('👤 User:', { userId, userName });

    return new Promise((resolve, reject) => {
      try {
        // Use native WebSocket instead of Socket.IO
        this.socket = new WebSocket('ws://localhost:5000');
        
        this.socket.onopen = () => {
          console.log('✅ WebSocket connected successfully!');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // Send join message
          this.send({
            type: 'join_community',
            data: { userId, userName }
          });
          
          // Send queued messages
          while (this.messageQueue.length > 0) {
            const queuedMessage = this.messageQueue.shift();
            this.socket.send(JSON.stringify(queuedMessage));
          }
          
          resolve();
        };

        this.socket.onclose = (event) => {
          console.log('❌ WebSocket disconnected:', event.code, event.reason);
          this.isConnected = false;
          
          // Attempt to reconnect if not a normal closure
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.socket.onerror = (error) => {
          console.error('❌ WebSocket connection error:', error);
          console.error('🔍 Check if backend server is running on port 5000');
          this.isConnected = false;
          reject(error);
        };

        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        reject(error);
      }
    });
  }

  scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000); // Cap at 30 seconds
    
    console.log(`⏳ Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay/1000}s`);
    
    this.reconnectTimer = setTimeout(() => {
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect(this.currentUserId, this.currentUserName).catch((error) => {
          console.error(`❌ Reconnect attempt ${this.reconnectAttempts} failed:`, error);
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          } else {
            console.log('🛑 Max reconnect attempts reached. Stopping reconnection.');
          }
        });
      }
    }, delay);
  }

  send(message) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket not ready, queuing message');
      // Queue message for later if not connected
      this.messageQueue.push(message);
      return;
    }
    
    // Only log important messages, not every message
    if (message.type === 'join_community' || message.type === 'join_group') {
      console.log('📤 Sending WebSocket message:', message.type);
    }
    this.socket.send(JSON.stringify(message));
  }

  handleMessage(message) {
    const { type, data } = message;
    
    // Only log important messages to reduce spam
    if (type === 'user_joined' || type === 'user_left' || type === 'error') {
      console.log('📥 Received WebSocket message:', type);
    }
    
    // Trigger appropriate event listeners
    const listeners = this.listeners.get(type) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('❌ Error in event listener:', error);
      }
    });
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.socket) {
      this.socket.close(1000, 'User disconnected');
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinGroup(groupId, userId) {
    if (!this.isConnected) {
      console.warn('WebSocket not connected');
      return;
    }
    
    this.send({
      type: 'join_group',
      data: { groupId, userId }
    });
  }

  leaveGroup(groupId, userId) {
    if (!this.isConnected) {
      return;
    }
    
    this.send({
      type: 'leave_group',
      data: { groupId, userId }
    });
  }

  sendMessage(messageData) {
    if (!this.isConnected) {
      console.warn('WebSocket not connected');
      return Promise.reject(new Error('WebSocket not connected'));
    }

    return new Promise((resolve, reject) => {
      try {
        this.send({
          type: 'send_group_message',
          data: messageData
        });
        
        // For simplicity, we'll assume success
        // In a more robust implementation, you'd want confirmation from server
        setTimeout(() => resolve(), 100);
      } catch (error) {
        reject(error);
      }
    });
  }

  loadGroupMessages(groupId, limit = 50, offset = 0) {
    if (!this.isConnected) {
      console.warn('WebSocket not connected');
      return Promise.reject(new Error('WebSocket not connected'));
    }

    return new Promise((resolve, reject) => {
      try {
        this.send({
          type: 'load_group_messages',
          data: { groupId, limit, offset }
        });
        
        // Set up one-time listener for response
        const responseHandler = (data) => {
          this.off('group_messages_loaded', responseHandler);
          resolve(data);
        };
        
        const errorHandler = (error) => {
          this.off('load_messages_error', errorHandler);
          reject(error);
        };
        
        this.on('group_messages_loaded', responseHandler);
        this.on('load_messages_error', errorHandler);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          this.off('group_messages_loaded', responseHandler);
          this.off('load_messages_error', errorHandler);
          reject(new Error('Load messages timeout'));
        }, 10000);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteMessage(messageId, userId) {
    if (!this.isConnected) {
      console.warn('WebSocket not connected');
      return Promise.reject(new Error('WebSocket not connected'));
    }

    return new Promise((resolve, reject) => {
      try {
        this.send({
          type: 'delete_message',
          data: { messageId, userId }
        });
        
        // Set up one-time listener for response
        const successHandler = (data) => {
          this.off('message_deleted_success', successHandler);
          resolve(data);
        };
        
        const errorHandler = (error) => {
          this.off('delete_message_error', errorHandler);
          reject(error);
        };
        
        this.on('message_deleted_success', successHandler);
        this.on('delete_message_error', errorHandler);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          this.off('message_deleted_success', successHandler);
          this.off('delete_message_error', errorHandler);
          reject(new Error('Delete message timeout'));
        }, 10000);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  startTyping(groupId, userName) {
    if (!this.isConnected) {
      return;
    }
    
    this.send({
      type: 'typing_start',
      data: { groupId, userName }
    });
  }

  stopTyping(groupId, userName) {
    if (!this.isConnected) {
      return;
    }
    
    this.send({
      type: 'typing_stop',
      data: { groupId, userName }
    });
  }

  updateStatus(userId, status) {
    if (!this.isConnected) {
      return;
    }
    
    this.send({
      type: 'update_status',
      data: { userId, status }
    });
  }

  getUserStatus(userIds) {
    if (!this.isConnected) {
      return Promise.reject(new Error('WebSocket not connected'));
    }

    return new Promise((resolve, reject) => {
      try {
        this.send({
          type: 'get_user_status',
          data: { userIds }
        });
        
        // Set up one-time listener for response
        const responseHandler = (data) => {
          this.off('user_status_info', responseHandler);
          resolve(data);
        };
        
        this.on('user_status_info', responseHandler);
        
        // Timeout after 5 seconds
        setTimeout(() => {
          this.off('user_status_info', responseHandler);
          reject(new Error('Get user status timeout'));
        }, 5000);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  // Event listeners for real-time updates
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    
    const listeners = this.listeners.get(event);
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  // Convenience methods for specific events
  onMessage(callback) {
    this.on('group_message', callback);
  }

  onUserJoined(callback) {
    this.on('user_joined', callback);
  }

  onUserLeft(callback) {
    this.on('user_left', callback);
  }

  onTyping(callback) {
    this.on('typing', callback);
  }

  onStopTyping(callback) {
    this.on('stop_typing', callback);
  }

  onMessageDeleted(callback) {
    this.on('message_deleted', callback);
  }

  onUserStatusUpdate(callback) {
    this.on('user_status_update', callback);
  }

  onUserStatusInfo(callback) {
    this.on('user_status_info', callback);
  }

  // Remove all event listeners
  removeAllListeners() {
    this.listeners.clear();
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      readyState: this.socket ? this.socket.readyState : null
    };
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService; 