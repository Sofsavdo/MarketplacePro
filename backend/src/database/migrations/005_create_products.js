exports.up = function(knex) {
  return knex.schema.createTable('products', function(table) {
    table.increments('id').primary();
    table.integer('merchant_id').references('id').inTable('merchants').onDelete('CASCADE');
    table.integer('category_id').references('id').inTable('categories');
    table.string('name').notNullable();
    table.string('slug').unique().notNullable();
    table.text('description').nullable();
    table.text('short_description').nullable();
    table.string('sku').unique().notNullable();
    table.string('barcode').nullable();
    table.decimal('price', 12, 2).notNullable();
    table.decimal('original_price', 12, 2).nullable();
    table.decimal('cost_price', 12, 2).nullable();
    table.integer('stock_quantity').defaultTo(0);
    table.boolean('allow_backorders').defaultTo(false);
    table.jsonb('images').nullable();
    table.jsonb('specifications').nullable();
    table.jsonb('variations').nullable();
    table.decimal('weight', 8, 2).nullable();
    table.decimal('length', 8, 2).nullable();
    table.decimal('width', 8, 2).nullable();
    table.decimal('height', 8, 2).nullable();
    table.decimal('commission_rate', 5, 2).defaultTo(5.00);
    table.enum('status', ['active', 'draft', 'archived']).defaultTo('draft');
    table.enum('approval_status', ['pending', 'approved', 'rejected']).defaultTo('pending');
    table.jsonb('seo_data').nullable();
    table.integer('view_count').defaultTo(0);
    table.integer('sold_count').defaultTo(0);
    table.decimal('rating', 3, 2).defaultTo(0.00);
    table.integer('review_count').defaultTo(0);
    table.timestamps(true, true);
    
    table.index(['merchant_id']);
    table.index(['category_id']);
    table.index(['slug']);
    table.index(['sku']);
    table.index(['status']);
    table.index(['approval_status']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('products');
}; 