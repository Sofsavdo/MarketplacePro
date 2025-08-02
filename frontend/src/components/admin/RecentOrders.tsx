'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export function RecentOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders([
        {
          id: '#12345',
          customer: 'Aziz Karimov',
          product: 'iPhone 15 Pro Max',
          amount: 15000000,
          status: 'pending',
          date: '2024-01-15 14:30',
          payment: 'card'
        },
        {
          id: '#12344',
          customer: 'Malika Yusupova',
          product: 'Samsung Galaxy S24',
          amount: 12000000,
          status: 'completed',
          date: '2024-01-15 13:45',
          payment: 'payme'
        },
        {
          id: '#12343',
          customer: 'Jasur Toshmatov',
          product: 'MacBook Pro M3',
          amount: 25000000,
          status: 'processing',
          date: '2024-01-15 12:20',
          payment: 'click'
        },
        {
          id: '#12342',
          customer: 'Dilfuza Rahimova',
          product: 'AirPods Pro',
          amount: 3500000,
          status: 'cancelled',
          date: '2024-01-15 11:15',
          payment: 'card'
        },
        {
          id: '#12341',
          customer: 'Shavkat Mirziyoyev',
          product: 'iPad Pro',
          amount: 8500000,
          status: 'completed',
          date: '2024-01-15 10:30',
          payment: 'payme'
        }
      ]);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'processing':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            So'nggi buyurtmalar
          </h3>
          <p className="text-sm text-gray-600">
            Oxirgi 5 ta buyurtma
          </p>
        </div>
        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          Barchasini ko'rish
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="h-5 w-5 text-primary-600" />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{order.id}</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">{order.customer}</p>
                <p className="text-xs text-gray-500">{order.product}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-gray-900">{formatPrice(order.amount)}</p>
              <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
              <p className="text-xs text-gray-500 capitalize">{order.payment}</p>
            </div>

            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
              <EyeIcon className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">12</p>
            <p className="text-xs text-gray-600">Bugun</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">89</p>
            <p className="text-xs text-gray-600">Bu hafta</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">342</p>
            <p className="text-xs text-gray-600">Bu oy</p>
          </div>
        </div>
      </div>
    </div>
  );
} 