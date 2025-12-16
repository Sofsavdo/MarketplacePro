'use client'

import { useState, useEffect } from 'react'
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react'

interface TrackingEvent {
  status: string
  title: string
  description: string
  timestamp: string | null
  completed: boolean
}

interface OrderTrackingProps {
  orderId: string
}

export default function OrderTracking({ orderId }: OrderTrackingProps) {
  const [tracking, setTracking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTracking()
  }, [orderId])

  const fetchTracking = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/tracking`)
      const data = await response.json()
      
      if (response.ok) {
        setTracking(data.tracking)
      }
    } catch (error) {
      console.error('Failed to fetch tracking:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string, completed: boolean) => {
    const iconClass = completed ? 'text-green-600' : 'text-gray-400'
    
    switch (status) {
      case 'pending':
        return <Clock className={`w-6 h-6 ${iconClass}`} />
      case 'confirmed':
        return <CheckCircle className={`w-6 h-6 ${iconClass}`} />
      case 'warehouse':
        return <Package className={`w-6 h-6 ${iconClass}`} />
      case 'shipped':
        return <Truck className={`w-6 h-6 ${iconClass}`} />
      case 'delivered':
        return <MapPin className={`w-6 h-6 ${iconClass}`} />
      default:
        return <Clock className={`w-6 h-6 ${iconClass}`} />
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="text-center py-8">Yuklanmoqda...</div>
      </div>
    )
  }

  if (!tracking) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="text-center py-8 text-gray-500">
          Tracking ma'lumotlari topilmadi
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Buyurtma holati</h2>

      {/* Estimated Delivery */}
      {tracking.estimatedDelivery && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-900">
            <Truck className="w-5 h-5" />
            <div>
              <div className="font-semibold">Taxminiy yetkazib berish</div>
              <div className="text-sm">
                {new Date(tracking.estimatedDelivery).toLocaleDateString('uz-UZ', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courier Info */}
      {tracking.courier && tracking.currentStatus === 'shipped' && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="font-semibold text-green-900 mb-2">Kuryer ma'lumotlari</div>
          <div className="text-sm text-green-800 space-y-1">
            <div>Xizmat: {tracking.courier.name}</div>
            <div>Telefon: {tracking.courier.phone}</div>
            <div>Tracking: {tracking.courier.trackingNumber}</div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {tracking.history.map((event: TrackingEvent, index: number) => (
          <div key={index} className="flex gap-4 pb-8 last:pb-0">
            {/* Icon */}
            <div className="relative flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  event.completed
                    ? 'bg-green-100 border-2 border-green-600'
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}
              >
                {getStatusIcon(event.status, event.completed)}
              </div>
              {index < tracking.history.length - 1 && (
                <div
                  className={`absolute left-1/2 top-12 w-0.5 h-full -translate-x-1/2 ${
                    event.completed ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pt-1">
              <div className="flex items-start justify-between mb-1">
                <h3
                  className={`font-semibold ${
                    event.completed ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {event.title}
                </h3>
                {event.timestamp && (
                  <span className="text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleString('uz-UZ', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
              <p
                className={`text-sm ${
                  event.completed ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Current Status Badge */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Joriy holat:</span>
          <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-semibold rounded-full">
            {tracking.history.find((e: TrackingEvent) => e.completed)?.title || 'Kutilmoqda'}
          </span>
        </div>
      </div>
    </div>
  )
}
