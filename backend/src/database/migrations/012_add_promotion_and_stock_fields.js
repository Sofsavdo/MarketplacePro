exports.up = function(knex) {
  return knex.schema.table('products', function(table) {
    // Promotion fields
    table.boolean('is_promoted').defaultTo(false);
    table.integer('promotion_priority').defaultTo(0);
    table.timestamp('promotion_start_date').nullable();
    table.timestamp('promotion_end_date').nullable();
    table.decimal('promotion_price', 10, 2).nullable();
    
    // Stock management
    table.integer('stock_quantity').defaultTo(0);
    table.integer('min_stock_alert').defaultTo(5);
    table.boolean('auto_disable_on_stockout').defaultTo(true);
    
    // SEO and marketing
    table.string('meta_title').nullable();
    table.text('meta_description').nullable();
    table.string('meta_keywords').nullable();
    
    // Product status
    table.enum('status', ['active', 'inactive', 'draft', 'archived']).defaultTo('draft');
    table.enum('approval_status', ['pending', 'approved', 'rejected']).defaultTo('pending');
    
    // Performance tracking
    table.integer('view_count').defaultTo(0);
    table.integer('sold_count').defaultTo(0);
    table.decimal('rating', 3, 2).defaultTo(0);
    table.integer('review_count').defaultTo(0);
    
    // Indexes for better performance
    table.index(['status', 'approval_status']);
    table.index(['is_promoted', 'promotion_priority']);
    table.index(['stock_quantity']);
    table.index(['category_id', 'status']);
  });
};

exports.down = function(knex) {
  return knex.schema.table('products', function(table) {
    table.dropColumn('is_promoted');
    table.dropColumn('promotion_priority');
    table.dropColumn('promotion_start_date');
    table.dropColumn('promotion_end_date');
    table.dropColumn('promotion_price');
    table.dropColumn('stock_quantity');
    table.dropColumn('min_stock_alert');
    table.dropColumn('auto_disable_on_stockout');
    table.dropColumn('meta_title');
    table.dropColumn('meta_description');
    table.dropColumn('meta_keywords');
    table.dropColumn('status');
    table.dropColumn('approval_status');
    table.dropColumn('view_count');
    table.dropColumn('sold_count');
    table.dropColumn('rating');
    table.dropColumn('review_count');
  });
}; 