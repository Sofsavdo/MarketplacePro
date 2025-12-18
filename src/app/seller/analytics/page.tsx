'use client'

import { useState } from 'react'
import { TrendingUp, DollarSign, ShoppingBag, Users, Calendar, ArrowUp, ArrowDown } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function SellerAnalyticsPage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')

  // Mock data for charts
  const salesData = [
    { name: 'Dush', sales: 4200000, orders: 12 },
    { name: 'Sesh', sales: 3800000, orders: 10 },
    { name: 'Chor', sales: 5100000, orders: 15 },
    { name: 'Pay', sales: 4600000, orders: 13 },
    { name: 'Jum', sales: 6200000, orders: 18 },
    { name: 'Shan', sales: 7800000, orders: 22 },
    { name: 'Yak', sales: 6500000, orders: 19 },
  ]

  const categoryData = [
    { name: 'Elektronika', value: 45, color: '#3B82F6' },
    { name: 'Kiyim', value: 25, color: '#10B981' },
    { name: 'Uy-ro\'zg\'or', value: 15, color: '#F59E0B' },
    { name: 'Sport', value: 10, color: '#EF4444' },
    { name: 'Boshqa', value: 5, color: '#8B5CF6' },
  ]

  const topProducts = [
    { name: 'iPhone 15 Pro Max', sales: 15, revenue: 232500000 },
    { name: 'Samsung Galaxy S24', sales: 12, revenue: 158400000 },
    { name: 'MacBook Pro M3', sales: 8, revenue: 200000000 },
    { name: 'AirPods Pro 2', sales: 25, revenue: 62500000 },
    { name: 'iPad Air M2', sales: 10, revenue: 85000000 },
  ]

  const metrics = [
    {
      title: 'Jami savdo',
      value: '38.2M',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue',
    },
    {
      title: 'Buyurtmalar',
      value: '109',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'green',
    },
    {
      title: 'Mijozlar',
      value: '87',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'O\'rtacha check',
      value: '350K',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      color: 'orange',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tahlil va Statistika</h1>
        <p className="text-gray-600">Biznesingiz ko'rsatkichlarini kuzatib boring</p>
      </div>

      {/* Period Selector */}
      <div className="flex justify-end mb-6">
        <div className="inline-flex rounded-lg border border-gray-300 bg-white">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              } ${p === 'week' ? 'rounded-l-lg' : p === 'year' ? 'rounded-r-lg' : ''}`}
            >
              {p === 'week' ? 'Hafta' : p === 'month' ? 'Oy' : 'Yil'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${metric.color}-100 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{metric.title}</p>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Savdo dinamikasi</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => `${(value / 1000000).toFixed(1)}M so'm`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Savdo"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Buyurtmalar soni</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#10B981" name="Buyurtmalar" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Kategoriyalar bo'yicha</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top mahsulotlar</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} ta sotildi</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {(product.revenue / 1000000).toFixed(1)}M
                  </p>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(product.sales / 25) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
