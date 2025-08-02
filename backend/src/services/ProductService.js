const Product = require('../models/Product');
const Category = require('../models/Category');
const Merchant = require('../models/Merchant');
const Review = require('../models/Review');
const AffiliateLink = require('../models/AffiliateLink');
const OrderService = require('./OrderService');
const logger = require('../utils/logger');

class ProductService {
  // Create a new product
  static async createProduct(productData, merchantId) {
    try {
      const product = await Product.query().insert({
        ...productData,
        merchant_id: merchantId,
        status: 'draft'
      });

      logger.info(`Product created: ${product.id} by merchant: ${merchantId}`);
      return product;
    } catch (error) {
      logger.error('Error creating product:', error);
      throw error;
    }
  }

  // Get product by ID with full details
  static async getProductById(productId, includeRelations = true) {
    try {
      let query = Product.query().findById(productId);

      if (includeRelations) {
        query = query.withGraphFetched('[merchant, category, reviews, affiliate_links]');
      }

      const product = await query;
      
      if (!product) {
        throw new Error('Product not found');
      }

      // Increment view count
      await product.incrementViews();

      return product;
    } catch (error) {
      logger.error('Error getting product by ID:', error);
      throw error;
    }
  }

  // Get product by slug
  static async getProductBySlug(slug, includeRelations = true) {
    try {
      let query = Product.query().where('slug', slug);

      if (includeRelations) {
        query = query.withGraphFetched('[merchant, category, reviews, affiliate_links]');
      }

      const product = await query.first();
      
      if (!product) {
        throw new Error('Product not found');
      }

      // Increment view count
      await product.incrementViews();

      return product;
    } catch (error) {
      logger.error('Error getting product by slug:', error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(productId, updateData, merchantId = null) {
    try {
      let query = Product.query().findById(productId);

      if (merchantId) {
        query = query.where('merchant_id', merchantId);
      }

      const product = await query.first();
      
      if (!product) {
        throw new Error('Product not found');
      }

      const updatedProduct = await product.$query().patchAndFetch(updateData);
      
      logger.info(`Product updated: ${productId}`);
      return updatedProduct;
    } catch (error) {
      logger.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(productId, merchantId = null) {
    try {
      let query = Product.query().findById(productId);

      if (merchantId) {
        query = query.where('merchant_id', merchantId);
      }

      const product = await query.first();
      
      if (!product) {
        throw new Error('Product not found');
      }

      await product.$query().delete();
      
      logger.info(`Product deleted: ${productId}`);
      return { success: true };
    } catch (error) {
      logger.error('Error deleting product:', error);
      throw error;
    }
  }

  // Search products
  static async searchProducts(searchParams) {
    try {
      const {
        query = '',
        category_id,
        merchant_id,
        min_price,
        max_price,
        rating,
        status = 'active',
        sort_by = 'created_at',
        sort_order = 'desc',
        page = 1,
        limit = 20,
        include_out_of_stock = false
      } = searchParams;

      let productQuery = Product.query()
        .where('status', status)
        .withGraphFetched('[merchant, category]');

      // Search by query
      if (query) {
        productQuery = productQuery.where(function() {
          this.where('name', 'ilike', `%${query}%`)
            .orWhere('description', 'ilike', `%${query}%`)
            .orWhere('tags', 'ilike', `%${query}%`);
        });
      }

      // Filter by category
      if (category_id) {
        productQuery = productQuery.where('category_id', category_id);
      }

      // Filter by merchant
      if (merchant_id) {
        productQuery = productQuery.where('merchant_id', merchant_id);
      }

      // Filter by price range
      if (min_price !== undefined) {
        productQuery = productQuery.where('price', '>=', min_price);
      }
      if (max_price !== undefined) {
        productQuery = productQuery.where('price', '<=', max_price);
      }

      // Filter by rating
      if (rating) {
        productQuery = productQuery.where('average_rating', '>=', rating);
      }

      // Filter out of stock products
      if (!include_out_of_stock) {
        productQuery = productQuery.where('stock_quantity', '>', 0);
      }

      // Sorting
      productQuery = productQuery.orderBy(sort_by, sort_order);

      // Pagination
      const offset = (page - 1) * limit;
      productQuery = productQuery.offset(offset).limit(limit);

      const products = await productQuery;
      const total = await Product.query()
        .where('status', status)
        .count('id as count')
        .first();

      return {
        products,
        pagination: {
          page,
          limit,
          total: parseInt(total.count),
          total_pages: Math.ceil(total.count / limit)
        }
      };
    } catch (error) {
      logger.error('Error searching products:', error);
      throw error;
    }
  }

  // Get featured products
  static async getFeaturedProducts(limit = 10) {
    try {
      const products = await Product.query()
        .where('status', 'active')
        .where('is_featured', true)
        .withGraphFetched('[merchant, category]')
        .orderBy('featured_order', 'asc')
        .limit(limit);

      return products;
    } catch (error) {
      logger.error('Error getting featured products:', error);
      throw error;
    }
  }

  // Get bestseller products
  static async getBestsellerProducts(limit = 10) {
    try {
      const products = await Product.query()
        .where('status', 'active')
        .withGraphFetched('[merchant, category]')
        .orderBy('total_orders', 'desc')
        .limit(limit);

      return products;
    } catch (error) {
      logger.error('Error getting bestseller products:', error);
      throw error;
    }
  }

  // Get new products
  static async getNewProducts(limit = 10) {
    try {
      const products = await Product.query()
        .where('status', 'active')
        .withGraphFetched('[merchant, category]')
        .orderBy('created_at', 'desc')
        .limit(limit);

      return products;
    } catch (error) {
      logger.error('Error getting new products:', error);
      throw error;
    }
  }

  // Get products on sale
  static async getSaleProducts(limit = 10) {
    try {
      const products = await Product.query()
        .where('status', 'active')
        .where('is_on_sale', true)
        .withGraphFetched('[merchant, category]')
        .orderBy('discount_percentage', 'desc')
        .limit(limit);

      return products;
    } catch (error) {
      logger.error('Error getting sale products:', error);
      throw error;
    }
  }

  // Get related products
  static async getRelatedProducts(productId, limit = 6) {
    try {
      const product = await Product.query().findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const relatedProducts = await Product.query()
        .where('status', 'active')
        .where('id', '!=', productId)
        .where(function() {
          this.where('category_id', product.category_id)
            .orWhere('merchant_id', product.merchant_id);
        })
        .withGraphFetched('[merchant, category]')
        .orderBy('average_rating', 'desc')
        .limit(limit);

      return relatedProducts;
    } catch (error) {
      logger.error('Error getting related products:', error);
      throw error;
    }
  }

  // Update product inventory
  static async updateInventory(productId, quantity, operation = 'decrease') {
    try {
      const product = await Product.query().findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      let newQuantity;
      if (operation === 'decrease') {
        newQuantity = Math.max(0, product.stock_quantity - quantity);
      } else if (operation === 'increase') {
        newQuantity = product.stock_quantity + quantity;
      } else {
        newQuantity = quantity;
      }

      const updatedProduct = await product.$query().patchAndFetch({
        stock_quantity: newQuantity,
        is_in_stock: newQuantity > 0
      });

      logger.info(`Product inventory updated: ${productId}, new quantity: ${newQuantity}`);
      return updatedProduct;
    } catch (error) {
      logger.error('Error updating product inventory:', error);
      throw error;
    }
  }

  // Update product ratings
  static async updateProductRatings(productId) {
    try {
      const product = await Product.query().findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      await product.updateRatingStats();
      return product;
    } catch (error) {
      logger.error('Error updating product ratings:', error);
      throw error;
    }
  }

  // Get product statistics
  static async getProductStats(productId) {
    try {
      const product = await Product.query().findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const stats = await product.getStats();
      return stats;
    } catch (error) {
      logger.error('Error getting product stats:', error);
      throw error;
    }
  }

  // Bulk update products
  static async bulkUpdateProducts(productIds, updateData, merchantId = null) {
    try {
      let query = Product.query()
        .whereIn('id', productIds);

      if (merchantId) {
        query = query.where('merchant_id', merchantId);
      }

      const updatedCount = await query.patch(updateData);
      
      logger.info(`Bulk updated ${updatedCount} products`);
      return { updated_count: updatedCount };
    } catch (error) {
      logger.error('Error bulk updating products:', error);
      throw error;
    }
  }

  // Get products by category
  static async getProductsByCategory(categoryId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        sort_by = 'created_at',
        sort_order = 'desc'
      } = options;

      let query = Product.query()
        .where('category_id', categoryId)
        .where('status', 'active')
        .withGraphFetched('[merchant, category]');

      // Sorting
      query = query.orderBy(sort_by, sort_order);

      // Pagination
      const offset = (page - 1) * limit;
      query = query.offset(offset).limit(limit);

      const products = await query;
      const total = await Product.query()
        .where('category_id', categoryId)
        .where('status', 'active')
        .count('id as count')
        .first();

      return {
        products,
        pagination: {
          page,
          limit,
          total: parseInt(total.count),
          total_pages: Math.ceil(total.count / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting products by category:', error);
      throw error;
    }
  }

  // Get products by merchant
  static async getProductsByMerchant(merchantId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        sort_by = 'created_at',
        sort_order = 'desc',
        status = 'active'
      } = options;

      let query = Product.query()
        .where('merchant_id', merchantId)
        .where('status', status)
        .withGraphFetched('[merchant, category]');

      // Sorting
      query = query.orderBy(sort_by, sort_order);

      // Pagination
      const offset = (page - 1) * limit;
      query = query.offset(offset).limit(limit);

      const products = await query;
      const total = await Product.query()
        .where('merchant_id', merchantId)
        .where('status', status)
        .count('id as count')
        .first();

      return {
        products,
        pagination: {
          page,
          limit,
          total: parseInt(total.count),
          total_pages: Math.ceil(total.count / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting products by merchant:', error);
      throw error;
    }
  }

  // Get product recommendations
  static async getProductRecommendations(userId, limit = 10) {
    try {
      // This is a simplified recommendation system
      // In a real application, you would implement more sophisticated algorithms
      
      const recommendations = await Product.query()
        .where('status', 'active')
        .where('average_rating', '>=', 4)
        .where('total_orders', '>', 0)
        .withGraphFetched('[merchant, category]')
        .orderByRaw('(average_rating * total_orders) DESC')
        .limit(limit);

      return recommendations;
    } catch (error) {
      logger.error('Error getting product recommendations:', error);
      throw error;
    }
  }

  // Get product analytics
  static async getProductAnalytics(productId, days = 30) {
    try {
      const product = await Product.query().findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const analytics = {
        views: await product.getViewsStats(days),
        orders: await product.getOrdersStats(days),
        revenue: await product.getRevenueStats(days),
        reviews: await product.getReviewsStats(days)
      };

      return analytics;
    } catch (error) {
      logger.error('Error getting product analytics:', error);
      throw error;
    }
  }

  // Export products
  static async exportProducts(filters = {}, format = 'json') {
    try {
      let query = Product.query()
        .where('status', 'active')
        .withGraphFetched('[merchant, category]');

      // Apply filters
      if (filters.category_id) {
        query = query.where('category_id', filters.category_id);
      }
      if (filters.merchant_id) {
        query = query.where('merchant_id', filters.merchant_id);
      }

      const products = await query;

      if (format === 'csv') {
        // Convert to CSV format
        const csvData = products.map(product => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          stock_quantity: product.stock_quantity,
          merchant_name: product.merchant?.business_name,
          category_name: product.category?.name,
          status: product.status,
          created_at: product.created_at
        }));

        return csvData;
      }

      return products;
    } catch (error) {
      logger.error('Error exporting products:', error);
      throw error;
    }
  }
}

module.exports = ProductService; 