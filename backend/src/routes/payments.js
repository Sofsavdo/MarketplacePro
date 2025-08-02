const express = require('express');
const router = express.Router();
const PaymentService = require('../services/PaymentService');
const auth = require('../middleware/auth');

const paymentService = new PaymentService();

// Get available payment methods
router.get('/methods', async (req, res) => {
  try {
    const methods = paymentService.getPaymentMethods();
    
    res.json({
      success: true,
      data: methods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Create payment
router.post('/create', auth, async (req, res) => {
  try {
    const { method, orderData } = req.body;

    if (!method || !orderData) {
      return res.status(400).json({
        success: false,
        message: 'To\'lov usuli va buyurtma ma\'lumotlari kerak'
      });
    }

    const paymentResult = await paymentService.processPayment(method, orderData);

    res.json({
      success: true,
      data: paymentResult
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Click payment webhook
router.post('/click/webhook', async (req, res) => {
  try {
    const paymentData = req.body;
    
    // Verify payment
    const verificationResult = await paymentService.verifyClickPayment(paymentData);
    
    if (verificationResult.success) {
      // Update order status in database
      // This would typically update the order status to 'paid'
      
      res.json({
        success: true,
        message: 'To\'lov tasdiqlandi'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'To\'lov tasdiqlanmadi'
      });
    }
  } catch (error) {
    console.error('Click webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook xatosi'
    });
  }
});

// Verify payment status
router.get('/verify/:paymentId', auth, async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // In real implementation, this would check payment status from database
    // For now, we'll return a mock response
    const paymentStatus = {
      paymentId,
      status: 'completed',
      amount: 100000,
      currency: 'UZS',
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: paymentStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Refund payment
router.post('/refund', auth, async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    if (!paymentId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID va miqdor kerak'
      });
    }

    const refundResult = await paymentService.refundPayment(paymentId, amount, reason);

    res.json({
      success: true,
      data: refundResult
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    // In real implementation, this would fetch from database
    const mockHistory = [
      {
        id: 'PAY_001',
        amount: 150000,
        currency: 'UZS',
        method: 'click',
        status: 'completed',
        createdAt: new Date().toISOString(),
        orderId: 'ORD_001'
      },
      {
        id: 'PAY_002',
        amount: 250000,
        currency: 'UZS',
        method: 'uzcard',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        orderId: 'ORD_002'
      }
    ];

    res.json({
      success: true,
      data: {
        payments: mockHistory,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: mockHistory.length,
          pages: 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

module.exports = router; 