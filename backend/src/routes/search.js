const express = require('express');
const router = express.Router();
const SearchService = require('../services/SearchService');

const searchService = new SearchService();

// Search products
router.get('/products', async (req, res) => {
  try {
    const { q, category, priceMin, priceMax, rating, inStock, sortBy, page, limit } = req.query;
    
    const filters = {
      category: category ? parseInt(category) : undefined,
      priceMin: priceMin ? parseInt(priceMin) : undefined,
      priceMax: priceMax ? parseInt(priceMax) : undefined,
      rating: rating ? parseFloat(rating) : undefined,
      inStock: inStock !== undefined ? inStock === 'true' : undefined,
      sortBy,
      page,
      limit
    };

    const result = await searchService.searchProducts(q, filters);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q, limit } = req.query;
    
    const result = await searchService.getSearchSuggestions(q, parseInt(limit) || 5);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get popular searches
router.get('/popular', async (req, res) => {
  try {
    const { limit } = req.query;
    
    const result = await searchService.getPopularSearches(parseInt(limit) || 10);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Advanced search
router.post('/advanced', async (req, res) => {
  try {
    const criteria = req.body;
    
    const result = await searchService.advancedSearch(criteria);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Rebuild search index (admin only)
router.post('/rebuild-index', async (req, res) => {
  try {
    const result = await searchService.rebuildIndex();
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get search statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    const result = await searchService.getSearchStats();
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 