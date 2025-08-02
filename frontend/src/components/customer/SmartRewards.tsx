'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  StarIcon, 
  FireIcon, 
  GiftIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  TrophyIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

interface SmartRewardsInfo {
  points: number;
  totalEarned: number;
  streak: number;
  nextStreakBonus: {
    daysNeeded: number;
    multiplier: number;
    bonusPercentage: number;
  } | null;
  canClaimToday: boolean;
  lastLogin: string | null;
  multiplier: number;
}

interface FlashDeal {
  id: string;
  title: string;
  description: string;
  discount: number;
  minPoints: number;
  expiresAt: string;
  category: string;
}

interface SmartRewardsProps {
  userId: string;
}

export function SmartRewards({ userId }: SmartRewardsProps) {
  const [rewardsInfo, setRewardsInfo] = useState<SmartRewardsInfo | null>(null);
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showClaimAnimation, setShowClaimAnimation] = useState(false);

  useEffect(() => {
    fetchRewardsInfo();
    fetchFlashDeals();
  }, [userId]);

  const fetchRewardsInfo = async () => {
    try {
      // Simulate API call
      const response = await fetch(`/api/smart-rewards/info`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRewardsInfo(data.data);
      } else {
        // Mock data for demonstration
        setRewardsInfo({
          points: 150,
          totalEarned: 450,
          streak: 7,
          nextStreakBonus: {
            daysNeeded: 7,
            multiplier: 2.0,
            bonusPercentage: 100
          },
          canClaimToday: true,
          lastLogin: null,
          multiplier: 1.5
        });
      }
    } catch (error) {
      console.error('Error fetching rewards info:', error);
      // Mock data for demonstration
      setRewardsInfo({
        points: 150,
        totalEarned: 450,
        streak: 7,
        nextStreakBonus: {
          daysNeeded: 7,
          multiplier: 2.0,
          bonusPercentage: 100
        },
        canClaimToday: true,
        lastLogin: null,
        multiplier: 1.5
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFlashDeals = async () => {
    try {
      // Simulate API call
      const response = await fetch(`/api/smart-rewards/flash-deals`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFlashDeals(data.data);
      } else {
        // Mock data for demonstration
        setFlashDeals([
          {
            id: 'flash_1',
            title: 'Flash Sale - 10% Off Electronics',
            description: 'Limited time offer on selected electronics',
            discount: 10,
            minPoints: 0,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            category: 'electronics'
          },
          {
            id: 'flash_2',
            title: 'Loyalty Bonus - 15% Off Fashion',
            description: 'Special offer for loyal customers',
            discount: 15,
            minPoints: 50,
            expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            category: 'fashion'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching flash deals:', error);
      // Mock data for demonstration
      setFlashDeals([
        {
          id: 'flash_1',
          title: 'Flash Sale - 10% Off Electronics',
          description: 'Limited time offer on selected electronics',
          discount: 10,
          minPoints: 0,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          category: 'electronics'
        },
        {
          id: 'flash_2',
          title: 'Loyalty Bonus - 15% Off Fashion',
          description: 'Special offer for loyal customers',
          discount: 15,
          minPoints: 50,
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          category: 'fashion'
        }
      ]);
    }
  };

  const claimDailyReward = async () => {
    if (!rewardsInfo?.canClaimToday || claiming) return;

    setClaiming(true);
    try {
      // Simulate API call
      const response = await fetch('/api/smart-rewards/daily-login', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRewardsInfo(prev => prev ? {
          ...prev,
          points: data.data.points,
          streak: data.data.streak,
          canClaimToday: false
        } : null);
        
        setShowClaimAnimation(true);
        setTimeout(() => setShowClaimAnimation(false), 3000);
      }
    } catch (error) {
      console.error('Error claiming daily reward:', error);
    } finally {
      setClaiming(false);
    }
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return <TrophyIcon className="w-6 h-6 text-yellow-500" />;
    if (streak >= 14) return <FireIcon className="w-6 h-6 text-orange-500" />;
    if (streak >= 7) return <SparklesIcon className="w-6 h-6 text-purple-500" />;
    if (streak >= 3) return <StarIcon className="w-6 h-6 text-blue-500" />;
    return <StarIcon className="w-6 h-6 text-gray-400" />;
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-64 rounded-lg"></div>
      </div>
    );
  }

  if (!rewardsInfo) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mb-2" />
        <p className="text-red-700">Failed to load rewards information</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily Login Reward */}
      <motion.div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Kunlik mukofot</h3>
          {getStreakIcon(rewardsInfo.streak)}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-blue-100">Joriy ballar</p>
            <p className="text-2xl font-bold">{rewardsInfo.points}</p>
          </div>
          <div>
            <p className="text-blue-100">Seriya</p>
            <p className="text-2xl font-bold">{rewardsInfo.streak} kun</p>
          </div>
        </div>

        {rewardsInfo.canClaimToday ? (
          <motion.button
            onClick={claimDailyReward}
            disabled={claiming}
            className="w-full bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {claiming ? 'Keling...' : `+${Math.floor(10 * rewardsInfo.multiplier)} ball olish`}
          </motion.button>
        ) : (
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <CheckCircleIcon className="w-6 h-6 mx-auto mb-2" />
            <p>Bugungi mukofot olingan!</p>
          </div>
        )}

        {rewardsInfo.nextStreakBonus && (
          <div className="mt-4 bg-white/10 rounded-lg p-3">
            <p className="text-sm text-blue-100">
              Keyingi bonus: {rewardsInfo.nextStreakBonus.daysNeeded} kundan keyin +{rewardsInfo.nextStreakBonus.bonusPercentage}%
            </p>
          </div>
        )}
      </motion.div>

      {/* Flash Deals */}
      {flashDeals.length > 0 && (
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center mb-4">
            <BoltIcon className="w-6 h-6 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold">Flash takliflar</h3>
          </div>
          
          <div className="space-y-3">
            {flashDeals.map((deal) => (
              <motion.div
                key={deal.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{deal.title}</h4>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                    -{deal.discount}%
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{deal.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {formatTimeRemaining(deal.expiresAt)} qoldi
                  </div>
                  
                  {deal.minPoints > 0 && (
                    <div className="flex items-center text-sm text-gray-500">
                      <GiftIcon className="w-4 h-4 mr-1" />
                      {deal.minPoints} ball
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Points Info */}
      <motion.div 
        className="bg-gray-50 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold mb-4">Ballar ma'lumoti</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm">Jami olingan</p>
            <p className="text-2xl font-bold text-blue-600">{rewardsInfo.totalEarned}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Joriy ko'paytiruvchi</p>
            <p className="text-2xl font-bold text-green-600">{rewardsInfo.multiplier}x</p>
          </div>
        </div>
        
        <div className="mt-4 bg-blue-50 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            💡 Har kuni kirish orqali ballar oling va seriya ko'paytiruvchilaridan foydalaning!
          </p>
        </div>
      </motion.div>

      {/* Claim Animation */}
      <AnimatePresence>
        {showClaimAnimation && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-lg p-8 shadow-2xl text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-xl font-bold text-green-600 mb-2">
                Tabriklaymiz!
              </h3>
              <p className="text-gray-600">
                Kunlik mukofot muvaffaqiyatli olingan!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 