'use client'

import Link from 'next/link'
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  ArrowUp,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle
} from 'lucide-react'

export default function SellerDashboard() {
  const stats = [
    {
      label: 'Jami daromad',
      value: '₸ 45,230,000',
      change: '+15.3%',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      label: 'Buyurtmalar',
      value: '234',
      change: '+12.5%',
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      label: 'Mahsulotlar',
      value: '56',
      change: '+8.2%',
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      label: 'Konversiya',
      value: '3.2%',
      change: '+0.5%',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ]

  const recentOrders = [
    {
      id: 'DM20241215000001',
      product: 'iPhone 15 Pro Max',
      customer: 'Alisher K.',
      amount: 15500000,
      status: 'confirmed',
      date: '15 Dek, 10:30',
    },
    {
      id: 'DM20241215000002',
      product: 'Samsung Galaxy S24',
      customer: 'Dilnoza R.',
      amount: 13200000,
      status: 'pending',
      date: '15 Dek, 09:15',
    },
    {
      id: 'DM20241215000003',
      product: 'MacBook Pro 14"',
      customer: 'Bobur T.',
      amount: 28000000,
      status: 'confirmed',
      date: '14 Dek, 18:45',
    },
  ]

  const products = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max 256GB',
      image: 'https://images.unsplash.com/photo-1696446702183-cbd50c2a2476?w=100',
      price: 15500000,
      stock: 12,
      sales: 45,
      status: 'active',
    },
    {
      id: 2,
      title: 'Samsung Galaxy S24 Ultra',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100',
      price: 13200000,
      stock: 8,
      sales: 32,
      status: 'active',
    },
    {
      id: 3,
      title: 'MacBook Pro 14" M3',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100',
      price: 28000000,
      stock: 3,
      sales: 18,
      status: 'low_stock',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Sotuvlar statistikasi va buyurtmalar</p>
        </div>
        <Link
          href="/seller/products/add"
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
        >
          <PlusCircle className="w-5 h-5" />
          Mahsulot qo'shish
        </Link>
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
                <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                  <ArrowUp className="w-4 h-4" />
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
              <Link href="/seller/orders" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                Barchasini ko'rish
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">{order.product}</div>
                    <div className="text-sm text-gray-500">{order.id}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status === 'confirmed' ? 'Tasdiqlandi' : 'Kutilmoqda'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600">{order.customer}</div>
                  <div className="font-bold text-gray-900">
                    {order.amount.toLocaleString()} so'm
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">{order.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Mahsulotlar</h2>
              <Link href="/seller/products" className="text-primary-600 hover:text-primary-700 text-sm font-semibold">
                Barchasini ko'rish
              </Link>
            </div>
          </div>
          <div className="divide-y">
            {products.map((product) => (
              <div key={product.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">{product.title}</div>
                    <div className="flex items-center gap-4 text-sm mb-2">
                      <div className="text-gray-600">
                        Omborda: <span className={`font-semibold ${product.stock < 5 ? 'text-red-600' : 'text-gray-900'}`}>
                          {product.stock} ta
                        </span>
                      </div>
                      <div className="text-gray-600">
                        Sotildi: <span className="font-semibold text-gray-900">{product.sales} ta</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-primary-600">
                        {product.price.toLocaleString()} so'm
                      </div>
                      {product.status === 'low_stock' && (
                        <span className="flex items-center gap-1 text-xs text-red-600 font-semibold">
                          <AlertCircle className="w-4 h-4" />
                          Kam qoldi
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">Jo'natish kerak</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">45</div>
              <div className="text-sm text-gray-600">Yetkazildi</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-sm text-gray-600">Kam qolgan mahsulotlar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
