exports.up = function(knex) {
  return knex.schema.createTable('merchants', function(table) {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('business_name').notNullable();
    table.text('description').nullable();
    table.string('logo').nullable();
    table.string('website').nullable();
    table.string('phone').nullable();
    table.string('address').nullable();
    table.string('city').nullable();
    table.string('country').nullable();
    table.string('postal_code').nullable();
    table.jsonb('business_info').nullable();
    table.jsonb('bank_details').nullable();
    table.decimal('commission_rate', 5, 2).defaultTo(5.00);
    table.enum('status', ['active', 'pending', 'suspended']).defaultTo('pending');
    table.timestamp('approved_at').nullable();
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['business_name']);
    table.index(['status']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('merchants');
}; 