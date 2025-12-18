'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { Bell, Package, ShoppingBag, TrendingUp, CheckCircle, X } from 'lucide-react'

interface Notification {
  id: string
  type: 'order' | 'delivery' | 'promo' | 'system'
  title: string
  message: string
  read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }

    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'order',
        title: 'Buyurtma tasdiqlandi',
        message: 'Sizning #12345 raqamli buyurtmangiz tasdiqlandi va tez orada yetkazib beriladi.',
        read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: '2',
        type: 'delivery',
        title: 'Buyurtma yo\'lda',
        message: 'Sizning buyurtmangiz yo\'lda. Taxminiy yetkazib berish vaqti: 2 soat.',
        read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: '3',
        type: 'promo',
        title: 'Yangi chegirma!',
        message: 'Barcha elektronika mahsulotlariga 20% chegirma. Promokod: TECH20',
        read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: '4',
        type: 'system',
        title: 'Xush kelibsiz!',
        message: 'DUBAYMALL platformasiga xush kelibsiz. Sizga yoqadigan mahsulotlarni toping!',
        read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      },
    ]

    setNotifications(mockNotifications)
    setLoading(false)
  }, [router])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-6 h-6 text-blue-600" />
      case 'delivery':
        return <Package className="w-6 h-6 text-green-600" />
      case 'promo':
        return <TrendingUp className="w-6 h-6 text-purple-600" />
      default:
        return <Bell className="w-6 h-6 text-gray-600" />
    }
  }

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
    
    if (seconds < 60) return 'Hozirgina'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} daqiqa oldin`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} soat oldin`
    return `${Math.floor(seconds / 86400)} kun oldin`
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bildirishnomalar</h1>
              <p className="text-gray-600">
                {unreadCount > 0 
                  ? `${unreadCount} ta o'qilmagan bildirishnoma`
                  : 'Barcha bildirishnomalar o\'qilgan'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Barchasini o'qilgan qilish</span>
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Bell className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bildirishnomalar yo'q
              </h2>
              <p className="text-gray-600">
                Yangi bildirishnomalar paydo bo'lganda bu yerda ko'rinadi
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-lg p-6 transition-all ${
                    !notification.read ? 'border-l-4 border-primary-600' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{notification.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {getTimeAgo(notification.created_at)}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            O'qilgan deb belgilash
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
