const AffiliateLink = require('../models/AffiliateLink');
const Blogger = require('../models/Blogger');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const OrderService = require('./OrderService');
const logger = require('../utils/logger');

class AffiliateService {
  // Create affiliate link
  static async createAffiliateLink(linkData, bloggerId) {
    try {
      const {
        product_id,
        description,
        commission_rate,
        commission_type = 'percentage',
        campaign_name,
        campaign_description
      } = linkData;

      // Validate product
      const product = await Product.query().findById(product_id);
      if (!product) {
        throw new Error('Product not found');
      }

      // Validate blogger
      const blogger = await Blogger.query().findById(bloggerId);
      if (!blogger) {
        throw new Error('Blogger not found');
      }

      // Generate affiliate code
      const affiliateCode = AffiliateLink.generateAffiliateCode(bloggerId, product_id);

      // Create affiliate link
      const affiliateLink = await AffiliateLink.query().insert({
        blogger_id: bloggerId,
        product_id,
        merchant_id: product.merchant_id,
        affiliate_code: affiliateCode,
        description,
        commission_rate: commission_rate || product.affiliate_commission_rate || 5,
        commission_type,
        is_active: true,
        campaign_name,
        campaign_description
      });

      // Generate short URL and QR code
      await affiliateLink.generateShortUrl();
      await affiliateLink.generateQRCode();

      logger.info(`Affiliate link created: ${affiliateCode} by blogger: ${bloggerId}`);
      return affiliateLink;
    } catch (error) {
      logger.error('Error creating affiliate link:', error);
      throw error;
    }
  }

  // Get affiliate link by ID
  static async getAffiliateLinkById(linkId, bloggerId = null) {
    try {
      let query = AffiliateLink.query()
        .findById(linkId)
        .withGraphFetched('[blogger, product, merchant]');

      if (bloggerId) {
        query = query.where('blogger_id', bloggerId);
      }

      const affiliateLink = await query;
      
      if (!affiliateLink) {
        throw new Error('Affiliate link not found');
      }

      return affiliateLink;
    } catch (error) {
      logger.error('Error getting affiliate link by ID:', error);
      throw error;
    }
  }

  // Get affiliate link by code
  static async getAffiliateLinkByCode(code) {
    try {
      const affiliateLink = await AffiliateLink.query()
        .where('affiliate_code', code)
        .withGraphFetched('[blogger, product, merchant]')
        .first();

      if (!affiliateLink) {
        throw new Error('Affiliate link not found');
      }

      return affiliateLink;
    } catch (error) {
      logger.error('Error getting affiliate link by code:', error);
      throw error;
    }
  }

  // Track affiliate click
  static async trackClick(affiliateCode, visitorData = {}) {
    try {
      const affiliateLink = await AffiliateLink.query()
        .where('affiliate_code', affiliateCode)
        .first();

      if (!affiliateLink) {
        throw new Error('Invalid affiliate code');
      }

      if (!affiliateLink.isActive()) {
        throw new Error('Affiliate link is not active');
      }

      // Increment click count
      await affiliateLink.incrementClicks();

      // Add experience points to blogger
      const blogger = await Blogger.query().findById(affiliateLink.blogger_id);
      if (blogger) {
        await blogger.addExperiencePoints(1);
      }

      logger.info(`Affiliate click tracked: ${affiliateCode}`);
      return affiliateLink;
    } catch (error) {
      logger.error('Error tracking affiliate click:', error);
      throw error;
    }
  }

  // Track affiliate conversion
  static async trackConversion(affiliateCode, orderId, amount) {
    try {
      const affiliateLink = await AffiliateLink.query()
        .where('affiliate_code', affiliateCode)
        .first();

      if (!affiliateLink) {
        throw new Error('Invalid affiliate code');
      }

      // Update affiliate link stats
      await affiliateLink.incrementConversions(amount);

      // Update order with affiliate information
      await Order.query()
        .findById(orderId)
        .patch({
          affiliate_id: affiliateLink.blogger_id,
          affiliate_code: affiliateCode,
          affiliate_link: affiliateLink.short_url,
          affiliate_commission: affiliateLink.calculateCommission(amount)
        });

      // Add experience points to blogger
      const blogger = await Blogger.query().findById(affiliateLink.blogger_id);
      if (blogger) {
        await blogger.addExperiencePoints(10);
        await blogger.addAchievement('first_conversion');
      }

      // Create notification
      await Notification.createAffiliateNotification(
        affiliateLink.blogger_id,
        affiliateLink.id,
        'New Conversion',
        `You earned a commission from order ${orderId}`,
        { order_id: orderId, amount, commission: affiliateLink.calculateCommission(amount) }
      );

      logger.info(`Affiliate conversion tracked: ${affiliateCode} for order: ${orderId}`);
      return affiliateLink;
    } catch (error) {
      logger.error('Error tracking affiliate conversion:', error);
      throw error;
    }
  }

  // Get blogger affiliate links
  static async getBloggerAffiliateLinks(bloggerId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        is_active,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = options;

      let query = AffiliateLink.query()
        .where('blogger_id', bloggerId)
        .withGraphFetched('[product, merchant]');

      if (is_active !== undefined) {
        query = query.where('is_active', is_active);
      }

      query = query.orderBy(sort_by, sort_order);

      const offset = (page - 1) * limit;
      query = query.offset(offset).limit(limit);

      const affiliateLinks = await query;
      const total = await AffiliateLink.query()
        .where('blogger_id', bloggerId)
        .count('id as count')
        .first();

      return {
        affiliate_links: affiliateLinks,
        pagination: {
          page,
          limit,
          total: parseInt(total.count),
          total_pages: Math.ceil(total.count / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting blogger affiliate links:', error);
      throw error;
    }
  }

  // Get product affiliate links
  static async getProductAffiliateLinks(productId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        is_active,
        sort_by = 'clicks',
        sort_order = 'desc'
      } = options;

      let query = AffiliateLink.query()
        .where('product_id', productId)
        .withGraphFetched('[blogger, merchant]');

      if (is_active !== undefined) {
        query = query.where('is_active', is_active);
      }

      query = query.orderBy(sort_by, sort_order);

      const offset = (page - 1) * limit;
      query = query.offset(offset).limit(limit);

      const affiliateLinks = await query;
      const total = await AffiliateLink.query()
        .where('product_id', productId)
        .count('id as count')
        .first();

      return {
        affiliate_links: affiliateLinks,
        pagination: {
          page,
          limit,
          total: parseInt(total.count),
          total_pages: Math.ceil(total.count / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting product affiliate links:', error);
      throw error;
    }
  }

  // Update affiliate link
  static async updateAffiliateLink(linkId, updateData, bloggerId = null) {
    try {
      let query = AffiliateLink.query().findById(linkId);

      if (bloggerId) {
        query = query.where('blogger_id', bloggerId);
      }

      const affiliateLink = await query.first();
      
      if (!affiliateLink) {
        throw new Error('Affiliate link not found');
      }

      const updatedLink = await affiliateLink.$query().patchAndFetch(updateData);
      
      logger.info(`Affiliate link updated: ${linkId}`);
      return updatedLink;
    } catch (error) {
      logger.error('Error updating affiliate link:', error);
      throw error;
    }
  }

  // Deactivate affiliate link
  static async deactivateAffiliateLink(linkId, bloggerId = null) {
    try {
      let query = AffiliateLink.query().findById(linkId);

      if (bloggerId) {
        query = query.where('blogger_id', bloggerId);
      }

      const affiliateLink = await query.first();
      
      if (!affiliateLink) {
        throw new Error('Affiliate link not found');
      }

      await affiliateLink.$query().patch({ is_active: false });
      
      logger.info(`Affiliate link deactivated: ${linkId}`);
      return { success: true };
    } catch (error) {
      logger.error('Error deactivating affiliate link:', error);
      throw error;
    }
  }

  // Get blogger performance
  static async getBloggerPerformance(bloggerId, days = 30) {
    try {
      const performance = await AffiliateLink.getBloggerPerformance(bloggerId, days);
      return performance;
    } catch (error) {
      logger.error('Error getting blogger performance:', error);
      throw error;
    }
  }

  // Get product performance
  static async getProductPerformance(productId, days = 30) {
    try {
      const performance = await AffiliateLink.getProductPerformance(productId, days);
      return performance;
    } catch (error) {
      logger.error('Error getting product performance:', error);
      throw error;
    }
  }

  // Get affiliate statistics
  static async getAffiliateStats(filters = {}) {
    try {
      let query = AffiliateLink.query();

      // Apply filters
      if (filters.blogger_id) {
        query = query.where('blogger_id', filters.blogger_id);
      }
      if (filters.product_id) {
        query = query.where('product_id', filters.product_id);
      }
      if (filters.merchant_id) {
        query = query.where('merchant_id', filters.merchant_id);
      }
      if (filters.date_from) {
        query = query.where('created_at', '>=', filters.date_from);
      }
      if (filters.date_to) {
        query = query.where('created_at', '<=', filters.date_to);
      }

      const stats = await query
        .select(
          AffiliateLink.raw('COUNT(*) as total_links'),
          AffiliateLink.raw('COUNT(CASE WHEN is_active = true THEN 1 END) as active_links'),
          AffiliateLink.raw('SUM(clicks) as total_clicks'),
          AffiliateLink.raw('SUM(conversions) as total_conversions'),
          AffiliateLink.raw('SUM(revenue) as total_revenue'),
          AffiliateLink.raw('SUM(commission_earned) as total_commission'),
          AffiliateLink.raw('AVG(commission_rate) as avg_commission_rate')
        )
        .first();

      return stats;
    } catch (error) {
      logger.error('Error getting affiliate stats:', error);
      throw error;
    }
  }

  // Get affiliate analytics
  static async getAffiliateAnalytics(days = 30, filters = {}) {
    try {
      let query = AffiliateLink.query()
        .select(
          AffiliateLink.raw('DATE(created_at) as date'),
          AffiliateLink.raw('COUNT(*) as new_links'),
          AffiliateLink.raw('SUM(clicks) as daily_clicks'),
          AffiliateLink.raw('SUM(conversions) as daily_conversions'),
          AffiliateLink.raw('SUM(revenue) as daily_revenue'),
          AffiliateLink.raw('SUM(commission_earned) as daily_commission')
        )
        .where('created_at', '>=', AffiliateLink.raw(`NOW() - INTERVAL '${days} days'`));

      // Apply filters
      if (filters.blogger_id) {
        query = query.where('blogger_id', filters.blogger_id);
      }
      if (filters.product_id) {
        query = query.where('product_id', filters.product_id);
      }

      const result = await query
        .groupBy('date')
        .orderBy('date');

      return result;
    } catch (error) {
      logger.error('Error getting affiliate analytics:', error);
      throw error;
    }
  }

  // Get top performing affiliate links
  static async getTopPerformingLinks(limit = 10, filters = {}) {
    try {
      let query = AffiliateLink.query()
        .withGraphFetched('[blogger, product, merchant]')
        .orderBy('commission_earned', 'desc')
        .limit(limit);

      // Apply filters
      if (filters.blogger_id) {
        query = query.where('blogger_id', filters.blogger_id);
      }
      if (filters.product_id) {
        query = query.where('product_id', filters.product_id);
      }

      const affiliateLinks = await query;
      return affiliateLinks;
    } catch (error) {
      logger.error('Error getting top performing affiliate links:', error);
      throw error;
    }
  }

  // Get top bloggers by earnings
  static async getTopBloggersByEarnings(limit = 10) {
    try {
      const bloggers = await Blogger.getTopBloggers(limit);
      return bloggers;
    } catch (error) {
      logger.error('Error getting top bloggers by earnings:', error);
      throw error;
    }
  }

  // Get campaign statistics
  static async getCampaignStats(campaignName) {
    try {
      const stats = await AffiliateLink.getCampaignStats(campaignName);
      return stats;
    } catch (error) {
      logger.error('Error getting campaign stats:', error);
      throw error;
    }
  }

  // Bulk create affiliate links
  static async bulkCreateAffiliateLinks(linksData, bloggerId) {
    try {
      const affiliateLinks = [];

      for (const linkData of linksData) {
        const affiliateLink = await this.createAffiliateLink(linkData, bloggerId);
        affiliateLinks.push(affiliateLink);
      }

      logger.info(`Bulk created ${affiliateLinks.length} affiliate links for blogger: ${bloggerId}`);
      return affiliateLinks;
    } catch (error) {
      logger.error('Error bulk creating affiliate links:', error);
      throw error;
    }
  }

  // Export affiliate data
  static async exportAffiliateData(filters = {}, format = 'json') {
    try {
      let query = AffiliateLink.query()
        .withGraphFetched('[blogger, product, merchant]');

      // Apply filters
      if (filters.blogger_id) {
        query = query.where('blogger_id', filters.blogger_id);
      }
      if (filters.product_id) {
        query = query.where('product_id', filters.product_id);
      }
      if (filters.is_active !== undefined) {
        query = query.where('is_active', filters.is_active);
      }

      const affiliateLinks = await query;

      if (format === 'csv') {
        // Convert to CSV format
        const csvData = affiliateLinks.map(link => ({
          id: link.id,
          affiliate_code: link.affiliate_code,
          blogger_name: link.blogger?.display_name,
          product_name: link.product?.name,
          merchant_name: link.merchant?.business_name,
          clicks: link.clicks,
          conversions: link.conversions,
          revenue: link.revenue,
          commission_earned: link.commission_earned,
          commission_rate: link.commission_rate,
          is_active: link.is_active,
          created_at: link.created_at
        }));

        return csvData;
      }

      return affiliateLinks;
    } catch (error) {
      logger.error('Error exporting affiliate data:', error);
      throw error;
    }
  }

  // Validate affiliate link data
  static validateAffiliateLinkData(linkData) {
    const { product_id, commission_rate } = linkData;

    if (!product_id) {
      throw new Error('Product ID is required');
    }

    if (commission_rate && (commission_rate < 0 || commission_rate > 100)) {
      throw new Error('Commission rate must be between 0 and 100');
    }

    return true;
  }
}

module.exports = AffiliateService; 