exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('name').notNullable();
    table.enum('role', ['admin', 'merchant', 'blogger', 'customer']).defaultTo('customer');
    table.enum('status', ['active', 'pending', 'suspended']).defaultTo('pending');
    table.string('phone').nullable();
    table.string('avatar').nullable();
    table.jsonb('profile_data').nullable();
    table.timestamp('email_verified_at').nullable();
    table.timestamp('last_login_at').nullable();
    table.timestamps(true, true);
    
    table.index(['email']);
    table.index(['role']);
    table.index(['status']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
}; 