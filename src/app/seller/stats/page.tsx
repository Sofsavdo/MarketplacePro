'use client'

import { TrendingUp, Package, DollarSign, Users } from 'lucide-react'

export default function SellerStatsPage() {
  const stats = {
    totalSales: 45000000,
    totalOrders: 156,
    totalProducts: 24,
    avgOrderValue: 288461,
  }

  const topProducts = [
    { name: 'iPhone 15 Pro Max', sales: 12, revenue: 186000000 },
    { name: 'MacBook Pro 14"', sales: 8, revenue: 224000000 },
    { name: 'Samsung Galaxy S24', sales: 15, revenue: 198000000 },
  ]

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Statistika</h1>
        <p className="text-gray-600 mt-1">Sotuvlar va mahsulotlar tahlili</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Jami sotuvlar</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalSales.toLocaleString()} so'm
          </div>
          <div className="text-sm text-green-600 mt-2">+12.5% bu oyda</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Buyurtmalar</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
          <div className="text-sm text-blue-600 mt-2">+8.3% bu oyda</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Mahsulotlar</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
          <div className="text-sm text-purple-600 mt-2">+3 yangi</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">O'rtacha check</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.avgOrderValue.toLocaleString()} so'm
          </div>
          <div className="text-sm text-yellow-600 mt-2">+5.2% bu oyda</div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-6">Eng ko'p sotiladigan mahsulotlar</h2>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600 font-bold">{index + 1}</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-600">{product.sales} ta sotildi</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-900">
                  {product.revenue.toLocaleString()} so'm
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
