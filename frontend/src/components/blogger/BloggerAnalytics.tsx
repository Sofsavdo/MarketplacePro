'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  EyeIcon,
  ClockIcon,
  StarIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

export function BloggerAnalytics() {
  const [analytics, setAnalytics] = useState({
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
    clicks: {
      total: 5670,
      change: 15.2,
      trend: 'up'
    }
  });

  const [topProducts, setTopProducts] = useState([]);
  const [recentEarnings, setRecentEarnings] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTopProducts([
        {
          id: 1,
          name: 'iPhone 15 Pro Max',
          clicks: 1250,
          conversions: 45,
          earnings: 675000,
          commission: 5.0
        },
        {
          id: 2,
          name: 'MacBook Pro M3 Max',
          clicks: 890,
          conversions: 25,
          earnings: 625000,
          commission: 5.0
        },
        {
          id: 3,
          name: 'AirPods Pro 2',
          clicks: 2100,
          conversions: 120,
          earnings: 300000,
          commission: 3.0
        },
        {
          id: 4,
          name: 'iPad Pro 12.9',
          clicks: 567,
          conversions: 18,
          earnings: 153000,
          commission: 4.0
        }
      ]);

      setRecentEarnings([
        {
          id: 1,
          product: 'iPhone 15 Pro Max',
          amount: 67500,
          date: '2024-01-15',
          status: 'completed'
        },
        {
          id: 2,
          product: 'MacBook Pro M3 Max',
          amount: 125000,
          date: '2024-01-14',
          status: 'completed'
        },
        {
          id: 3,
          product: 'AirPods Pro 2',
          amount: 9000,
          date: '2024-01-13',
          status: 'pending'
        },
        {
          id: 4,
          product: 'iPad Pro 12.9',
          amount: 34000,
          date: '2024-01-12',
          status: 'completed'
        }
      ]);
    }, 1000);
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Analitika</h2>
        <p className="text-gray-600">Blogger statistikasi va hisobotlar</p>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eng ko'p daromad keltirgan mahsulotlar</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm font-medium text-purple-600">
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.conversions} konversiya</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatPrice(product.earnings)}</p>
                  <p className="text-xs text-gray-500">{product.commission}% komissiya</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Earnings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">So'nggi daromadlar</h3>
          <div className="space-y-4">
            {recentEarnings.map((earning) => (
              <div key={earning.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{earning.product}</p>
                    <p className="text-xs text-gray-500">{new Date(earning.date).toLocaleDateString('uz-UZ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatPrice(earning.amount)}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(earning.status)}`}>
                    {earning.status === 'completed' ? 'To\'langan' : 'Kutilmoqda'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ishlash ko'rsatkichlari</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CurrencyDollarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatPrice(analytics.earnings.total)}</p>
            <p className="text-sm text-gray-600">Jami daromad</p>
            <div className="flex items-center justify-center mt-2">
              {getTrendIcon(analytics.earnings.trend)}
              <span className={`ml-1 text-sm font-medium ${
                analytics.earnings.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {analytics.earnings.change}%
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.followers.total.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Obunachilar</p>
            <div className="flex items-center justify-center mt-2">
              {getTrendIcon(analytics.followers.trend)}
              <span className={`ml-1 text-sm font-medium ${
                analytics.followers.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {analytics.followers.change}%
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <LinkIcon className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.conversions.total}</p>
            <p className="text-sm text-gray-600">Konversiyalar</p>
            <div className="flex items-center justify-center mt-2">
              {getTrendIcon(analytics.conversions.trend)}
              <span className={`ml-1 text-sm font-medium ${
                analytics.conversions.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {analytics.conversions.change}%
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <EyeIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.clicks.total.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Bosishlar</p>
            <div className="flex items-center justify-center mt-2">
              {getTrendIcon(analytics.clicks.trend)}
              <span className={`ml-1 text-sm font-medium ${
                analytics.clicks.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {analytics.clicks.change}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 