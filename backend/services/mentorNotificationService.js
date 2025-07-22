const MentorshipRequest = require('../models/MentorshipRequest');
const Mentorship = require('../models/Mentorship');

class MentorNotificationService {
  constructor() {
    this.activeConnections = new Map(); // Store active mentor connections
    this.notificationQueue = [];
    this.isProcessing = false;
  }

  // Initialize the service (called when server starts)
  initialize() {
    console.log('🚨 Mentor Notification Service initialized');
    
    // Start processing notification queue
    this.startQueueProcessor();
    
    // Start cleanup of expired requests
    this.startRequestCleanup();
  }

  // Add mentor to active connection pool (when they go online)
  addMentorConnection(mentorId, connectionInfo = {}) {
    this.activeConnections.set(mentorId, {
      connectedAt: new Date(),
      lastActivity: new Date(),
      socketId: connectionInfo.socketId,
      isAvailable: true,
      responseCount: 0,
      ...connectionInfo
    });
    
    console.log(`📱 Mentor ${mentorId} connected for notifications`);
    
    // Update mentor's availability status
    this.updateMentorOnlineStatus(mentorId, true);
  }

  // Remove mentor from active connections (when they go offline)
  removeMentorConnection(mentorId) {
    if (this.activeConnections.has(mentorId)) {
      this.activeConnections.delete(mentorId);
      console.log(`📱 Mentor ${mentorId} disconnected from notifications`);
      
      // Update mentor's availability status
      this.updateMentorOnlineStatus(mentorId, false);
    }
  }

  // Update mentor's online status in database
  async updateMentorOnlineStatus(mentorId, isOnline) {
    try {
      const status = isOnline ? 'Available' : 'Offline';
      await Mentorship.findByIdAndUpdate(mentorId, {
        'availability.status': status,
        'statistics.lastActiveDate': new Date()
      });
    } catch (error) {
      console.error('Error updating mentor online status:', error);
    }
  }

  // Main function to broadcast request to available mentors (Uber-like)
  async broadcastRequestToMentors(requestId, options = {}) {
    try {
      const request = await MentorshipRequest.findById(requestId);
      if (!request) {
        throw new Error('Request not found');
      }

      // Find matching mentors
      const matchingMentors = await MentorshipRequest.findMatchingMentors(requestId, { 
        limit: options.maxMentors || 5 
      });

      if (matchingMentors.length === 0) {
        console.log(`❌ No matching mentors found for request ${request.requestId}`);
        return { success: false, mentorsNotified: 0, message: 'No matching mentors available' };
      }

      // Filter to only online mentors if preference is set
      const availableMentors = options.onlineOnly 
        ? matchingMentors.filter(mentor => this.activeConnections.has(mentor._id.toString()))
        : matchingMentors;

      if (availableMentors.length === 0 && options.onlineOnly) {
        console.log(`❌ No online mentors available for request ${request.requestId}`);
        return { success: false, mentorsNotified: 0, message: 'No online mentors available' };
      }

      // Create notification payload
      const notification = this.createNotificationPayload(request, 'new_request');

      let notificationsSent = 0;
      const notificationResults = [];

      // Send notifications to mentors
      for (const mentor of availableMentors) {
        try {
          const result = await this.sendNotificationToMentor(mentor._id, notification, request);
          if (result.success) {
            notificationsSent++;
            
            // Add to request's targeted mentors
            await request.addTargetedMentor(mentor._id);
          }
          notificationResults.push({ mentorId: mentor._id, ...result });
        } catch (error) {
          console.error(`Error sending notification to mentor ${mentor._id}:`, error);
          notificationResults.push({ 
            mentorId: mentor._id, 
            success: false, 
            error: error.message 
          });
        }
      }

      // Update request status
      if (notificationsSent > 0) {
        request.status = 'Broadcasted';
        request.metrics.mentorPoolSize = availableMentors.length;
        request.metrics.totalNotificationsSent = notificationsSent;
        await request.save();
      }

      console.log(`🚨 Request ${request.requestId} broadcasted to ${notificationsSent}/${availableMentors.length} mentors`);

      return {
        success: notificationsSent > 0,
        mentorsNotified: notificationsSent,
        totalMentors: availableMentors.length,
        results: notificationResults,
        estimatedResponseTime: this.calculateEstimatedResponseTime(availableMentors)
      };

    } catch (error) {
      console.error('Error broadcasting request to mentors:', error);
      return { success: false, mentorsNotified: 0, error: error.message };
    }
  }

  // Send notification to specific mentor
  async sendNotificationToMentor(mentorId, notification, request) {
    try {
      const connection = this.activeConnections.get(mentorId.toString());
      
      if (connection && connection.isAvailable) {
        // Real-time notification (via WebSocket/Socket.io - to be implemented)
        const realTimeResult = await this.sendRealTimeNotification(mentorId, notification, connection);
        
        // Email/SMS backup notification
        const backupResult = await this.sendBackupNotification(mentorId, notification, request);
        
        // Update connection activity
        connection.lastActivity = new Date();
        connection.responseCount++;
        
        console.log(`📧 Notification sent to mentor ${mentorId} for request ${request.requestId}`);
        
        return {
          success: true,
          method: realTimeResult.success ? 'real-time' : 'backup',
          timestamp: new Date()
        };
      } else {
        // Mentor not online, send backup notification only
        const backupResult = await this.sendBackupNotification(mentorId, notification, request);
        
        return {
          success: backupResult.success,
          method: 'backup',
          timestamp: new Date()
        };
      }
    } catch (error) {
      console.error(`Error sending notification to mentor ${mentorId}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Send real-time notification (WebSocket/Socket.io implementation)
  async sendRealTimeNotification(mentorId, notification, connection) {
    try {
      // TODO: Implement WebSocket/Socket.io real-time notification
      // For now, we'll simulate this
      
      console.log(`📱 REAL-TIME ALERT to mentor ${mentorId}:`, {
        title: notification.title,
        body: notification.body,
        urgency: notification.urgency,
        category: notification.category
      });
      
      // Simulate successful real-time notification
      return { success: true, method: 'websocket' };
    } catch (error) {
      console.error('Real-time notification failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send backup notification (Email/SMS)
  async sendBackupNotification(mentorId, notification, request) {
    try {
      const mentor = await Mentorship.findById(mentorId);
      if (!mentor) {
        throw new Error('Mentor not found');
      }

      // Email notification
      if (mentor.settings.emailNotifications && mentor.mentor.email) {
        await this.sendEmailNotification(mentor.mentor.email, notification, request);
      }

      // SMS notification
      if (mentor.settings.smsNotifications && mentor.mentor.phone) {
        await this.sendSMSNotification(mentor.mentor.phone, notification, request);
      }

      return { success: true, method: 'email/sms' };
    } catch (error) {
      console.error('Backup notification failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send email notification
  async sendEmailNotification(email, notification, request) {
    try {
      // TODO: Implement actual email sending (using nodemailer or similar)
      console.log(`📧 EMAIL NOTIFICATION to ${email}:`, {
        subject: notification.title,
        body: notification.body,
        requestId: request.requestId,
        category: request.category,
        urgency: request.urgency
      });
      
      // Simulate email sending
      return { success: true };
    } catch (error) {
      console.error('Email notification failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Send SMS notification
  async sendSMSNotification(phone, notification, request) {
    try {
      // TODO: Implement actual SMS sending (using Twilio or Africa's Talking)
      console.log(`📱 SMS NOTIFICATION to ${phone}:`, {
        message: `${notification.title}: ${notification.body.substring(0, 100)}... Request: ${request.requestId}`,
        urgency: request.urgency
      });
      
      // Simulate SMS sending
      return { success: true };
    } catch (error) {
      console.error('SMS notification failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Create notification payload
  createNotificationPayload(request, type) {
    const urgencyEmoji = {
      'Critical': '🚨',
      'High': '🔥',
      'Medium': '⚡',
      'Low': '💡'
    };

    const typeEmoji = {
      'Quick Question': '❓',
      'Code Review': '👨‍💻',
      'Career Advice': '💼',
      'Technical Help': '🔧',
      'Project Guidance': '📋',
      'General Mentorship': '🎯'
    };

    switch (type) {
      case 'new_request':
        return {
          type: 'new_request',
          title: `${urgencyEmoji[request.urgency]} New ${request.urgency} Priority Request`,
          body: `${typeEmoji[request.sessionType]} ${request.sessionType} needed in ${request.category}. "${request.problemDescription.substring(0, 100)}${request.problemDescription.length > 100 ? '...' : ''}"`,
          data: {
            requestId: request.requestId,
            category: request.category,
            sessionType: request.sessionType,
            urgency: request.urgency,
            preferredDuration: request.preferredDuration,
            budget: request.budget,
            menteeName: request.mentee.name,
            timeElapsed: request.timeElapsed
          },
          actions: [
            { type: 'accept', label: 'Accept', color: 'green' },
            { type: 'decline', label: 'Decline', color: 'red' },
            { type: 'view_details', label: 'View Details', color: 'blue' }
          ],
          urgency: request.urgency,
          category: request.category,
          expiresAt: new Date(Date.now() + (15 * 60 * 1000)) // 15 minutes expiry
        };

      case 'request_accepted':
        return {
          type: 'request_accepted',
          title: '✅ Your request has been accepted!',
          body: `A mentor will help you with "${request.sessionType}" in ${request.category}.`,
          data: {
            requestId: request.requestId,
            mentorName: request.selectedMentor?.mentorName
          }
        };

      case 'session_starting':
        return {
          type: 'session_starting',
          title: '🎯 Your mentorship session is starting',
          body: 'Please join the session room when ready.',
          data: {
            requestId: request.requestId,
            sessionLink: request.session?.meetingLink
          }
        };

      default:
        return {
          type: 'general',
          title: 'Mentorship Notification',
          body: 'You have a new mentorship notification.',
          data: { requestId: request.requestId }
        };
    }
  }

  // Calculate estimated response time based on mentor activity
  calculateEstimatedResponseTime(mentors) {
    if (mentors.length === 0) return 'Unknown';

    const onlineMentors = mentors.filter(mentor => 
      this.activeConnections.has(mentor._id.toString())
    ).length;

    if (onlineMentors > 0) {
      return '1-5 minutes';
    } else {
      const avgResponseTimes = mentors.map(mentor => {
        switch (mentor.availability.responseTime) {
          case 'Within 1 hour': return 30;
          case 'Within 4 hours': return 120;
          case 'Within 24 hours': return 720;
          case 'Within 48 hours': return 1440;
          default: return 360;
        }
      });

      const avgMinutes = avgResponseTimes.reduce((sum, time) => sum + time, 0) / avgResponseTimes.length;
      
      if (avgMinutes <= 60) return `${Math.round(avgMinutes)} minutes`;
      if (avgMinutes <= 1440) return `${Math.round(avgMinutes / 60)} hours`;
      return `${Math.round(avgMinutes / 1440)} days`;
    }
  }

  // Start queue processor for batch notifications
  startQueueProcessor() {
    setInterval(async () => {
      if (this.notificationQueue.length > 0 && !this.isProcessing) {
        this.isProcessing = true;
        
        try {
          const batch = this.notificationQueue.splice(0, 10); // Process 10 at a time
          await this.processBatchNotifications(batch);
        } catch (error) {
          console.error('Error processing notification batch:', error);
        } finally {
          this.isProcessing = false;
        }
      }
    }, 5000); // Process every 5 seconds
  }

  // Process batch notifications
  async processBatchNotifications(batch) {
    for (const notification of batch) {
      try {
        await this.broadcastRequestToMentors(notification.requestId, notification.options);
      } catch (error) {
        console.error('Error processing batch notification:', error);
      }
    }
  }

  // Add notification to queue
  queueNotification(requestId, options = {}) {
    this.notificationQueue.push({ requestId, options, queuedAt: new Date() });
  }

  // Start cleanup service for expired requests
  startRequestCleanup() {
    setInterval(async () => {
      try {
        await this.cleanupExpiredRequests();
      } catch (error) {
        console.error('Error cleaning up expired requests:', error);
      }
    }, 60000); // Run every minute
  }

  // Cleanup expired requests
  async cleanupExpiredRequests() {
    const expiredTime = new Date(Date.now() - (30 * 60 * 1000)); // 30 minutes ago

    const expiredRequests = await MentorshipRequest.find({
      status: { $in: ['Pending', 'Broadcasted'] },
      createdAt: { $lt: expiredTime }
    });

    for (const request of expiredRequests) {
      request.status = 'Expired';
      await request.save();
      console.log(`⏰ Request ${request.requestId} expired after 30 minutes`);
    }

    if (expiredRequests.length > 0) {
      console.log(`🧹 Cleaned up ${expiredRequests.length} expired requests`);
    }
  }

  // Get active connections count
  getActiveConnectionsCount() {
    return this.activeConnections.size;
  }

  // Get mentor connection status
  getMentorConnectionStatus(mentorId) {
    return this.activeConnections.get(mentorId.toString()) || null;
  }

  // Update mentor availability in real-time
  async updateMentorAvailability(mentorId, isAvailable, status = null) {
    const connection = this.activeConnections.get(mentorId.toString());
    if (connection) {
      connection.isAvailable = isAvailable;
      connection.lastActivity = new Date();
    }

    // Update database
    const updateData = { 'availability.isAvailable': isAvailable };
    if (status) updateData['availability.status'] = status;

    await Mentorship.findByIdAndUpdate(mentorId, updateData);
  }

  // Notify mentee when mentor responds
  async notifyMenteeAboutResponse(requestId, response, mentorData) {
    try {
      const request = await MentorshipRequest.findOne({ requestId });
      if (!request) return;

      if (response === 'Accepted') {
        const notification = this.createNotificationPayload(request, 'request_accepted');
        // Send notification to mentee (email/SMS/push)
        console.log(`✅ Notifying mentee ${request.mentee.email} about accepted request ${requestId}`);
      }
    } catch (error) {
      console.error('Error notifying mentee about response:', error);
    }
  }
}

// Create singleton instance
const mentorNotificationService = new MentorNotificationService();

// Auto-start when required
mentorNotificationService.initialize();

module.exports = mentorNotificationService; 