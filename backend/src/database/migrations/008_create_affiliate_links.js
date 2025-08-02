exports.up = function(knex) {
  return knex.schema.createTable('affiliate_links', function(table) {
    table.increments('id').primary();
    table.integer('blogger_id').references('id').inTable('bloggers').onDelete('CASCADE');
    table.integer('product_id').references('id').inTable('products');
    table.string('unique_code').unique().notNullable();
    table.string('short_url').nullable();
    table.string('utm_source').defaultTo('affiliate');
    table.string('utm_medium').defaultTo('blogger');
    table.string('utm_campaign').nullable();
    table.integer('click_count').defaultTo(0);
    table.integer('conversion_count').defaultTo(0);
    table.decimal('total_earnings', 12, 2).defaultTo(0.00);
    table.boolean('is_active').defaultTo(true);
    table.timestamp('expires_at').nullable();
    table.timestamps(true, true);
    
    table.index(['blogger_id']);
    table.index(['product_id']);
    table.index(['unique_code']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('affiliate_links');
}; 