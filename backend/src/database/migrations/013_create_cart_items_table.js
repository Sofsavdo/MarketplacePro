exports.up = function(knex) {
  return knex.schema.createTable('cart_items', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.integer('product_id').unsigned().notNullable();
    table.integer('quantity').unsigned().notNullable().defaultTo(1);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');

    // Indexes
    table.index(['user_id']);
    table.index(['product_id']);
    table.unique(['user_id', 'product_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cart_items');
}; 