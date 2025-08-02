const express = require('express');
const router = express.Router();
const SmartRewardsService = require('../services/SmartRewardsService');
const auth = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

/**
 * @route POST /api/smart-rewards/daily-login
 * @desc Claim daily login reward
 * @access Private
 */
router.post('/daily-login', auth, async (req, res) => {
  try {
    const result = await SmartRewardsService.processDailyLogin(req.user.id);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route GET /api/smart-rewards/info
 * @desc Get user's smart rewards information
 * @access Private
 */
router.get('/info', auth, async (req, res) => {
  try {
    const info = await SmartRewardsService.getUserSmartRewardsInfo(req.user.id);
    
    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route POST /api/smart-rewards/redeem
 * @desc Redeem points for discount
 * @access Private
 */
router.post('/redeem', auth, validateRequest({
  orderId: 'required|string',
  pointsToRedeem: 'required|integer|min:1',
  orderAmount: 'required|numeric|min:0'
}), async (req, res) => {
  try {
    const { orderId, pointsToRedeem, orderAmount } = req.body;
    
    const result = await SmartRewardsService.redeemPointsForDiscount(
      req.user.id,
      orderId,
      pointsToRedeem,
      orderAmount
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route GET /api/smart-rewards/flash-deals
 * @desc Get available flash deals for user
 * @access Private
 */
router.get('/flash-deals', auth, async (req, res) => {
  try {
    const deals = await SmartRewardsService.getFlashDeals(req.user.id);
    
    res.json({
      success: true,
      data: deals
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route POST /api/smart-rewards/award-purchase
 * @desc Award points for purchase (called after order completion)
 * @access Private
 */
router.post('/award-purchase', auth, validateRequest({
  orderId: 'required|string',
  orderAmount: 'required|numeric|min:0'
}), async (req, res) => {
  try {
    const { orderId, orderAmount } = req.body;
    
    const result = await SmartRewardsService.awardPurchasePoints(
      req.user.id,
      orderId,
      orderAmount
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route GET /api/smart-rewards/calculate-discount
 * @desc Calculate potential discount from points
 * @access Private
 */
router.get('/calculate-discount', auth, validateRequest({
  points: 'required|integer|min:0',
  orderAmount: 'required|numeric|min:0'
}), async (req, res) => {
  try {
    const { points, orderAmount } = req.query;
    
    const discountInfo = SmartRewardsService.calculateDiscountFromPoints(
      parseInt(points),
      parseFloat(orderAmount)
    );
    
    res.json({
      success: true,
      data: discountInfo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route GET /api/smart-rewards/stats
 * @desc Get smart rewards statistics (admin only)
 * @access Private (Admin)
 */
router.get('/stats', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }
    
    const stats = await SmartRewardsService.getSmartRewardsStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 