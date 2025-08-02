'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  EyeIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export function Analytics() {
  const [analytics, setAnalytics] = useState({
    revenue: {
      total: 125000000,
      change: 12.5,
      trend: 'up'
    },
    orders: {
      total: 1250,
      change: 8.3,
      trend: 'up'
    },
    users: {
      total: 8500,
      change: 15.2,
      trend: 'up'
    },
    products: {
      total: 12500,
      change: -2.1,
      trend: 'down'
    }
  });

  const [topProducts, setTopProducts] = useState([]);
  const [topMerchants, setTopMerchants] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTopProducts([
        {
          id: 1,
          name: 'iPhone 15 Pro Max',
          sales: 45,
          revenue: 675000000,
          rating: 4.8
        },
        {
          id: 2,
          name: 'Samsung Galaxy S24 Ultra',
          sales: 38,
          revenue: 456000000,
          rating: 4.6
        },
        {
          id: 3,
          name: 'MacBook Pro M3 Max',
          sales: 25,
          revenue: 625000000,
          rating: 4.9
        },
        {
          id: 4,
          name: 'Nike Air Max 270',
          sales: 120,
          revenue: 102000000,
          rating: 4.5
        },
        {
          id: 5,
          name: 'Rolex Submariner',
          sales: 3,
          revenue: 255000000,
          rating: 5.0
        }
      ]);

      setTopMerchants([
        {
          id: 1,
          name: 'Apple Store',
          revenue: 1300000000,
          orders: 70,
          rating: 4.8
        },
        {
          id: 2,
          name: 'Samsung Shop',
          revenue: 456000000,
          orders: 38,
          rating: 4.6
        },
        {
          id: 3,
          name: 'Sport Store',
          revenue: 102000000,
          orders: 120,
          rating: 4.5
        },
        {
          id: 4,
          name: 'Luxury Watches',
          revenue: 255000000,
          orders: 3,
          rating: 5.0
        }
      ]);

      setRecentActivity([
        {
          id: 1,
          type: 'order',
          message: 'Yangi buyurtma qabul qilindi',
          details: 'ORD-006 - iPhone 15 Pro Max',
          time: '2 daqiqa oldin'
        },
        {
          id: 2,
          type: 'user',
          message: 'Yangi foydalanuvchi ro\'yxatdan o\'tdi',
          details: 'Malika Yusupova - Blogger',
          time: '15 daqiqa oldin'
        },
        {
          id: 3,
          type: 'product',
          message: 'Yangi mahsulot qo\'shildi',
          details: 'MacBook Air M2 - Apple Store',
          time: '1 soat oldin'
        },
        {
          id: 4,
          type: 'payment',
          message: 'To\'lov muvaffaqiyatli amalga oshirildi',
          details: 'ORD-005 - 85,000,000 UZS',
          time: '2 soat oldin'
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBagIcon className="h-5 w-5 text-blue-500" />;
      case 'user':
        return <UsersIcon className="h-5 w-5 text-green-500" />;
      case 'product':
        return <ChartBarIcon className="h-5 w-5 text-purple-500" />;
      case 'payment':
        return <CurrencyDollarIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analitika</h1>
        <p className="text-gray-600">Platforma statistikasi va hisobotlar</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami daromad</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(analytics.revenue.total)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getTrendIcon(analytics.revenue.trend)}
            <span className={`ml-2 text-sm font-medium ${
              analytics.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.revenue.change}%
            </span>
            <span className="ml-2 text-sm text-gray-500">o\'tgan oydan</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Buyurtmalar</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.orders.total.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getTrendIcon(analytics.orders.trend)}
            <span className={`ml-2 text-sm font-medium ${
              analytics.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.orders.change}%
            </span>
            <span className="ml-2 text-sm text-gray-500">o\'tgan oydan</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Foydalanuvchilar</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.users.total.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getTrendIcon(analytics.users.trend)}
            <span className={`ml-2 text-sm font-medium ${
              analytics.users.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.users.change}%
            </span>
            <span className="ml-2 text-sm text-gray-500">o\'tgan oydan</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mahsulotlar</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.products.total.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getTrendIcon(analytics.products.trend)}
            <span className={`ml-2 text-sm font-medium ${
              analytics.products.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.products.change}%
            </span>
            <span className="ml-2 text-sm text-gray-500">o\'tgan oydan</span>
          </div>
        </motion.div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eng ko'p sotiladigan mahsulotlar</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} sotilgan</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatPrice(product.revenue)}</p>
                  <div className="flex items-center">
                    <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Merchants */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Eng yaxshi sotuvchilar</h3>
          <div className="space-y-4">
            {topMerchants.map((merchant, index) => (
              <div key={merchant.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{merchant.name}</p>
                    <p className="text-xs text-gray-500">{merchant.orders} buyurtma</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatPrice(merchant.revenue)}</p>
                  <div className="flex items-center">
                    <StarIcon className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500 ml-1">{merchant.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">So'nggi faollik</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.details}</p>
              </div>
              <div className="text-sm text-gray-400">{activity.time}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
} 