const { Model } = require('objection');
const User = require('./User');

class Blogger extends Model {
  static get tableName() {
    return 'bloggers';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'display_name'],

      properties: {
        id: { type: 'integer' },
        user_id: { type: 'integer' },
        display_name: { type: 'string', minLength: 1, maxLength: 255 },
        bio: { type: 'string', maxLength: 1000 },
        profile_image: { type: 'string', maxLength: 500 },
        cover_image: { type: 'string', maxLength: 500 },
        website: { type: 'string', maxLength: 500 },
        instagram_handle: { type: 'string', maxLength: 100 },
        instagram_followers: { type: 'integer', minimum: 0 },
        tiktok_handle: { type: 'string', maxLength: 100 },
        tiktok_followers: { type: 'integer', minimum: 0 },
        youtube_handle: { type: 'string', maxLength: 100 },
        youtube_subscribers: { type: 'integer', minimum: 0 },
        telegram_handle: { type: 'string', maxLength: 100 },
        telegram_followers: { type: 'integer', minimum: 0 },
        facebook_handle: { type: 'string', maxLength: 100 },
        facebook_followers: { type: 'integer', minimum: 0 },
        total_clicks: { type: 'integer', minimum: 0 },
        total_conversions: { type: 'integer', minimum: 0 },
        total_earnings: { type: 'number', minimum: 0 },
        commission_rate: { type: 'number', minimum: 0, maximum: 100 },
        commission_tier: { type: 'string', enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'] },
        payout_threshold: { type: 'number', minimum: 0 },
        verification_status: { type: 'string', enum: ['pending', 'verified', 'rejected'] },
        verification_notes: { type: 'string', maxLength: 1000 },
        content_categories: { type: 'array', items: { type: 'string' } },
        achievements: { type: 'array', items: { type: 'string' } },
        badges: { type: 'array', items: { type: 'string' } },
        level: { type: 'integer', minimum: 1 },
        experience_points: { type: 'integer', minimum: 0 },
        status: { type: 'string', enum: ['active', 'inactive', 'suspended'] },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const User = require('./User');
    const AffiliateLink = require('./AffiliateLink');
    const Order = require('./Order');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'bloggers.user_id',
          to: 'users.id'
        }
      },
      affiliate_links: {
        relation: Model.HasManyRelation,
        modelClass: AffiliateLink,
        join: {
          from: 'bloggers.id',
          to: 'affiliate_links.blogger_id'
        }
      },
      orders: {
        relation: Model.HasManyRelation,
        modelClass: Order,
        join: {
          from: 'bloggers.id',
          to: 'orders.affiliate_id'
        }
      }
    };
  }

  // Instance methods
  async getFullProfile() {
    const user = await this.$relatedQuery('user');
    return {
      ...this.toJSON(),
      user: user ? user.toJSON() : null
    };
  }

  async calculateTotalFollowers() {
    return (
      (this.instagram_followers || 0) +
      (this.tiktok_followers || 0) +
      (this.youtube_subscribers || 0) +
      (this.telegram_followers || 0) +
      (this.facebook_followers || 0)
    );
  }

  async calculateConversionRate() {
    if (this.total_clicks === 0) return 0;
    return (this.total_conversions / this.total_clicks) * 100;
  }

  async calculateEarningsPerClick() {
    if (this.total_clicks === 0) return 0;
    return this.total_earnings / this.total_clicks;
  }

  async updateStats() {
    const [clicksResult, conversionsResult, earningsResult] = await Promise.all([
      this.$relatedQuery('affiliate_links').sum('clicks as total_clicks'),
      this.$relatedQuery('affiliate_links').sum('conversions as total_conversions'),
      this.$relatedQuery('orders')
        .where('payment_status', 'completed')
        .sum('affiliate_commission as total_earnings')
    ]);

    this.total_clicks = parseInt(clicksResult[0].total_clicks || 0);
    this.total_conversions = parseInt(conversionsResult[0].total_conversions || 0);
    this.total_earnings = parseFloat(earningsResult[0].total_earnings || 0);

    await this.$query().patch({
      total_clicks: this.total_clicks,
      total_conversions: this.total_conversions,
      total_earnings: this.total_earnings
    });

    return {
      total_clicks: this.total_clicks,
      total_conversions: this.total_conversions,
      total_earnings: this.total_earnings
    };
  }

  async addExperiencePoints(points) {
    this.experience_points += points;
    
    // Level up logic
    const newLevel = Math.floor(this.experience_points / 1000) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      // Add achievement for level up
      if (!this.achievements) this.achievements = [];
      this.achievements.push(`level_${this.level}_reached`);
    }

    await this.$query().patch({
      experience_points: this.experience_points,
      level: this.level,
      achievements: this.achievements
    });

    return { level: this.level, experience_points: this.experience_points };
  }

  async addAchievement(achievement) {
    if (!this.achievements) this.achievements = [];
    if (!this.achievements.includes(achievement)) {
      this.achievements.push(achievement);
      await this.$query().patch({ achievements: this.achievements });
    }
    return this.achievements;
  }

  async addBadge(badge) {
    if (!this.badges) this.badges = [];
    if (!this.badges.includes(badge)) {
      this.badges.push(badge);
      await this.$query().patch({ badges: this.badges });
    }
    return this.badges;
  }

  isVerified() {
    return this.verification_status === 'verified';
  }

  isActive() {
    return this.status === 'active';
  }

  canReceivePayout() {
    return this.total_earnings >= this.payout_threshold;
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

  static async findByCategory(category) {
    return await this.query()
      .whereRaw("content_categories @> ?", [JSON.stringify([category])]);
  }

  static async findByLevel(level) {
    return await this.query().where('level', level);
  }

  static async search(searchTerm) {
    return await this.query()
      .where(function() {
        this.where('display_name', 'ilike', `%${searchTerm}%`)
          .orWhere('bio', 'ilike', `%${searchTerm}%`)
          .orWhere('instagram_handle', 'ilike', `%${searchTerm}%`)
          .orWhere('tiktok_handle', 'ilike', `%${searchTerm}%`)
          .orWhere('youtube_handle', 'ilike', `%${searchTerm}%`);
      });
  }

  static async getTopBloggers(limit = 10) {
    return await this.query()
      .orderBy('total_earnings', 'desc')
      .limit(limit);
  }

  static async getTopByFollowers(platform = null, limit = 10) {
    let query = this.query();
    
    if (platform) {
      const followerColumn = `${platform}_followers`;
      query = query.orderBy(followerColumn, 'desc');
    } else {
      query = query.orderByRaw('(instagram_followers + tiktok_followers + youtube_subscribers + telegram_followers + facebook_followers) DESC');
    }
    
    return await query.limit(limit);
  }

  static async getTopByConversionRate(limit = 10) {
    return await this.query()
      .where('total_clicks', '>', 0)
      .orderByRaw('(total_conversions::float / total_clicks) DESC')
      .limit(limit);
  }

  static async getStats() {
    const stats = await this.query()
      .select(
        this.raw('COUNT(*) as total_bloggers'),
        this.raw('COUNT(CASE WHEN verification_status = \'verified\' THEN 1 END) as verified_bloggers'),
        this.raw('COUNT(CASE WHEN status = \'active\' THEN 1 END) as active_bloggers'),
        this.raw('AVG(commission_rate) as avg_commission_rate'),
        this.raw('SUM(total_earnings) as total_platform_earnings'),
        this.raw('AVG(level) as avg_level'),
        this.raw('SUM(total_clicks) as total_clicks'),
        this.raw('SUM(total_conversions) as total_conversions')
      )
      .first();

    return stats;
  }

  static async getEarningsStats(days = 30) {
    const result = await this.query()
      .select(
        this.raw('DATE(created_at) as date'),
        this.raw('SUM(total_earnings) as daily_earnings'),
        this.raw('COUNT(*) as new_bloggers')
      )
      .where('created_at', '>=', this.raw(`NOW() - INTERVAL '${days} days'`))
      .groupBy('date')
      .orderBy('date');

    return result;
  }

  static async getLeaderboard(limit = 20) {
    return await this.query()
      .select(
        'id',
        'display_name',
        'profile_image',
        'level',
        'experience_points',
        'total_earnings',
        'total_clicks',
        'total_conversions',
        'achievements',
        'badges'
      )
      .orderBy('total_earnings', 'desc')
      .limit(limit);
  }
}

module.exports = Blogger; 