const express = require('express');
const router = express.Router();
const GamificationService = require('../services/GamificationService');
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Check and award achievements
router.post('/check-achievements', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const earnedAchievements = await GamificationService.checkAchievements(userId);

    res.json({
      success: true,
      message: 'Achievements checked successfully',
      data: { earned_achievements: earnedAchievements }
    });
  } catch (error) {
    logger.error('Error checking achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check achievements',
      error: error.message
    });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { type = 'earnings', limit = 10 } = req.query;

    const leaderboard = await GamificationService.getLeaderboard(type, parseInt(limit));

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    logger.error('Error getting leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get leaderboard',
      error: error.message
    });
  }
});

// Get blogger achievements
router.get('/achievements/:bloggerId', auth, async (req, res) => {
  try {
    const { bloggerId } = req.params;

    // Check if user is requesting their own achievements or is admin
    if (req.user.id !== bloggerId && req.user.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const achievements = await GamificationService.getBloggerAchievements(bloggerId);

    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    logger.error('Error getting blogger achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blogger achievements',
      error: error.message
    });
  }
});

// Get gamification statistics (admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const stats = await GamificationService.getGamificationStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error getting gamification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get gamification stats',
      error: error.message
    });
  }
});

module.exports = router; 