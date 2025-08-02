const { Model } = require('objection');
const User = require('./User');

class Merchant extends Model {
  static get tableName() {
    return 'merchants';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'business_name'],

      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        business_name: { type: 'string', minLength: 1, maxLength: 255 },
        business_description: { type: 'string', maxLength: 1000 },
        business_logo: { type: 'string', maxLength: 500 },
        business_website: { type: 'string', maxLength: 500 },
        business_email: { type: 'string', format: 'email', maxLength: 255 },
        business_phone: { type: 'string', maxLength: 20 },
        business_address: { type: 'string', maxLength: 500 },
        business_city: { type: 'string', maxLength: 100 },
        business_state: { type: 'string', maxLength: 100 },
        business_country: { type: 'string', maxLength: 100 },
        business_zip_code: { type: 'string', maxLength: 20 },
        tax_id: { type: 'string', maxLength: 100 },
        registration_number: { type: 'string', maxLength: 100 },
        legal_documents: { type: 'array', items: { type: 'string' } },
        bank_name: { type: 'string', maxLength: 255 },
        bank_account_number: { type: 'string', maxLength: 100 },
        bank_routing_number: { type: 'string', maxLength: 100 },
        commission_rate: { type: 'number', minimum: 0, maximum: 100 },
        commission_tiers: { type: 'object' },
        verification_status: { type: 'string', enum: ['pending', 'verified', 'rejected'] },
        verification_notes: { type: 'string', maxLength: 1000 },
        total_products: { type: 'integer', minimum: 0 },
        total_orders: { type: 'integer', minimum: 0 },
        total_revenue: { type: 'number', minimum: 0 },
        average_rating: { type: 'number', minimum: 0, maximum: 5 },
        total_ratings: { type: 'integer', minimum: 0 },
        status: { type: 'string', enum: ['active', 'inactive', 'suspended'] },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const User = require('./User');
    const Product = require('./Product');
    const Order = require('./Order');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'merchants.user_id',
          to: 'users.id'
        }
      },
      products: {
        relation: Model.HasManyRelation,
        modelClass: Product,
        join: {
          from: 'merchants.id',
          to: 'products.merchant_id'
        }
      },
      orders: {
        relation: Model.HasManyRelation,
        modelClass: Order,
        join: {
          from: 'merchants.id',
          to: 'orders.merchant_id'
        }
      }
    };
  }

  // Instance methods
  async getFullBusinessInfo() {
    const user = await this.$relatedQuery('user');
    return {
      ...this.toJSON(),
      user: user ? user.toJSON() : null
    };
  }

  async calculateTotalRevenue() {
    const result = await this.$relatedQuery('orders')
      .where('payment_status', 'completed')
      .sum('total_amount as total');
    
    this.total_revenue = parseFloat(result[0].total || 0);
    await this.$query().patch({ total_revenue: this.total_revenue });
    return this.total_revenue;
  }

  async calculateAverageRating() {
    const result = await this.$relatedQuery('products')
      .avg('average_rating as avg_rating');
    
    this.average_rating = parseFloat(result[0].avg_rating || 0);
    await this.$query().patch({ average_rating: this.average_rating });
    return this.average_rating;
  }

  async updateStats() {
    const [productsCount, ordersCount] = await Promise.all([
      this.$relatedQuery('products').count('id as count'),
      this.$relatedQuery('orders').count('id as count')
    ]);

    this.total_products = parseInt(productsCount[0].count || 0);
    this.total_orders = parseInt(ordersCount[0].count || 0);

    await this.$query().patch({
      total_products: this.total_products,
      total_orders: this.total_orders
    });

    return {
      total_products: this.total_products,
      total_orders: this.total_orders
    };
  }

  isVerified() {
    return this.verification_status === 'verified';
  }

  isActive() {
    return this.status === 'active';
  }

  // Static methods
  static async findByUserId(userId) {
    return await this.query().where('user_id', userId).first();
  }

  static async findVerified() {
    return await this.query().where('verification_status', 'verified');
  }

  static async findActive() {
    return await this.query().where('status', 'active');
  }

  static async findByStatus(status) {
    return await this.query().where('status', status);
  }

  static async findByVerificationStatus(status) {
    return await this.query().where('verification_status', status);
  }

  static async search(searchTerm) {
    return await this.query()
      .where(function() {
        this.where('business_name', 'ilike', `%${searchTerm}%`)
          .orWhere('business_description', 'ilike', `%${searchTerm}%`)
          .orWhere('business_email', 'ilike', `%${searchTerm}%`);
      });
  }

  static async getTopMerchants(limit = 10) {
    return await this.query()
      .orderBy('total_revenue', 'desc')
      .limit(limit);
  }

  static async getStats() {
    const stats = await this.query()
      .select(
        this.raw('COUNT(*) as total_merchants'),
        this.raw('COUNT(CASE WHEN verification_status = \'verified\' THEN 1 END) as verified_merchants'),
        this.raw('COUNT(CASE WHEN status = \'active\' THEN 1 END) as active_merchants'),
        this.raw('AVG(commission_rate) as avg_commission_rate'),
        this.raw('SUM(total_revenue) as total_platform_revenue'),
        this.raw('AVG(average_rating) as avg_merchant_rating')
      )
      .first();

    return stats;
  }

  static async getRevenueStats(days = 30) {
    const result = await this.query()
      .select(
        this.raw('DATE(created_at) as date'),
        this.raw('SUM(total_revenue) as daily_revenue'),
        this.raw('COUNT(*) as new_merchants')
      )
      .where('created_at', '>=', this.raw(`NOW() - INTERVAL '${days} days'`))
      .groupBy('date')
      .orderBy('date');

    return result;
  }
}

module.exports = Merchant; 