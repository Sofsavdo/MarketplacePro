const express = require('express');
const router = express.Router();
const NotificationService = require('../services/NotificationService');
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { page = 1, limit = 20, unread_only = false } = req.query;
    const userId = req.user.id;
    const userType = req.user.type;

    const result = await NotificationService.getUserNotifications(
      userId, 
      userType, 
      { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        unreadOnly: unread_only === 'true' 
      }
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications',
      error: error.message
    });
  }
});

// Get unread count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.type;

    const count = await NotificationService.getUnreadCount(userId, userType);

    res.json({
      success: true,
      data: { unread_count: count }
    });
  } catch (error) {
    logger.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count',
      error: error.message
    });
  }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await NotificationService.markAsRead(id, userId);

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.type;

    await NotificationService.markAllAsRead(userId, userType);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await NotificationService.deleteNotification(id, userId);

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    logger.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
});

// Create system notification (admin only)
router.post('/system', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { user_id, user_type, title, message, data, priority } = req.body;

    const notification = await NotificationService.createSystemNotification({
      user_id,
      user_type,
      title,
      message,
      data,
      priority
    });

    res.status(201).json({
      success: true,
      message: 'System notification created',
      data: notification
    });
  } catch (error) {
    logger.error('Error creating system notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create system notification',
      error: error.message
    });
  }
});

module.exports = router; 