const User = require('../models/User');
const Order = require('../models/Order');
const logger = require('../utils/logger');

class LoyaltyService {
  // Loyalty tiers
  static tiers = {
    BRONZE: {
      name: 'Bronze',
      minSpent: 0,
      pointsMultiplier: 1,
      benefits: ['Basic rewards', 'Email support']
    },
    SILVER: {
      name: 'Silver',
      minSpent: 1000000, // 1M UZS
      pointsMultiplier: 1.2,
      benefits: ['Enhanced rewards', 'Priority support', 'Free shipping']
    },
    GOLD: {
      name: 'Gold',
      minSpent: 5000000, // 5M UZS
      pointsMultiplier: 1.5,
      benefits: ['Premium rewards', 'VIP support', 'Free shipping', 'Exclusive offers']
    },
    PLATINUM: {
      name: 'Platinum',
      minSpent: 20000000, // 20M UZS
      pointsMultiplier: 2,
      benefits: ['Elite rewards', 'Dedicated support', 'Free shipping', 'Exclusive offers', 'Early access']
    }
  };

  // Calculate points for order
  static calculatePoints(orderAmount, tier = 'BRONZE') {
    const tierConfig = this.tiers[tier];
    const basePoints = Math.floor(orderAmount / 1000); // 1 point per 1000 UZS
    return Math.floor(basePoints * tierConfig.pointsMultiplier);
  }

  // Add points to user
  static async addPoints(userId, points, orderId = null, reason = 'purchase') {
    try {
      const user = await User.query().findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const currentPoints = user.loyalty_points || 0;
      const newPoints = currentPoints + points;

      // Update user points
      await User.query()
        .findById(userId)
        .patch({ 
          loyalty_points: newPoints,
          total_points_earned: (user.total_points_earned || 0) + points
        });

      // Log points transaction
      await this.logPointsTransaction(userId, points, orderId, reason, 'earned');

      // Check for tier upgrade
      await this.checkTierUpgrade(userId);

      logger.info(`Added ${points} points to user ${userId}. Total: ${newPoints}`);
      return newPoints;
    } catch (error) {
      logger.error('Error adding points:', error);
      throw error;
    }
  }

  // Deduct points from user
  static async deductPoints(userId, points, reason = 'redemption') {
    try {
      const user = await User.query().findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const currentPoints = user.loyalty_points || 0;
      if (currentPoints < points) {
        throw new Error('Insufficient points');
      }

      const newPoints = currentPoints - points;

      // Update user points
      await User.query()
        .findById(userId)
        .patch({ 
          loyalty_points: newPoints,
          total_points_spent: (user.total_points_spent || 0) + points
        });

      // Log points transaction
      await this.logPointsTransaction(userId, points, null, reason, 'spent');

      logger.info(`Deducted ${points} points from user ${userId}. Remaining: ${newPoints}`);
      return newPoints;
    } catch (error) {
      logger.error('Error deducting points:', error);
      throw error;
    }
  }

  // Get user loyalty info
  static async getUserLoyaltyInfo(userId) {
    try {
      const user = await User.query().findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const currentTier = await this.getUserTier(userId);
      const nextTier = await this.getNextTier(userId);
      const pointsToNextTier = await this.getPointsToNextTier(userId);

      return {
        user_id: userId,
        current_tier: currentTier,
        next_tier: nextTier,
        current_points: user.loyalty_points || 0,
        total_points_earned: user.total_points_earned || 0,
        total_points_spent: user.total_points_spent || 0,
        points_to_next_tier: pointsToNextTier,
        benefits: currentTier.benefits,
        tier_progress: this.calculateTierProgress(userId, currentTier, nextTier)
      };
    } catch (error) {
      logger.error('Error getting user loyalty info:', error);
      throw error;
    }
  }

  // Get user tier
  static async getUserTier(userId) {
    try {
      const user = await User.query().findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const totalSpent = user.total_spent || 0;
      
      // Determine tier based on total spent
      if (totalSpent >= this.tiers.PLATINUM.minSpent) {
        return this.tiers.PLATINUM;
      } else if (totalSpent >= this.tiers.GOLD.minSpent) {
        return this.tiers.GOLD;
      } else if (totalSpent >= this.tiers.SILVER.minSpent) {
        return this.tiers.SILVER;
      } else {
        return this.tiers.BRONZE;
      }
    } catch (error) {
      logger.error('Error getting user tier:', error);
      throw error;
    }
  }

  // Get next tier
  static async getNextTier(userId) {
    try {
      const user = await User.query().findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const totalSpent = user.total_spent || 0;
      
      if (totalSpent < this.tiers.SILVER.minSpent) {
        return this.tiers.SILVER;
      } else if (totalSpent < this.tiers.GOLD.minSpent) {
        return this.tiers.GOLD;
      } else if (totalSpent < this.tiers.PLATINUM.minSpent) {
        return this.tiers.PLATINUM;
      } else {
        return null; // Already at highest tier
      }
    } catch (error) {
      logger.error('Error getting next tier:', error);
      throw error;
    }
  }

  // Get points needed for next tier
  static async getPointsToNextTier(userId) {
    try {
      const nextTier = await this.getNextTier(userId);
      if (!nextTier) {
        return 0; // Already at highest tier
      }

      const user = await User.query().findById(userId);
      const totalSpent = user.total_spent || 0;
      const remainingSpent = nextTier.minSpent - totalSpent;

      return Math.ceil(remainingSpent / 1000); // Convert to points
    } catch (error) {
      logger.error('Error getting points to next tier:', error);
      throw error;
    }
  }

  // Calculate tier progress percentage
  static async calculateTierProgress(userId, currentTier, nextTier) {
    if (!nextTier) {
      return 100; // At highest tier
    }

    const user = await User.query().findById(userId);
    const totalSpent = user.total_spent || 0;
    const currentTierMin = currentTier.minSpent;
    const nextTierMin = nextTier.minSpent;

    const progress = ((totalSpent - currentTierMin) / (nextTierMin - currentTierMin)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }

  // Check for tier upgrade
  static async checkTierUpgrade(userId) {
    try {
      const currentTier = await this.getUserTier(userId);
      const user = await User.query().findById(userId);
      
      // Check if user should be upgraded
      let newTier = null;
      if (user.total_spent >= this.tiers.PLATINUM.minSpent) {
        newTier = this.tiers.PLATINUM;
      } else if (user.total_spent >= this.tiers.GOLD.minSpent) {
        newTier = this.tiers.GOLD;
      } else if (user.total_spent >= this.tiers.SILVER.minSpent) {
        newTier = this.tiers.SILVER;
      }

      if (newTier && newTier.name !== currentTier.name) {
        // Upgrade user tier
        await User.query()
          .findById(userId)
          .patch({ 
            loyalty_tier: newTier.name,
            tier_upgraded_at: new Date()
          });

        // Create upgrade notification
        // await NotificationService.createSystemNotification({
        //   user_id: userId,
        //   user_type: 'customer',
        //   title: 'Tier Upgrade!',
        //   message: `Congratulations! You've been upgraded to ${newTier.name} tier!`,
        //   data: { new_tier: newTier.name, benefits: newTier.benefits }
        // });

        logger.info(`User ${userId} upgraded to ${newTier.name} tier`);
        return newTier;
      }

      return null;
    } catch (error) {
      logger.error('Error checking tier upgrade:', error);
      throw error;
    }
  }

  // Get available rewards
  static async getAvailableRewards(userId) {
    try {
      const user = await User.query().findById(userId);
      const currentPoints = user.loyalty_points || 0;

      const rewards = [
        {
          id: 1,
          name: '1000 UZS Discount',
          points_required: 100,
          value: 1000,
          type: 'discount'
        },
        {
          id: 2,
          name: '5000 UZS Discount',
          points_required: 450,
          value: 5000,
          type: 'discount'
        },
        {
          id: 3,
          name: 'Free Shipping',
          points_required: 200,
          value: 5000,
          type: 'shipping'
        },
        {
          id: 4,
          name: 'Premium Support',
          points_required: 300,
          value: 0,
          type: 'service'
        }
      ];

      return rewards.filter(reward => currentPoints >= reward.points_required);
    } catch (error) {
      logger.error('Error getting available rewards:', error);
      throw error;
    }
  }

  // Redeem reward
  static async redeemReward(userId, rewardId) {
    try {
      const rewards = await this.getAvailableRewards(userId);
      const reward = rewards.find(r => r.id === rewardId);

      if (!reward) {
        throw new Error('Reward not available');
      }

      // Deduct points
      await this.deductPoints(userId, reward.points_required, `reward_redemption_${rewardId}`);

      // Create reward redemption record
      await this.createRewardRedemption(userId, reward);

      logger.info(`User ${userId} redeemed reward: ${reward.name}`);
      return reward;
    } catch (error) {
      logger.error('Error redeeming reward:', error);
      throw error;
    }
  }

  // Log points transaction
  static async logPointsTransaction(userId, points, orderId, reason, type) {
    try {
      // This would typically be stored in a separate loyalty_transactions table
      logger.info(`Points transaction logged: User ${userId}, ${type} ${points} points, reason: ${reason}`);
    } catch (error) {
      logger.error('Error logging points transaction:', error);
    }
  }

  // Create reward redemption
  static async createRewardRedemption(userId, reward) {
    try {
      // This would typically be stored in a separate reward_redemptions table
      logger.info(`Reward redemption created: User ${userId}, reward: ${reward.name}`);
    } catch (error) {
      logger.error('Error creating reward redemption:', error);
    }
  }

  // Get loyalty statistics
  static async getLoyaltyStats() {
    try {
      const stats = await User.query()
        .select('loyalty_tier')
        .whereNotNull('loyalty_tier');

      const tierCounts = {};
      stats.forEach(user => {
        tierCounts[user.loyalty_tier] = (tierCounts[user.loyalty_tier] || 0) + 1;
      });

      const totalPoints = await User.query()
        .sum('loyalty_points as total')
        .first();

      return {
        tier_distribution: tierCounts,
        total_points_in_circulation: totalPoints.total || 0,
        total_users_with_points: stats.length
      };
    } catch (error) {
      logger.error('Error getting loyalty stats:', error);
      throw error;
    }
  }
}

module.exports = LoyaltyService; 