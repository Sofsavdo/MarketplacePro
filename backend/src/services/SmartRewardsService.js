const User = require('../models/User');
const Order = require('../models/Order');
const logger = require('../utils/logger');

class SmartRewardsService {
  // Daily login reward points
  static DAILY_LOGIN_POINTS = 10;
  
  // Streak multipliers
  static STREAK_MULTIPLIERS = {
    3: 1.2,   // 3 days = 20% bonus
    7: 1.5,   // 7 days = 50% bonus
    14: 2.0,  // 14 days = 100% bonus
    30: 3.0   // 30 days = 200% bonus
  };
  
  // Purchase points rate (1% of purchase value)
  static PURCHASE_POINTS_RATE = 0.01;
  
  // Point redemption rate (100 points = 1% discount)
  static POINTS_TO_DISCOUNT_RATE = 100;
  
  // Maximum discount percentage
  static MAX_DISCOUNT_PERCENTAGE = 20;

  /**
   * Process daily login and award points
   */
  static async processDailyLogin(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const today = new Date().toDateString();
      const lastLogin = user.last_daily_login ? new Date(user.last_daily_login).toDateString() : null;

      // Check if already logged in today
      if (lastLogin === today) {
        return {
          success: false,
          message: 'Already claimed today\'s reward',
          points: user.smart_rewards_points || 0,
          streak: user.login_streak || 0
        };
      }

      // Calculate streak
      let newStreak = 1;
      if (lastLogin) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastLogin === yesterdayStr) {
          newStreak = (user.login_streak || 0) + 1;
        }
      }

      // Calculate points with streak multiplier
      const basePoints = this.DAILY_LOGIN_POINTS;
      const multiplier = this.getStreakMultiplier(newStreak);
      const awardedPoints = Math.floor(basePoints * multiplier);

      // Update user
      await User.updateById(userId, {
        smart_rewards_points: (user.smart_rewards_points || 0) + awardedPoints,
        login_streak: newStreak,
        last_daily_login: new Date(),
        total_points_earned: (user.total_points_earned || 0) + awardedPoints
      });

      // Log the transaction
      await this.logPointsTransaction(userId, awardedPoints, null, 'daily_login', 'earned');

      return {
        success: true,
        message: `Daily login reward claimed! +${awardedPoints} points`,
        points: (user.smart_rewards_points || 0) + awardedPoints,
        streak: newStreak,
        multiplier: multiplier,
        basePoints: basePoints,
        awardedPoints: awardedPoints
      };

    } catch (error) {
      logger.error('Error processing daily login:', error);
      throw error;
    }
  }

  /**
   * Award points for purchase
   */
  static async awardPurchasePoints(userId, orderId, orderAmount) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Calculate points based on purchase amount
      const basePoints = Math.floor(orderAmount * this.PURCHASE_POINTS_RATE);
      
      // Apply streak multiplier if user has active streak
      const multiplier = this.getStreakMultiplier(user.login_streak || 0);
      const awardedPoints = Math.floor(basePoints * multiplier);

      // Update user points
      await User.updateById(userId, {
        smart_rewards_points: (user.smart_rewards_points || 0) + awardedPoints,
        total_points_earned: (user.total_points_earned || 0) + awardedPoints
      });

      // Log the transaction
      await this.logPointsTransaction(userId, awardedPoints, orderId, 'purchase', 'earned');

      return {
        success: true,
        points: awardedPoints,
        multiplier: multiplier,
        basePoints: basePoints
      };

    } catch (error) {
      logger.error('Error awarding purchase points:', error);
      throw error;
    }
  }

  /**
   * Calculate discount from points
   */
  static calculateDiscountFromPoints(points, orderAmount) {
    const maxDiscountAmount = orderAmount * (this.MAX_DISCOUNT_PERCENTAGE / 100);
    const discountPercentage = Math.min(points / this.POINTS_TO_DISCOUNT_RATE, this.MAX_DISCOUNT_PERCENTAGE);
    const discountAmount = Math.min(orderAmount * (discountPercentage / 100), maxDiscountAmount);
    
    return {
      discountPercentage: discountPercentage,
      discountAmount: discountAmount,
      pointsUsed: Math.floor(discountPercentage * this.POINTS_TO_DISCOUNT_RATE)
    };
  }

  /**
   * Redeem points for discount
   */
  static async redeemPointsForDiscount(userId, orderId, pointsToRedeem, orderAmount) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const availablePoints = user.smart_rewards_points || 0;
      if (availablePoints < pointsToRedeem) {
        throw new Error('Insufficient points');
      }

      // Calculate discount
      const discountInfo = this.calculateDiscountFromPoints(pointsToRedeem, orderAmount);
      
      if (discountInfo.pointsUsed > availablePoints) {
        throw new Error('Not enough points for this discount');
      }

      // Update user points
      await User.updateById(userId, {
        smart_rewards_points: availablePoints - discountInfo.pointsUsed
      });

      // Log the redemption
      await this.logPointsTransaction(userId, -discountInfo.pointsUsed, orderId, 'discount_redemption', 'spent');

      return {
        success: true,
        discountPercentage: discountInfo.discountPercentage,
        discountAmount: discountInfo.discountAmount,
        pointsUsed: discountInfo.pointsUsed,
        remainingPoints: availablePoints - discountInfo.pointsUsed
      };

    } catch (error) {
      logger.error('Error redeeming points for discount:', error);
      throw error;
    }
  }

  /**
   * Get user's smart rewards info
   */
  static async getUserSmartRewardsInfo(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const currentStreak = user.login_streak || 0;
      const nextStreakBonus = this.getNextStreakBonus(currentStreak);
      const canClaimToday = this.canClaimDailyReward(user.last_daily_login);

      return {
        points: user.smart_rewards_points || 0,
        totalEarned: user.total_points_earned || 0,
        streak: currentStreak,
        nextStreakBonus: nextStreakBonus,
        canClaimToday: canClaimToday,
        lastLogin: user.last_daily_login,
        multiplier: this.getStreakMultiplier(currentStreak)
      };

    } catch (error) {
      logger.error('Error getting user smart rewards info:', error);
      throw error;
    }
  }

  /**
   * Get available flash deals for user
   */
  static async getFlashDeals(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Generate flash deals based on user activity and streak
      const deals = [];
      const streak = user.login_streak || 0;

      // Basic flash deal for all users
      deals.push({
        id: 'flash_1',
        title: 'Flash Sale - 10% Off Electronics',
        description: 'Limited time offer on selected electronics',
        discount: 10,
        minPoints: 0,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        category: 'electronics'
      });

      // Streak-based deals
      if (streak >= 7) {
        deals.push({
          id: 'flash_2',
          title: 'Loyalty Bonus - 15% Off Fashion',
          description: 'Special offer for loyal customers',
          discount: 15,
          minPoints: 50,
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
          category: 'fashion'
        });
      }

      if (streak >= 14) {
        deals.push({
          id: 'flash_3',
          title: 'VIP Flash Deal - 20% Off Everything',
          description: 'Exclusive offer for VIP members',
          discount: 20,
          minPoints: 100,
          expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
          category: 'all'
        });
      }

      return deals;

    } catch (error) {
      logger.error('Error getting flash deals:', error);
      throw error;
    }
  }

  /**
   * Get streak multiplier
   */
  static getStreakMultiplier(streak) {
    for (const [days, multiplier] of Object.entries(this.STREAK_MULTIPLIERS).reverse()) {
      if (streak >= parseInt(days)) {
        return multiplier;
      }
    }
    return 1.0; // No bonus
  }

  /**
   * Get next streak bonus info
   */
  static getNextStreakBonus(currentStreak) {
    for (const [days, multiplier] of Object.entries(this.STREAK_MULTIPLIERS)) {
      if (currentStreak < parseInt(days)) {
        return {
          daysNeeded: parseInt(days) - currentStreak,
          multiplier: multiplier,
          bonusPercentage: Math.round((multiplier - 1) * 100)
        };
      }
    }
    return null; // Already at max streak
  }

  /**
   * Check if user can claim daily reward
   */
  static canClaimDailyReward(lastLogin) {
    if (!lastLogin) return true;
    
    const today = new Date().toDateString();
    const lastLoginDate = new Date(lastLogin).toDateString();
    
    return today !== lastLoginDate;
  }

  /**
   * Log points transaction
   */
  static async logPointsTransaction(userId, points, orderId, reason, type) {
    try {
      // This would typically go to a separate points_transactions table
      // For now, we'll just log it
      logger.info(`Points transaction: User ${userId}, Points: ${points}, Order: ${orderId}, Reason: ${reason}, Type: ${type}`);
    } catch (error) {
      logger.error('Error logging points transaction:', error);
    }
  }

  /**
   * Get smart rewards statistics
   */
  static async getSmartRewardsStats() {
    try {
      // Get basic stats
      const totalUsers = await User.count();
      const activeUsers = await User.count({ login_streak: { $gt: 0 } });
      const highStreakUsers = await User.count({ login_streak: { $gte: 7 } });

      return {
        totalUsers,
        activeUsers,
        highStreakUsers,
        averageStreak: await this.getAverageStreak(),
        totalPointsAwarded: await this.getTotalPointsAwarded()
      };

    } catch (error) {
      logger.error('Error getting smart rewards stats:', error);
      throw error;
    }
  }

  /**
   * Get average streak across all users
   */
  static async getAverageStreak() {
    try {
      const result = await User.query()
        .avg('login_streak as avg_streak')
        .first();
      
      return Math.round(result?.avg_streak || 0);
    } catch (error) {
      logger.error('Error getting average streak:', error);
      return 0;
    }
  }

  /**
   * Get total points awarded
   */
  static async getTotalPointsAwarded() {
    try {
      const result = await User.query()
        .sum('total_points_earned as total_points')
        .first();
      
      return result?.total_points || 0;
    } catch (error) {
      logger.error('Error getting total points awarded:', error);
      return 0;
    }
  }
}

module.exports = SmartRewardsService; 