const Order = require('../models/Order');
const User = require('../models/User');
const Payment = require('../models/Payment');
const logger = require('../utils/logger');

class FraudDetectionService {
  // Risk scoring factors
  static riskFactors = {
    // User behavior factors
    NEW_USER: 10,
    MULTIPLE_ACCOUNTS: 25,
    SUSPICIOUS_LOCATION: 15,
    RAPID_ORDERS: 20,
    
    // Order factors
    HIGH_VALUE_ORDER: 15,
    UNUSUAL_PRODUCT_COMBINATION: 10,
    RAPID_CHECKOUT: 10,
    
    // Payment factors
    MULTIPLE_PAYMENT_METHODS: 20,
    FAILED_PAYMENTS: 15,
    SUSPICIOUS_PAYMENT_PATTERN: 25,
    
    // Device/IP factors
    VPN_PROXY: 20,
    MULTIPLE_DEVICES: 15,
    SUSPICIOUS_IP: 10
  };

  // Analyze order for fraud
  static async analyzeOrder(orderId) {
    try {
      const order = await Order.query()
        .findById(orderId)
        .withGraphFetched('[customer, merchant, items, payment]');

      if (!order) {
        throw new Error('Order not found');
      }

      const riskScore = await this.calculateRiskScore(order);
      const riskLevel = this.getRiskLevel(riskScore);
      const recommendations = this.getRecommendations(riskScore, order);

      const analysis = {
        order_id: orderId,
        risk_score: riskScore,
        risk_level: riskLevel,
        risk_factors: await this.identifyRiskFactors(order),
        recommendations: recommendations,
        timestamp: new Date(),
        confidence: this.calculateConfidence(riskScore)
      };

      // Store analysis result
      await this.storeAnalysisResult(analysis);

      // Take automatic action if high risk
      if (riskLevel === 'high') {
        await this.takeAutomaticAction(orderId, analysis);
      }

      logger.info(`Fraud analysis completed for order ${orderId}: ${riskLevel} risk (${riskScore})`);
      return analysis;
    } catch (error) {
      logger.error('Error analyzing order for fraud:', error);
      throw error;
    }
  }

  // Calculate risk score
  static async calculateRiskScore(order) {
    let score = 0;

    // User behavior analysis
    score += await this.analyzeUserBehavior(order.customer_id);
    
    // Order pattern analysis
    score += this.analyzeOrderPattern(order);
    
    // Payment analysis
    score += await this.analyzePayment(order.payment);
    
    // Device/IP analysis
    score += await this.analyzeDeviceInfo(order);

    return Math.min(score, 100); // Cap at 100
  }

  // Analyze user behavior
  static async analyzeUserBehavior(userId) {
    let score = 0;

    // Check if new user
    const user = await User.query().findById(userId);
    const userAge = Date.now() - new Date(user.created_at).getTime();
    const daysSinceCreation = userAge / (1000 * 60 * 60 * 24);

    if (daysSinceCreation < 7) {
      score += this.riskFactors.NEW_USER;
    }

    // Check for multiple accounts from same IP
    const accountsFromSameIP = await User.query()
      .where('last_ip', user.last_ip)
      .whereNot('id', userId)
      .resultSize();

    if (accountsFromSameIP > 2) {
      score += this.riskFactors.MULTIPLE_ACCOUNTS;
    }

    // Check order frequency
    const recentOrders = await Order.query()
      .where('customer_id', userId)
      .where('created_at', '>', new Date(Date.now() - 24 * 60 * 60 * 1000))
      .resultSize();

    if (recentOrders > 5) {
      score += this.riskFactors.RAPID_ORDERS;
    }

    return score;
  }

  // Analyze order pattern
  static analyzeOrderPattern(order) {
    let score = 0;

    // High value order
    if (order.total_amount > 10000000) { // 10M UZS
      score += this.riskFactors.HIGH_VALUE_ORDER;
    }

    // Unusual product combination
    const categories = order.items.map(item => item.category_id);
    const uniqueCategories = new Set(categories);
    
    if (uniqueCategories.size > 5 && order.items.length > 10) {
      score += this.riskFactors.UNUSUAL_PRODUCT_COMBINATION;
    }

    // Rapid checkout (less than 30 seconds)
    const checkoutTime = new Date(order.created_at) - new Date(order.cart_created_at);
    if (checkoutTime < 30000) { // 30 seconds
      score += this.riskFactors.RAPID_CHECKOUT;
    }

    return score;
  }

  // Analyze payment
  static async analyzePayment(payment) {
    let score = 0;

    if (!payment) return score;

    // Check for failed payments
    const failedPayments = await Payment.query()
      .where('customer_id', payment.customer_id)
      .where('status', 'failed')
      .where('created_at', '>', new Date(Date.now() - 24 * 60 * 60 * 1000))
      .resultSize();

    if (failedPayments > 2) {
      score += this.riskFactors.FAILED_PAYMENTS;
    }

    // Check payment method pattern
    const paymentMethods = await Payment.query()
      .where('customer_id', payment.customer_id)
      .where('created_at', '>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .select('payment_method');

    const uniqueMethods = new Set(paymentMethods.map(p => p.payment_method));
    if (uniqueMethods.size > 3) {
      score += this.riskFactors.MULTIPLE_PAYMENT_METHODS;
    }

    return score;
  }

  // Analyze device info
  static async analyzeDeviceInfo(order) {
    let score = 0;

    // This would typically check against device fingerprinting database
    // For now, we'll implement basic checks

    // Check for VPN/Proxy (simplified)
    if (order.user_agent && (
      order.user_agent.includes('VPN') || 
      order.user_agent.includes('Proxy') ||
      order.user_agent.includes('Tor')
    )) {
      score += this.riskFactors.VPN_PROXY;
    }

    // Check for multiple devices (simplified)
    const deviceOrders = await Order.query()
      .where('customer_id', order.customer_id)
      .where('user_agent', order.user_agent)
      .resultSize();

    if (deviceOrders > 10) {
      score += this.riskFactors.MULTIPLE_DEVICES;
    }

    return score;
  }

  // Get risk level
  static getRiskLevel(score) {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  // Get recommendations
  static getRecommendations(score, order) {
    const recommendations = [];

    if (score >= 70) {
      recommendations.push('Hold order for manual review');
      recommendations.push('Request additional verification');
      recommendations.push('Contact customer for confirmation');
    } else if (score >= 40) {
      recommendations.push('Monitor order closely');
      recommendations.push('Enable additional verification');
    } else {
      recommendations.push('Order appears safe');
    }

    return recommendations;
  }

  // Calculate confidence
  static calculateConfidence(score) {
    // Higher score = higher confidence in fraud detection
    return Math.min(score + 20, 100);
  }

  // Identify specific risk factors
  static async identifyRiskFactors(order) {
    const factors = [];

    // User behavior factors
    const user = await User.query().findById(order.customer_id);
    const userAge = Date.now() - new Date(user.created_at).getTime();
    const daysSinceCreation = userAge / (1000 * 60 * 60 * 24);

    if (daysSinceCreation < 7) {
      factors.push('New user account');
    }

    // Order factors
    if (order.total_amount > 10000000) {
      factors.push('High value order');
    }

    // Payment factors
    if (order.payment) {
      const failedPayments = await Payment.query()
        .where('customer_id', order.customer_id)
        .where('status', 'failed')
        .where('created_at', '>', new Date(Date.now() - 24 * 60 * 60 * 1000))
        .resultSize();

      if (failedPayments > 2) {
        factors.push('Multiple failed payments');
      }
    }

    return factors;
  }

  // Store analysis result
  static async storeAnalysisResult(analysis) {
    try {
      // Store in database or cache for future reference
      // This could be stored in a separate fraud_analysis table
      logger.info(`Fraud analysis stored for order ${analysis.order_id}`);
    } catch (error) {
      logger.error('Error storing fraud analysis:', error);
    }
  }

  // Take automatic action
  static async takeAutomaticAction(orderId, analysis) {
    try {
      // Update order status
      await Order.query()
        .findById(orderId)
        .patch({ 
          fraud_status: 'suspicious',
          fraud_score: analysis.risk_score,
          fraud_analysis: analysis
        });

      // Create notification for admin
      // await NotificationService.createSystemNotification({
      //   user_id: 'admin',
      //   user_type: 'admin',
      //   title: 'High Risk Order Detected',
      //   message: `Order ${orderId} flagged for manual review`,
      //   data: { order_id: orderId, risk_score: analysis.risk_score }
      // });

      logger.info(`Automatic action taken for high-risk order ${orderId}`);
    } catch (error) {
      logger.error('Error taking automatic action:', error);
    }
  }

  // Get fraud statistics
  static async getFraudStats(days = 30) {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const stats = await Order.query()
        .where('created_at', '>', startDate)
        .select('fraud_status', 'fraud_score')
        .whereNotNull('fraud_score');

      const totalAnalyzed = stats.length;
      const highRisk = stats.filter(s => s.fraud_score >= 70).length;
      const mediumRisk = stats.filter(s => s.fraud_score >= 40 && s.fraud_score < 70).length;
      const lowRisk = stats.filter(s => s.fraud_score < 40).length;

      return {
        total_analyzed: totalAnalyzed,
        high_risk: highRisk,
        medium_risk: mediumRisk,
        low_risk: lowRisk,
        high_risk_percentage: totalAnalyzed > 0 ? (highRisk / totalAnalyzed * 100).toFixed(2) : 0,
        average_risk_score: totalAnalyzed > 0 ? (stats.reduce((sum, s) => sum + s.fraud_score, 0) / totalAnalyzed).toFixed(2) : 0
      };
    } catch (error) {
      logger.error('Error getting fraud stats:', error);
      throw error;
    }
  }
}

module.exports = FraudDetectionService; 