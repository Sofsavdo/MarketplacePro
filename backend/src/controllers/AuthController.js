const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const logger = require('../utils/logger');

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, name, role = 'customer' } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Foydalanuvchi allaqachon mavjud'
        });
      }
      
      // Create new user
      const user = await User.create({
        email,
        password,
        name,
        role
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      
      // Remove password from response
      const { password_hash, ...userWithoutPassword } = user;
      
      logger.info(`New user registered: ${email}`);
      
      res.status(201).json({
        success: true,
        message: 'Foydalanuvchi muvaffaqiyatli ro\'yxatdan o\'tdi',
        data: {
          user: userWithoutPassword,
          token
        }
      });
      
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Ro\'yxatdan o\'tishda xatolik yuz berdi'
      });
    }
  }
  
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Noto\'g\'ri email yoki parol'
        });
      }
      
      // Check password
      const isValidPassword = await User.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: 'Noto\'g\'ri email yoki parol'
        });
      }
      
      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Hisob faol emas'
        });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role 
        },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );
      
      // Update last login
      await User.updateLastLogin(user.id);
      
      // Remove password from response
      const { password_hash, ...userWithoutPassword } = user;
      
      logger.info(`User logged in: ${email}`);
      
      res.json({
        success: true,
        message: 'Muvaffaqiyatli kirildi',
        data: {
          user: userWithoutPassword,
          token
        }
      });
      
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Kirishda xatolik yuz berdi'
      });
    }
  }
  
  static async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token taqdim etilmagan'
        });
      }
      
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Noto\'g\'ri token'
        });
      }
      
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Hisob faol emas'
        });
      }
      
      // Remove password from response
      const { password_hash, ...userWithoutPassword } = user;
      
      res.json({
        success: true,
        data: {
          user: userWithoutPassword
        }
      });
      
    } catch (error) {
      logger.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        message: 'Noto\'g\'ri token'
      });
    }
  }
  
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Foydalanuvchi topilmadi'
        });
      }
      
      // Verify current password
      const isValidPassword = await User.verifyPassword(currentPassword, user.password_hash);
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          message: 'Joriy parol noto\'g\'ri'
        });
      }
      
      // Update password
      const bcrypt = require('bcryptjs');
      const newPasswordHash = await bcrypt.hash(newPassword, 10);
      
      await User.update(userId, {
        password_hash: newPasswordHash
      });
      
      logger.info(`Password changed for user: ${user.email}`);
      
      res.json({
        success: true,
        message: 'Parol muvaffaqiyatli o\'zgartirildi'
      });
      
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Parol o\'zgartirishda xatolik yuz berdi'
      });
    }
  }
}

module.exports = AuthController; 