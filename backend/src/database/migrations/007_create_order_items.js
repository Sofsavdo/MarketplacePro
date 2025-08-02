exports.up = function(knex) {
  return knex.schema.createTable('order_items', function(table) {
    table.increments('id').primary();
    table.integer('order_id').references('id').inTable('orders').onDelete('CASCADE');
    table.integer('product_id').references('id').inTable('products');
    table.string('product_name').notNullable();
    table.string('product_sku').notNullable();
    table.integer('quantity').notNullable();
    table.decimal('unit_price', 12, 2).notNullable();
    table.decimal('total_price', 12, 2).notNullable();
    table.jsonb('product_data').nullable();
    table.timestamps(true, true);
    
    table.index(['order_id']);
    table.index(['product_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('order_items');
}; 