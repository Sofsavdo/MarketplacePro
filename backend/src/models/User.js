const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { email, password, name, role = 'customer' } = userData;
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const [user] = await db('users').insert({
      email,
      password_hash: passwordHash,
      name,
      role,
      status: 'active'
    }).returning('*');
    
    return user;
  }
  
  static async findByEmail(email) {
    const user = await db('users').where({ email }).first();
    return user;
  }
  
  static async findById(id) {
    const user = await db('users').where({ id }).first();
    return user;
  }
  
  static async update(id, updateData) {
    const [user] = await db('users')
      .where({ id })
      .update(updateData)
      .returning('*');
    
    return user;
  }
  
  static async delete(id) {
    return await db('users').where({ id }).del();
  }
  
  static async list(filters = {}, page = 1, limit = 10) {
    let query = db('users');
    
    if (filters.role) {
      query = query.where({ role: filters.role });
    }
    
    if (filters.status) {
      query = query.where({ status: filters.status });
    }
    
    if (filters.search) {
      query = query.where(function() {
        this.where('name', 'ilike', `%${filters.search}%`)
          .orWhere('email', 'ilike', `%${filters.search}%`);
      });
    }
    
    const offset = (page - 1) * limit;
    
    const users = await query
      .select('id', 'email', 'name', 'role', 'status', 'created_at')
      .offset(offset)
      .limit(limit)
      .orderBy('created_at', 'desc');
    
    const total = await query.clone().count('* as count').first();
    
    return {
      users,
      pagination: {
        page,
        limit,
        total: parseInt(total.count),
        pages: Math.ceil(total.count / limit)
      }
    };
  }
  
  static async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
  
  static async updateLastLogin(id) {
    return await db('users')
      .where({ id })
      .update({ last_login_at: new Date() });
  }
}

module.exports = User; 