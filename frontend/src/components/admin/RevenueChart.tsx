'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUpIcon,
  TrendingDownIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export function RevenueChart() {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // Simulate chart data
    const generateData = () => {
      const data = [];
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      
      for (let i = 0; i < days; i++) {
        data.push({
          date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          revenue: Math.floor(Math.random() * 50000) + 10000,
          orders: Math.floor(Math.random() * 100) + 20
        });
      }
      return data;
    };

    setChartData(generateData());
  }, [timeRange]);

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
  const avgRevenue = totalRevenue / chartData.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Daromad dinamikasi
          </h3>
          <p className="text-sm text-gray-600">
            Platforma daromadlari va buyurtmalar
          </p>
        </div>
        
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          {['7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Jami daromad</p>
              <p className="text-2xl font-bold text-green-900">
                ${(totalRevenue / 1000).toFixed(1)}K
              </p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12.5% o'tgan davrdan</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Jami buyurtmalar</p>
              <p className="text-2xl font-bold text-blue-900">
                {totalOrders.toLocaleString()}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUpIcon className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-sm text-blue-600">+8.3% o'tgan davrdan</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">O'rtacha buyurtma</p>
              <p className="text-2xl font-bold text-purple-900">
                ${avgRevenue.toFixed(0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUpIcon className="h-4 w-4 text-purple-500 mr-1" />
            <span className="text-sm text-purple-600">+5.2% o'tgan davrdan</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
          {chartData.map((item, index) => {
            const maxRevenue = Math.max(...chartData.map(d => d.revenue));
            const height = (item.revenue / maxRevenue) * 100;
            
            return (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: index * 0.05 }}
                className="relative flex-1 mx-1"
              >
                <div className="bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg h-full min-h-[20px] hover:from-primary-600 hover:to-primary-500 transition-all duration-300 cursor-pointer group">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ${item.revenue.toLocaleString()}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
          {chartData.filter((_, index) => index % Math.ceil(chartData.length / 5) === 0).map((item, index) => (
            <span key={index}>{item.date}</span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center mt-4 space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-500 rounded"></div>
          <span className="text-sm text-gray-600">Daromad</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-600">Buyurtmalar</span>
        </div>
      </div>
    </div>
  );
} 