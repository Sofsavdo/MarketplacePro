'use client'

import { useState } from 'react'
import { Package, Eye, MessageSquare, Star } from 'lucide-react'
import Link from 'next/link'
import OrderTracking from '@/components/orders/OrderTracking'

export default function CustomerOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  // Mock orders
  const orders = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-12-15',
      total: 15500000,
      status: 'shipped',
      items: [
        {
          id: '1',
          name: 'iPhone 15 Pro Max 256GB',
          image: 'https://images.unsplash.com/photo-1696446702183-cbd50c2a2476?w=200',
          quantity: 1,
          price: 15500000,
        },
      ],
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-12-10',
      total: 13200000,
      status: 'delivered',
      items: [
        {
          id: '2',
          name: 'Samsung Galaxy S24 Ultra',
          image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200',
          quantity: 1,
          price: 13200000,
        },
      ],
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mening buyurtmalarim</h1>
          <p className="text-gray-600 mt-1">Barcha buyurtmalaringiz va ularning holati</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Orders List */}
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm border">
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      getStatusBadge(order.status).color
                    }`}
                  >
                    {getStatusBadge(order.status).text}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x {item.price.toLocaleString()} so'm
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="font-semibold text-gray-900">Jami:</span>
                  <span className="font-bold text-primary-600">
                    {order.total.toLocaleString()} so'm
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setSelectedOrder(order.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                  >
                    <Eye className="w-4 h-4" />
                    Kuzatish
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  {order.status === 'delivered' && (
                    <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {orders.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Buyurtmalar yo'q</p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  Xarid qilish
                </Link>
              </div>
            )}
          </div>

          {/* Tracking Panel */}
          <div className="lg:sticky lg:top-8 h-fit">
            {selectedOrder ? (
              <OrderTracking orderId={selectedOrder} />
            ) : (
              <div className="bg-white rounded-xl p-12 shadow-sm border text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Buyurtma holatini ko'rish uchun "Kuzatish" tugmasini bosing
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
