exports.up = function(knex) {
  return knex.schema.createTable('blogger_earnings', function(table) {
    table.increments('id').primary();
    table.integer('blogger_id').references('id').inTable('bloggers').onDelete('CASCADE');
    table.integer('order_id').references('id').inTable('orders').nullable();
    table.integer('affiliate_link_id').references('id').inTable('affiliate_links').nullable();
    table.decimal('amount', 12, 2).notNullable();
    table.decimal('commission_rate', 5, 2).notNullable();
    table.string('currency').defaultTo('UZS');
    table.enum('status', ['pending', 'approved', 'paid', 'cancelled']).defaultTo('pending');
    table.enum('type', ['commission', 'bonus', 'referral', 'campaign']).defaultTo('commission');
    table.text('description').nullable();
    table.timestamp('paid_at').nullable();
    table.timestamps(true, true);
    
    table.index(['blogger_id']);
    table.index(['order_id']);
    table.index(['affiliate_link_id']);
    table.index(['status']);
    table.index(['type']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('blogger_earnings');
}; 