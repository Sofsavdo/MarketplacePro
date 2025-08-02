const db = require('../config/database');
const logger = require('../utils/logger');

class AnalyticsService {
  static async getPlatformStats() {
    try {
      const [
        totalUsers,
        totalMerchants,
        totalBloggers,
        totalProducts,
        totalOrders,
        totalRevenue
      ] = await Promise.all([
        db('users').count('* as count').first(),
        db('merchants').count('* as count').first(),
        db('bloggers').count('* as count').first(),
        db('products').count('* as count').first(),
        db('orders').count('* as count').first(),
        db('orders').sum('total_amount as total').first()
      ]);
      
      return {
        totalUsers: parseInt(totalUsers.count),
        totalMerchants: parseInt(totalMerchants.count),
        totalBloggers: parseInt(totalBloggers.count),
        totalProducts: parseInt(totalProducts.count),
        totalOrders: parseInt(totalOrders.count),
        totalRevenue: parseFloat(totalRevenue.total || 0)
      };
    } catch (error) {
      logger.error('Error getting platform stats:', error);
      throw error;
    }
  }
  
  static async getRevenueTrend(days = 30) {
    try {
      const revenueData = await db('orders')
        .select(
          db.raw('DATE(created_at) as date'),
          db.raw('SUM(total_amount) as revenue'),
          db.raw('COUNT(*) as orders')
        )
        .where('created_at', '>=', db.raw(`NOW() - INTERVAL '${days} days'`))
        .where('status', '!=', 'cancelled')
        .groupBy('date')
        .orderBy('date');
      
      return revenueData;
    } catch (error) {
      logger.error('Error getting revenue trend:', error);
      throw error;
    }
  }
  
  static async getTopProducts(limit = 10) {
    try {
      const products = await db('products')
        .select('id', 'name', 'price', 'sold_count', 'view_count', 'rating')
        .where('status', 'active')
        .where('approval_status', 'approved')
        .orderBy('sold_count', 'desc')
        .limit(limit);
      
      return products;
    } catch (error) {
      logger.error('Error getting top products:', error);
      throw error;
    }
  }
  
  static async getTopBloggers(limit = 10) {
    try {
      const bloggers = await db('bloggers')
        .select('id', 'username', 'total_followers', 'conversion_rate', 'total_earnings')
        .where('status', 'active')
        .orderBy('total_earnings', 'desc')
        .limit(limit);
      
      return bloggers;
    } catch (error) {
      logger.error('Error getting top bloggers:', error);
      throw error;
    }
  }
  
  static async getMerchantStats(merchantId) {
    try {
      const [
        totalProducts,
        totalOrders,
        totalRevenue,
        avgRating
      ] = await Promise.all([
        db('products').where('merchant_id', merchantId).count('* as count').first(),
        db('orders').where('merchant_id', merchantId).count('* as count').first(),
        db('orders').where('merchant_id', merchantId).sum('total_amount as total').first(),
        db('products').where('merchant_id', merchantId).avg('rating as avg').first()
      ]);
      
      return {
        totalProducts: parseInt(totalProducts.count),
        totalOrders: parseInt(totalOrders.count),
        totalRevenue: parseFloat(totalRevenue.total || 0),
        avgRating: parseFloat(avgRating.avg || 0)
      };
    } catch (error) {
      logger.error('Error getting merchant stats:', error);
      throw error;
    }
  }
  
  static async getBloggerStats(bloggerId) {
    try {
      const [
        totalEarnings,
        totalClicks,
        totalConversions,
        activeLinks
      ] = await Promise.all([
        db('blogger_earnings').where('blogger_id', bloggerId).sum('amount as total').first(),
        db('affiliate_links').where('blogger_id', bloggerId).sum('click_count as total').first(),
        db('affiliate_links').where('blogger_id', bloggerId).sum('conversion_count as total').first(),
        db('affiliate_links').where('blogger_id', bloggerId).where('is_active', true).count('* as count').first()
      ]);
      
      return {
        totalEarnings: parseFloat(totalEarnings.total || 0),
        totalClicks: parseInt(totalClicks.total || 0),
        totalConversions: parseInt(totalConversions.total || 0),
        activeLinks: parseInt(activeLinks.count),
        conversionRate: totalClicks.total > 0 ? (totalConversions.total / totalClicks.total * 100).toFixed(2) : 0
      };
    } catch (error) {
      logger.error('Error getting blogger stats:', error);
      throw error;
    }
  }
  
  static async getOrderStats() {
    try {
      const stats = await db('orders')
        .select('status')
        .count('* as count')
        .groupBy('status');
      
      return stats.reduce((acc, stat) => {
        acc[stat.status] = parseInt(stat.count);
        return acc;
      }, {});
    } catch (error) {
      logger.error('Error getting order stats:', error);
      throw error;
    }
  }
}

module.exports = AnalyticsService; 