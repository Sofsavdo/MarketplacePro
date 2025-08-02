const { Model } = require('objection');

class Order extends Model {
  static get tableName() {
    return 'orders';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['customer_id', 'merchant_id', 'order_number', 'total_amount'],

      properties: {
        id: { type: 'integer' },
        customer_id: { type: 'integer' },
        merchant_id: { type: 'integer' },
        affiliate_id: { type: ['integer', 'null'] },
        order_number: { type: 'string', minLength: 1, maxLength: 50 },
        order_status: { type: 'string', enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'] },
        payment_status: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'] },
        shipping_status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'returned'] },
        customer_email: { type: 'string', format: 'email', maxLength: 255 },
        customer_phone: { type: 'string', maxLength: 20 },
        customer_name: { type: 'string', maxLength: 255 },
        billing_address: { type: 'object' },
        shipping_address: { type: 'object' },
        ordered_items: { type: 'array', items: { type: 'object' } },
        subtotal: { type: 'number', minimum: 0 },
        tax_amount: { type: 'number', minimum: 0 },
        shipping_amount: { type: 'number', minimum: 0 },
        discount_amount: { type: 'number', minimum: 0 },
        total_amount: { type: 'number', minimum: 0 },
        currency: { type: 'string', maxLength: 3 },
        payment_method: { type: 'string', maxLength: 100 },
        payment_gateway: { type: 'string', maxLength: 100 },
        transaction_id: { type: 'string', maxLength: 255 },
        shipping_method: { type: 'string', maxLength: 100 },
        tracking_number: { type: 'string', maxLength: 255 },
        affiliate_code: { type: 'string', maxLength: 100 },
        affiliate_link: { type: 'string', maxLength: 500 },
        affiliate_commission: { type: 'number', minimum: 0 },
        platform_commission: { type: 'number', minimum: 0 },
        notes: { type: 'string', maxLength: 1000 },
        communication_history: { type: 'array', items: { type: 'object' } },
        estimated_delivery: { type: 'string', format: 'date-time' },
        delivered_at: { type: 'string', format: 'date-time' },
        cancelled_at: { type: 'string', format: 'date-time' },
        refunded_at: { type: 'string', format: 'date-time' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const User = require('./User');
    const Merchant = require('./Merchant');
    const Blogger = require('./Blogger');
    const Payment = require('./Payment');

    return {
      customer: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'orders.customer_id',
          to: 'users.id'
        }
      },
      merchant: {
        relation: Model.BelongsToOneRelation,
        modelClass: Merchant,
        join: {
          from: 'orders.merchant_id',
          to: 'merchants.id'
        }
      },
      affiliate: {
        relation: Model.BelongsToOneRelation,
        modelClass: Blogger,
        join: {
          from: 'orders.affiliate_id',
          to: 'bloggers.id'
        }
      },
      payments: {
        relation: Model.HasManyRelation,
        modelClass: Payment,
        join: {
          from: 'orders.id',
          to: 'payments.order_id'
        }
      }
    };
  }

  // Instance methods
  async getFullOrderDetails() {
    const [customer, merchant, affiliate, payments] = await Promise.all([
      this.$relatedQuery('customer'),
      this.$relatedQuery('merchant'),
      this.$relatedQuery('affiliate'),
      this.$relatedQuery('payments')
    ]);

    return {
      ...this.toJSON(),
      customer: customer ? customer.toJSON() : null,
      merchant: merchant ? merchant.toJSON() : null,
      affiliate: affiliate ? affiliate.toJSON() : null,
      payments: payments.map(payment => payment.toJSON())
    };
  }

  async calculateTotals() {
    const items = this.ordered_items || [];
    let subtotal = 0;
    let taxAmount = 0;
    let shippingAmount = this.shipping_amount || 0;
    let discountAmount = this.discount_amount || 0;

    // Calculate subtotal from items
    items.forEach(item => {
      subtotal += (item.price * item.quantity);
    });

    // Calculate tax (simplified - in real app, this would be more complex)
    taxAmount = subtotal * 0.1; // 10% tax rate

    // Calculate total
    const total = subtotal + taxAmount + shippingAmount - discountAmount;

    // Update order
    await this.$query().patch({
      subtotal,
      tax_amount: taxAmount,
      total_amount: total
    });

    return {
      subtotal,
      tax_amount: taxAmount,
      shipping_amount: shippingAmount,
      discount_amount: discountAmount,
      total_amount: total
    };
  }

  async updateStatus(newStatus, notes = null) {
    const oldStatus = this.order_status;
    this.order_status = newStatus;

    // Add to communication history
    if (!this.communication_history) {
      this.communication_history = [];
    }

    this.communication_history.push({
      type: 'status_update',
      from: oldStatus,
      to: newStatus,
      timestamp: new Date().toISOString(),
      notes: notes
    });

    // Set specific timestamps based on status
    if (newStatus === 'delivered') {
      this.delivered_at = new Date().toISOString();
    } else if (newStatus === 'cancelled') {
      this.cancelled_at = new Date().toISOString();
    } else if (newStatus === 'refunded') {
      this.refunded_at = new Date().toISOString();
    }

    await this.$query().patch({
      order_status: newStatus,
      communication_history: this.communication_history,
      delivered_at: this.delivered_at,
      cancelled_at: this.cancelled_at,
      refunded_at: this.refunded_at
    });

    return this;
  }

  async updatePaymentStatus(newStatus, transactionId = null) {
    this.payment_status = newStatus;
    if (transactionId) {
      this.transaction_id = transactionId;
    }

    await this.$query().patch({
      payment_status: newStatus,
      transaction_id: this.transaction_id
    });

    return this;
  }

  async updateShippingStatus(newStatus, trackingNumber = null) {
    this.shipping_status = newStatus;
    if (trackingNumber) {
      this.tracking_number = trackingNumber;
    }

    await this.$query().patch({
      shipping_status: newStatus,
      tracking_number: this.tracking_number
    });

    return this;
  }

  async calculateCommissions() {
    // Calculate affiliate commission
    if (this.affiliate_id && this.affiliate_commission === 0) {
      // This would typically come from the affiliate link or product settings
      const affiliateCommissionRate = 0.05; // 5% default
      this.affiliate_commission = this.total_amount * affiliateCommissionRate;
    }

    // Calculate platform commission
    if (this.platform_commission === 0) {
      const platformCommissionRate = 0.03; // 3% default
      this.platform_commission = this.total_amount * platformCommissionRate;
    }

    await this.$query().patch({
      affiliate_commission: this.affiliate_commission,
      platform_commission: this.platform_commission
    });

    return {
      affiliate_commission: this.affiliate_commission,
      platform_commission: this.platform_commission
    };
  }

  isCompleted() {
    return this.order_status === 'delivered' && this.payment_status === 'paid';
  }

  isCancelled() {
    return this.order_status === 'cancelled';
  }

  isRefunded() {
    return this.payment_status === 'refunded';
  }

  canBeCancelled() {
    return ['pending', 'confirmed', 'processing'].includes(this.order_status);
  }

  canBeRefunded() {
    return this.payment_status === 'paid' && !this.isRefunded();
  }

  // Static methods
  static async findByOrderNumber(orderNumber) {
    return await this.query().where('order_number', orderNumber).first();
  }

  static async findByCustomer(customerId) {
    return await this.query().where('customer_id', customerId);
  }

  static async findByMerchant(merchantId) {
    return await this.query().where('merchant_id', merchantId);
  }

  static async findByAffiliate(affiliateId) {
    return await this.query().where('affiliate_id', affiliateId);
  }

  static async findByStatus(status) {
    return await this.query().where('order_status', status);
  }

  static async findByPaymentStatus(status) {
    return await this.query().where('payment_status', status);
  }

  static async findByShippingStatus(status) {
    return await this.query().where('shipping_status', status);
  }

  static async findByDateRange(startDate, endDate) {
    return await this.query()
      .whereBetween('created_at', [startDate, endDate]);
  }

  static async search(searchTerm) {
    return await this.query()
      .where(function() {
        this.where('order_number', 'ilike', `%${searchTerm}%`)
          .orWhere('customer_email', 'ilike', `%${searchTerm}%`)
          .orWhere('customer_name', 'ilike', `%${searchTerm}%`)
          .orWhere('tracking_number', 'ilike', `%${searchTerm}%`);
      });
  }

  static async getStats() {
    const stats = await this.query()
      .select(
        this.raw('COUNT(*) as total_orders'),
        this.raw('COUNT(CASE WHEN order_status = \'delivered\' THEN 1 END) as completed_orders'),
        this.raw('COUNT(CASE WHEN order_status = \'cancelled\' THEN 1 END) as cancelled_orders'),
        this.raw('COUNT(CASE WHEN payment_status = \'paid\' THEN 1 END) as paid_orders'),
        this.raw('SUM(total_amount) as total_revenue'),
        this.raw('SUM(affiliate_commission) as total_affiliate_commission'),
        this.raw('SUM(platform_commission) as total_platform_commission'),
        this.raw('AVG(total_amount) as average_order_value')
      )
      .first();

    return stats;
  }

  static async getRevenueStats(days = 30) {
    const result = await this.query()
      .select(
        this.raw('DATE(created_at) as date'),
        this.raw('COUNT(*) as orders_count'),
        this.raw('SUM(total_amount) as daily_revenue'),
        this.raw('SUM(affiliate_commission) as daily_affiliate_commission'),
        this.raw('SUM(platform_commission) as daily_platform_commission')
      )
      .where('created_at', '>=', this.raw(`NOW() - INTERVAL '${days} days'`))
      .groupBy('date')
      .orderBy('date');

    return result;
  }

  static async getTopProducts(limit = 10) {
    const result = await this.query()
      .select(
        this.raw('jsonb_array_elements(ordered_items)->>\'product_id\' as product_id'),
        this.raw('jsonb_array_elements(ordered_items)->>\'name\' as product_name'),
        this.raw('SUM((jsonb_array_elements(ordered_items)->>\'quantity\')::int) as total_quantity'),
        this.raw('SUM((jsonb_array_elements(ordered_items)->>\'price\')::decimal * (jsonb_array_elements(ordered_items)->>\'quantity\')::int) as total_revenue')
      )
      .groupBy('product_id', 'product_name')
      .orderBy('total_revenue', 'desc')
      .limit(limit);

    return result;
  }

  static generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }
}

module.exports = Order; 