'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon,
  GiftIcon,
  TrophyIcon,
  SparklesIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';

interface LoyaltyInfo {
  current_tier: {
    name: string;
    benefits: string[];
  };
  next_tier?: {
    name: string;
    minSpent: number;
  };
  current_points: number;
  total_points_earned: number;
  points_to_next_tier: number;
  tier_progress: number;
}

interface LoyaltyCardProps {
  userId: string;
}

export function LoyaltyCard({ userId }: LoyaltyCardProps) {
  const [loyaltyInfo, setLoyaltyInfo] = useState<LoyaltyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    fetchLoyaltyInfo();
  }, [userId]);

  const fetchLoyaltyInfo = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockLoyaltyInfo: LoyaltyInfo = {
          current_tier: {
            name: 'Silver',
            benefits: ['Enhanced rewards', 'Priority support', 'Free shipping']
          },
          next_tier: {
            name: 'Gold',
            minSpent: 5000000
          },
          current_points: 1250,
          total_points_earned: 3500,
          points_to_next_tier: 750,
          tier_progress: 62.5
        };
        
        setLoyaltyInfo(mockLoyaltyInfo);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching loyalty info:', error);
      setLoading(false);
    }
  };

  const getTierColor = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze':
        return 'bg-amber-500';
      case 'silver':
        return 'bg-gray-400';
      case 'gold':
        return 'bg-yellow-500';
      case 'platinum':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTierIcon = (tierName: string) => {
    switch (tierName.toLowerCase()) {
      case 'bronze':
        return '🥉';
      case 'silver':
        return '🥈';
      case 'gold':
        return '🥇';
      case 'platinum':
        return '💎';
      default:
        return '⭐';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!loyaltyInfo) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Loyalty ma'lumotlari topilmadi</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Loyalty Program</h3>
            <p className="text-primary-100 text-sm">Sizning darajangiz</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{loyaltyInfo.current_points}</div>
            <div className="text-primary-100 text-sm">Ball</div>
          </div>
        </div>
      </div>

      {/* Tier Info */}
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-12 h-12 rounded-full ${getTierColor(loyaltyInfo.current_tier.name)} flex items-center justify-center text-white text-xl`}>
            {getTierIcon(loyaltyInfo.current_tier.name)}
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900">
              {loyaltyInfo.current_tier.name} Tier
            </h4>
            <p className="text-gray-600 text-sm">
              {loyaltyInfo.total_points_earned} ball to'plagan
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {loyaltyInfo.next_tier && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Keyingi darajaga: {loyaltyInfo.next_tier.name}</span>
              <span>{loyaltyInfo.points_to_next_tier} ball kerak</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loyaltyInfo.tier_progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {loyaltyInfo.tier_progress.toFixed(1)}% to'ldirildi
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="mb-6">
          <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <GiftIcon className="h-4 w-4 mr-2 text-primary-600" />
            Sizning imtiyozlaringiz
          </h5>
          <div className="space-y-2">
            {loyaltyInfo.current_tier.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <SparklesIcon className="h-3 w-3 mr-2 text-primary-500" />
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-3">
          <button
            onClick={() => setShowRewards(!showRewards)}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm font-medium"
          >
            Mukofotlarni ko'rish
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium">
            Tarix
          </button>
        </div>
      </div>

      {/* Rewards Modal */}
      {showRewards && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowRewards(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Mavjud mukofotlar
              </h3>
              <button
                onClick={() => setShowRewards(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {[
                { name: '1000 UZS chegirma', points: 100, available: true },
                { name: '5000 UZS chegirma', points: 450, available: loyaltyInfo.current_points >= 450 },
                { name: 'Bepul yetkazib berish', points: 200, available: loyaltyInfo.current_points >= 200 },
                { name: 'Premium qo\'llab-quvvatlash', points: 300, available: loyaltyInfo.current_points >= 300 }
              ].map((reward, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    reward.available 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${
                        reward.available ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {reward.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {reward.points} ball
                      </p>
                    </div>
                    <button
                      disabled={!reward.available}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        reward.available
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {reward.available ? 'Olish' : 'Yetarli emas'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 