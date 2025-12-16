'use client'

import Link from 'next/link'
import { useState } from 'react'
import { TrendingUp, Store, X, Heart, MapPin, ChevronRight, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import MainLayout from '@/components/layout/MainLayout'

export default function HomePage() {
  const [showSellerModal, setShowSellerModal] = useState(false)
  const [showBloggerModal, setShowBloggerModal] = useState(false)
  const { getTotalItems } = useCartStore()

  const categories = [
    { id: 1, name: 'Elektronika', icon: '📱', color: 'bg-blue-50' },
    { id: 2, name: 'Kiyim', icon: '👕', color: 'bg-purple-50' },
    { id: 3, name: 'Maishiy texnika', icon: '🏠', color: 'bg-green-50' },
    { id: 4, name: 'Sport', icon: '⚽', color: 'bg-orange-50' },
    { id: 5, name: 'Go\'zallik', icon: '💄', color: 'bg-pink-50' },
    { id: 6, name: 'Kitoblar', icon: '📚', color: 'bg-yellow-50' },
    { id: 7, name: 'O\'yinchoqlar', icon: '🧸', color: 'bg-red-50' },
    { id: 8, name: 'Avtotovarlar', icon: '🚗', color: 'bg-gray-50' },
  ]

  const products = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max 256GB',
      image: 'https://images.unsplash.com/photo-1696446702183-cbd50c2a2476?w=400',
      price: 15500000,
      oldPrice: 17000000,
      rating: 4.8,
      reviews: 124,
      installment: 1291666,
    },
    {
      id: 2,
      title: 'Samsung Galaxy S24 Ultra 512GB',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      price: 13200000,
      oldPrice: 14500000,
      rating: 4.7,
      reviews: 89,
      installment: 1100000,
    },
    {
      id: 3,
      title: 'MacBook Pro 14" M3 Chip',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      price: 28000000,
      oldPrice: 31000000,
      rating: 4.9,
      reviews: 156,
      installment: 2333333,
    },
    {
      id: 4,
      title: 'Sony WH-1000XM5 Wireless',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
      price: 4200000,
      oldPrice: 4800000,
      rating: 4.6,
      reviews: 234,
      installment: 350000,
    },
    {
      id: 5,
      title: 'Apple Watch Series 9 GPS',
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
      price: 5800000,
      oldPrice: 6500000,
      rating: 4.8,
      reviews: 178,
      installment: 483333,
    },
    {
      id: 6,
      title: 'iPad Pro 12.9" M2 256GB',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
      price: 12500000,
      oldPrice: 14000000,
      rating: 4.7,
      reviews: 92,
      installment: 1041666,
    },
  ]

  return (
    <MainLayout>
      <div className="bg-gray-50">
        {/* Top Bar */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2 text-sm">
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-1 text-gray-600 hover:text-primary-600">
                  <MapPin className="w-4 h-4" />
                  <span>Toshkent</span>
                </button>
                <Link href="/delivery" className="text-gray-600 hover:text-primary-600">
                  Yetkazib berish
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowBloggerModal(true)}
                  className="text-gold-600 hover:text-gold-700 font-medium"
                >
                  Bloger bo'lish
                </button>
                <button
                  onClick={() => setShowSellerModal(true)}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sotuvchi bo'lish
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Categories */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className={`flex items-center gap-2 px-4 py-3 ${cat.color} rounded-xl hover:shadow-md transition whitespace-nowrap`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-medium text-gray-800">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="container mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-8 md:p-12">
            <div className="text-white max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Premium mahsulotlar
              </h1>
              <p className="text-xl text-primary-100 mb-6">
                Tez yetkazib berish • Kafolat • Chegirmalar
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-2xl">🚚</span>
                  <div>
                    <div className="font-semibold">1-2 kun</div>
                    <div className="text-xs text-primary-100">Yetkazib berish</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-2xl">✅</span>
                  <div>
                    <div className="font-semibold">Kafolat</div>
                    <div className="text-xs text-primary-100">Sifat kafolati</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400"
                alt="Shopping"
                className="w-80 h-80 object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Yangi mahsulotlar</h2>
          <Link href="/products" className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium">
            Barchasi
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition">
                  <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                </button>
                {product.oldPrice && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition">
                  {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  {product.oldPrice && (
                    <div className="text-xs text-gray-400 line-through">
                      {product.oldPrice.toLocaleString()} so'm
                    </div>
                  )}
                  <div className="text-lg font-bold text-gray-900">
                    {product.price.toLocaleString()} so'm
                  </div>
                  <div className="text-xs text-gray-500">
                    {product.installment.toLocaleString()} so'm/oy
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-12 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🚚</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Tez yetkazib berish</h3>
                <p className="text-sm text-gray-600">1-2 kun ichida yetkazamiz</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Sifat kafolati</h3>
                <p className="text-sm text-gray-600">100% asl mahsulotlar</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💳</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Xavfsiz to'lov</h3>
                <p className="text-sm text-gray-600">Click, Payme, Uzum</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎁</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Chegirmalar</h3>
                <p className="text-sm text-gray-600">Har kuni yangi takliflar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-primary-600" />
                </div>
                <span className="text-xl font-bold">DUBAYMALL</span>
              </div>
              <p className="text-gray-400 text-sm">
                Premium mahsulotlar va tez yetkazib berish
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Kompaniya</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">Biz haqimizda</Link></li>
                <li><Link href="/contact" className="hover:text-white">Aloqa</Link></li>
                <li><Link href="/careers" className="hover:text-white">Karyera</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Yordam</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/delivery" className="hover:text-white">Yetkazib berish</Link></li>
                <li><Link href="/return" className="hover:text-white">Qaytarish</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Aloqa</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>+998 90 123 45 67</li>
                <li>support@dubaymall.uz</li>
                <li>@dubaymall</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 DUBAYMALL. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>

      {/* Seller Modal */}
      {showSellerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSellerModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">DUBAYMALL da soting</h2>
              <button onClick={() => setShowSellerModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Millionlab mijozlarga yeting</h3>
                <p className="text-gray-700">Professional logistika va marketing yordami</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">✅</span>
                  </div>
                  <div>
                    <div className="font-semibold">Bepul ro'yxat</div>
                    <div className="text-sm text-gray-600">Boshlash uchun to'lov yo'q</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📦</span>
                  </div>
                  <div>
                    <div className="font-semibold">Ombor xizmati</div>
                    <div className="text-sm text-gray-600">Saqlash va jo'natish</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Link href="/register?role=seller" className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-center font-semibold">
                  Sotuvchi bo'lish
                </Link>
                <Link href="/login" className="flex-1 py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 text-center font-semibold">
                  Kirish
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blogger Modal */}
      {showBloggerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBloggerModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Bloger bo'ling</h2>
              <button onClick={() => setShowBloggerModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-r from-gold-50 to-gold-100 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-2">Yuqori komissiya oling!</h3>
                <p className="text-gray-700">Auditoriyangizni monetizatsiya qiling</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💰</span>
                  </div>
                  <div>
                    <div className="font-semibold">Yuqori komissiya</div>
                    <div className="text-sm text-gray-600">Katta daromad imkoniyati</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🔗</span>
                  </div>
                  <div>
                    <div className="font-semibold">Shaxsiy promo kod</div>
                    <div className="text-sm text-gray-600">Noyob kod va ssilka</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Link href="/register?role=blogger" className="flex-1 py-3 bg-gold-600 text-white rounded-lg hover:bg-gold-700 text-center font-semibold">
                  Bloger bo'lish
                </Link>
                <Link href="/login" className="flex-1 py-3 border-2 border-gold-600 text-gold-600 rounded-lg hover:bg-gold-50 text-center font-semibold">
                  Kirish
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </MainLayout>
  )
}
