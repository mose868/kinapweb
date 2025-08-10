// Native WebSocket Service for KiNaP Community Hub
// Replacing Socket.IO with native WebSocket to match backend implementation

class WebSocketService {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private userId: string | null = null;
  private userName: string | null = null;
  private userAvatar: string | null = null;

  // Initialize WebSocket connection
  connect(userId: string, userName: string, userAvatar: string) {
    if (this.ws && this.isConnected) {
      return this.ws;
    }

    this.userId = userId;
    this.userName = userName;
    this.userAvatar = userAvatar;

    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const wsUrl = serverUrl.replace('http', 'ws').replace('/api', '');

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('🔌 WebSocket connected successfully');
        this.isConnected = true;
        this.reconnectAttempts = 0;

        // Send a ping message to verify connection
        this.sendMessage({
          type: 'ping',
          data: { timestamp: Date.now() }
        });

        // Join with user info after a short delay
        setTimeout(() => {
          this.sendMessage({
            type: 'join_community',
            data: { userId, userName, userAvatar }
          });
        }, 100);
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('🔌 WebSocket message received:', message.type);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        this.isConnected = false;
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('🔌 WebSocket error:', error);
        this.isConnected = false;
      };

    } catch (error) {
      console.error('🔌 WebSocket connection error:', error);
      this.handleReconnect();
    }

    return this.ws;
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('🔌 Max reconnection attempts reached');
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);

    console.log(`🔌 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      if (this.userId && this.userName && this.userAvatar) {
        this.connect(this.userId, this.userName, this.userAvatar);
      }
    }, delay);
  }

  private handleMessage(message: any) {
    const { type, data } = message;
    
    // Handle pong response
    if (type === 'pong') {
      console.log('🔌 WebSocket ping-pong successful');
      return;
    }
    
    // Emit event to listeners
    if (this.eventListeners.has(type)) {
      this.eventListeners.get(type)?.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${type}:`, error);
        }
      });
    }
  }

  private sendMessage(message: any) {
    if (this.ws && this.isConnected) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    }
  }

  // Join a group
  joinGroup(groupId: string, userId: string, userName: string) {
    this.sendMessage({
      type: 'join_group',
      data: { groupId, userId, userName }
    });
  }

  // Leave a group
  leaveGroup(groupId: string, userId: string) {
    this.sendMessage({
      type: 'leave_group',
      data: { groupId, userId }
    });
  }

  // Send a group message
  sendGroupMessage(
    groupId: string,
    sender: string,
    content: string,
    type: string = 'text',
    userName: string
  ) {
    this.sendMessage({
      type: 'send_group_message',
      data: {
        groupId,
        sender,
        content,
        type,
        userName,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Load group messages
  loadGroupMessages(groupId: string, limit: number = 50) {
    this.sendMessage({
      type: 'load_group_messages',
      data: { groupId, limit }
    });
  }

  // Delete message
  deleteMessage(messageId: string, groupId: string, userId: string) {
    this.sendMessage({
      type: 'delete_message',
      data: { messageId, groupId, userId }
    });
  }

  // Typing indicators
  startTyping(groupId: string, userId: string, userName: string) {
    this.sendMessage({
      type: 'typing_start',
      data: { groupId, userId, userName }
    });
  }

  stopTyping(groupId: string, userId: string) {
    this.sendMessage({
      type: 'typing_stop',
      data: { groupId, userId }
    });
  }

  // Update user status
  updateStatus(userId: string, status: string) {
    this.sendMessage({
      type: 'update_status',
      data: { userId, status }
    });
  }

  // Get user status
  getUserStatus(userIds: string[]) {
    this.sendMessage({
      type: 'get_user_status',
      data: { userIds }
    });
  }

  // Disconnect
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.isConnected = false;
    this.eventListeners.clear();
  }

  // Get WebSocket instance
  getSocket(): WebSocket | null {
    return this.ws;
  }

  // Check connection status
  isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Listen to events
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);
  }

  // Remove event listener
  off(event: string, callback?: Function) {
    if (!this.eventListeners.has(event)) return;

    if (callback) {
      const listeners = this.eventListeners.get(event) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    } else {
      this.eventListeners.delete(event);
    }
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
