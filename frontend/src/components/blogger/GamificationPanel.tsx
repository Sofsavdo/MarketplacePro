'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrophyIcon,
  StarIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline';

interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: string;
  earned: boolean;
  earned_at?: Date;
}

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  display_name: string;
  total_sales: number;
  total_earnings: number;
  total_points: number;
}

interface GamificationPanelProps {
  bloggerId: string;
}

export function GamificationPanel({ bloggerId }: GamificationPanelProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'achievements' | 'leaderboard'>('achievements');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGamificationData();
  }, [bloggerId]);

  const fetchGamificationData = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        const mockAchievements: Achievement[] = [
          {
            id: 'first_sale',
            name: 'First Sale',
            description: 'Complete your first sale',
            points: 100,
            icon: '🎯',
            earned: true,
            earned_at: new Date('2024-01-10')
          },
          {
            id: 'sales_milestone_10',
            name: '10 Sales',
            description: 'Complete 10 sales',
            points: 500,
            icon: '🏆',
            earned: true,
            earned_at: new Date('2024-01-15')
          },
          {
            id: 'earnings_milestone_1m',
            name: '1M UZS Earnings',
            description: 'Earn 1 million UZS',
            points: 1000,
            icon: '💰',
            earned: false
          }
        ];

        const mockLeaderboard: LeaderboardEntry[] = [
          {
            rank: 1,
            id: '1',
            username: 'top_blogger',
            display_name: 'Aziz Karimov',
            total_sales: 150,
            total_earnings: 8500000,
            total_points: 2500
          },
          {
            rank: 2,
            id: '2',
            username: 'rising_star',
            display_name: 'Malika Yusupova',
            total_sales: 120,
            total_earnings: 6500000,
            total_points: 1800
          },
          {
            rank: 3,
            id: '3',
            username: 'consistent_performer',
            display_name: 'Jasur Toshmatov',
            total_sales: 95,
            total_earnings: 5200000,
            total_points: 1450
          }
        ];

        setAchievements(mockAchievements);
        setLeaderboard(mockLeaderboard);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching gamification data:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Gamification</h3>
            <p className="text-purple-100 text-sm">Achievements va Leaderboard</p>
          </div>
          <TrophyIcon className="h-8 w-8 text-purple-200" />
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'achievements'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrophyIcon className="h-4 w-4 inline mr-2" />
          Achievements
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
            activeTab === 'leaderboard'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <TrendingUpIcon className="h-4 w-4 inline mr-2" />
          Leaderboard
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'achievements' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Achievements</h4>
              <div className="text-sm text-gray-600">
                {achievements.filter(a => a.earned).length} / {achievements.length} earned
              </div>
            </div>

            <div className="grid gap-4">
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    achievement.earned
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`text-3xl ${achievement.earned ? 'opacity-100' : 'opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className={`font-semibold ${
                          achievement.earned ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {achievement.name}
                        </h5>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{achievement.points} pts</span>
                          {achievement.earned && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${
                        achievement.earned ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                      {achievement.earned && achievement.earned_at && (
                        <p className="text-xs text-green-600 mt-2">
                          Earned on {achievement.earned_at.toLocaleDateString('uz-UZ')}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Top Performers</h4>
              <div className="text-sm text-gray-600">This month</div>
            </div>

            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    index === 0 ? 'border-yellow-200 bg-yellow-50' :
                    index === 1 ? 'border-gray-200 bg-gray-50' :
                    index === 2 ? 'border-amber-200 bg-amber-50' :
                    'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className="text-lg font-bold text-gray-600">{entry.rank}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-semibold text-gray-900">
                            {entry.display_name}
                          </h5>
                          <p className="text-sm text-gray-600">@{entry.username}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatPrice(entry.total_earnings)}
                          </div>
                          <div className="text-xs text-gray-600">
                            {entry.total_sales} sales • {entry.total_points} pts
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 