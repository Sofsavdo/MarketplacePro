const Notification = require('../models/Notification');
const logger = require('../utils/logger');

class NotificationService {
  // Create notification
  static async createNotification(data) {
    try {
      const notification = await Notification.query().insert({
        user_id: data.user_id,
        user_type: data.user_type,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
        is_read: false,
        priority: data.priority || 'normal'
      });

      // Emit real-time notification via WebSocket
      this.emitNotification(notification);

      logger.info(`Notification created: ${notification.id} for user: ${data.user_id}`);
      return notification;
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw error;
    }
  }

  // Emit notification via WebSocket
  static emitNotification(notification) {
    try {
      // WebSocket implementation will be added here
      // For now, we'll use a placeholder
      global.io?.to(`user_${notification.user_id}`).emit('notification', notification);
    } catch (error) {
      logger.error('Error emitting notification:', error);
    }
  }

  // Get user notifications
  static async getUserNotifications(userId, userType, options = {}) {
    try {
      const { page = 1, limit = 20, unreadOnly = false } = options;
      const offset = (page - 1) * limit;

      let query = Notification.query()
        .where('user_id', userId)
        .where('user_type', userType)
        .orderBy('created_at', 'desc');

      if (unreadOnly) {
        query = query.where('is_read', false);
      }

      const notifications = await query
        .offset(offset)
        .limit(limit);

      const total = await query.clone().resultSize();

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting user notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.query()
        .where('id', notificationId)
        .where('user_id', userId)
        .patch({ is_read: true });

      return notification;
    } catch (error) {
      logger.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId, userType) {
    try {
      const result = await Notification.query()
        .where('user_id', userId)
        .where('user_type', userType)
        .where('is_read', false)
        .patch({ is_read: true });

      return result;
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  static async deleteNotification(notificationId, userId) {
    try {
      const result = await Notification.query()
        .where('id', notificationId)
        .where('user_id', userId)
        .delete();

      return result;
    } catch (error) {
      logger.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Get notification count
  static async getUnreadCount(userId, userType) {
    try {
      const count = await Notification.query()
        .where('user_id', userId)
        .where('user_type', userType)
        .where('is_read', false)
        .resultSize();

      return count;
    } catch (error) {
      logger.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Create system notification
  static async createSystemNotification(data) {
    try {
      const notification = await Notification.query().insert({
        user_id: data.user_id,
        user_type: data.user_type,
        type: 'system',
        title: data.title,
        message: data.message,
        data: data.data || {},
        is_read: false,
        priority: data.priority || 'normal'
      });

      this.emitNotification(notification);
      return notification;
    } catch (error) {
      logger.error('Error creating system notification:', error);
      throw error;
    }
  }

  // Create order notification
  static async createOrderNotification(orderId, userId, userType, type) {
    try {
      const notificationData = {
        user_id: userId,
        user_type: userType,
        type: 'order',
        data: { order_id: orderId }
      };

      switch (type) {
        case 'created':
          notificationData.title = 'Yangi buyurtma';
          notificationData.message = 'Sizga yangi buyurtma kelib tushdi';
          break;
        case 'updated':
          notificationData.title = 'Buyurtma yangilandi';
          notificationData.message = 'Buyurtma holati yangilandi';
          break;
        case 'cancelled':
          notificationData.title = 'Buyurtma bekor qilindi';
          notificationData.message = 'Buyurtma bekor qilindi';
          break;
        case 'delivered':
          notificationData.title = 'Buyurtma yetkazildi';
          notificationData.message = 'Buyurtma muvaffaqiyatli yetkazildi';
          break;
      }

      return await this.createNotification(notificationData);
    } catch (error) {
      logger.error('Error creating order notification:', error);
      throw error;
    }
  }

  // Create affiliate notification
  static async createAffiliateNotification(affiliateId, userId, userType, type) {
    try {
      const notificationData = {
        user_id: userId,
        user_type: userType,
        type: 'affiliate',
        data: { affiliate_id: affiliateId }
      };

      switch (type) {
        case 'commission_earned':
          notificationData.title = 'Komissiya qo\'shildi';
          notificationData.message = 'Sizga yangi komissiya qo\'shildi';
          break;
        case 'payout_processed':
          notificationData.title = 'To\'lov amalga oshirildi';
          notificationData.message = 'Komissiya to\'lovi amalga oshirildi';
          break;
        case 'link_created':
          notificationData.title = 'Affiliate link yaratildi';
          notificationData.message = 'Yangi affiliate link yaratildi';
          break;
      }

      return await this.createNotification(notificationData);
    } catch (error) {
      logger.error('Error creating affiliate notification:', error);
      throw error;
    }
  }
}

module.exports = NotificationService; 