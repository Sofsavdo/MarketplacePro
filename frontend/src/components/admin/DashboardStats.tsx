'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline';

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenueChange: 0,
    ordersChange: 0,
    usersChange: 0,
    productsChange: 0
  });

  useEffect(() => {
    // Simulate API call
    const fetchStats = async () => {
      // In real app, this would be an API call
      setTimeout(() => {
        setStats({
          totalRevenue: 1250000,
          totalOrders: 15420,
          totalUsers: 45680,
          totalProducts: 8920,
          revenueChange: 12.5,
          ordersChange: 8.3,
          usersChange: 15.7,
          productsChange: 5.2
        });
      }, 1000);
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Jami daromad',
      value: `${(stats.totalRevenue / 1000000).toFixed(1)}M`,
      change: stats.revenueChange,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Jami buyurtmalar',
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChange,
      icon: ClockIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Foydalanuvchilar',
      value: stats.totalUsers.toLocaleString(),
      change: stats.usersChange,
      icon: UsersIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Mahsulotlar',
      value: stats.totalProducts.toLocaleString(),
      change: stats.productsChange,
      icon: ShoppingBagIcon,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-xl p-6 shadow-sm border border-gray-200`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  {isPositive ? (
                    <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? '+' : ''}{stat.change}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    o'tgan oydan
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 