import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Initialize socket connection
  connect(userId: string, userName: string, userAvatar: string) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('🔌 Socket.IO connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Join with user info
      this.socket?.emit('join', userId);
      this.socket?.emit('user_online', { userId, userName, userAvatar });
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Socket.IO disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Socket.IO connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('🔌 Max reconnection attempts reached');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔌 Socket.IO reconnected after ${attemptNumber} attempts`);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Re-join with user info
      this.socket?.emit('join', userId);
      this.socket?.emit('user_online', { userId, userName, userAvatar });
    });

    return this.socket;
  }

  // Join a group
  joinGroup(groupId: string, userId: string, userName: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_group', { groupId, userId, userName });
    }
  }

  // Leave a group
  leaveGroup(groupId: string, userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_group', { groupId, userId });
    }
  }

  // Send a group message
  sendGroupMessage(groupId: string, sender: string, content: string, type: string = 'text', userName: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('group_message', { sender, groupId, content, type, userName });
    }
  }

  // Send private message
  sendPrivateMessage(sender: string, recipient: string, content: string, type: string = 'text') {
    if (this.socket && this.isConnected) {
      this.socket.emit('private_message', { sender, recipient, content, type });
    }
  }

  // Typing indicators
  startTyping(groupId: string, userId: string, userName: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('user_typing', { groupId, userId, userName });
    }
  }

  stopTyping(groupId: string, userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('user_stop_typing', { groupId, userId });
    }
  }

  // Message status
  markMessageRead(messageId: string, groupId: string, userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('message_read', { messageId, groupId, userId });
    }
  }

  markMessageDelivered(messageId: string, groupId: string, userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('message_delivered', { messageId, groupId, userId });
    }
  }

  // Reactions
  addReaction(messageId: string, groupId: string, userId: string, reaction: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('reaction_added', { messageId, groupId, userId, reaction });
    }
  }

  // Message editing
  editMessage(messageId: string, groupId: string, newContent: string, userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('message_edited', { messageId, groupId, newContent, userId });
    }
  }

  // Message deletion
  deleteMessage(messageId: string, groupId: string, userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('message_deleted', { messageId, groupId, userId });
    }
  }

  // File upload progress
  sendFileUploadProgress(groupId: string, userId: string, fileName: string, progress: number) {
    if (this.socket && this.isConnected) {
      this.socket.emit('file_upload_progress', { groupId, userId, fileName, progress });
    }
  }

  // Voice messages
  startVoiceMessage(groupId: string, userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('voice_message_start', { groupId, userId });
    }
  }

  stopVoiceMessage(groupId: string, userId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('voice_message_stop', { groupId, userId });
    }
  }

  // Call functionality
  requestCall(fromUserId: string, toUserId: string, callType: 'audio' | 'video') {
    if (this.socket && this.isConnected) {
      this.socket.emit('call_request', { fromUserId, toUserId, callType });
    }
  }

  acceptCall(fromUserId: string, toUserId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('call_accepted', { fromUserId, toUserId });
    }
  }

  rejectCall(fromUserId: string, toUserId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('call_rejected', { fromUserId, toUserId });
    }
  }

  endCall(fromUserId: string, toUserId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('call_ended', { fromUserId, toUserId });
    }
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Get socket instance
  getSocket(): Socket | null {
    return this.socket;
  }

  // Check connection status
  isSocketConnected(): boolean {
    return this.isConnected;
  }

  // Listen to events
  on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remove event listener
  off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }
}

// Create singleton instance
const socketService = new SocketService();
export default socketService; 