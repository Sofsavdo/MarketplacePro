'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon, 
  GiftIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface CheckoutWithRewardsProps {
  orderAmount: number;
  orderId: string;
  userId: string;
  onDiscountApplied: (discountAmount: number) => void;
}

interface RewardsInfo {
  points: number;
  totalEarned: number;
  streak: number;
  multiplier: number;
}

interface DiscountInfo {
  discountPercentage: number;
  discountAmount: number;
  pointsUsed: number;
}

export function CheckoutWithRewards({ 
  orderAmount, 
  orderId, 
  userId, 
  onDiscountApplied 
}: CheckoutWithRewardsProps) {
  const [rewardsInfo, setRewardsInfo] = useState<RewardsInfo | null>(null);
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showDiscountInfo, setShowDiscountInfo] = useState(false);

  useEffect(() => {
    fetchRewardsInfo();
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
        multiplier: 1.5
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDiscount = async (pointsToUse: number) => {
    try {
      const response = await fetch(`/api/smart-rewards/calculate-discount?points=${pointsToUse}&orderAmount=${orderAmount}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.data;
      } else {
        // Mock calculation
        const discountPercentage = Math.min(pointsToUse / 100, 20);
        const discountAmount = orderAmount * (discountPercentage / 100);
        return {
          discountPercentage,
          discountAmount,
          pointsUsed: Math.floor(discountPercentage * 100)
        };
      }
    } catch (error) {
      console.error('Error calculating discount:', error);
      // Mock calculation
      const discountPercentage = Math.min(pointsToUse / 100, 20);
      const discountAmount = orderAmount * (discountPercentage / 100);
      return {
        discountPercentage,
        discountAmount,
        pointsUsed: Math.floor(discountPercentage * 100)
      };
    }
  };

  const applyDiscount = async (pointsToUse: number) => {
    if (!rewardsInfo || pointsToUse > rewardsInfo.points || applying) return;

    setApplying(true);
    try {
      const discountData = await calculateDiscount(pointsToUse);
      
      // Simulate API call to redeem points
      const response = await fetch('/api/smart-rewards/redeem', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          pointsToRedeem: pointsToUse,
          orderAmount
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDiscountInfo(data.data);
        onDiscountApplied(data.data.discountAmount);
        
        // Update local rewards info
        setRewardsInfo(prev => prev ? {
          ...prev,
          points: data.data.remainingPoints
        } : null);
      }
    } catch (error) {
      console.error('Error applying discount:', error);
    } finally {
      setApplying(false);
    }
  };

  const getMaxDiscountPoints = () => {
    if (!rewardsInfo) return 0;
    const maxDiscountPercentage = 20;
    const maxPoints = Math.floor(orderAmount * (maxDiscountPercentage / 100) * 100);
    return Math.min(maxPoints, rewardsInfo.points);
  };

  const getQuickDiscountOptions = () => {
    const maxPoints = getMaxDiscountPoints();
    const options = [];
    
    // 5% discount
    const points5 = Math.min(500, maxPoints);
    if (points5 >= 500) {
      options.push({ label: '5% chegirma', points: 500, percentage: 5 });
    }
    
    // 10% discount
    const points10 = Math.min(1000, maxPoints);
    if (points10 >= 1000) {
      options.push({ label: '10% chegirma', points: 1000, percentage: 10 });
    }
    
    // 15% discount
    const points15 = Math.min(1500, maxPoints);
    if (points15 >= 1500) {
      options.push({ label: '15% chegirma', points: 1500, percentage: 15 });
    }
    
    // 20% discount
    const points20 = Math.min(2000, maxPoints);
    if (points20 >= 2000) {
      options.push({ label: '20% chegirma', points: 2000, percentage: 20 });
    }
    
    return options;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-32 rounded-lg"></div>
      </div>
    );
  }

  if (!rewardsInfo || rewardsInfo.points === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center">
          <GiftIcon className="w-6 h-6 text-gray-400 mr-2" />
          <p className="text-gray-600">Ballaringiz yetarli emas yoki mavjud emas</p>
        </div>
      </div>
    );
  }

  const quickOptions = getQuickDiscountOptions();
  const maxPoints = getMaxDiscountPoints();

  return (
    <div className="space-y-4">
      {/* Rewards Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Ballar bilan chegirma</h3>
          <div className="flex items-center">
            <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
            <span className="font-semibold text-blue-600">{rewardsInfo.points}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Jami olingan</p>
            <p className="font-semibold">{rewardsInfo.totalEarned} ball</p>
          </div>
          <div>
            <p className="text-gray-600">Ko'paytiruvchi</p>
            <p className="font-semibold text-green-600">{rewardsInfo.multiplier}x</p>
          </div>
        </div>
      </div>

      {/* Applied Discount */}
      {discountInfo && (
        <motion.div 
          className="bg-green-50 border border-green-200 rounded-lg p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-semibold text-green-700">
                Chegirma qo'llanildi: -{discountInfo.discountPercentage.toFixed(1)}%
              </span>
            </div>
            <span className="text-lg font-bold text-green-700">
              -{discountInfo.discountAmount.toLocaleString()} UZS
            </span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            {discountInfo.pointsUsed} ball ishlatildi
          </p>
        </motion.div>
      )}

      {/* Quick Discount Options */}
      {!discountInfo && quickOptions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Tezkor chegirmalar</h4>
            <button
              onClick={() => setShowDiscountInfo(!showDiscountInfo)}
              className="text-blue-600 hover:text-blue-700"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>
          </div>
          
          {showDiscountInfo && (
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <p className="text-sm text-blue-700">
                100 ball = 1% chegirma. Maksimal 20% chegirma qo'llash mumkin.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            {quickOptions.map((option) => (
              <motion.button
                key={option.percentage}
                onClick={() => applyDiscount(option.points)}
                disabled={applying}
                className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center hover:bg-blue-100 transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-semibold text-blue-700">{option.label}</div>
                <div className="text-sm text-gray-600">{option.points} ball</div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Discount */}
      {!discountInfo && maxPoints > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Maxsus chegirma</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ballar soni (maksimal {maxPoints})
              </label>
              <input
                type="number"
                min="0"
                max={maxPoints}
                placeholder="Ballar sonini kiriting"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => {
                  const points = parseInt(e.target.value) || 0;
                  if (points > 0) {
                    calculateDiscount(points).then(setDiscountInfo);
                  } else {
                    setDiscountInfo(null);
                  }
                }}
              />
            </div>
            
            {discountInfo && !discountInfo.discountAmount && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-2" />
                  <p className="text-sm text-yellow-700">
                    Bu miqdordagi ballar yetarli emas
                  </p>
                </div>
              </div>
            )}
            
            {discountInfo && discountInfo.discountAmount > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">
                    Potensial chegirma: {discountInfo.discountPercentage.toFixed(1)}%
                  </span>
                  <span className="font-semibold text-green-700">
                    -{discountInfo.discountAmount.toLocaleString()} UZS
                  </span>
                </div>
                <button
                  onClick={() => applyDiscount(discountInfo.pointsUsed)}
                  disabled={applying}
                  className="w-full mt-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {applying ? 'Qo\'llanmoqda...' : 'Chegirmani qo\'llash'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Final Amount */}
      {discountInfo && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold">Yakuniy summa:</span>
            <span className="font-bold text-green-600">
              {(orderAmount - discountInfo.discountAmount).toLocaleString()} UZS
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {discountInfo.discountAmount.toLocaleString()} UZS tejab qoldingiz!
          </p>
        </div>
      )}
    </div>
  );
} 