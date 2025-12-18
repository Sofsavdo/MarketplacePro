'use client'

import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  AlertTriangle,
  Eye
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [realTimeData, setRealTimeData] = useState({
    todayRevenue: 12500000,
    todayOrders: 45,
    activeUsers: 234,
    pendingOrders: 12,
  })

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        todayRevenue: prev.todayRevenue + Math.floor(Math.random() * 1000000),
        todayOrders: prev.todayOrders + (Math.random() > 0.7 ? 1 : 0),
        activeUsers: Math.max(100, prev.activeUsers + Math.floor(Math.random() * 10) - 5),
        pendingOrders: Math.max(0, prev.pendingOrders + Math.floor(Math.random() * 3) - 1),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const salesData = [
    { day: 'Dush', revenue: 18500000, orders: 52 },
    { day: 'Sesh', revenue: 22300000, orders: 68 },
    { day: 'Chor', revenue: 19800000, orders: 61 },
    { day: 'Pay', revenue: 25100000, orders: 74 },
    { day: 'Jum', revenue: 28900000, orders: 89 },
    { day: 'Shan', revenue: 32400000, orders: 95 },
    { day: 'Yak', revenue: 29700000, orders: 87 },
  ]

  const categoryData = [
    { name: 'Elektronika', value: 45, color: '#3B82F6' },
    { name: 'Kiyim', value: 25, color: '#10B981' },
    { name: 'Uy-ro\'zg\'or', value: 15, color: '#F59E0B' },
    { name: 'Sport', value: 10, color: '#EF4444' },
    { name: 'Boshqa', value: 5, color: '#8B5CF6' },
  ]
  const stats = [
    {
      label: 'Jami daromad',
      value: '₸ 125,430,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      label: 'Buyurtmalar',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      label: 'Mahsulotlar',
      value: '856',
      change: '+15.3%',
      trend: 'up',
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      label: 'Foydalanuvchilar',
      value: '3,456',
      change: '+23.1%',
      trend: 'up',
      icon: Users,
      color: 'bg-orange-500',
    },
  ]

  const recentOrders = [
    {
      id: 'DM20241215000001',
      customer: 'Alisher Karimov',
      product: 'iPhone 15 Pro Max',
      amount: 15500000,
      status: 'delivered',
      date: '15 Dek, 2024',
    },
    {
      id: 'DM20241215000002',
      customer: 'Dilnoza Rahimova',
      product: 'Samsung Galaxy S24',
      amount: 13200000,
      status: 'shipped',
      date: '15 Dek, 2024',
    },
    {
      id: 'DM20241215000003',
      customer: 'Bobur Tursunov',
      product: 'MacBook Pro 14"',
      amount: 28000000,
      status: 'pending',
      date: '15 Dek, 2024',
    },
    {
      id: 'DM20241215000004',
      customer: 'Malika Azimova',
      product: 'Apple Watch Series 9',
      amount: 5800000,
      status: 'confirmed',
      date: '15 Dek, 2024',
    },
  ]

  const pendingProducts = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max 512GB',
      seller: 'TechStore UZ',
      price: 16500000,
      image: 'https://images.unsplash.com/photo-1696446702183-cbd50c2a2476?w=100',
      date: '15 Dek, 2024',
    },
    {
      id: 2,
      title: 'Samsung Galaxy Z Fold 5',
      seller: 'Mobile World',
      price: 18000000,
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100',
      date: '15 Dek, 2024',
    },
    {
      id: 3,
      title: 'Sony PlayStation 5',
      seller: 'GameZone',
      price: 7500000,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=100',
      date: '14 Dek, 2024',
    },
  ]

  const getStatusBadge = (status: string) => {
    const styles = {
      delivered: 'bg-green-100 text-green-700',
      shipped: 'bg-blue-100 text-blue-700',
      confirmed: 'bg-purple-100 text-purple-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    
    const labels = {
      delivered: 'Yetkazildi',
      shipped: 'Yo\'lda',
      confirmed: 'Tasdiqlandi',
      pending: 'Kutilmoqda',
      cancelled: 'Bekor qilindi',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">DUBAYMALL platformasi statistikasi</p>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <div className="flex items-center space-x-1 text-sm">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
          <p className="text-green-100 text-sm mb-1">Bugungi daromad</p>
          <p className="text-3xl font-bold">{(realTimeData.todayRevenue / 1000000).toFixed(1)}M</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-8 h-8 opacity-80" />
            <div className="flex items-center space-x-1 text-sm">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
          <p className="text-blue-100 text-sm mb-1">Bugungi buyurtmalar</p>
          <p className="text-3xl font-bold">{realTimeData.todayOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 opacity-80" />
            <div className="flex items-center space-x-1 text-sm">
              <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
          <p className="text-purple-100 text-sm mb-1">Faol foydalanuvchilar</p>
          <p className="text-3xl font-bold">{realTimeData.activeUsers}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 opacity-80" />
            <div className="flex items-center space-x-1 text-sm">
              <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
          <p className="text-orange-100 text-sm mb-1">Kutilayotgan buyurtmalar</p>
          <p className="text-3xl font-bold">{realTimeData.pendingOrders}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Haftalik savdo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value: any) => `${(value / 1000000).toFixed(1)}M`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Daromad" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Kategoriyalar bo'yicha</h3>
          <ResponsiveContainer width="100%" height={250}>
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">So'nggi buyurtmalar</h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                Barchasini ko'rish
              </button>
            </div>
          </div>
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">{order.customer}</div>
                    <div className="text-sm text-gray-500">{order.id}</div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600">{order.product}</div>
                  <div className="font-bold text-gray-900">
                    {order.amount.toLocaleString()} so'm
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">{order.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Products */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Tasdiqlash kutilmoqda</h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                {pendingProducts.length} ta
              </span>
            </div>
          </div>
          <div className="divide-y">
            {pendingProducts.map((product) => (
              <div key={product.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">{product.title}</div>
                    <div className="text-sm text-gray-500 mb-2">{product.seller}</div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-primary-600">
                        {product.price.toLocaleString()} so'm
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">45</div>
              <div className="text-sm text-gray-600">Kutilayotgan buyurtmalar</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">156</div>
              <div className="text-sm text-gray-600">Aktiv blogerlar</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">89</div>
              <div className="text-sm text-gray-600">Tasdiqlangan sotuvchilar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
