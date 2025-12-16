'use client'

import { useEffect, useState } from 'react'
import { Package, Truck, CheckCircle, Clock } from 'lucide-react'

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [filter])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      let filteredOrders = data.orders || []
      if (filter !== 'all') {
        filteredOrders = filteredOrders.filter((o: any) => o.status === filter)
      }
      
      setOrders(filteredOrders)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />
      case 'confirmed': return <Package className="w-5 h-5" />
      case 'shipped': return <Truck className="w-5 h-5" />
      case 'delivered': return <CheckCircle className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
    }
    
    const labels = {
      pending: 'Kutilmoqda',
      confirmed: 'Tasdiqlandi',
      shipped: 'Yo\'lda',
      delivered: 'Yetkazildi',
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
        <h1 className="text-3xl font-bold text-gray-900">Buyurtmalar</h1>
        <p className="text-gray-600 mt-1">Barcha buyurtmalaringiz</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'confirmed', 'shipped', 'delivered'] as const).map((f) => (
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
            {f === 'confirmed' && 'Tasdiqlandi'}
            {f === 'shipped' && 'Yo\'lda'}
            {f === 'delivered' && 'Yetkazildi'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Yuklanmoqda...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-600">Buyurtma topilmadi</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{order.order_number}</h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleString('uz-UZ')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600">
                    {order.total?.toLocaleString()} so'm
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.items?.length || 0} ta mahsulot
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Yetkazib berish manzili:</div>
                  <div className="font-medium text-gray-900">{order.delivery_address}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Telefon:</div>
                  <div className="font-medium text-gray-900">{order.delivery_phone}</div>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="border-t pt-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Mahsulotlar:</div>
                  <div className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">Mahsulot #{item.product_id}</span>
                        <span className="font-medium text-gray-900">
                          {item.quantity} x {item.price?.toLocaleString()} so'm
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
