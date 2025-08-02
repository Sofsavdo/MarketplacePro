const ProductService = require('../services/ProductService');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

class ProductController {
  // Create a new product
  static async createProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const productData = req.body;
      const merchantId = req.user.merchant_id;

      const product = await ProductService.createProduct(productData, merchantId);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      logger.error('Error in createProduct controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: error.message
      });
    }
  }

  // Get product by ID
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const includeRelations = req.query.include_relations !== 'false';

      const product = await ProductService.getProductById(id, includeRelations);

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Error in getProductById controller:', error);
      
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get product',
        error: error.message
      });
    }
  }

  // Get product by slug
  static async getProductBySlug(req, res) {
    try {
      const { slug } = req.params;
      const includeRelations = req.query.include_relations !== 'false';

      const product = await ProductService.getProductBySlug(slug, includeRelations);

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Error in getProductBySlug controller:', error);
      
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get product',
        error: error.message
      });
    }
  }

  // Update product
  static async updateProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData = req.body;
      const merchantId = req.user.merchant_id;

      const product = await ProductService.updateProduct(id, updateData, merchantId);

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      logger.error('Error in updateProduct controller:', error);
      
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update product',
        error: error.message
      });
    }
  }

  // Delete product
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const merchantId = req.user.merchant_id;

      await ProductService.deleteProduct(id, merchantId);

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      logger.error('Error in deleteProduct controller:', error);
      
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete product',
        error: error.message
      });
    }
  }

  // Search products
  static async searchProducts(req, res) {
    try {
      const searchParams = req.query;

      const result = await ProductService.searchProducts(searchParams);

      res.json({
        success: true,
        data: result.products,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in searchProducts controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search products',
        error: error.message
      });
    }
  }

  // Get featured products
  static async getFeaturedProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const products = await ProductService.getFeaturedProducts(limit);

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Error in getFeaturedProducts controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get featured products',
        error: error.message
      });
    }
  }

  // Get bestseller products
  static async getBestsellerProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const products = await ProductService.getBestsellerProducts(limit);

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Error in getBestsellerProducts controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get bestseller products',
        error: error.message
      });
    }
  }

  // Get new products
  static async getNewProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const products = await ProductService.getNewProducts(limit);

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Error in getNewProducts controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get new products',
        error: error.message
      });
    }
  }

  // Get sale products
  static async getSaleProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const products = await ProductService.getSaleProducts(limit);

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Error in getSaleProducts controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get sale products',
        error: error.message
      });
    }
  }

  // Get related products
  static async getRelatedProducts(req, res) {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit) || 6;

      const products = await ProductService.getRelatedProducts(id, limit);

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Error in getRelatedProducts controller:', error);
      
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get related products',
        error: error.message
      });
    }
  }

  // Update product inventory
  static async updateInventory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { quantity, operation } = req.body;
      const merchantId = req.user.merchant_id;

      const product = await ProductService.updateInventory(id, quantity, operation, merchantId);

      res.json({
        success: true,
        message: 'Product inventory updated successfully',
        data: product
      });
    } catch (error) {
      logger.error('Error in updateInventory controller:', error);
      
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update product inventory',
        error: error.message
      });
    }
  }

  // Get product statistics
  static async getProductStats(req, res) {
    try {
      const { id } = req.params;

      const stats = await ProductService.getProductStats(id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error('Error in getProductStats controller:', error);
      
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get product statistics',
        error: error.message
      });
    }
  }

  // Bulk update products
  static async bulkUpdateProducts(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { product_ids, update_data } = req.body;
      const merchantId = req.user.merchant_id;

      const result = await ProductService.bulkUpdateProducts(product_ids, update_data, merchantId);

      res.json({
        success: true,
        message: 'Products updated successfully',
        data: result
      });
    } catch (error) {
      logger.error('Error in bulkUpdateProducts controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bulk update products',
        error: error.message
      });
    }
  }

  // Get products by category
  static async getProductsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const options = req.query;

      const result = await ProductService.getProductsByCategory(categoryId, options);

      res.json({
        success: true,
        data: result.products,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getProductsByCategory controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get products by category',
        error: error.message
      });
    }
  }

  // Get products by merchant
  static async getProductsByMerchant(req, res) {
    try {
      const { merchantId } = req.params;
      const options = req.query;

      const result = await ProductService.getProductsByMerchant(merchantId, options);

      res.json({
        success: true,
        data: result.products,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error in getProductsByMerchant controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get products by merchant',
        error: error.message
      });
    }
  }

  // Get product recommendations
  static async getProductRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 10;

      const recommendations = await ProductService.getProductRecommendations(userId, limit);

      res.json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      logger.error('Error in getProductRecommendations controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get product recommendations',
        error: error.message
      });
    }
  }

  // Get product analytics
  static async getProductAnalytics(req, res) {
    try {
      const { id } = req.params;
      const days = parseInt(req.query.days) || 30;

      const analytics = await ProductService.getProductAnalytics(id, days);

      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      logger.error('Error in getProductAnalytics controller:', error);
      
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to get product analytics',
        error: error.message
      });
    }
  }

  // Export products
  static async exportProducts(req, res) {
    try {
      const filters = req.query;
      const format = req.query.format || 'json';

      const data = await ProductService.exportProducts(filters, format);

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
      }

      res.json({
        success: true,
        data: data
      });
    } catch (error) {
      logger.error('Error in exportProducts controller:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to export products',
        error: error.message
      });
    }
  }

  // Update product ratings
  static async updateProductRatings(req, res) {
    try {
      const { id } = req.params;

      const product = await ProductService.updateProductRatings(id);

      res.json({
        success: true,
        message: 'Product ratings updated successfully',
        data: product
      });
    } catch (error) {
      logger.error('Error in updateProductRatings controller:', error);
      
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update product ratings',
        error: error.message
      });
    }
  }
}

module.exports = ProductController; 