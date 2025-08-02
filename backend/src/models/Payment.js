const { Model } = require('objection');

class Payment extends Model {
  static get tableName() {
    return 'payments';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['order_id', 'user_id', 'amount', 'currency', 'payment_method'],

      properties: {
        id: { type: 'integer' },
        order_id: { type: 'integer' },
        user_id: { type: 'integer' },
        merchant_id: { type: ['integer', 'null'] },
        transaction_id: { type: 'string', minLength: 1, maxLength: 255 },
        payment_method: { type: 'string', maxLength: 100 },
        payment_gateway: { type: 'string', maxLength: 100 },
        payment_type: { type: 'string', enum: ['order', 'refund', 'payout', 'commission', 'subscription'] },
        status: { type: 'string', enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'] },
        amount: { type: 'number', minimum: 0 },
        fee: { type: 'number', minimum: 0 },
        tax: { type: 'number', minimum: 0 },
        net_amount: { type: 'number', minimum: 0 },
        currency: { type: 'string', maxLength: 3 },
        exchange_rate: { type: 'number', minimum: 0 },
        raw_payment_data: { type: 'object' },
        metadata: { type: 'object' },
        description: { type: 'string', maxLength: 500 },
        failure_reason: { type: 'string', maxLength: 500 },
        failure_code: { type: 'string', maxLength: 100 },
        refund_amount: { type: 'number', minimum: 0 },
        refund_reason: { type: 'string', maxLength: 500 },
        refunded_at: { type: 'string', format: 'date-time' },
        processed_at: { type: 'string', format: 'date-time' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const User = require('./User');
    const Order = require('./Order');
    const Merchant = require('./Merchant');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'payments.user_id',
          to: 'users.id'
        }
      },
      order: {
        relation: Model.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: 'payments.order_id',
          to: 'orders.id'
        }
      },
      merchant: {
        relation: Model.BelongsToOneRelation,
        modelClass: Merchant,
        join: {
          from: 'payments.merchant_id',
          to: 'merchants.id'
        }
      }
    };
  }

  // Instance methods
  async getFullPaymentDetails() {
    const [user, order, merchant] = await Promise.all([
      this.$relatedQuery('user'),
      this.$relatedQuery('order'),
      this.$relatedQuery('merchant')
    ]);

    return {
      ...this.toJSON(),
      user: user ? user.toJSON() : null,
      order: order ? order.toJSON() : null,
      merchant: merchant ? merchant.toJSON() : null
    };
  }

  async calculateNetAmount() {
    this.net_amount = this.amount - this.fee - this.tax;
    await this.$query().patch({ net_amount: this.net_amount });
    return this.net_amount;
  }

  async processPayment() {
    this.status = 'processing';
    this.processed_at = new Date().toISOString();
    
    await this.$query().patch({
      status: this.status,
      processed_at: this.processed_at
    });

    return this;
  }

  async completePayment() {
    this.status = 'completed';
    this.processed_at = new Date().toISOString();
    
    await this.$query().patch({
      status: this.status,
      processed_at: this.processed_at
    });

    return this;
  }

  async failPayment(reason, code = null) {
    this.status = 'failed';
    this.failure_reason = reason;
    this.failure_code = code;
    
    await this.$query().patch({
      status: this.status,
      failure_reason: this.failure_reason,
      failure_code: this.failure_code
    });

    return this;
  }

  async refundPayment(amount, reason) {
    if (amount > this.amount) {
      throw new Error('Refund amount cannot exceed original payment amount');
    }

    this.status = 'refunded';
    this.refund_amount = amount;
    this.refund_reason = reason;
    this.refunded_at = new Date().toISOString();
    
    await this.$query().patch({
      status: this.status,
      refund_amount: this.refund_amount,
      refund_reason: this.refund_reason,
      refunded_at: this.refunded_at
    });

    return this;
  }

  async cancelPayment() {
    this.status = 'cancelled';
    
    await this.$query().patch({
      status: this.status
    });

    return this;
  }

  isCompleted() {
    return this.status === 'completed';
  }

  isFailed() {
    return this.status === 'failed';
  }

  isRefunded() {
    return this.status === 'refunded';
  }

  isPending() {
    return this.status === 'pending';
  }

  isProcessing() {
    return this.status === 'processing';
  }

  canBeRefunded() {
    return this.status === 'completed' && !this.isRefunded();
  }

  canBeCancelled() {
    return ['pending', 'processing'].includes(this.status);
  }

  // Static methods
  static async findByTransactionId(transactionId) {
    return await this.query().where('transaction_id', transactionId).first();
  }

  static async findByOrder(orderId) {
    return await this.query().where('order_id', orderId);
  }

  static async findByUser(userId) {
    return await this.query().where('user_id', userId);
  }

  static async findByMerchant(merchantId) {
    return await this.query().where('merchant_id', merchantId);
  }

  static async findByStatus(status) {
    return await this.query().where('status', status);
  }

  static async findByPaymentMethod(method) {
    return await this.query().where('payment_method', method);
  }

  static async findByPaymentType(type) {
    return await this.query().where('payment_type', type);
  }

  static async findByDateRange(startDate, endDate) {
    return await this.query()
      .whereBetween('created_at', [startDate, endDate]);
  }

  static async search(searchTerm) {
    return await this.query()
      .where(function() {
        this.where('transaction_id', 'ilike', `%${searchTerm}%`)
          .orWhere('description', 'ilike', `%${searchTerm}%`)
          .orWhere('failure_reason', 'ilike', `%${searchTerm}%`);
      });
  }

  static async getStats() {
    const stats = await this.query()
      .select(
        this.raw('COUNT(*) as total_payments'),
        this.raw('COUNT(CASE WHEN status = \'completed\' THEN 1 END) as completed_payments'),
        this.raw('COUNT(CASE WHEN status = \'failed\' THEN 1 END) as failed_payments'),
        this.raw('COUNT(CASE WHEN status = \'refunded\' THEN 1 END) as refunded_payments'),
        this.raw('SUM(amount) as total_amount'),
        this.raw('SUM(fee) as total_fees'),
        this.raw('SUM(net_amount) as total_net_amount'),
        this.raw('SUM(refund_amount) as total_refunds'),
        this.raw('AVG(amount) as average_payment_amount')
      )
      .first();

    return stats;
  }

  static async getRevenueStats(days = 30) {
    const result = await this.query()
      .select(
        this.raw('DATE(created_at) as date'),
        this.raw('COUNT(*) as payments_count'),
        this.raw('SUM(amount) as daily_amount'),
        this.raw('SUM(fee) as daily_fees'),
        this.raw('SUM(net_amount) as daily_net_amount'),
        this.raw('COUNT(CASE WHEN status = \'completed\' THEN 1 END) as completed_count'),
        this.raw('COUNT(CASE WHEN status = \'failed\' THEN 1 END) as failed_count')
      )
      .where('created_at', '>=', this.raw(`NOW() - INTERVAL '${days} days'`))
      .groupBy('date')
      .orderBy('date');

    return result;
  }

  static async getPaymentMethodStats() {
    const result = await this.query()
      .select(
        'payment_method',
        this.raw('COUNT(*) as count'),
        this.raw('SUM(amount) as total_amount'),
        this.raw('AVG(amount) as average_amount'),
        this.raw('COUNT(CASE WHEN status = \'completed\' THEN 1 END) as completed_count'),
        this.raw('COUNT(CASE WHEN status = \'failed\' THEN 1 END) as failed_count')
      )
      .groupBy('payment_method')
      .orderBy('total_amount', 'desc');

    return result;
  }

  static async getGatewayStats() {
    const result = await this.query()
      .select(
        'payment_gateway',
        this.raw('COUNT(*) as count'),
        this.raw('SUM(amount) as total_amount'),
        this.raw('AVG(fee) as average_fee'),
        this.raw('COUNT(CASE WHEN status = \'completed\' THEN 1 END) as completed_count'),
        this.raw('COUNT(CASE WHEN status = \'failed\' THEN 1 END) as failed_count')
      )
      .groupBy('payment_gateway')
      .orderBy('total_amount', 'desc');

    return result;
  }

  static async getTopMerchantsByRevenue(limit = 10) {
    const result = await this.query()
      .select(
        'merchant_id',
        this.raw('COUNT(*) as payments_count'),
        this.raw('SUM(amount) as total_revenue'),
        this.raw('AVG(amount) as average_payment'),
        this.raw('SUM(fee) as total_fees')
      )
      .whereNotNull('merchant_id')
      .groupBy('merchant_id')
      .orderBy('total_revenue', 'desc')
      .limit(limit);

    return result;
  }

  static generateTransactionId() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `TXN-${timestamp}-${random}`;
  }

  static async getFailedPaymentsAnalysis() {
    const result = await this.query()
      .select(
        'failure_code',
        'payment_method',
        'payment_gateway',
        this.raw('COUNT(*) as failure_count'),
        this.raw('AVG(amount) as average_amount'),
        this.raw('SUM(amount) as total_failed_amount')
      )
      .where('status', 'failed')
      .groupBy('failure_code', 'payment_method', 'payment_gateway')
      .orderBy('failure_count', 'desc');

    return result;
  }
}

module.exports = Payment; 