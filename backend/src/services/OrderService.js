const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Merchant = require('../models/Merchant');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const PaymentService = require('./PaymentService');
const logger = require('../utils/logger');

class OrderService {
  // Create a new order
  static async createOrder(orderData, customerId) {
    try {
      // Validate products and calculate totals
      const { items, ...orderInfo } = orderData;
      const validatedItems = await this.validateOrderItems(items);
      
      // Calculate order totals
      const totals = this.calculateOrderTotals(validatedItems, orderInfo);
      
      // Generate order number
      const orderNumber = Order.generateOrderNumber();
      
      // Create order
      const order = await Order.query().insert({
        ...orderInfo,
        customer_id: customerId,
        order_number: orderNumber,
        ordered_items: validatedItems,
        ...totals,
        order_status: 'pending',
        payment_status: 'pending',
        shipping_status: 'pending'
      });

      // Update product inventory
      await this.updateProductInventory(validatedItems, 'decrease');

      // Create notifications
      await this.createOrderNotifications(order);

      logger.info(`Order created: ${orderNumber} by customer: ${customerId}`);
      return order;
    } catch (error) {
      logger.error('Error creating order:', error);
      throw error;
    }
  }

  // Get order by ID
  static async getOrderById(orderId, userId = null) {
    try {
      let query = Order.query()
        .findById(orderId)
        .withGraphFetched('[customer, merchant, affiliate, payments]');

      if (userId) {
        query = query.where('customer_id', userId);
      }

      const order = await query;
      
      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      logger.error('Error getting order by ID:', error);
      throw error;
    }
  }

  // Get order by order number
  static async getOrderByNumber(orderNumber, userId = null) {
    try {
      let query = Order.query()
        .where('order_number', orderNumber)
        .withGraphFetched('[customer, merchant, affiliate, payments]');

      if (userId) {
        query = query.where('customer_id', userId);
      }

      const order = await query.first();
      
      if (!order) {
        throw new Error('Order not found');
      }

      return order;
    } catch (error) {
      logger.error('Error getting order by number:', error);
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(orderId, newStatus, notes = null, userId = null) {
    try {
      let query = Order.query().findById(orderId);

      if (userId) {
        query = query.where('customer_id', userId);
      }

      const order = await query.first();
      
      if (!order) {
        throw new Error('Order not found');
      }

      const updatedOrder = await order.updateStatus(newStatus, notes);

      // Create notification for status change
      await Notification.createOrderNotification(
        order.customer_id,
        order.id,
        `Order Status Updated`,
        `Your order ${order.order_number} status has been updated to ${newStatus}`,
        { previous_status: order.order_status, new_status: newStatus }
      );

      logger.info(`Order status updated: ${orderId} to ${newStatus}`);
      return updatedOrder;
    } catch (error) {
      logger.error('Error updating order status:', error);
      throw error;
    }
  }

  // Update payment status
  static async updatePaymentStatus(orderId, newStatus, transactionId = null) {
    try {
      const order = await Order.query().findById(orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }

      const updatedOrder = await order.updatePaymentStatus(newStatus, transactionId);

      // If payment is completed, update order status
      if (newStatus === 'paid') {
        await updatedOrder.updateStatus('confirmed');
      }

      // Create notification
      await Notification.createPaymentNotification(
        order.customer_id,
        transactionId,
        `Payment ${newStatus}`,
        `Payment for order ${order.order_number} is ${newStatus}`,
        { order_id: order.id, payment_status: newStatus }
      );

      logger.info(`Payment status updated: ${orderId} to ${newStatus}`);
      return updatedOrder;
    } catch (error) {
      logger.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Update shipping status
  static async updateShippingStatus(orderId, newStatus, trackingNumber = null) {
    try {
      const order = await Order.query().findById(orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }

      const updatedOrder = await order.updateShippingStatus(newStatus, trackingNumber);

      // Create notification
      await Notification.createOrderNotification(
        order.customer_id,
        order.id,
        `Shipping Update`,
        `Your order ${order.order_number} shipping status: ${newStatus}`,
        { shipping_status: newStatus, tracking_number: trackingNumber }
      );

      logger.info(`Shipping status updated: ${orderId} to ${newStatus}`);
      return updatedOrder;
    } catch (error) {
      logger.error('Error updating shipping status:', error);
      throw error;
    }
  }

  // Cancel order
  static async cancelOrder(orderId, reason, userId = null) {
    try {
      let query = Order.query().findById(orderId);

      if (userId) {
        query = query.where('customer_id', userId);
      }

      const order = await query.first();
      
      if (!order) {
        throw new Error('Order not found');
      }

      if (!order.canBeCancelled()) {
        throw new Error('Order cannot be cancelled');
      }

      // Update order status
      const updatedOrder = await order.updateStatus('cancelled', reason);

      // Restore product inventory
      await this.updateProductInventory(order.ordered_items, 'increase');

      // Create notification
      await Notification.createOrderNotification(
        order.customer_id,
        order.id,
        `Order Cancelled`,
        `Your order ${order.order_number} has been cancelled`,
        { reason }
      );

      logger.info(`Order cancelled: ${orderId}`);
      return updatedOrder;
    } catch (error) {
      logger.error('Error cancelling order:', error);
      throw error;
    }
  }

  // Refund order
  static async refundOrder(orderId, refundAmount, reason) {
    try {
      const order = await Order.query().findById(orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }

      if (!order.canBeRefunded()) {
        throw new Error('Order cannot be refunded');
      }

      // Update payment status
      await order.updatePaymentStatus('refunded');

      // Create refund payment record
      await Payment.query().insert({
        order_id: orderId,
        user_id: order.customer_id,
        merchant_id: order.merchant_id,
        payment_type: 'refund',
        amount: refundAmount,
        currency: order.currency,
        description: `Refund for order ${order.order_number}`,
        status: 'completed'
      });

      // Create notification
      await Notification.createPaymentNotification(
        order.customer_id,
        null,
        `Order Refunded`,
        `Your order ${order.order_number} has been refunded`,
        { refund_amount: refundAmount, reason }
      );

      logger.info(`Order refunded: ${orderId}, amount: ${refundAmount}`);
      return { success: true };
    } catch (error) {
      logger.error('Error refunding order:', error);
      throw error;
    }
  }

  // Get customer orders
  static async getCustomerOrders(customerId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = options;

      let query = Order.query()
        .where('customer_id', customerId)
        .withGraphFetched('[merchant, payments]');

      if (status) {
        query = query.where('order_status', status);
      }

      query = query.orderBy(sort_by, sort_order);

      const offset = (page - 1) * limit;
      query = query.offset(offset).limit(limit);

      const orders = await query;
      const total = await Order.query()
        .where('customer_id', customerId)
        .count('id as count')
        .first();

      return {
        orders,
        pagination: {
          page,
          limit,
          total: parseInt(total.count),
          total_pages: Math.ceil(total.count / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting customer orders:', error);
      throw error;
    }
  }

  // Get merchant orders
  static async getMerchantOrders(merchantId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = options;

      let query = Order.query()
        .where('merchant_id', merchantId)
        .withGraphFetched('[customer, payments]');

      if (status) {
        query = query.where('order_status', status);
      }

      query = query.orderBy(sort_by, sort_order);

      const offset = (page - 1) * limit;
      query = query.offset(offset).limit(limit);

      const orders = await query;
      const total = await Order.query()
        .where('merchant_id', merchantId)
        .count('id as count')
        .first();

      return {
        orders,
        pagination: {
          page,
          limit,
          total: parseInt(total.count),
          total_pages: Math.ceil(total.count / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting merchant orders:', error);
      throw error;
    }
  }

  // Search orders
  static async searchOrders(searchParams) {
    try {
      const {
        query = '',
        status,
        payment_status,
        shipping_status,
        date_from,
        date_to,
        min_amount,
        max_amount,
        page = 1,
        limit = 20,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = searchParams;

      let orderQuery = Order.query()
        .withGraphFetched('[customer, merchant, payments]');

      // Search by query
      if (query) {
        orderQuery = orderQuery.where(function() {
          this.where('order_number', 'ilike', `%${query}%`)
            .orWhere('customer_email', 'ilike', `%${query}%`)
            .orWhere('customer_name', 'ilike', `%${query}%`);
        });
      }

      // Filter by status
      if (status) {
        orderQuery = orderQuery.where('order_status', status);
      }

      if (payment_status) {
        orderQuery = orderQuery.where('payment_status', payment_status);
      }

      if (shipping_status) {
        orderQuery = orderQuery.where('shipping_status', shipping_status);
      }

      // Filter by date range
      if (date_from) {
        orderQuery = orderQuery.where('created_at', '>=', date_from);
      }
      if (date_to) {
        orderQuery = orderQuery.where('created_at', '<=', date_to);
      }

      // Filter by amount range
      if (min_amount) {
        orderQuery = orderQuery.where('total_amount', '>=', min_amount);
      }
      if (max_amount) {
        orderQuery = orderQuery.where('total_amount', '<=', max_amount);
      }

      orderQuery = orderQuery.orderBy(sort_by, sort_order);

      const offset = (page - 1) * limit;
      orderQuery = orderQuery.offset(offset).limit(limit);

      const orders = await orderQuery;
      const total = await Order.query().count('id as count').first();

      return {
        orders,
        pagination: {
          page,
          limit,
          total: parseInt(total.count),
          total_pages: Math.ceil(total.count / limit)
        }
      };
    } catch (error) {
      logger.error('Error searching orders:', error);
      throw error;
    }
  }

  // Get order statistics
  static async getOrderStats(filters = {}) {
    try {
      let query = Order.query();

      // Apply filters
      if (filters.merchant_id) {
        query = query.where('merchant_id', filters.merchant_id);
      }
      if (filters.customer_id) {
        query = query.where('customer_id', filters.customer_id);
      }
      if (filters.date_from) {
        query = query.where('created_at', '>=', filters.date_from);
      }
      if (filters.date_to) {
        query = query.where('created_at', '<=', filters.date_to);
      }

      const stats = await query
        .select(
          Order.raw('COUNT(*) as total_orders'),
          Order.raw('COUNT(CASE WHEN order_status = \'delivered\' THEN 1 END) as completed_orders'),
          Order.raw('COUNT(CASE WHEN order_status = \'cancelled\' THEN 1 END) as cancelled_orders'),
          Order.raw('COUNT(CASE WHEN payment_status = \'paid\' THEN 1 END) as paid_orders'),
          Order.raw('SUM(total_amount) as total_revenue'),
          Order.raw('AVG(total_amount) as average_order_value'),
          Order.raw('SUM(affiliate_commission) as total_affiliate_commission'),
          Order.raw('SUM(platform_commission) as total_platform_commission')
        )
        .first();

      return stats;
    } catch (error) {
      logger.error('Error getting order stats:', error);
      throw error;
    }
  }

  // Get order analytics
  static async getOrderAnalytics(days = 30, filters = {}) {
    try {
      let query = Order.query()
        .select(
          Order.raw('DATE(created_at) as date'),
          Order.raw('COUNT(*) as orders_count'),
          Order.raw('SUM(total_amount) as daily_revenue'),
          Order.raw('COUNT(CASE WHEN order_status = \'delivered\' THEN 1 END) as completed_count'),
          Order.raw('COUNT(CASE WHEN order_status = \'cancelled\' THEN 1 END) as cancelled_count')
        )
        .where('created_at', '>=', Order.raw(`NOW() - INTERVAL '${days} days'`));

      // Apply filters
      if (filters.merchant_id) {
        query = query.where('merchant_id', filters.merchant_id);
      }

      const result = await query
        .groupBy('date')
        .orderBy('date');

      return result;
    } catch (error) {
      logger.error('Error getting order analytics:', error);
      throw error;
    }
  }

  // Helper methods
  static async validateOrderItems(items) {
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.query().findById(item.product_id);
      
      if (!product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }

      if (product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      if (product.status !== 'active') {
        throw new Error(`Product not available: ${product.name}`);
      }

      validatedItems.push({
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity
      });
    }

    return validatedItems;
  }

  static calculateOrderTotals(items, orderInfo) {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * 0.1; // 10% tax
    const shippingAmount = orderInfo.shipping_amount || 0;
    const discountAmount = orderInfo.discount_amount || 0;
    const total = subtotal + taxAmount + shippingAmount - discountAmount;

    return {
      subtotal,
      tax_amount: taxAmount,
      shipping_amount: shippingAmount,
      discount_amount: discountAmount,
      total_amount: total
    };
  }

  static async updateProductInventory(items, operation) {
    for (const item of items) {
      await Product.query()
        .findById(item.product_id)
        .patch({
          stock_quantity: Product.raw(`stock_quantity ${operation === 'decrease' ? '-' : '+'} ${item.quantity}`),
          is_in_stock: Product.raw(`CASE WHEN stock_quantity ${operation === 'decrease' ? '-' : '+'} ${item.quantity} > 0 THEN true ELSE false END`)
        });
    }
  }

  static async createOrderNotifications(order) {
    // Notify customer
    await Notification.createOrderNotification(
      order.customer_id,
      order.id,
      `Order Confirmed`,
      `Your order ${order.order_number} has been confirmed`,
      { order_id: order.id }
    );

    // Notify merchant
    const merchant = await Merchant.query().findById(order.merchant_id);
    if (merchant) {
      await Notification.createOrderNotification(
        merchant.user_id,
        order.id,
        `New Order Received`,
        `New order ${order.order_number} received`,
        { order_id: order.id, customer_name: order.customer_name }
      );
    }
  }
}

module.exports = OrderService; 