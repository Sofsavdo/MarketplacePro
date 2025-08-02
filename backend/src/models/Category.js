const { Model } = require('objection');

class Category extends Model {
  static get tableName() {
    return 'categories';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'slug'],

      properties: {
        id: { type: 'integer' },
        parent_id: { type: ['integer', 'null'] },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        slug: { type: 'string', minLength: 1, maxLength: 255 },
        description: { type: 'string', maxLength: 1000 },
        image: { type: 'string', maxLength: 500 },
        icon: { type: 'string', maxLength: 100 },
        meta_title: { type: 'string', maxLength: 255 },
        meta_description: { type: 'string', maxLength: 500 },
        meta_keywords: { type: 'string', maxLength: 500 },
        commission_rate: { type: 'number', minimum: 0, maximum: 100 },
        commission_tiers: { type: 'object' },
        sort_order: { type: 'integer', minimum: 0 },
        status: { type: 'string', enum: ['active', 'inactive'] },
        is_featured: { type: 'boolean' },
        is_visible: { type: 'boolean' },
        total_products: { type: 'integer', minimum: 0 },
        total_orders: { type: 'integer', minimum: 0 },
        total_revenue: { type: 'number', minimum: 0 },
        average_rating: { type: 'number', minimum: 0, maximum: 5 },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' }
      }
    };
  }

  static get relationMappings() {
    const Product = require('./Product');

    return {
      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: 'categories.parent_id',
          to: 'categories.id'
        }
      },
      children: {
        relation: Model.HasManyRelation,
        modelClass: Category,
        join: {
          from: 'categories.id',
          to: 'categories.parent_id'
        }
      },
      products: {
        relation: Model.HasManyRelation,
        modelClass: Product,
        join: {
          from: 'categories.id',
          to: 'products.category_id'
        }
      }
    };
  }

  // Instance methods
  async getFullHierarchy() {
    const children = await this.$relatedQuery('children');
    const parent = await this.$relatedQuery('parent');
    
    return {
      ...this.toJSON(),
      parent: parent ? parent.toJSON() : null,
      children: children.map(child => child.toJSON())
    };
  }

  async getAllChildren() {
    const children = await this.$relatedQuery('children');
    const allChildren = [...children];
    
    for (const child of children) {
      const grandChildren = await child.getAllChildren();
      allChildren.push(...grandChildren);
    }
    
    return allChildren;
  }

  async getAncestors() {
    const ancestors = [];
    let current = await this.$relatedQuery('parent');
    
    while (current) {
      ancestors.unshift(current.toJSON());
      current = await current.$relatedQuery('parent');
    }
    
    return ancestors;
  }

  async updateStats() {
    const [productsCount, ordersCount, revenueResult, ratingResult] = await Promise.all([
      this.$relatedQuery('products').count('id as count'),
      this.$relatedQuery('products').sum('total_orders as total'),
      this.$relatedQuery('products').sum('total_revenue as total'),
      this.$relatedQuery('products').avg('average_rating as avg_rating')
    ]);

    this.total_products = parseInt(productsCount[0].count || 0);
    this.total_orders = parseInt(ordersCount[0].total || 0);
    this.total_revenue = parseFloat(revenueResult[0].total || 0);
    this.average_rating = parseFloat(ratingResult[0].avg_rating || 0);

    await this.$query().patch({
      total_products: this.total_products,
      total_orders: this.total_orders,
      total_revenue: this.total_revenue,
      average_rating: this.average_rating
    });

    return {
      total_products: this.total_products,
      total_orders: this.total_orders,
      total_revenue: this.total_revenue,
      average_rating: this.average_rating
    };
  }

  isActive() {
    return this.status === 'active';
  }

  isVisible() {
    return this.is_visible;
  }

  isFeatured() {
    return this.is_featured;
  }

  // Static methods
  static async findRootCategories() {
    return await this.query().whereNull('parent_id');
  }

  static async findBySlug(slug) {
    return await this.query().where('slug', slug).first();
  }

  static async findActive() {
    return await this.query().where('status', 'active');
  }

  static async findVisible() {
    return await this.query().where('is_visible', true);
  }

  static async findFeatured() {
    return await this.query().where('is_featured', true);
  }

  static async findByParent(parentId) {
    return await this.query().where('parent_id', parentId);
  }

  static async search(searchTerm) {
    return await this.query()
      .where(function() {
        this.where('name', 'ilike', `%${searchTerm}%`)
          .orWhere('description', 'ilike', `%${searchTerm}%`)
          .orWhere('meta_keywords', 'ilike', `%${searchTerm}%`);
      });
  }

  static async getHierarchy() {
    const rootCategories = await this.findRootCategories();
    const hierarchy = [];
    
    for (const root of rootCategories) {
      const fullHierarchy = await root.getFullHierarchy();
      hierarchy.push(fullHierarchy);
    }
    
    return hierarchy;
  }

  static async getTopCategories(limit = 10) {
    return await this.query()
      .orderBy('total_revenue', 'desc')
      .limit(limit);
  }

  static async getStats() {
    const stats = await this.query()
      .select(
        this.raw('COUNT(*) as total_categories'),
        this.raw('COUNT(CASE WHEN parent_id IS NULL THEN 1 END) as root_categories'),
        this.raw('COUNT(CASE WHEN status = \'active\' THEN 1 END) as active_categories'),
        this.raw('COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_categories'),
        this.raw('AVG(commission_rate) as avg_commission_rate'),
        this.raw('SUM(total_revenue) as total_platform_revenue'),
        this.raw('AVG(average_rating) as avg_category_rating')
      )
      .first();

    return stats;
  }

  static async getRevenueStats(days = 30) {
    const result = await this.query()
      .select(
        this.raw('DATE(created_at) as date'),
        this.raw('SUM(total_revenue) as daily_revenue'),
        this.raw('COUNT(*) as new_categories')
      )
      .where('created_at', '>=', this.raw(`NOW() - INTERVAL '${days} days'`))
      .groupBy('date')
      .orderBy('date');

    return result;
  }

  static async getCategoryTree() {
    const allCategories = await this.query().orderBy('sort_order', 'asc');
    const categoryMap = new Map();
    const rootCategories = [];
    
    // Create a map of all categories
    allCategories.forEach(category => {
      categoryMap.set(category.id, {
        ...category.toJSON(),
        children: []
      });
    });
    
    // Build the tree structure
    allCategories.forEach(category => {
      const categoryNode = categoryMap.get(category.id);
      
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryNode);
        }
      } else {
        rootCategories.push(categoryNode);
      }
    });
    
    return rootCategories;
  }
}

module.exports = Category; 