exports.up = function(knex) {
  return knex.schema.createTable('reviews', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('order_id').references('id').inTable('orders').onDelete('SET NULL');
    table.uuid('merchant_id').references('id').inTable('merchants').onDelete('CASCADE');
    
    // Review content
    table.text('title');
    table.text('content').notNullable();
    table.integer('rating').notNullable(); // 1-5 stars
    table.jsonb('rating_breakdown'); // Quality, Value, Service, etc.
    
    // Media
    table.jsonb('images').defaultTo('[]');
    table.jsonb('videos').defaultTo('[]');
    
    // Verification
    table.boolean('verified_purchase').defaultTo(false);
    table.boolean('is_verified').defaultTo(false);
    table.boolean('is_helpful').defaultTo(false);
    table.integer('helpful_count').defaultTo(0);
    table.integer('not_helpful_count').defaultTo(0);
    
    // Status
    table.enum('status', ['pending', 'approved', 'rejected', 'spam']).defaultTo('pending');
    table.text('rejection_reason');
    table.uuid('moderated_by').references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('moderated_at');
    
    // Merchant response
    table.text('merchant_response');
    table.timestamp('merchant_responded_at');
    
    // Analytics
    table.integer('views').defaultTo(0);
    table.integer('likes').defaultTo(0);
    table.integer('reports').defaultTo(0);
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
    
    // Indexes
    table.index(['product_id']);
    table.index(['user_id']);
    table.index(['order_id']);
    table.index(['merchant_id']);
    table.index(['rating']);
    table.index(['status']);
    table.index(['verified_purchase']);
    table.index(['created_at']);
    table.index(['deleted_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('reviews');
}; 