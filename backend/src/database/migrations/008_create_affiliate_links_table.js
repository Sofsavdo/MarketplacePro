exports.up = function(knex) {
  return knex.schema.createTable('affiliate_links', (table) => {
    // Primary key
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('blogger_id').references('id').inTable('bloggers').onDelete('CASCADE');
    table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.uuid('merchant_id').references('id').inTable('merchants').onDelete('CASCADE');
    
    // Link info
    table.string('affiliate_code').unique().notNullable();
    table.string('custom_url');
    table.string('short_url');
    table.string('qr_code_url');
    table.text('description');
    
    // Commission settings
    table.decimal('commission_rate', 5, 2).notNullable();
    table.decimal('commission_amount', 10, 2);
    table.enum('commission_type', ['percentage', 'fixed']).defaultTo('percentage');
    table.boolean('is_active').defaultTo(true);
    
    // Tracking
    table.integer('clicks').defaultTo(0);
    table.integer('unique_clicks').defaultTo(0);
    table.integer('conversions').defaultTo(0);
    table.decimal('conversion_rate', 5, 2).defaultTo(0);
    table.decimal('total_revenue', 15, 2).defaultTo(0);
    table.decimal('total_commission', 15, 2).defaultTo(0);
    table.decimal('paid_commission', 15, 2).defaultTo(0);
    
    // Campaign settings
    table.string('campaign_name');
    table.string('campaign_id');
    table.timestamp('campaign_start');
    table.timestamp('campaign_end');
    table.boolean('campaign_active').defaultTo(true);
    
    // Performance tracking
    table.jsonb('click_history'); // Array of click events
    table.jsonb('conversion_history'); // Array of conversion events
    table.jsonb('revenue_history'); // Array of revenue events
    
    // Settings
    table.jsonb('tracking_settings');
    table.jsonb('creative_materials'); // Banners, text, etc.
    table.jsonb('targeting_settings'); // Geographic, demographic targeting
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at');
    
    // Indexes
    table.index(['blogger_id']);
    table.index(['product_id']);
    table.index(['merchant_id']);
    table.index(['affiliate_code']);
    table.index(['custom_url']);
    table.index(['is_active']);
    table.index(['campaign_active']);
    table.index(['created_at']);
    table.index(['deleted_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('affiliate_links');
}; 