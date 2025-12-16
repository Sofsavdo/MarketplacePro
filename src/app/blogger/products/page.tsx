'use client'

import { useState } from 'react'
import { Search, Share2, Copy, ExternalLink } from 'lucide-react'
import Image from 'next/image'

export default function BloggerProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const products = [
    {
      id: '1',
      title: 'iPhone 15 Pro Max 256GB',
      price: 15500000,
      image: 'https://images.unsplash.com/photo-1696446702183-cbd50c2a2476?w=400',
      category: 'Elektronika',
      commission: 3100000,
    },
    {
      id: '2',
      title: 'Samsung Galaxy S24 Ultra',
      price: 13200000,
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      category: 'Elektronika',
      commission: 2640000,
    },
    {
      id: '3',
      title: 'MacBook Pro 14" M3',
      price: 28000000,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      category: 'Elektronika',
      commission: 5600000,
    },
  ]

  const generatePromoLink = (productId: string) => {
    const promoCode = 'BLOG32707' // Mock promo code
    return `${window.location.origin}/product/${productId}?ref=${promoCode.toLowerCase()}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Nusxalandi!')
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mahsulotlar</h1>
        <p className="text-gray-600 mt-1">Reklama qilish uchun mahsulotlar</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Mahsulot qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Barcha kategoriyalar</option>
            <option value="Elektronika">Elektronika</option>
            <option value="Kiyim">Kiyim</option>
            <option value="Sport">Sport</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{product.title}</h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-600">Narx</div>
                  <div className="font-bold text-gray-900">
                    {product.price.toLocaleString()} so'm
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Sizning komissiya</div>
                  <div className="font-bold text-green-600">
                    {product.commission.toLocaleString()} so'm
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    const link = generatePromoLink(product.id)
                    copyToClipboard(link)
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  <Copy className="w-4 h-4" />
                  Havola nusxalash
                </button>
                <button
                  onClick={() => {
                    const link = generatePromoLink(product.id)
                    window.open(link, '_blank')
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ko'rish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-gray-500">Mahsulotlar topilmadi</p>
        </div>
      )}
    </div>
  )
}
