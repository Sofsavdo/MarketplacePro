'use client'

import { TrendingUp, MousePointer, ShoppingCart, DollarSign } from 'lucide-react'

export default function BloggerStatsPage() {
  const stats = {
    totalClicks: 1245,
    conversions: 87,
    conversionRate: 6.99,
    totalEarnings: 8700000,
  }

  const topLinks = [
    { product: 'iPhone 15 Pro Max', clicks: 456, conversions: 32, earnings: 3200000 },
    { product: 'MacBook Pro 14"', clicks: 234, conversions: 18, earnings: 2800000 },
    { product: 'Samsung Galaxy S24', clicks: 345, conversions: 25, earnings: 2100000 },
  ]

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Statistika</h1>
        <p className="text-gray-600 mt-1">Kliklar va konversiyalar tahlili</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MousePointer className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Jami kliklar</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalClicks}</div>
          <div className="text-sm text-blue-600 mt-2">+15.3% bu oyda</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Konversiyalar</div>
          <div className="text-2xl font-bold text-gray-900">{stats.conversions}</div>
          <div className="text-sm text-green-600 mt-2">+8.7% bu oyda</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Konversiya darajasi</div>
          <div className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</div>
          <div className="text-sm text-purple-600 mt-2">+0.5% bu oyda</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Jami daromad</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalEarnings.toLocaleString()} so'm
          </div>
          <div className="text-sm text-yellow-600 mt-2">+12.1% bu oyda</div>
        </div>
      </div>

      {/* Top Links */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-6">Eng samarali havolalar</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mahsulot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kliklar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Konversiyalar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Daromad
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topLinks.map((link, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {link.product}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{link.clicks}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{link.conversions}</td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">
                    {link.earnings.toLocaleString()} so'm
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
