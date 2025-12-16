'use client'

import { useState } from 'react'
import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import { Search, Filter, Star, Heart, ShoppingCart } from 'lucide-react'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 50000000])
  const [sortBy, setSortBy] = useState('popular')

  const categories = [
    { id: 'all', name: 'Barchasi' },
    { id: 'electronics', name: 'Elektronika' },
    { id: 'fashion', name: 'Kiyim' },
    { id: 'home', name: 'Maishiy texnika' },
    { id: 'sports', name: 'Sport' },
    { id: 'beauty', name: 'Go\'zallik' },
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
      category: 'electronics',
    },
    {
      id: 2,
      title: 'Samsung Galaxy S24 Ultra',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      price: 13200000,
      oldPrice: 14500000,
      rating: 4.7,
      reviews: 89,
      category: 'electronics',
    },
    {
      id: 3,
      title: 'MacBook Pro 14" M3',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      price: 28000000,
      oldPrice: 31000000,
      rating: 4.9,
      reviews: 156,
      category: 'electronics',
    },
    {
      id: 4,
      title: 'Sony WH-1000XM5',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
      price: 4500000,
      oldPrice: 5200000,
      rating: 4.6,
      reviews: 78,
      category: 'electronics',
    },
    {
      id: 5,
      title: 'Nike Air Max 270',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      price: 1800000,
      oldPrice: 2200000,
      rating: 4.5,
      reviews: 92,
      category: 'fashion',
    },
    {
      id: 6,
      title: 'Adidas Ultraboost',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
      price: 2100000,
      oldPrice: 2500000,
      rating: 4.7,
      reviews: 65,
      category: 'fashion',
    },
  ]

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false
    if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false
    return true
  })

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mahsulotlar</h1>
            <p className="text-gray-600">{filteredProducts.length} ta mahsulot topildi</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-20">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtrlar
                </h2>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qidirish
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Mahsulot nomi..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoriya
                  </label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition ${
                          selectedCategory === cat.id
                            ? 'bg-primary-50 text-primary-600 font-medium'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saralash
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="popular">Mashhur</option>
                    <option value="price-low">Arzon</option>
                    <option value="price-high">Qimmat</option>
                    <option value="rating">Reyting</option>
                    <option value="newest">Yangi</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setPriceRange([0, 50000000])
                    setSortBy('popular')
                  }}
                  className="w-full py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition font-medium"
                >
                  Tozalash
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.oldPrice && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-lg">
                          -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                        </div>
                      )}
                      <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition opacity-0 group-hover:opacity-100">
                        <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.oldPrice && (
                            <div className="text-sm text-gray-400 line-through">
                              {product.oldPrice.toLocaleString()} so'm
                            </div>
                          )}
                          <div className="text-lg font-bold text-primary-600">
                            {product.price.toLocaleString()} so'm
                          </div>
                        </div>
                        <button className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center hover:bg-primary-700 transition">
                          <ShoppingCart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Mahsulot topilmadi</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
