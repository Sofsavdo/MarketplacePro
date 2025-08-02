'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  ShoppingBagIcon,
  EyeIcon,
  StarIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

export function MerchantStats() {
  const [stats, setStats] = useState({
    revenue: {
      total: 25000000,
      change: 15.2,
      trend: 'up'
    },
    orders: {
      total: 45,
      change: 8.5,
      trend: 'up'
    },
    views: {
      total: 1250,
      change: 12.3,
      trend: 'up'
    },
    rating: {
      total: 4.8,
      change: 0.2,
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
      value: formatPrice(stats.revenue.total),
      change: stats.revenue.change,
      trend: stats.revenue.trend,
      icon: CurrencyDollarIcon,
      color: 'green'
    },
    {
      title: 'Buyurtmalar',
      value: stats.orders.total.toString(),
      change: stats.orders.change,
      trend: stats.orders.trend,
      icon: ShoppingBagIcon,
      color: 'blue'
    },
    {
      title: 'Ko\'rishlar',
      value: stats.views.total.toLocaleString(),
      change: stats.views.change,
      trend: stats.views.trend,
      icon: EyeIcon,
      color: 'purple'
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
          green: 'bg-green-100 text-green-600',
          blue: 'bg-blue-100 text-blue-600',
          purple: 'bg-purple-100 text-purple-600',
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