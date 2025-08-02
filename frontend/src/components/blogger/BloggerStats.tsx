'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  UsersIcon,
  EyeIcon,
  StarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

export function BloggerStats() {
  const [stats, setStats] = useState({
    earnings: {
      total: 8500000,
      change: 18.5,
      trend: 'up'
    },
    followers: {
      total: 12500,
      change: 12.3,
      trend: 'up'
    },
    conversions: {
      total: 234,
      change: 8.7,
      trend: 'up'
    },
    rating: {
      total: 4.8,
      change: 0.3,
      trend: 'up'
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  const statCards = [
    {
      title: 'Jami daromad',
      value: formatPrice(stats.earnings.total),
      change: stats.earnings.change,
      trend: stats.earnings.trend,
      icon: CurrencyDollarIcon,
      color: 'purple'
    },
    {
      title: 'Obunachilar',
      value: stats.followers.total.toLocaleString(),
      change: stats.followers.change,
      trend: stats.followers.trend,
      icon: UsersIcon,
      color: 'blue'
    },
    {
      title: 'Konversiyalar',
      value: stats.conversions.total.toString(),
      change: stats.conversions.change,
      trend: stats.conversions.trend,
      icon: EyeIcon,
      color: 'green'
    },
    {
      title: 'Reyting',
      value: stats.rating.total.toString(),
      change: stats.rating.change,
      trend: stats.rating.trend,
      icon: StarIcon,
      color: 'yellow'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          purple: 'bg-purple-100 text-purple-600',
          blue: 'bg-blue-100 text-blue-600',
          green: 'bg-green-100 text-green-600',
          yellow: 'bg-yellow-100 text-yellow-600'
        };

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${colorClasses[stat.color]} rounded-lg flex items-center justify-center`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {getTrendIcon(stat.trend)}
              <span className={`ml-2 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}%
              </span>
              <span className="ml-2 text-sm text-gray-500">o'tgan oydan</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 