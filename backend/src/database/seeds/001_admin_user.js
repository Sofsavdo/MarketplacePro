const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Delete existing admin user
  await knex('users').where({ email: 'admin@affilimart.com' }).del();
  
  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  await knex('users').insert({
    email: 'admin@affilimart.com',
    password_hash: passwordHash,
    name: 'Admin User',
    role: 'admin',
    status: 'active',
    email_verified_at: new Date(),
    created_at: new Date(),
    updated_at: new Date()
  });
}; 