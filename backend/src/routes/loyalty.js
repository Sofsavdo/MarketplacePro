const express = require('express');
const router = express.Router();
const LoyaltyService = require('../services/LoyaltyService');
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Get user loyalty info
router.get('/info', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const loyaltyInfo = await LoyaltyService.getUserLoyaltyInfo(userId);

    res.json({
      success: true,
      data: loyaltyInfo
    });
  } catch (error) {
    logger.error('Error getting loyalty info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get loyalty info',
      error: error.message
    });
  }
});

// Get available rewards
router.get('/rewards', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const rewards = await LoyaltyService.getAvailableRewards(userId);

    res.json({
      success: true,
      data: rewards
    });
  } catch (error) {
    logger.error('Error getting available rewards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available rewards',
      error: error.message
    });
  }
});

// Redeem reward
router.post('/redeem/:rewardId', auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { rewardId } = req.params;
    const userId = req.user.id;

    const reward = await LoyaltyService.redeemReward(userId, parseInt(rewardId));

    res.json({
      success: true,
      message: 'Reward redeemed successfully',
      data: reward
    });
  } catch (error) {
    logger.error('Error redeeming reward:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to redeem reward',
      error: error.message
    });
  }
});

// Get loyalty statistics (admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const stats = await LoyaltyService.getLoyaltyStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error getting loyalty stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get loyalty stats',
      error: error.message
    });
  }
});

// Add points to user (admin only)
router.post('/add-points', auth, async (req, res) => {
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

    const { user_id, points, reason = 'admin_adjustment' } = req.body;

    const newPoints = await LoyaltyService.addPoints(user_id, points, null, reason);

    res.json({
      success: true,
      message: 'Points added successfully',
      data: { new_points: newPoints }
    });
  } catch (error) {
    logger.error('Error adding points:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add points',
      error: error.message
    });
  }
});

// Deduct points from user (admin only)
router.post('/deduct-points', auth, async (req, res) => {
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

    const { user_id, points, reason = 'admin_adjustment' } = req.body;

    const newPoints = await LoyaltyService.deductPoints(user_id, points, reason);

    res.json({
      success: true,
      message: 'Points deducted successfully',
      data: { new_points: newPoints }
    });
  } catch (error) {
    logger.error('Error deducting points:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deduct points',
      error: error.message
    });
  }
});

module.exports = router; 