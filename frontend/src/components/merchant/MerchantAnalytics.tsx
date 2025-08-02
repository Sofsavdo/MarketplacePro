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

export function MerchantAnalytics() {
  const [analytics, setAnalytics] = useState({
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

  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

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
          name: 'MacBook Pro M3 Max',
          sales: 25,
          revenue: 625000000,
          rating: 4.9
        },
        {
          id: 3,
          name: 'AirPods Pro 2',
          sales: 120,
          revenue: 300000000,
          rating: 4.7
        },
        {
          id: 4,
          name: 'iPad Pro 12.9',
          sales: 18,
          revenue: 153000000,
          rating: 4.6
        }
      ]);

      setRecentOrders([
        {
          id: 'ORD-001',
          customer: 'Aziz Karimov',
          total: 15000000,
          status: 'delivered',
          date: '2024-01-15'
        },
        {
          id: 'ORD-002',
          customer: 'Malika Yusupova',
          total: 25000000,
          status: 'shipped',
          date: '2024-01-14'
        },
        {
          id: 'ORD-003',
          customer: 'Jasur Toshmatov',
          total: 45000000,
          status: 'processing',
          date: '2024-01-13'
        },
        {
          id: 'ORD-004',
          customer: 'Dilfuza Rahimova',
          total: 2500000,
          status: 'pending',
          date: '2024-01-12'
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
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Analitika</h2>
        <p className="text-gray-600">Do'koningiz statistikasi va hisobotlar</p>
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

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">So'nggi buyurtmalar</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ShoppingBagIcon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{formatPrice(order.total)}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status === 'delivered' ? 'Yetkazilgan' :
                     order.status === 'shipped' ? 'Yuborilgan' :
                     order.status === 'processing' ? 'Jarayonda' :
                     order.status === 'pending' ? 'Kutilmoqda' : order.status}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatPrice(analytics.revenue.total)}</p>
            <p className="text-sm text-gray-600">Jami daromad</p>
            <div className="flex items-center justify-center mt-2">
              {getTrendIcon(analytics.revenue.trend)}
              <span className={`ml-1 text-sm font-medium ${
                analytics.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {analytics.revenue.change}%
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.orders.total}</p>
            <p className="text-sm text-gray-600">Buyurtmalar</p>
            <div className="flex items-center justify-center mt-2">
              {getTrendIcon(analytics.orders.trend)}
              <span className={`ml-1 text-sm font-medium ${
                analytics.orders.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {analytics.orders.change}%
              </span>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <EyeIcon className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.views.total.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Ko'rishlar</p>
            <div className="flex items-center justify-center mt-2">
              {getTrendIcon(analytics.views.trend)}
              <span className={`ml-1 text-sm font-medium ${
                analytics.views.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {analytics.views.change}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 