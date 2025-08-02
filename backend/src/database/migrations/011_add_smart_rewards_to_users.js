exports.up = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    // Smart Rewards fields
    table.integer('smart_rewards_points').defaultTo(0);
    table.integer('total_points_earned').defaultTo(0);
    table.integer('login_streak').defaultTo(0);
    table.timestamp('last_daily_login');
    
    // Indexes for smart rewards
    table.index(['smart_rewards_points']);
    table.index(['login_streak']);
    table.index(['last_daily_login']);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.dropColumn('smart_rewards_points');
    table.dropColumn('total_points_earned');
    table.dropColumn('login_streak');
    table.dropColumn('last_daily_login');
  });
}; 