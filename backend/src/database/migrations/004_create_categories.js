exports.up = function(knex) {
  return knex.schema.createTable('categories', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('slug').unique().notNullable();
    table.text('description').nullable();
    table.string('image').nullable();
    table.string('icon').nullable();
    table.integer('parent_id').references('id').inTable('categories').nullable();
    table.integer('sort_order').defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.jsonb('seo_data').nullable();
    table.decimal('commission_rate', 5, 2).defaultTo(5.00);
    table.timestamps(true, true);
    
    table.index(['slug']);
    table.index(['parent_id']);
    table.index(['is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('categories');
}; 