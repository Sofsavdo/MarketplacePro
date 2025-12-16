'use client'

import { 
  DollarSign, 
  MousePointerClick, 
  TrendingUp,
  Clock,
  Copy,
  ExternalLink,
  Gift,
  ArrowUp
} from 'lucide-react'

export default function BloggerDashboard() {
  const stats = [
    {
      label: 'Jami daromad',
      value: '₸ 8,450,000',
      change: '+18.2%',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      label: 'Kliklar',
      value: '2,345',
      change: '+12.5%',
      icon: MousePointerClick,
      color: 'bg-blue-500',
    },
    {
      label: 'Konversiya',
      value: '4.8%',
      change: '+1.2%',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      label: 'Kutilmoqda',
      value: '₸ 2,150,000',
      change: '14 kun',
      icon: Clock,
      color: 'bg-orange-500',
    },
  ]

  const promoCode = 'BLOGGER2024'
  const referralLink = 'https://dubaymall.uz/ref/blogger2024'

  const topProducts = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max',
      image: 'https://images.unsplash.com/photo-1696446702183-cbd50c2a2476?w=100',
      clicks: 456,
      conversions: 23,
      earnings: 3565000,
    },
    {
      id: 2,
      title: 'Samsung Galaxy S24',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100',
      clicks: 342,
      conversions: 18,
      earnings: 2376000,
    },
    {
      id: 3,
      title: 'MacBook Pro 14"',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100',
      clicks: 234,
      conversions: 12,
      earnings: 3360000,
    },
  ]

  const recentEarnings = [
    {
      id: 1,
      order: 'DM20241215000001',
      product: 'iPhone 15 Pro Max',
      amount: 155000,
      status: 'available',
      date: '15 Dek, 2024',
    },
    {
      id: 2,
      order: 'DM20241215000002',
      product: 'Samsung Galaxy S24',
      amount: 132000,
      status: 'pending',
      date: '15 Dek, 2024',
    },
    {
      id: 3,
      order: 'DM20241214000045',
      product: 'Apple Watch Series 9',
      amount: 58000,
      status: 'paid',
      date: '14 Dek, 2024',
    },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Nusxalandi!')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Daromadlar va statistika</p>
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
                  {stat.change.includes('%') && <ArrowUp className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Promo Code & Link */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-6 h-6" />
            <h3 className="text-xl font-bold">Shaxsiy promo kod</h3>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
            <div className="text-sm text-gold-100 mb-1">Sizning kodingiz:</div>
            <div className="text-2xl font-bold">{promoCode}</div>
          </div>
          <button
            onClick={() => copyToClipboard(promoCode)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gold-600 rounded-lg hover:bg-gold-50 transition font-semibold"
          >
            <Copy className="w-4 h-4" />
            Nusxalash
          </button>
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink className="w-6 h-6" />
            <h3 className="text-xl font-bold">Referal ssilka</h3>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
            <div className="text-sm text-primary-100 mb-1">Sizning ssilkangiz:</div>
            <div className="text-sm font-mono break-all">{referralLink}</div>
          </div>
          <button
            onClick={() => copyToClipboard(referralLink)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition font-semibold"
          >
            <Copy className="w-4 h-4" />
            Nusxalash
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Eng ko'p daromad keltirgan</h2>
          </div>
          <div className="divide-y">
            {topProducts.map((product) => (
              <div key={product.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-2">{product.title}</div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Kliklar</div>
                        <div className="font-semibold text-gray-900">{product.clicks}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Sotuvlar</div>
                        <div className="font-semibold text-gray-900">{product.conversions}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Daromad</div>
                        <div className="font-semibold text-green-600">
                          {product.earnings.toLocaleString()} so'm
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Earnings */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">So'nggi daromadlar</h2>
          </div>
          <div className="divide-y">
            {recentEarnings.map((earning) => (
              <div key={earning.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">{earning.product}</div>
                    <div className="text-sm text-gray-500">{earning.order}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    earning.status === 'paid' 
                      ? 'bg-green-100 text-green-700'
                      : earning.status === 'available'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {earning.status === 'paid' ? 'To\'landi' : earning.status === 'available' ? 'Mavjud' : 'Kutilmoqda'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-gray-600">{earning.date}</div>
                  <div className="font-bold text-gray-900">
                    {earning.amount.toLocaleString()} so'm
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">To'lov muddati</h3>
            <p className="text-gray-700">
              Daromadlaringiz mahsulot yetkazilgandan 14 kun o'tgach avtomatik to'lanadi. 
              Hozirda <span className="font-bold">₸ 2,150,000</span> kutilmoqda.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
