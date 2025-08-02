const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const EmailService = require('./EmailService');

class AuthService {
  constructor() {
    this.emailService = new EmailService();
    this.refreshTokens = new Map();
  }

  // Register new user
  async register(userData) {
    try {
      const { email, password, first_name, last_name, phone, role = 'customer' } = userData;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new Error('Bu email allaqachon ro\'yxatdan o\'tgan');
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phone,
        role,
        email_verified: false,
        phone_verified: false,
        status: 'active'
      });

      // Send welcome email
      await this.emailService.sendWelcomeEmail(user);

      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokens(user);

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            email_verified: user.email_verified,
            phone_verified: user.phone_verified
          },
          accessToken,
          refreshToken
        },
        message: 'Foydalanuvchi muvaffaqiyatli ro\'yxatdan o\'tdi'
      };
    } catch (error) {
      throw new Error(`Ro\'yxatdan o\'tishda xatolik: ${error.message}`);
    }
  }

  // Login user
  async login(credentials) {
    try {
      const { email, password } = credentials;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('Noto\'g\'ri email yoki parol');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Noto\'g\'ri email yoki parol');
      }

      // Check if user is active
      if (user.status !== 'active') {
        throw new Error('Hisobingiz faol emas');
      }

      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokens(user);

      // Update last login
      await User.update(user.id, { last_login: new Date() });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            email_verified: user.email_verified,
            phone_verified: user.phone_verified
          },
          accessToken,
          refreshToken
        },
        message: 'Tizimga muvaffaqiyatli kirdingiz'
      };
    } catch (error) {
      throw new Error(`Kirishda xatolik: ${error.message}`);
    }
  }

  // OAuth 2.0 login
  async oauthLogin(provider, profile) {
    try {
      let user = await User.findByEmail(profile.email);

      if (!user) {
        // Create new user from OAuth profile
        user = await User.create({
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          oauth_provider: provider,
          oauth_id: profile.id,
          email_verified: true,
          status: 'active'
        });
      } else {
        // Update existing user's OAuth info
        await User.update(user.id, {
          oauth_provider: provider,
          oauth_id: profile.id,
          last_login: new Date()
        });
      }

      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokens(user);

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            email_verified: user.email_verified,
            phone_verified: user.phone_verified
          },
          accessToken,
          refreshToken
        },
        message: 'OAuth orqali muvaffaqiyatli kirdingiz'
      };
    } catch (error) {
      throw new Error(`OAuth kirishda xatolik: ${error.message}`);
    }
  }

  // Generate JWT tokens
  async generateTokens(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m'
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d'
    });

    // Store refresh token
    this.refreshTokens.set(refreshToken, {
      userId: user.id,
      createdAt: new Date()
    });

    return { accessToken, refreshToken };
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Check if refresh token exists in storage
      const storedToken = this.refreshTokens.get(refreshToken);
      if (!storedToken) {
        throw new Error('Noto\'g\'ri refresh token');
      }

      // Get user
      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error('Foydalanuvchi topilmadi');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      // Remove old refresh token
      this.refreshTokens.delete(refreshToken);

      return {
        success: true,
        data: tokens,
        message: 'Token yangilandi'
      };
    } catch (error) {
      throw new Error(`Token yangilashda xatolik: ${error.message}`);
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== 'email_verification') {
        throw new Error('Noto\'g\'ri token turi');
      }

      await User.update(decoded.userId, { email_verified: true });

      return {
        success: true,
        message: 'Email tasdiqlandi'
      };
    } catch (error) {
      throw new Error(`Email tasdiqlashda xatolik: ${error.message}`);
    }
  }

  // Send email verification
  async sendEmailVerification(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Foydalanuvchi topilmadi');
      }

      if (user.email_verified) {
        throw new Error('Email allaqachon tasdiqlangan');
      }

      const token = jwt.sign(
        { userId: user.id, type: 'email_verification' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
      
      await this.emailService.sendEmail(
        user.email,
        'Email tasdiqlash',
        `Emailingizni tasdiqlash uchun quyidagi havolani bosing: ${verificationUrl}`
      );

      return {
        success: true,
        message: 'Tasdiqlash xabari yuborildi'
      };
    } catch (error) {
      throw new Error(`Email yuborishda xatolik: ${error.message}`);
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        throw new Error('Bu email bilan foydalanuvchi topilmadi');
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      await User.update(user.id, {
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry
      });

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      await this.emailService.sendPasswordReset(user, resetToken);

      return {
        success: true,
        message: 'Parol tiklash xabari yuborildi'
      };
    } catch (error) {
      throw new Error(`Parol tiklashda xatolik: ${error.message}`);
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const user = await User.findByResetToken(token);
      if (!user) {
        throw new Error('Noto\'g\'ri yoki muddati o\'tgan token');
      }

      if (user.reset_token_expiry < new Date()) {
        throw new Error('Token muddati o\'tgan');
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password and clear reset token
      await User.update(user.id, {
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null
      });

      return {
        success: true,
        message: 'Parol muvaffaqiyatli o\'zgartirildi'
      };
    } catch (error) {
      throw new Error(`Parol o\'zgartirishda xatolik: ${error.message}`);
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Foydalanuvchi topilmadi');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Joriy parol noto\'g\'ri');
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await User.update(user.id, { password: hashedPassword });

      return {
        success: true,
        message: 'Parol muvaffaqiyatli o\'zgartirildi'
      };
    } catch (error) {
      throw new Error(`Parol o\'zgartirishda xatolik: ${error.message}`);
    }
  }

  // Logout
  async logout(refreshToken) {
    try {
      // Remove refresh token from storage
      this.refreshTokens.delete(refreshToken);

      return {
        success: true,
        message: 'Tizimdan chiqdingiz'
      };
    } catch (error) {
      throw new Error(`Chiqishda xatolik: ${error.message}`);
    }
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Noto\'g\'ri token');
    }
  }

  // Get user profile
  async getProfile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('Foydalanuvchi topilmadi');
      }

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          role: user.role,
          email_verified: user.email_verified,
          phone_verified: user.phone_verified,
          status: user.status,
          created_at: user.created_at,
          last_login: user.last_login
        }
      };
    } catch (error) {
      throw new Error(`Profil olishda xatolik: ${error.message}`);
    }
  }

  // Update profile
  async updateProfile(userId, updateData) {
    try {
      const allowedFields = ['first_name', 'last_name', 'phone'];
      const filteredData = {};

      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });

      await User.update(userId, filteredData);

      return {
        success: true,
        message: 'Profil yangilandi'
      };
    } catch (error) {
      throw new Error(`Profil yangilashda xatolik: ${error.message}`);
    }
  }

  // Clean up expired refresh tokens
  cleanupExpiredTokens() {
    const now = new Date();
    for (const [token, data] of this.refreshTokens.entries()) {
      if (now - data.createdAt > 7 * 24 * 60 * 60 * 1000) { // 7 days
        this.refreshTokens.delete(token);
      }
    }
  }
}

module.exports = AuthService; 