const { Model } = require('objection');

class AffiliateLink extends Model {
  static get tableName() {
    return 'affiliate_links';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['blogger_id', 'product_id', 'affiliate_code'],

      properties: {
        id: { type: 'integer' },
        blogger_id: { type: 'integer' },
        product_id: { type: 'integer' },
        merchant_id: { type: 'integer' },
        affiliate_code: { type: 'string', minLength: 1, maxLength: 100 },
        custom_url: { type: 'string', maxLength: 500 },
        short_url: { type: 'string', maxLength: 500 },
        qr_code_url: { type: 'string', maxLength: 500 },
        description: { type: 'string', maxLength: 1000 },
        commission_rate: { type: 'number', minimum: 0, maximum: 100 },
        commission_type: { type: 'string', enum: ['percentage', 'fixed'] },
        is_active: { type: 'boolean' },
        clicks: { type: 'integer', minimum: 0 },
        conversions: { type: 'integer', minimum: 0 },
        revenue: { type: 'number', minimum: 0 },
        commission_earned: { type: 'number', minimum: 0 },
        campaign_name: { type: 'string', maxLength: 255 },
        campaign_description: { type: 'string', maxLength: 1000 },
        start_date: { type: 'string', format: 'date-time' },
        end_date: { type: 'string', format: 'date-time' },
        performance_history: { type: 'array', items: { type: 'object' } },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Blogger = require('./Blogger');
    const Product = require('./Product');
    const Merchant = require('./Merchant');
    const Order = require('./Order');

    return {
      blogger: {
        relation: Model.BelongsToOneRelation,
        modelClass: Blogger,
        join: {
          from: 'affiliate_links.blogger_id',
          to: 'bloggers.id'
        }
      },
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'affiliate_links.product_id',
          to: 'products.id'
        }
      },
      merchant: {
        relation: Model.BelongsToOneRelation,
        modelClass: Merchant,
        join: {
          from: 'affiliate_links.merchant_id',
          to: 'merchants.id'
        }
      },
      orders: {
        relation: Model.HasManyRelation,
        modelClass: Order,
        join: {
          from: 'affiliate_links.affiliate_code',
          to: 'orders.affiliate_code'
        }
      }
    };
  }

  // Instance methods
  async getFullLinkDetails() {
    const [blogger, product, merchant] = await Promise.all([
      this.$relatedQuery('blogger'),
      this.$relatedQuery('product'),
      this.$relatedQuery('merchant')
    ]);

    return {
      ...this.toJSON(),
      blogger: blogger ? blogger.toJSON() : null,
      product: product ? product.toJSON() : null,
      merchant: merchant ? merchant.toJSON() : null
    };
  }

  async incrementClicks() {
    this.clicks += 1;
    await this.$query().patch({ clicks: this.clicks });
    
    // Add to performance history
    await this.addPerformanceRecord('click');
    
    return this.clicks;
  }

  async incrementConversions(amount = 0) {
    this.conversions += 1;
    this.revenue += amount;
    
    // Calculate commission
    const commission = this.calculateCommission(amount);
    this.commission_earned += commission;
    
    await this.$query().patch({
      conversions: this.conversions,
      revenue: this.revenue,
      commission_earned: this.commission_earned
    });
    
    // Add to performance history
    await this.addPerformanceRecord('conversion', { amount, commission });
    
    return {
      conversions: this.conversions,
      revenue: this.revenue,
      commission_earned: this.commission_earned
    };
  }

  calculateCommission(amount) {
    if (this.commission_type === 'percentage') {
      return (amount * this.commission_rate) / 100;
    } else {
      return this.commission_rate; // Fixed amount
    }
  }

  async addPerformanceRecord(type, data = {}) {
    if (!this.performance_history) {
      this.performance_history = [];
    }

    this.performance_history.push({
      type,
      timestamp: new Date().toISOString(),
      ...data
    });

    await this.$query().patch({
      performance_history: this.performance_history
    });
  }

  async calculateConversionRate() {
    if (this.clicks === 0) return 0;
    return (this.conversions / this.clicks) * 100;
  }

  async calculateEarningsPerClick() {
    if (this.clicks === 0) return 0;
    return this.commission_earned / this.clicks;
  }

  async generateShortUrl() {
    const shortCode = this.generateShortCode();
    this.short_url = `${process.env.BASE_URL}/ref/${shortCode}`;
    await this.$query().patch({ short_url: this.short_url });
    return this.short_url;
  }

  async generateQRCode() {
    const qrCodeData = this.short_url || this.custom_url;
    // In a real implementation, you would generate QR code here
    this.qr_code_url = `${process.env.BASE_URL}/qr/${this.affiliate_code}`;
    await this.$query().patch({ qr_code_url: this.qr_code_url });
    return this.qr_code_url;
  }

  generateShortCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  isActive() {
    return this.is_active;
  }

  isExpired() {
    if (!this.end_date) return false;
    return new Date() > new Date(this.end_date);
  }

  // Static methods
  static async findByAffiliateCode(code) {
    return await this.query().where('affiliate_code', code).first();
  }

  static async findByBlogger(bloggerId) {
    return await this.query().where('blogger_id', bloggerId);
  }

  static async findByProduct(productId) {
    return await this.query().where('product_id', productId);
  }

  static async findByMerchant(merchantId) {
    return await this.query().where('merchant_id', merchantId);
  }

  static async findActive() {
    return await this.query().where('is_active', true);
  }

  static async findByCampaign(campaignName) {
    return await this.query().where('campaign_name', campaignName);
  }

  static async search(searchTerm) {
    return await this.query()
      .where(function() {
        this.where('affiliate_code', 'ilike', `%${searchTerm}%`)
          .orWhere('description', 'ilike', `%${searchTerm}%`)
          .orWhere('campaign_name', 'ilike', `%${searchTerm}%`);
      });
  }

  static async getTopPerformingLinks(limit = 10) {
    return await this.query()
      .orderBy('commission_earned', 'desc')
      .limit(limit);
  }

  static async getTopByConversionRate(limit = 10) {
    return await this.query()
      .where('clicks', '>', 0)
      .orderByRaw('(conversions::float / clicks) DESC')
      .limit(limit);
  }

  static async getTopByClicks(limit = 10) {
    return await this.query()
      .orderBy('clicks', 'desc')
      .limit(limit);
  }

  static async getStats() {
    const stats = await this.query()
      .select(
        this.raw('COUNT(*) as total_links'),
        this.raw('COUNT(CASE WHEN is_active = true THEN 1 END) as active_links'),
        this.raw('SUM(clicks) as total_clicks'),
        this.raw('SUM(conversions) as total_conversions'),
        this.raw('SUM(revenue) as total_revenue'),
        this.raw('SUM(commission_earned) as total_commission'),
        this.raw('AVG(commission_rate) as avg_commission_rate')
      )
      .first();

    return stats;
  }

  static async getPerformanceStats(days = 30) {
    const result = await this.query()
      .select(
        this.raw('DATE(created_at) as date'),
        this.raw('COUNT(*) as new_links'),
        this.raw('SUM(clicks) as daily_clicks'),
        this.raw('SUM(conversions) as daily_conversions'),
        this.raw('SUM(revenue) as daily_revenue'),
        this.raw('SUM(commission_earned) as daily_commission')
      )
      .where('created_at', '>=', this.raw(`NOW() - INTERVAL '${days} days'`))
      .groupBy('date')
      .orderBy('date');

    return result;
  }

  static async getBloggerPerformance(bloggerId, days = 30) {
    const result = await this.query()
      .select(
        'product_id',
        'affiliate_code',
        'clicks',
        'conversions',
        'revenue',
        'commission_earned',
        this.raw('(conversions::float / NULLIF(clicks, 0)) * 100 as conversion_rate')
      )
      .where('blogger_id', bloggerId)
      .where('created_at', '>=', this.raw(`NOW() - INTERVAL '${days} days'`))
      .orderBy('commission_earned', 'desc');

    return result;
  }

  static async getProductPerformance(productId, days = 30) {
    const result = await this.query()
      .select(
        'blogger_id',
        'affiliate_code',
        'clicks',
        'conversions',
        'revenue',
        'commission_earned',
        this.raw('(conversions::float / NULLIF(clicks, 0)) * 100 as conversion_rate')
      )
      .where('product_id', productId)
      .where('created_at', '>=', this.raw(`NOW() - INTERVAL '${days} days'`))
      .orderBy('commission_earned', 'desc');

    return result;
  }

  static generateAffiliateCode(bloggerId, productId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `AFF-${bloggerId}-${productId}-${timestamp}-${random}`.toUpperCase();
  }

  static async getCampaignStats(campaignName) {
    const result = await this.query()
      .select(
        'affiliate_code',
        'clicks',
        'conversions',
        'revenue',
        'commission_earned',
        this.raw('(conversions::float / NULLIF(clicks, 0)) * 100 as conversion_rate')
      )
      .where('campaign_name', campaignName)
      .orderBy('commission_earned', 'desc');

    return result;
  }
}

module.exports = AffiliateLink; 