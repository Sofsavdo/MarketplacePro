const { Model } = require('objection');

class Review extends Model {
  static get tableName() {
    return 'reviews';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['product_id', 'user_id', 'rating', 'title'],

      properties: {
        id: { type: 'integer' },
        product_id: { type: 'integer' },
        user_id: { type: 'integer' },
        order_id: { type: ['integer', 'null'] },
        merchant_id: { type: 'integer' },
        title: { type: 'string', minLength: 1, maxLength: 255 },
        content: { type: 'string', maxLength: 2000 },
        rating: { type: 'integer', minimum: 1, maximum: 5 },
        rating_breakdown: { type: 'object' },
        images: { type: 'array', items: { type: 'string' } },
        videos: { type: 'array', items: { type: 'string' } },
        verified_purchase: { type: 'boolean' },
        helpful_count: { type: 'integer', minimum: 0 },
        not_helpful_count: { type: 'integer', minimum: 0 },
        moderation_status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
        rejection_reason: { type: 'string', maxLength: 500 },
        merchant_response: { type: 'string', maxLength: 1000 },
        merchant_response_date: { type: 'string', format: 'date-time' },
        views: { type: 'integer', minimum: 0 },
        likes: { type: 'integer', minimum: 0 },
        reports: { type: 'integer', minimum: 0 },
        is_featured: { type: 'boolean' },
        is_anonymous: { type: 'boolean' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const User = require('./User');
    const Product = require('./Product');
    const Order = require('./Order');
    const Merchant = require('./Merchant');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'reviews.user_id',
          to: 'users.id'
        }
      },
      product: {
        relation: Model.BelongsToOneRelation,
        modelClass: Product,
        join: {
          from: 'reviews.product_id',
          to: 'products.id'
        }
      },
      order: {
        relation: Model.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: 'reviews.order_id',
          to: 'orders.id'
        }
      },
      merchant: {
        relation: Model.BelongsToOneRelation,
        modelClass: Merchant,
        join: {
          from: 'reviews.merchant_id',
          to: 'merchants.id'
        }
      }
    };
  }

  // Instance methods
  async getFullReviewDetails() {
    const [user, product, order, merchant] = await Promise.all([
      this.$relatedQuery('user'),
      this.$relatedQuery('product'),
      this.$relatedQuery('order'),
      this.$relatedQuery('merchant')
    ]);

    return {
      ...this.toJSON(),
      user: user ? user.toJSON() : null,
      product: product ? product.toJSON() : null,
      order: order ? order.toJSON() : null,
      merchant: merchant ? merchant.toJSON() : null
    };
  }

  async incrementViews() {
    this.views += 1;
    await this.$query().patch({ views: this.views });
    return this.views;
  }

  async incrementLikes() {
    this.likes += 1;
    await this.$query().patch({ likes: this.likes });
    return this.likes;
  }

  async decrementLikes() {
    if (this.likes > 0) {
      this.likes -= 1;
      await this.$query().patch({ likes: this.likes });
    }
    return this.likes;
  }

  async markHelpful() {
    this.helpful_count += 1;
    await this.$query().patch({ helpful_count: this.helpful_count });
    return this.helpful_count;
  }

  async markNotHelpful() {
    this.not_helpful_count += 1;
    await this.$query().patch({ not_helpful_count: this.not_helpful_count });
    return this.not_helpful_count;
  }

  async reportReview() {
    this.reports += 1;
    await this.$query().patch({ reports: this.reports });
    return this.reports;
  }

  async approveReview() {
    this.moderation_status = 'approved';
    await this.$query().patch({ moderation_status: this.moderation_status });
    return this;
  }

  async rejectReview(reason) {
    this.moderation_status = 'rejected';
    this.rejection_reason = reason;
    await this.$query().patch({
      moderation_status: this.moderation_status,
      rejection_reason: this.rejection_reason
    });
    return this;
  }

  async addMerchantResponse(response) {
    this.merchant_response = response;
    this.merchant_response_date = new Date().toISOString();
    await this.$query().patch({
      merchant_response: this.merchant_response,
      merchant_response_date: this.merchant_response_date
    });
    return this;
  }

  async featureReview() {
    this.is_featured = true;
    await this.$query().patch({ is_featured: this.is_featured });
    return this;
  }

  async unfeatureReview() {
    this.is_featured = false;
    await this.$query().patch({ is_featured: this.is_featured });
    return this;
  }

  calculateHelpfulScore() {
    const total = this.helpful_count + this.not_helpful_count;
    if (total === 0) return 0;
    return (this.helpful_count / total) * 100;
  }

  isApproved() {
    return this.moderation_status === 'approved';
  }

  isRejected() {
    return this.moderation_status === 'rejected';
  }

  isPending() {
    return this.moderation_status === 'pending';
  }

  isFeatured() {
    return this.is_featured;
  }

  isVerified() {
    return this.verified_purchase;
  }

  // Static methods
  static async findByProduct(productId) {
    return await this.query().where('product_id', productId);
  }

  static async findByUser(userId) {
    return await this.query().where('user_id', userId);
  }

  static async findByMerchant(merchantId) {
    return await this.query().where('merchant_id', merchantId);
  }

  static async findByRating(rating) {
    return await this.query().where('rating', rating);
  }

  static async findByStatus(status) {
    return await this.query().where('moderation_status', status);
  }

  static async findApproved() {
    return await this.query().where('moderation_status', 'approved');
  }

  static async findFeatured() {
    return await this.query().where('is_featured', true);
  }

  static async findVerified() {
    return await this.query().where('verified_purchase', true);
  }

  static async search(searchTerm) {
    return await this.query()
      .where(function() {
        this.where('title', 'ilike', `%${searchTerm}%`)
          .orWhere('content', 'ilike', `%${searchTerm}%`);
      });
  }

  static async getTopReviews(limit = 10) {
    return await this.query()
      .where('moderation_status', 'approved')
      .orderBy('helpful_count', 'desc')
      .limit(limit);
  }

  static async getRecentReviews(limit = 10) {
    return await this.query()
      .where('moderation_status', 'approved')
      .orderBy('created_at', 'desc')
      .limit(limit);
  }

  static async getHighestRatedReviews(limit = 10) {
    return await this.query()
      .where('moderation_status', 'approved')
      .orderBy('rating', 'desc')
      .limit(limit);
  }

  static async getLowestRatedReviews(limit = 10) {
    return await this.query()
      .where('moderation_status', 'approved')
      .orderBy('rating', 'asc')
      .limit(limit);
  }

  static async getProductRatingStats(productId) {
    const stats = await this.query()
      .select(
        this.raw('COUNT(*) as total_reviews'),
        this.raw('AVG(rating) as average_rating'),
        this.raw('COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star'),
        this.raw('COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star'),
        this.raw('COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star'),
        this.raw('COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star'),
        this.raw('COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star'),
        this.raw('COUNT(CASE WHEN verified_purchase = true THEN 1 END) as verified_reviews')
      )
      .where('product_id', productId)
      .where('moderation_status', 'approved')
      .first();

    return stats;
  }

  static async getMerchantRatingStats(merchantId) {
    const stats = await this.query()
      .select(
        this.raw('COUNT(*) as total_reviews'),
        this.raw('AVG(rating) as average_rating'),
        this.raw('COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star'),
        this.raw('COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star'),
        this.raw('COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star'),
        this.raw('COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star'),
        this.raw('COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star'),
        this.raw('COUNT(CASE WHEN verified_purchase = true THEN 1 END) as verified_reviews')
      )
      .where('merchant_id', merchantId)
      .where('moderation_status', 'approved')
      .first();

    return stats;
  }

  static async getStats() {
    const stats = await this.query()
      .select(
        this.raw('COUNT(*) as total_reviews'),
        this.raw('COUNT(CASE WHEN moderation_status = \'approved\' THEN 1 END) as approved_reviews'),
        this.raw('COUNT(CASE WHEN moderation_status = \'pending\' THEN 1 END) as pending_reviews'),
        this.raw('COUNT(CASE WHEN moderation_status = \'rejected\' THEN 1 END) as rejected_reviews'),
        this.raw('COUNT(CASE WHEN verified_purchase = true THEN 1 END) as verified_reviews'),
        this.raw('COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_reviews'),
        this.raw('AVG(rating) as average_rating'),
        this.raw('SUM(views) as total_views'),
        this.raw('SUM(likes) as total_likes'),
        this.raw('SUM(reports) as total_reports')
      )
      .first();

    return stats;
  }

  static async getReviewStats(days = 30) {
    const result = await this.query()
      .select(
        this.raw('DATE(created_at) as date'),
        this.raw('COUNT(*) as reviews_count'),
        this.raw('AVG(rating) as average_rating'),
        this.raw('COUNT(CASE WHEN moderation_status = \'approved\' THEN 1 END) as approved_count'),
        this.raw('COUNT(CASE WHEN moderation_status = \'rejected\' THEN 1 END) as rejected_count'),
        this.raw('SUM(views) as daily_views'),
        this.raw('SUM(likes) as daily_likes')
      )
      .where('created_at', '>=', this.raw(`NOW() - INTERVAL '${days} days'`))
      .groupBy('date')
      .orderBy('date');

    return result;
  }

  static async getTopReviewers(limit = 10) {
    const result = await this.query()
      .select(
        'user_id',
        this.raw('COUNT(*) as reviews_count'),
        this.raw('AVG(rating) as average_rating'),
        this.raw('SUM(helpful_count) as total_helpful'),
        this.raw('SUM(views) as total_views')
      )
      .where('moderation_status', 'approved')
      .groupBy('user_id')
      .orderBy('reviews_count', 'desc')
      .limit(limit);

    return result;
  }

  static async getReportedReviews(limit = 10) {
    return await this.query()
      .where('reports', '>', 0)
      .orderBy('reports', 'desc')
      .limit(limit);
  }

  static async getPendingModeration(limit = 50) {
    return await this.query()
      .where('moderation_status', 'pending')
      .orderBy('created_at', 'asc')
      .limit(limit);
  }

  static async getRatingDistribution() {
    const result = await this.query()
      .select(
        'rating',
        this.raw('COUNT(*) as count'),
        this.raw('COUNT(*) * 100.0 / (SELECT COUNT(*) FROM reviews WHERE moderation_status = \'approved\') as percentage')
      )
      .where('moderation_status', 'approved')
      .groupBy('rating')
      .orderBy('rating', 'desc');

    return result;
  }
}

module.exports = Review; 