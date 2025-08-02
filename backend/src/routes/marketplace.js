const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// Marketplace bosh sahifasi uchun barcha ma'lumotlar
router.get('/home', async (req, res) => {
  try {
    const [
      promotedProducts,
      bestSellers,
      newProducts,
      discountedProducts,
      categories
    ] = await Promise.all([
      Product.getPromotedProducts(8),
      Product.getBestSellers(8),
      Product.getNewProducts(8),
      Product.getDiscountedProducts(8),
      Category.getAll()
    ]);

    res.json({
      success: true,
      data: {
        promotedProducts,
        bestSellers,
        newProducts,
        discountedProducts,
        categories
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Marketplace mahsulotlari (filtrlar bilan)
router.get('/products', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category_id,
      min_price,
      max_price,
      search,
      sort_by
    } = req.query;

    const filters = {
      category_id,
      min_price: min_price ? parseInt(min_price) : undefined,
      max_price: max_price ? parseInt(max_price) : undefined,
      search,
      sort_by
    };

    const result = await Product.getMarketplaceProducts(filters, parseInt(page), parseInt(limit));

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Mahsulot detallari
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Mahsulot topilmadi'
      });
    }

    // Faqat approved va active mahsulotlarni ko'rsatish
    if (product.approval_status !== 'approved' || product.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Mahsulot topilmadi'
      });
    }

    // View count oshirish
    await Product.updateViewCount(req.params.id);

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Kategoriyalar
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.getAll();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Qidiruv
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Qidiruv so\'zi kerak'
      });
    }

    const filters = { search: q };
    const result = await Product.getMarketplaceProducts(filters, parseInt(page), parseInt(limit));

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Reklama mahsulotlari
router.get('/promoted', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = await Product.getPromotedProducts(parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Top sotuvchilar
router.get('/bestsellers', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = await Product.getBestSellers(parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Yangi mahsulotlar
router.get('/new', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = await Product.getNewProducts(parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

// Chegirmali mahsulotlar
router.get('/discounted', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = await Product.getDiscountedProducts(parseInt(limit));

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server xatosi',
      error: error.message
    });
  }
});

module.exports = router; 