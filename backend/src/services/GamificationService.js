const Blogger = require('../models/Blogger');
const AffiliateLink = require('../models/AffiliateLink');
const Order = require('../models/Order');
const logger = require('../utils/logger');

class GamificationService {
  // Achievement types
  static achievements = {
    FIRST_SALE: {
      id: 'first_sale',
      name: 'First Sale',
      description: 'Complete your first sale',
      points: 100,
      icon: '🎯',
      category: 'sales'
    },
    SALES_MILESTONE_10: {
      id: 'sales_milestone_10',
      name: '10 Sales',
      description: 'Complete 10 sales',
      points: 500,
      icon: '🏆',
      category: 'sales'
    },
    EARNINGS_MILESTONE_1M: {
      id: 'earnings_milestone_1m',
      name: '1M UZS Earnings',
      description: 'Earn 1 million UZS',
      points: 1000,
      icon: '💰',
      category: 'earnings'
    }
  };

  // Badge types
  static badges = {
    NEWCOMER: {
      id: 'newcomer',
      name: 'Newcomer',
      description: 'Just getting started',
      icon: '🌱',
      color: 'green'
    },
    RISING_STAR: {
      id: 'rising_star',
      name: 'Rising Star',
      description: 'Showing great potential',
      icon: '⭐',
      color: 'yellow'
    },
    TOP_PERFORMER: {
      id: 'top_performer',
      name: 'Top Performer',
      description: 'Consistently high performance',
      icon: '🏅',
      color: 'orange'
    }
  };

  // Check and award achievements
  static async checkAchievements(bloggerId) {
    try {
      const blogger = await Blogger.query().findById(bloggerId);
      if (!blogger) {
        throw new Error('Blogger not found');
      }

      const earnedAchievements = [];
      const stats = await this.getBloggerStats(bloggerId);

      // Check each achievement
      for (const [key, achievement] of Object.entries(this.achievements)) {
        const hasEarned = await this.hasEarnedAchievement(bloggerId, achievement.id);
        
        if (!hasEarned && await this.checkAchievementCondition(achievement, stats)) {
          await this.awardAchievement(bloggerId, achievement);
          earnedAchievements.push(achievement);
        }
      }

      return earnedAchievements;
    } catch (error) {
      logger.error('Error checking achievements:', error);
      throw error;
    }
  }

  // Check if blogger has earned specific achievement
  static async hasEarnedAchievement(bloggerId, achievementId) {
    try {
      const blogger = await Blogger.query().findById(bloggerId);
      const earnedAchievements = blogger.earned_achievements || [];
      return earnedAchievements.includes(achievementId);
    } catch (error) {
      logger.error('Error checking earned achievement:', error);
      return false;
    }
  }

  // Check achievement condition
  static async checkAchievementCondition(achievement, stats) {
    try {
      switch (achievement.id) {
        case 'first_sale':
          return stats.total_sales >= 1;
        case 'sales_milestone_10':
          return stats.total_sales >= 10;
        case 'earnings_milestone_1m':
          return stats.total_earnings >= 1000000;
        default:
          return false;
      }
    } catch (error) {
      logger.error('Error checking achievement condition:', error);
      return false;
    }
  }

  // Award achievement to blogger
  static async awardAchievement(bloggerId, achievement) {
    try {
      const blogger = await Blogger.query().findById(bloggerId);
      const earnedAchievements = blogger.earned_achievements || [];
      earnedAchievements.push(achievement.id);

      await Blogger.query()
        .findById(bloggerId)
        .patch({
          earned_achievements: earnedAchievements,
          total_points: (blogger.total_points || 0) + achievement.points,
          last_achievement_earned: new Date()
        });

      logger.info(`Achievement awarded: ${achievement.name} to blogger ${bloggerId}`);
      return achievement;
    } catch (error) {
      logger.error('Error awarding achievement:', error);
      throw error;
    }
  }

  // Get blogger statistics
  static async getBloggerStats(bloggerId) {
    try {
      const [totalSales, totalEarnings] = await Promise.all([
        Order.query()
          .where('affiliate_blogger_id', bloggerId)
          .where('status', 'completed')
          .resultSize(),
        
        AffiliateLink.query()
          .where('blogger_id', bloggerId)
          .sum('total_commission as total')
          .first()
      ]);

      return {
        total_sales: totalSales,
        total_earnings: totalEarnings.total || 0
      };
    } catch (error) {
      logger.error('Error getting blogger stats:', error);
      throw error;
    }
  }

  // Get leaderboard
  static async getLeaderboard(type = 'earnings', limit = 10) {
    try {
      let query = Blogger.query()
        .select('id', 'username', 'display_name', 'avatar_url', 'current_badge');

      switch (type) {
        case 'earnings':
          query = query.orderBy('total_earnings', 'desc');
          break;
        case 'sales':
          query = query.orderBy('total_sales', 'desc');
          break;
        case 'points':
          query = query.orderBy('total_points', 'desc');
          break;
        default:
          query = query.orderBy('total_earnings', 'desc');
      }

      const bloggers = await query.limit(limit);

      const leaderboard = await Promise.all(
        bloggers.map(async (blogger, index) => {
          const stats = await this.getBloggerStats(blogger.id);
          return {
            rank: index + 1,
            ...blogger,
            ...stats
          };
        })
      );

      return leaderboard;
    } catch (error) {
      logger.error('Error getting leaderboard:', error);
      throw error;
    }
  }
}

module.exports = GamificationService; 