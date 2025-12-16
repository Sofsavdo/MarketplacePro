'use client'

import { useState } from 'react'
import { DollarSign, Clock, CheckCircle, TrendingUp, Download } from 'lucide-react'

export default function BloggerEarningsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'available' | 'paid'>('all')

  // Mock earnings data
  const earnings = [
    {
      id: '1',
      order_number: 'DM20241215000001',
      product: 'iPhone 15 Pro Max',
      amount: 3100000,
      status: 'paid',
      date: '2024-12-01',
      paid_date: '2024-12-15',
    },
    {
      id: '2',
      order_number: 'DM20241215000002',
      product: 'Samsung Galaxy S24',
      amount: 2640000,
      status: 'available',
      date: '2024-12-10',
      available_date: '2024-12-24',
    },
    {
      id: '3',
      order_number: 'DM20241215000003',
      product: 'MacBook Pro 14"',
      amount: 5600000,
      status: 'pending',
      date: '2024-12-14',
      available_date: '2024-12-28',
    },
  ]

  const filteredEarnings = filter === 'all' 
    ? earnings 
    : earnings.filter(e => e.status === filter)

  const totalPaid = earnings.filter(e => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0)
  const totalAvailable = earnings.filter(e => e.status === 'available').reduce((sum, e) => sum + e.amount, 0)
  const totalPending = earnings.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0)

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      available: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
    }
    
    const labels = {
      paid: 'To\'landi',
      available: 'Mavjud',
      pending: 'Kutilmoqda',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Daromadlar</h1>
        <p className="text-gray-600 mt-1">Sizning daromadlaringiz va to'lovlar</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">To'langan</div>
              <div className="text-2xl font-bold text-gray-900">
                {totalPaid.toLocaleString()} so'm
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Mavjud</div>
              <div className="text-2xl font-bold text-gray-900">
                {totalAvailable.toLocaleString()} so'm
              </div>
            </div>
          </div>
          {totalAvailable > 0 && (
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm">
              Yechib olish
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Kutilmoqda</div>
              <div className="text-2xl font-bold text-gray-900">
                {totalPending.toLocaleString()} so'm
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {(['all', 'pending', 'available', 'paid'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              {f === 'all' && 'Barchasi'}
              {f === 'pending' && 'Kutilmoqda'}
              {f === 'available' && 'Mavjud'}
              {f === 'paid' && 'To\'langan'}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold">
          <Download className="w-5 h-5" />
          Hisobotni yuklab olish
        </button>
      </div>

      {/* Earnings List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Buyurtma</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mahsulot</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Summa</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Holat</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredEarnings.map((earning) => (
                <tr key={earning.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{earning.order_number}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{earning.product}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">
                      {earning.amount.toLocaleString()} so'm
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(earning.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {new Date(earning.date).toLocaleDateString('uz-UZ')}
                    </div>
                    {earning.status === 'pending' && (
                      <div className="text-xs text-yellow-600 mt-1">
                        Mavjud: {new Date(earning.available_date!).toLocaleDateString('uz-UZ')}
                      </div>
                    )}
                    {earning.status === 'paid' && (
                      <div className="text-xs text-green-600 mt-1">
                        To'landi: {new Date(earning.paid_date!).toLocaleDateString('uz-UZ')}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">To'lov muddati</h3>
            <p className="text-gray-700 text-sm">
              Daromadlaringiz mahsulot yetkazilgandan 14 kun o'tgach avtomatik to'lanadi. 
              Bu muddat mijozning mahsulotni qaytarish huquqini ta'minlash uchun zarur.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
