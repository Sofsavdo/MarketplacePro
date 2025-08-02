const Product = require('../models/Product');
const Category = require('../models/Category');

class SearchService {
  constructor() {
    this.searchIndex = new Map();
    this.initializeSearchIndex();
  }

  // Initialize search index
  async initializeSearchIndex() {
    try {
      // Load all products and categories into memory for fast search
      const products = await Product.getAllProducts();
      const categories = await Category.getAllCategories();

      // Index products
      products.forEach(product => {
        this.indexProduct(product);
      });

      // Index categories
      categories.forEach(category => {
        this.indexCategory(category);
      });

      console.log(`Search index initialized with ${products.length} products and ${categories.length} categories`);
    } catch (error) {
      console.error('Search index initialization error:', error);
    }
  }

  // Index a product
  indexProduct(product) {
    const searchableText = [
      product.name,
      product.description,
      product.category_name,
      product.merchant_name,
      product.tags,
      product.sku
    ].join(' ').toLowerCase();

    const tokens = this.tokenize(searchableText);
    
    tokens.forEach(token => {
      if (!this.searchIndex.has(token)) {
        this.searchIndex.set(token, { products: [], categories: [] });
      }
      this.searchIndex.get(token).products.push(product.id);
    });
  }

  // Index a category
  indexCategory(category) {
    const searchableText = [
      category.name,
      category.description,
      category.slug
    ].join(' ').toLowerCase();

    const tokens = this.tokenize(searchableText);
    
    tokens.forEach(token => {
      if (!this.searchIndex.has(token)) {
        this.searchIndex.set(token, { products: [], categories: [] });
      }
      this.searchIndex.get(token).categories.push(category.id);
    });
  }

  // Tokenize text for search
  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2)
      .map(token => token.trim());
  }

  // Search products
  async searchProducts(query, filters = {}) {
    try {
      const {
        category,
        priceMin,
        priceMax,
        rating,
        inStock,
        sortBy = 'relevance',
        page = 1,
        limit = 20
      } = filters;

      // Build search query
      let searchQuery = {};
      
      if (query) {
        const tokens = this.tokenize(query);
        const productIds = new Set();
        
        tokens.forEach(token => {
          const indexEntry = this.searchIndex.get(token);
          if (indexEntry) {
            indexEntry.products.forEach(id => productIds.add(id));
          }
        });

        if (productIds.size > 0) {
          searchQuery.id = Array.from(productIds);
        }
      }

      // Apply filters
      if (category) {
        searchQuery.category_id = category;
      }

      if (priceMin !== undefined || priceMax !== undefined) {
        searchQuery.price = {};
        if (priceMin !== undefined) searchQuery.price.$gte = priceMin;
        if (priceMax !== undefined) searchQuery.price.$lte = priceMax;
      }

      if (rating !== undefined) {
        searchQuery.rating = { $gte: rating };
      }

      if (inStock !== undefined) {
        searchQuery.stock_quantity = inStock ? { $gt: 0 } : 0;
      }

      // Get products with filters
      const products = await Product.searchProducts(searchQuery, {
        sortBy,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      return {
        success: true,
        data: {
          products: products.data,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: products.total,
            pages: Math.ceil(products.total / parseInt(limit))
          },
          filters: {
            applied: filters,
            available: await this.getAvailableFilters(query, filters)
          }
        }
      };
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Qidiruvda xatolik');
    }
  }

  // Get available filters
  async getAvailableFilters(query, appliedFilters) {
    try {
      const allProducts = await Product.getAllProducts();
      
      // Apply current filters to get filtered products
      let filteredProducts = allProducts;
      
      if (appliedFilters.category) {
        filteredProducts = filteredProducts.filter(p => p.category_id === appliedFilters.category);
      }

      if (appliedFilters.priceMin !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= appliedFilters.priceMin);
      }

      if (appliedFilters.priceMax !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= appliedFilters.priceMax);
      }

      // Extract available filter values
      const categories = [...new Set(filteredProducts.map(p => p.category_id))];
      const priceRange = {
        min: Math.min(...filteredProducts.map(p => p.price)),
        max: Math.max(...filteredProducts.map(p => p.price))
      };
      const ratings = [...new Set(filteredProducts.map(p => Math.floor(p.rating)))].sort();
      const stockStatus = {
        inStock: filteredProducts.filter(p => p.stock_quantity > 0).length,
        outOfStock: filteredProducts.filter(p => p.stock_quantity === 0).length
      };

      return {
        categories,
        priceRange,
        ratings,
        stockStatus
      };
    } catch (error) {
      console.error('Filter generation error:', error);
      return {};
    }
  }

  // Search suggestions
  async getSearchSuggestions(query, limit = 5) {
    try {
      if (!query || query.length < 2) {
        return { success: true, data: [] };
      }

      const tokens = this.tokenize(query);
      const suggestions = new Set();

      tokens.forEach(token => {
        // Find similar tokens
        for (const [indexToken, indexEntry] of this.searchIndex.entries()) {
          if (indexToken.includes(token) || token.includes(indexToken)) {
            // Get product names for suggestions
            indexEntry.products.forEach(productId => {
              // In real implementation, you'd fetch product names from database
              suggestions.add(`Mahsulot ${productId}`);
            });
          }
        }
      });

      return {
        success: true,
        data: Array.from(suggestions).slice(0, limit)
      };
    } catch (error) {
      console.error('Search suggestions error:', error);
      return { success: true, data: [] };
    }
  }

  // Popular searches
  async getPopularSearches(limit = 10) {
    try {
      // In real implementation, this would track search queries
      const popularSearches = [
        'iPhone',
        'Samsung',
        'Laptop',
        'Telefon',
        'Kompyuter',
        'Noutbuk',
        'Smartphone',
        'Tablet',
        'Aksessuarlar',
        'Gadjetlar'
      ];

      return {
        success: true,
        data: popularSearches.slice(0, limit)
      };
    } catch (error) {
      console.error('Popular searches error:', error);
      return { success: true, data: [] };
    }
  }

  // Advanced search with multiple criteria
  async advancedSearch(criteria) {
    try {
      const {
        query,
        categories = [],
        priceRange,
        rating,
        brand,
        features = [],
        sortBy = 'relevance',
        page = 1,
        limit = 20
      } = criteria;

      let searchQuery = {};

      // Text search
      if (query) {
        const tokens = this.tokenize(query);
        const productIds = new Set();
        
        tokens.forEach(token => {
          const indexEntry = this.searchIndex.get(token);
          if (indexEntry) {
            indexEntry.products.forEach(id => productIds.add(id));
          }
        });

        if (productIds.size > 0) {
          searchQuery.id = Array.from(productIds);
        }
      }

      // Category filter
      if (categories.length > 0) {
        searchQuery.category_id = categories;
      }

      // Price range
      if (priceRange) {
        searchQuery.price = {};
        if (priceRange.min !== undefined) searchQuery.price.$gte = priceRange.min;
        if (priceRange.max !== undefined) searchQuery.price.$lte = priceRange.max;
      }

      // Rating filter
      if (rating) {
        searchQuery.rating = { $gte: rating };
      }

      // Brand filter
      if (brand) {
        searchQuery.merchant_name = { $like: `%${brand}%` };
      }

      // Features filter
      if (features.length > 0) {
        searchQuery.features = { $overlap: features };
      }

      const products = await Product.searchProducts(searchQuery, {
        sortBy,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      return {
        success: true,
        data: {
          products: products.data,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: products.total,
            pages: Math.ceil(products.total / parseInt(limit))
          }
        }
      };
    } catch (error) {
      console.error('Advanced search error:', error);
      throw new Error('Kengaytirilgan qidiruvda xatolik');
    }
  }

  // Rebuild search index
  async rebuildIndex() {
    try {
      console.log('Rebuilding search index...');
      this.searchIndex.clear();
      await this.initializeSearchIndex();
      console.log('Search index rebuilt successfully');
      
      return {
        success: true,
        message: 'Qidiruv indeksi qayta yaratildi'
      };
    } catch (error) {
      console.error('Index rebuild error:', error);
      throw new Error('Indeks qayta yaratishda xatolik');
    }
  }

  // Get search statistics
  async getSearchStats() {
    try {
      const stats = {
        totalIndexedProducts: 0,
        totalIndexedCategories: 0,
        totalSearchTerms: this.searchIndex.size,
        indexSize: JSON.stringify(this.searchIndex).length,
        lastRebuild: new Date().toISOString()
      };

      // Count indexed items
      for (const [token, entry] of this.searchIndex.entries()) {
        stats.totalIndexedProducts += entry.products.length;
        stats.totalIndexedCategories += entry.categories.length;
      }

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Search stats error:', error);
      throw new Error('Qidiruv statistikasini olishda xatolik');
    }
  }
}

module.exports = SearchService; 