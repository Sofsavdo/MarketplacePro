'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import { Heart, ShoppingCart, Trash2, TrendingUp } from 'lucide-react'
import { useCartStore } from '@/store/cart'

interface WishlistItem {
  id: number
  title: string
  price: number
  image: string
  stock: number
  category: string
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [mounted, setMounted] = useState(false)
  const { addItem } = useCartStore()

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('wishlist')
    if (stored) {
      try {
        setWishlist(JSON.parse(stored))
      } catch (error) {
        console.error('Wishlist parse error:', error)
      }
    }
  }, [])

  const removeFromWishlist = (id: number) => {
    const updated = wishlist.filter(item => item.id !== id)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  const addToCart = (item: WishlistItem) => {
    addItem({
      id: item.id,
      title: item.title,
      price: item.price,
      image: item.image,
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sevimlilar</h1>
            <p className="text-gray-600">
              {wishlist.length > 0 
                ? `Sizda ${wishlist.length} ta sevimli mahsulot bor`
                : 'Sevimlilar ro\'yxati bo\'sh'}
            </p>
          </div>

          {wishlist.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sevimlilar ro'yxati bo'sh
              </h2>
              <p className="text-gray-600 mb-8">
                Mahsulotlarni sevimlilar ro'yxatiga qo'shish uchun ❤️ tugmasini bosing
              </p>
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Mahsulotlarni ko'rish</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <Link href={`/product/${item.id}`}>
                    <div className="relative aspect-square">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            removeFromWishlist(item.id)
                          }}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                        >
                          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                        </button>
                      </div>
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600">
                        {item.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-primary-600">
                          {item.price.toLocaleString('uz-UZ')} so'm
                        </p>
                        {item.stock > 0 ? (
                          <p className="text-sm text-green-600">Mavjud</p>
                        ) : (
                          <p className="text-sm text-red-600">Tugagan</p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCart(item)}
                        disabled={item.stock === 0}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Savatga</span>
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
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
