exports.up = function(knex) {
  return knex.schema.createTable('bloggers', function(table) {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('username').unique().notNullable();
    table.text('bio').nullable();
    table.string('avatar').nullable();
    table.jsonb('social_links').nullable();
    table.jsonb('demographics').nullable();
    table.enum('tier', ['beginner', 'rising', 'super', 'elite']).defaultTo('beginner');
    table.integer('total_followers').defaultTo(0);
    table.decimal('conversion_rate', 5, 2).defaultTo(0.00);
    table.decimal('total_earnings', 12, 2).defaultTo(0.00);
    table.enum('status', ['active', 'pending', 'suspended']).defaultTo('pending');
    table.timestamp('approved_at').nullable();
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['username']);
    table.index(['tier']);
    table.index(['status']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('bloggers');
}; 