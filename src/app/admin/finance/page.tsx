'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, Download, Calendar } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AdminFinancePage() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

  const revenueData = [
    { month: 'Yan', revenue: 125000000, expenses: 45000000, profit: 80000000 },
    { month: 'Fev', revenue: 142000000, expenses: 48000000, profit: 94000000 },
    { month: 'Mar', revenue: 158000000, expenses: 52000000, profit: 106000000 },
    { month: 'Apr', revenue: 171000000, expenses: 55000000, profit: 116000000 },
    { month: 'May', revenue: 189000000, expenses: 58000000, profit: 131000000 },
    { month: 'Iyun', revenue: 205000000, expenses: 62000000, profit: 143000000 },
  ]

  const commissionData = [
    { seller: 'TechStore UZ', sales: 45000000, commission: 4500000, rate: 10 },
    { seller: 'Fashion Hub', sales: 38000000, commission: 3800000, rate: 10 },
    { seller: 'Home Decor', sales: 32000000, commission: 3200000, rate: 10 },
    { seller: 'Sports Pro', sales: 28000000, commission: 2800000, rate: 10 },
    { seller: 'Beauty Shop', sales: 25000000, commission: 2500000, rate: 10 },
  ]

  const paymentMethods = [
    { method: 'Click', amount: 85000000, percentage: 42 },
    { method: 'Payme', amount: 68000000, percentage: 34 },
    { method: 'Naqd', amount: 48000000, percentage: 24 },
  ]

  const metrics = [
    {
      title: 'Jami daromad',
      value: '205M',
      change: '+18.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      description: 'Ushbu oy',
    },
    {
      title: 'Komissiya',
      value: '20.5M',
      change: '+15.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue',
      description: '10% o\'rtacha',
    },
    {
      title: 'Xarajatlar',
      value: '62M',
      change: '+6.8%',
      trend: 'up',
      icon: TrendingDown,
      color: 'red',
      description: 'Operatsion',
    },
    {
      title: 'Sof foyda',
      value: '143M',
      change: '+23.1%',
      trend: 'up',
      icon: Wallet,
      color: 'purple',
      description: 'Ushbu oy',
    },
  ]

  const transactions = [
    {
      id: '1',
      date: new Date().toISOString(),
      type: 'income',
      description: 'Buyurtma to\'lovi #DM12345',
      amount: 2500000,
      status: 'completed',
    },
    {
      id: '2',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'commission',
      description: 'Sotuvchi komissiyasi - TechStore',
      amount: 450000,
      status: 'completed',
    },
    {
      id: '3',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      type: 'expense',
      description: 'Server xarajatlari',
      amount: -150000,
      status: 'completed',
    },
    {
      id: '4',
      date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      type: 'income',
      description: 'Buyurtma to\'lovi #DM12346',
      amount: 1800000,
      status: 'pending',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Moliyaviy Boshqaruv</h1>
        <p className="text-gray-600">Platformaning moliyaviy ko'rsatkichlari</p>
      </div>

      {/* Period Selector */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Davr:</span>
        </div>
        <div className="inline-flex rounded-lg border border-gray-300 bg-white">
          {(['week', 'month', 'quarter', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              } ${p === 'week' ? 'rounded-l-lg' : p === 'year' ? 'rounded-r-lg' : ''}`}
            >
              {p === 'week' ? 'Hafta' : p === 'month' ? 'Oy' : p === 'quarter' ? 'Kvartal' : 'Yil'}
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
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{metric.title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-xs text-gray-500">{metric.description}</p>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Daromad va xarajatlar</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Batafsil
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => `${(value / 1000000).toFixed(0)}M`} />
              <Legend />
              <Bar dataKey="revenue" fill="#10B981" name="Daromad" />
              <Bar dataKey="expenses" fill="#EF4444" name="Xarajat" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profit Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Sof foyda dinamikasi</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Batafsil
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any) => `${(value / 1000000).toFixed(0)}M`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                name="Foyda"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Commission Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Sotuvchilar komissiyasi</h3>
            <button className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
          <div className="space-y-4">
            {commissionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{item.seller}</p>
                  <p className="text-sm text-gray-500">
                    Savdo: {(item.sales / 1000000).toFixed(1)}M so'm
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {(item.commission / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-gray-500">{item.rate}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">To'lov usullari</h3>
          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{method.method}</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {(method.amount / 1000000).toFixed(0)}M
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {method.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">So'nggi tranzaksiyalar</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Barchasini ko'rish
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sana</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tavsif</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Turi</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Summa</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleString('uz-UZ')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-800' :
                      transaction.type === 'commission' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? 'Kirim' :
                       transaction.type === 'commission' ? 'Komissiya' : 'Chiqim'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-medium ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.amount.toLocaleString('uz-UZ')} so'm
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status === 'completed' ? 'Bajarildi' : 'Kutilmoqda'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
