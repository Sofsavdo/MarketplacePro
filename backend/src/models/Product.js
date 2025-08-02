const db = require('../config/database');

class Product {
  static async create(productData) {
    const [product] = await db('products').insert(productData).returning('*');
    return product;
  }
  
  static async findById(id) {
    const product = await db('products')
      .select('products.*', 'merchants.business_name as merchant_name', 'categories.name as category_name')
      .leftJoin('merchants', 'products.merchant_id', 'merchants.id')
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .where('products.id', id)
      .first();
    
    return product;
  }
  
  static async findBySlug(slug) {
    const product = await db('products')
      .select('products.*', 'merchants.business_name as merchant_name', 'categories.name as category_name')
      .leftJoin('merchants', 'products.merchant_id', 'merchants.id')
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .where('products.slug', slug)
      .first();
    
    return product;
  }
  
  static async update(id, updateData) {
    const [product] = await db('products')
      .where({ id })
      .update(updateData)
      .returning('*');
    
    return product;
  }
  
  static async delete(id) {
    return await db('products').where({ id }).del();
  }
  
  static async list(filters = {}, page = 1, limit = 10) {
    let query = db('products')
      .select('products.*', 'merchants.business_name as merchant_name', 'categories.name as category_name')
      .leftJoin('merchants', 'products.merchant_id', 'merchants.id')
      .leftJoin('categories', 'products.category_id', 'categories.id');
    
    if (filters.merchant_id) {
      query = query.where('products.merchant_id', filters.merchant_id);
    }
    
    if (filters.category_id) {
      query = query.where('products.category_id', filters.category_id);
    }
    
    if (filters.status) {
      query = query.where('products.status', filters.status);
    }
    
    if (filters.approval_status) {
      query = query.where('products.approval_status', filters.approval_status);
    }
    
    if (filters.min_price) {
      query = query.where('products.price', '>=', filters.min_price);
    }
    
    if (filters.max_price) {
      query = query.where('products.price', '<=', filters.max_price);
    }
    
    if (filters.search) {
      query = query.where(function() {
        this.where('products.name', 'ilike', `%${filters.search}%`)
          .orWhere('products.description', 'ilike', `%${filters.search}%`)
          .orWhere('products.sku', 'ilike', `%${filters.search}%`);
      });
    }
    
    const offset = (page - 1) * limit;
    
    const products = await query
      .offset(offset)
      .limit(limit)
      .orderBy('products.created_at', 'desc');
    
    const total = await query.clone().count('products.id as count').first();
    
    return {
      products,
      pagination: {
        page,
        limit,
        total: parseInt(total.count),
        pages: Math.ceil(total.count / limit)
      }
    };
  }
  
  static async updateViewCount(id) {
    return await db('products')
      .where({ id })
      .increment('view_count', 1);
  }
  
  static async updateSoldCount(id, quantity) {
    return await db('products')
      .where({ id })
      .increment('sold_count', quantity);
  }
  
  static async getTopSellers(limit = 10) {
    return await db('products')
      .select('*')
      .where('status', 'active')
      .where('approval_status', 'approved')
      .orderBy('sold_count', 'desc')
      .limit(limit);
  }
  
  static async getTrending(limit = 10) {
    return await db('products')
      .select('*')
      .where('status', 'active')
      .where('approval_status', 'approved')
      .orderBy('view_count', 'desc')
      .limit(limit);
  }

  // Marketplace uchun faqat approved va active mahsulotlarni qaytarish
  static async getMarketplaceProducts(filters = {}, page = 1, limit = 20) {
    let query = db('products')
      .select(
        'products.*',
        'merchants.business_name as merchant_name',
        'merchants.location as merchant_location',
        'categories.name as category_name'
      )
      .leftJoin('merchants', 'products.merchant_id', 'merchants.id')
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .where('products.status', 'active')
      .where('products.approval_status', 'approved')
      .where('products.stock_quantity', '>', 0); // Faqat stock bor mahsulotlar

    if (filters.category_id) {
      query = query.where('products.category_id', filters.category_id);
    }

    if (filters.min_price) {
      query = query.where('products.price', '>=', filters.min_price);
    }

    if (filters.max_price) {
      query = query.where('products.price', '<=', filters.max_price);
    }

    if (filters.search) {
      query = query.where(function() {
        this.where('products.name', 'ilike', `%${filters.search}%`)
          .orWhere('products.description', 'ilike', `%${filters.search}%`)
          .orWhere('merchants.business_name', 'ilike', `%${filters.search}%`);
      });
    }

    if (filters.sort_by) {
      switch (filters.sort_by) {
        case 'price_low':
          query = query.orderBy('products.price', 'asc');
          break;
        case 'price_high':
          query = query.orderBy('products.price', 'desc');
          break;
        case 'popular':
          query = query.orderBy('products.sold_count', 'desc');
          break;
        case 'newest':
          query = query.orderBy('products.created_at', 'desc');
          break;
        case 'rating':
          query = query.orderBy('products.rating', 'desc');
          break;
        default:
          query = query.orderBy('products.created_at', 'desc');
      }
    } else {
      query = query.orderBy('products.created_at', 'desc');
    }

    const offset = (page - 1) * limit;
    
    const products = await query
      .offset(offset)
      .limit(limit);

    const total = await query.clone().count('products.id as count').first();

    return {
      products,
      pagination: {
        page,
        limit,
        total: parseInt(total.count),
        pages: Math.ceil(total.count / limit)
      }
    };
  }

  // Stock boshqaruvi
  static async updateStock(id, quantity) {
    const product = await this.findById(id);
    if (!product) {
      throw new Error('Mahsulot topilmadi');
    }

    const newStock = product.stock_quantity - quantity;
    if (newStock < 0) {
      throw new Error('Yetarli stock yo\'q');
    }

    const updateData = {
      stock_quantity: newStock,
      status: newStock === 0 ? 'inactive' : 'active'
    };

    return await this.update(id, updateData);
  }

  // Reklama va banner mahsulotlari
  static async getPromotedProducts(limit = 10) {
    return await db('products')
      .select(
        'products.*',
        'merchants.business_name as merchant_name',
        'categories.name as category_name'
      )
      .leftJoin('merchants', 'products.merchant_id', 'merchants.id')
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .where('products.status', 'active')
      .where('products.approval_status', 'approved')
      .where('products.stock_quantity', '>', 0)
      .where('products.is_promoted', true)
      .orderBy('products.promotion_priority', 'desc')
      .limit(limit);
  }

  // Top mahsulotlar (bestsellers)
  static async getBestSellers(limit = 10) {
    return await db('products')
      .select(
        'products.*',
        'merchants.business_name as merchant_name',
        'categories.name as category_name'
      )
      .leftJoin('merchants', 'products.merchant_id', 'merchants.id')
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .where('products.status', 'active')
      .where('products.approval_status', 'approved')
      .where('products.stock_quantity', '>', 0)
      .orderBy('products.sold_count', 'desc')
      .limit(limit);
  }

  // Yangi mahsulotlar
  static async getNewProducts(limit = 10) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await db('products')
      .select(
        'products.*',
        'merchants.business_name as merchant_name',
        'categories.name as category_name'
      )
      .leftJoin('merchants', 'products.merchant_id', 'merchants.id')
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .where('products.status', 'active')
      .where('products.approval_status', 'approved')
      .where('products.stock_quantity', '>', 0)
      .where('products.created_at', '>=', thirtyDaysAgo)
      .orderBy('products.created_at', 'desc')
      .limit(limit);
  }

  // Chegirmali mahsulotlar
  static async getDiscountedProducts(limit = 10) {
    return await db('products')
      .select(
        'products.*',
        'merchants.business_name as merchant_name',
        'categories.name as category_name'
      )
      .leftJoin('merchants', 'products.merchant_id', 'merchants.id')
      .leftJoin('categories', 'products.category_id', 'categories.id')
      .where('products.status', 'active')
      .where('products.approval_status', 'approved')
      .where('products.stock_quantity', '>', 0)
      .where('products.discount_percentage', '>', 0)
      .orderBy('products.discount_percentage', 'desc')
      .limit(limit);
  }
}

module.exports = Product; 