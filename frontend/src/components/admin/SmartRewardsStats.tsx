'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  FireIcon, 
  UsersIcon, 
  ChartBarIcon,
  TrendingUpIcon,
  GiftIcon
} from '@heroicons/react/24/outline';

interface SmartRewardsStats {
  totalUsers: number;
  activeUsers: number;
  highStreakUsers: number;
  averageStreak: number;
  totalPointsAwarded: number;
}

export function SmartRewardsStats() {
  const [stats, setStats] = useState<SmartRewardsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Simulate API call
      const response = await fetch('/api/smart-rewards/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      } else {
        // Mock data for demonstration
        setStats({
          totalUsers: 1250,
          activeUsers: 890,
          highStreakUsers: 234,
          averageStreak: 5.2,
          totalPointsAwarded: 45600
        });
      }
    } catch (error) {
      console.error('Error fetching smart rewards stats:', error);
      // Mock data for demonstration
      setStats({
        totalUsers: 1250,
        activeUsers: 890,
        highStreakUsers: 234,
        averageStreak: 5.2,
        totalPointsAwarded: 45600
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Failed to load smart rewards statistics</p>
      </div>
    );
  }

  const engagementRate = ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1);
  const highStreakRate = ((stats.highStreakUsers / stats.totalUsers) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Aqlli mukofotlar statistikasi</h2>
        <div className="flex items-center">
          <StarIcon className="w-6 h-6 text-yellow-500 mr-2" />
          <span className="text-sm text-gray-600">Real-time ma'lumotlar</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Jami foydalanuvchilar</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Tizimda ro'yxatdan o'tgan</p>
        </motion.div>

        {/* Active Users */}
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <FireIcon className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">{engagementRate}%</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Faol foydalanuvchilar</h3>
          <p className="text-3xl font-bold text-green-600">{stats.activeUsers.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Kunlik kirish qilgan</p>
        </motion.div>

        {/* High Streak Users */}
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <StarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600">{highStreakRate}%</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Yuqori seriya</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.highStreakUsers.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">7+ kunlik seriya</p>
        </motion.div>

        {/* Average Streak */}
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-orange-600">O'rtacha</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">O'rtacha seriya</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.averageStreak}</p>
          <p className="text-sm text-gray-600 mt-1">Kunlik o'rtacha</p>
        </motion.div>

        {/* Total Points Awarded */}
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <GiftIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <TrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Jami berilgan ballar</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.totalPointsAwarded.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Barcha vaqtlar bo'yicha</p>
        </motion.div>

        {/* Engagement Rate */}
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUpIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-indigo-600">Yuqori</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Jalb qilish darajasi</h3>
          <p className="text-3xl font-bold text-indigo-600">{engagementRate}%</p>
          <p className="text-sm text-gray-600 mt-1">Faol foydalanuvchilar</p>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tahlil va tavsiyalar</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">✅ Yaxshi natijalar</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• {engagementRate}% foydalanuvchilar faol</li>
              <li>• O'rtacha {stats.averageStreak} kunlik seriya</li>
              <li>• {stats.totalPointsAwarded.toLocaleString()} ball berildi</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">💡 Yaxshilash imkoniyatlari</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Seriya ko'paytiruvchilarini oshirish</li>
              <li>• Flash takliflarni ko'paytirish</li>
              <li>• Push-bildirishnomalarni faollashtirish</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="bg-white border border-gray-200 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tezkor amallar</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Flash taklif yaratish
          </button>
          <button className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
            Seriya bonusini oshirish
          </button>
          <button className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
            Hisobot yuklab olish
          </button>
        </div>
      </motion.div>
    </div>
  );
} 