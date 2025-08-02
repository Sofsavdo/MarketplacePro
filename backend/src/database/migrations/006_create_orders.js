exports.up = function(knex) {
  return knex.schema.createTable('orders', function(table) {
    table.increments('id').primary();
    table.string('order_number').unique().notNullable();
    table.integer('customer_id').references('id').inTable('users');
    table.integer('merchant_id').references('id').inTable('merchants');
    table.integer('affiliate_id').references('id').inTable('bloggers').nullable();
    table.decimal('subtotal', 12, 2).notNullable();
    table.decimal('tax_amount', 12, 2).defaultTo(0.00);
    table.decimal('shipping_amount', 12, 2).defaultTo(0.00);
    table.decimal('discount_amount', 12, 2).defaultTo(0.00);
    table.decimal('total_amount', 12, 2).notNullable();
    table.decimal('commission_amount', 12, 2).defaultTo(0.00);
    table.string('currency').defaultTo('UZS');
    table.enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']).defaultTo('pending');
    table.enum('payment_status', ['pending', 'paid', 'failed', 'refunded']).defaultTo('pending');
    table.string('payment_method').nullable();
    table.string('payment_transaction_id').nullable();
    table.jsonb('shipping_address').nullable();
    table.jsonb('billing_address').nullable();
    table.string('tracking_number').nullable();
    table.text('notes').nullable();
    table.timestamp('paid_at').nullable();
    table.timestamp('shipped_at').nullable();
    table.timestamp('delivered_at').nullable();
    table.timestamps(true, true);
    
    table.index(['order_number']);
    table.index(['customer_id']);
    table.index(['merchant_id']);
    table.index(['affiliate_id']);
    table.index(['status']);
    table.index(['payment_status']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('orders');
}; 