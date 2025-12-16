'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag, Search, ShoppingCart, User, TrendingUp, Store, X, Mail, Phone, Instagram, MessageCircle } from 'lucide-react'

export default function HomePage() {
  const [showSellerModal, setShowSellerModal] = useState(false)
  const [showBloggerModal, setShowBloggerModal] = useState(false)

  // Mock products
  const products = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max 256GB',
      image: 'https://images.unsplash.com/photo-1696446702183-cbd50c2a2476?w=500',
      price: 15500000,
      originalPrice: 17000000,
      discount: 9,
      rating: 4.8,
      reviews: 124,
      badge: 'Yangi'
    },
    {
      id: 2,
      title: 'Samsung Galaxy S24 Ultra',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
      price: 13200000,
      originalPrice: 14500000,
      discount: 9,
      rating: 4.7,
      reviews: 89,
      badge: 'Top'
    },
    {
      id: 3,
      title: 'MacBook Pro 14" M3',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
      price: 28000000,
      originalPrice: 31000000,
      discount: 10,
      rating: 4.9,
      reviews: 156,
      badge: 'Premium'
    },
    {
      id: 4,
      title: 'Sony WH-1000XM5',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500',
      price: 4200000,
      originalPrice: 4800000,
      discount: 13,
      rating: 4.6,
      reviews: 234,
    },
    {
      id: 5,
      title: 'Apple Watch Series 9',
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500',
      price: 5800000,
      originalPrice: 6500000,
      discount: 11,
      rating: 4.8,
      reviews: 178,
      badge: 'Yangi'
    },
    {
      id: 6,
      title: 'iPad Pro 12.9" M2',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      price: 12500000,
      originalPrice: 14000000,
      discount: 11,
      rating: 4.7,
      reviews: 92,
    },
  ]

  const categories = [
    { name: 'Telefonlar', icon: '📱', count: 234 },
    { name: 'Noutbuklar', icon: '💻', count: 156 },
    { name: 'Aksessuarlar', icon: '🎧', count: 567 },
    { name: 'Soatlar', icon: '⌚', count: 89 },
    { name: 'Planshetlar', icon: '📱', count: 123 },
    { name: 'Kameralar', icon: '📷', count: 78 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>📞 +998 90 123 45 67</span>
              <span>📧 support@dubaymall.uz</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBloggerModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-lg hover:from-gold-600 hover:to-gold-700 transition text-sm font-semibold"
              >
                <TrendingUp className="w-4 h-4" />
                Bloger bo'lish
              </button>
              <button
                onClick={() => setShowSellerModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition text-sm font-semibold"
              >
                <Store className="w-4 h-4" />
                DUBAYMALL da soting
              </button>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">
                DUBAYMALL
              </span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Mahsulot qidirish..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition">
                <User className="w-6 h-6" />
                <span className="text-sm font-medium">Kirish</span>
              </Link>
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-primary-600 transition" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-primary-50 rounded-lg transition whitespace-nowrap"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-semibold">{cat.name}</div>
                  <div className="text-xs text-gray-500">{cat.count} ta</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">Premium Mahsulotlar</h1>
              <p className="text-xl text-primary-100 mb-6">
                Tez yetkazib berish • Kafolat • Chegirmalar
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <div>
                    <div className="font-semibold">1-2 kun</div>
                    <div className="text-sm text-primary-100">Yetkazib berish</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div>
                    <div className="font-semibold">Kafolat</div>
                    <div className="text-sm text-primary-100">Sifat kafolati</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <div className="font-semibold">Chegirmalar</div>
                    <div className="text-sm text-primary-100">Har kuni yangi</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400"
                alt="Shopping"
                className="w-64 h-64 object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Yangi mahsulotlar</h2>
          <Link href="/products" className="text-primary-600 hover:text-primary-700 font-semibold">
            Barchasini ko'rish →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition group"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                {product.badge && (
                  <div className="absolute top-2 left-2 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {product.badge}
                  </div>
                )}
                {product.discount && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                    -{product.discount}%
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary-600 transition">
                  {product.title}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-xs ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
                <div className="space-y-1">
                  {product.originalPrice && (
                    <div className="text-xs text-gray-400 line-through">
                      {product.originalPrice.toLocaleString()} so'm
                    </div>
                  )}
                  <div className="text-lg font-bold text-primary-600">
                    {product.price.toLocaleString()} so'm
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🚚</span>
              </div>
              <div>
                <div className="font-bold">Tez yetkazib berish</div>
                <div className="text-sm text-gray-600">1-2 kun ichida</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <div className="font-bold">Sifat kafolati</div>
                <div className="text-sm text-gray-600">100% asl mahsulot</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💳</span>
              </div>
              <div>
                <div className="font-bold">Xavfsiz to'lov</div>
                <div className="text-sm text-gray-600">Click, Payme, Uzum</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎁</span>
              </div>
              <div>
                <div className="font-bold">Chegirmalar</div>
                <div className="text-sm text-gray-600">Har kuni yangi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-6 h-6" />
                <span className="text-xl font-bold">DUBAYMALL</span>
              </div>
              <p className="text-gray-400">
                Premium e-commerce platform
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Kompaniya</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition">Biz haqimizda</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Aloqa</Link></li>
                <li><Link href="/careers" className="hover:text-white transition">Karyera</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Yordam</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                <li><Link href="/support" className="hover:text-white transition">Qo'llab-quvvatlash</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Shartlar</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Aloqa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@dubaymall.uz</li>
                <li>Tel: +998 90 123 45 67</li>
                <li>Telegram: @dubaymall</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DUBAYMALL. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>

      {/* Seller Modal */}
      {showSellerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">DUBAYMALL da soting</h2>
              <button
                onClick={() => setShowSellerModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Nima uchun DUBAYMALL?</h3>
                <p className="text-gray-700">
                  Millionlab mijozlarga yeting. Professional logistika va marketing yordami.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">✅</span>
                  </div>
                  <div>
                    <div className="font-semibold">Bepul ro'yxat</div>
                    <div className="text-sm text-gray-600">Boshlash uchun hech narsa to'lamang</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📦</span>
                  </div>
                  <div>
                    <div className="font-semibold">Ombor xizmati</div>
                    <div className="text-sm text-gray-600">Biz saqlash va jo'natishni boshqaramiz</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <div className="font-semibold">Analytics</div>
                    <div className="text-sm text-gray-600">Real-time sotuvlar statistikasi</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💰</span>
                  </div>
                  <div>
                    <div className="font-semibold">Tez to'lovlar</div>
                    <div className="text-sm text-gray-600">Avtomatik pul o'tkazmalari</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-bold mb-4">Qanday boshlash kerak?</h4>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <span>Ro'yxatdan o'ting va kompaniya ma'lumotlarini kiriting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <span>Mahsulotlaringizni qo'shing (rasm, video, tasnif)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <span>Mahsulotlarni bizning omborimizga olib keling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                    <span>Sotuvlarni kuzating va daromad oling!</span>
                  </li>
                </ol>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/register?role=seller"
                  className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold text-center"
                >
                  Sotuvchi bo'lish
                </Link>
                <Link
                  href="/login"
                  className="flex-1 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition font-semibold text-center"
                >
                  Kirish
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blogger Modal */}
      {showBloggerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Bloger bo'ling va daromad qiling</h2>
              <button
                onClick={() => setShowBloggerModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-gold-50 to-gold-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Yuqori komissiya har bir sotuvdan!</h3>
                <p className="text-gray-700">
                  O'z auditoriyangizni monetizatsiya qiling. Telegram, Instagram orqali daromad qiling.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💰</span>
                  </div>
                  <div>
                    <div className="font-semibold">Yuqori komissiya</div>
                    <div className="text-sm text-gray-600">Har bir sotuvdan katta daromad</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🔗</span>
                  </div>
                  <div>
                    <div className="font-semibold">Shaxsiy promo kod</div>
                    <div className="text-sm text-gray-600">Noyob kod va referal ssilka</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <div className="font-semibold">Real-time statistika</div>
                    <div className="text-sm text-gray-600">Kliklar va sotuvlarni kuzating</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🤖</span>
                  </div>
                  <div>
                    <div className="font-semibold">Telegram bot</div>
                    <div className="text-sm text-gray-600">Avtomatik reklama materiallari</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-bold mb-4">Qanday ishlaydi?</h4>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-gold-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <span>Ro'yxatdan o'ting va ijtimoiy tarmoqlaringizni ulang</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-gold-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <span>Shaxsiy promo kod va referal ssilka oling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-gold-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <span>Mahsulotlarni auditoriyangizga taqdim eting</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-gold-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                    <span>Har bir sotuvdan yuqori komissiya oling!</span>
                  </li>
                </ol>
              </div>

              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <MessageCircle className="w-5 h-5 text-primary-600" />
                  <span className="font-semibold">Telegram bot orqali</span>
                </div>
                <p className="text-sm text-gray-600">
                  Reklama bannerlari, textlar va ssilkalarni avtomatik oling. Real-time bildirishnomalar.
                </p>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/register?role=blogger"
                  className="flex-1 py-3 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition font-semibold text-center"
                >
                  Bloger bo'lish
                </Link>
                <Link
                  href="/login"
                  className="flex-1 py-3 border-2 border-gold-600 text-gold-600 rounded-lg hover:bg-gold-50 transition font-semibold text-center"
                >
                  Kirish
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
