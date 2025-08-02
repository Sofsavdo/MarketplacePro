const express = require('express');
const router = express.Router();
const FraudDetectionService = require('../services/FraudDetectionService');
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Analyze order for fraud
router.post('/analyze-order/:orderId', auth, async (req, res) => {
  try {
    // Check if user is admin or merchant
    if (!['admin', 'merchant'].includes(req.user.type)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or merchant only.'
      });
    }

    const { orderId } = req.params;

    const analysis = await FraudDetectionService.analyzeOrder(orderId);

    res.json({
      success: true,
      message: 'Fraud analysis completed',
      data: analysis
    });
  } catch (error) {
    logger.error('Error analyzing order for fraud:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze order for fraud',
      error: error.message
    });
  }
});

// Get fraud statistics (admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { days = 30 } = req.query;

    const stats = await FraudDetectionService.getFraudStats(parseInt(days));

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Error getting fraud stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get fraud stats',
      error: error.message
    });
  }
});

module.exports = router; 