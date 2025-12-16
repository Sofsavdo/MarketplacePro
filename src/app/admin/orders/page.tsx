'use client'

import { useState } from 'react'
import { Package, Search, Filter, Eye } from 'lucide-react'

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all')

  const orders = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: 'Alisher Karimov',
      seller: 'TechStore UZ',
      total: 15500000,
      status: 'delivered',
      date: '2024-12-15',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: 'Dilshod Rahimov',
      seller: 'TechStore UZ',
      total: 13200000,
      status: 'shipped',
      date: '2024-12-14',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customer: 'Nodira Azimova',
      seller: 'TechStore UZ',
      total: 28000000,
      status: 'pending',
      date: '2024-12-13',
    },
  ]

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Kutilmoqda' },
      confirmed: { color: 'bg-blue-100 text-blue-800', text: 'Tasdiqlandi' },
      shipped: { color: 'bg-purple-100 text-purple-800', text: 'Yuborildi' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Yetkazildi' },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'Bekor qilindi' },
    }
    return config[status as keyof typeof config] || config.pending
  }

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  )

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Buyurtmalar</h1>
        <p className="text-gray-600 mt-1">Barcha buyurtmalarni boshqarish</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">Jami</div>
          <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">Kutilmoqda</div>
          <div className="text-2xl font-bold text-yellow-600">
            {orders.filter(o => o.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">Yuborildi</div>
          <div className="text-2xl font-bold text-purple-600">
            {orders.filter(o => o.status === 'shipped').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="text-sm text-gray-600 mb-1">Yetkazildi</div>
          <div className="text-2xl font-bold text-green-600">
            {orders.filter(o => o.status === 'delivered').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Barcha statuslar</option>
            <option value="pending">Kutilmoqda</option>
            <option value="confirmed">Tasdiqlandi</option>
            <option value="shipped">Yuborildi</option>
            <option value="delivered">Yetkazildi</option>
            <option value="cancelled">Bekor qilindi</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Buyurtma
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Mijoz
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sotuvchi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Summa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{order.orderNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.seller}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.total.toLocaleString()} so'm
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status).color}`}>
                      {getStatusBadge(order.status).text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.date).toLocaleDateString('uz-UZ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-primary-600 hover:text-primary-900">
                      <Eye className="w-5 h-5" />
                    </button>
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
