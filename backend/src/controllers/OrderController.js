const OrderService = require('../services/OrderService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class OrderController {
  // Create a new order
  static async createOrder(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const orderData = req.body;
      const customerId = req.user.id;

      const order = await OrderService.createOrder(orderData, customerId);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      logger.error('Error in createOrder controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create order',
        error: error.message
      });
    }
  }

  // Get order by ID
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const order = await OrderService.getOrderById(id, userId);

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      logger.error('Error in getOrderById controller:', error);
      
      if (error.message === 'Order not found') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get order',
        error: error.message
      });
    }
  }

  // Get order by order number
  static async getOrderByNumber(req, res) {
    try {
      const { orderNumber } = req.params;
      const userId = req.user.id;

      const order = await OrderService.getOrderByNumber(orderNumber, userId);

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      logger.error('Error in getOrderByNumber controller:', error);
      
      if (error.message === 'Order not found') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get order',
        error: error.message
      });
    }
  }

  // Update order status
  static async updateOrderStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { status, notes } = req.body;
      const userId = req.user.id;

      const order = await OrderService.updateOrderStatus(id, status, notes, userId);

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: order
      });
    } catch (error) {
      logger.error('Error in updateOrderStatus controller:', error);
      
      if (error.message === 'Order not found') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update order status',
        error: error.message
      });
    }
  }

  // Update payment status
  static async updatePaymentStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { status, transaction_id } = req.body;

      const order = await OrderService.updatePaymentStatus(id, status, transaction_id);

      res.json({
        success: true,
        message: 'Payment status updated successfully',
        data: order
      });
    } catch (error) {
      logger.error('Error in updatePaymentStatus controller:', error);
      
      if (error.message === 'Order not found') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update payment status',
        error: error.message
      });
    }
  }

  // Update shipping status
  static async updateShippingStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { status, tracking_number } = req.body;

      const order = await OrderService.updateShippingStatus(id, status, tracking_number);

      res.json({
        success: true,
        message: 'Shipping status updated successfully',
        data: order
      });
    } catch (error) {
      logger.error('Error in updateShippingStatus controller:', error);
      
      if (error.message === 'Order not found') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update shipping status',
        error: error.message
      });
    }
  }

  // Cancel order
  static async cancelOrder(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { reason } = req.body;
      const userId = req.user.id;

      const order = await OrderService.cancelOrder(id, reason, userId);

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: order
      });
    } catch (error) {
      logger.error('Error in cancelOrder controller:', error);
      
      if (error.message === 'Order not found') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (error.message === 'Order cannot be cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Order cannot be cancelled'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to cancel order',
        error: error.message
      });
    }
  }

  // Refund order
  static async refundOrder(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { amount, reason } = req.body;

      const result = await OrderService.refundOrder(id, amount, reason);

      res.json({
        success: true,
        message: 'Order refunded successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error in refundOrder controller:', error);
      
      if (error.message === 'Order not found') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      if (error.message === 'Order cannot be refunded') {
        return res.status(400).json({
          success: false,
          message: 'Order cannot be refunded'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to refund order',
        error: error.message
      });
    }
  }

  // Get customer orders
  static async getCustomerOrders(req, res) {
    try {
      const customerId = req.user.id;
      const options = req.query;

      const result = await OrderService.getCustomerOrders(customerId, options);

      res.json({
        success: true,
        data: result.orders,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getCustomerOrders controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get customer orders',
        error: error.message
      });
    }
  }

  // Get merchant orders
  static async getMerchantOrders(req, res) {
    try {
      const merchantId = req.user.merchant_id;
      const options = req.query;

      const result = await OrderService.getMerchantOrders(merchantId, options);

      res.json({
        success: true,
        data: result.orders,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getMerchantOrders controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get merchant orders',
        error: error.message
      });
    }
  }

  // Search orders
  static async searchOrders(req, res) {
    try {
      const searchParams = req.query;

      const result = await OrderService.searchOrders(searchParams);

      res.json({
        success: true,
        data: result.orders,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in searchOrders controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search orders',
        error: error.message
      });
    }
  }

  // Get order statistics
  static async getOrderStats(req, res) {
    try {
      const filters = req.query;

      const stats = await OrderService.getOrderStats(filters);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Error in getOrderStats controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get order statistics',
        error: error.message
      });
    }
  }

  // Get order analytics
  static async getOrderAnalytics(req, res) {
    try {
      const days = parseInt(req.query.days) || 30;
      const filters = req.query;

      const analytics = await OrderService.getOrderAnalytics(days, filters);

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      logger.error('Error in getOrderAnalytics controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get order analytics',
        error: error.message
      });
    }
  }
}

module.exports = OrderController; 