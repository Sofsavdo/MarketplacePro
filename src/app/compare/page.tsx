'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MainLayout from '@/components/layout/MainLayout'
import { X, Check, Star, ShoppingCart, Plus } from 'lucide-react'

interface Product {
  id: number
  title: string
  image: string
  price: number
  rating: number
  reviews: number
  brand: string
  specs: {
    [key: string]: string
  }
}

export default function ComparePage() {
  const [compareProducts, setCompareProducts] = useState<Product[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('compare')
    if (stored) {
      try {
        setCompareProducts(JSON.parse(stored))
      } catch (error) {
        console.error('Compare parse error:', error)
      }
    }
  }, [])

  const removeProduct = (id: number) => {
    const updated = compareProducts.filter(p => p.id !== id)
    setCompareProducts(updated)
    localStorage.setItem('compare', JSON.stringify(updated))
  }

  const clearAll = () => {
    setCompareProducts([])
    localStorage.removeItem('compare')
  }

  if (!mounted) {
    return null
  }

  // Mock data for demonstration
  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max 256GB',
      image: 'https://images.unsplash.com/photo-1696446702183-cbd50c2a2476?w=400',
      price: 15500000,
      rating: 4.8,
      reviews: 124,
      brand: 'Apple',
      specs: {
        'Ekran': '6.7" Super Retina XDR',
        'Protsessor': 'A17 Pro',
        'Xotira': '256GB',
        'Kamera': '48MP + 12MP + 12MP',
        'Batareya': '4422 mAh',
        'OS': 'iOS 17',
        'Og\'irligi': '221g',
        'Rang': 'Titanium Natural',
      }
    },
    {
      id: 2,
      title: 'Samsung Galaxy S24 Ultra 512GB',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      price: 13200000,
      rating: 4.7,
      reviews: 89,
      brand: 'Samsung',
      specs: {
        'Ekran': '6.8" Dynamic AMOLED 2X',
        'Protsessor': 'Snapdragon 8 Gen 3',
        'Xotira': '512GB',
        'Kamera': '200MP + 50MP + 12MP + 10MP',
        'Batareya': '5000 mAh',
        'OS': 'Android 14',
        'Og\'irligi': '232g',
        'Rang': 'Titanium Gray',
      }
    },
    {
      id: 3,
      title: 'Google Pixel 8 Pro 256GB',
      image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
      price: 11800000,
      rating: 4.6,
      reviews: 67,
      brand: 'Google',
      specs: {
        'Ekran': '6.7" LTPO OLED',
        'Protsessor': 'Google Tensor G3',
        'Xotira': '256GB',
        'Kamera': '50MP + 48MP + 48MP',
        'Batareya': '5050 mAh',
        'OS': 'Android 14',
        'Og\'irligi': '213g',
        'Rang': 'Obsidian',
      }
    },
  ]

  const productsToCompare = compareProducts.length > 0 ? compareProducts : mockProducts

  const allSpecs = Array.from(
    new Set(productsToCompare.flatMap(p => Object.keys(p.specs)))
  )

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Mahsulotlarni taqqoslash</h1>
                <p className="text-gray-600">
                  {productsToCompare.length} ta mahsulot taqqoslanmoqda
                </p>
              </div>
              {productsToCompare.length > 0 && (
                <button
                  onClick={clearAll}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Barchasini o'chirish
                </button>
              )}
            </div>
          </div>

          {productsToCompare.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Taqqoslash uchun mahsulot yo'q
              </h3>
              <p className="text-gray-600 mb-6">
                Mahsulotlar sahifasidan taqqoslash uchun mahsulotlarni qo'shing
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Do'konga o'tish
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-6 text-left font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10">
                        Xususiyat
                      </th>
                      {productsToCompare.map(product => (
                        <th key={product.id} className="p-6 min-w-[300px]">
                          <div className="relative">
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="absolute top-0 right-0 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="relative w-full aspect-square mb-4">
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{product.title}</h3>
                            <div className="flex items-center justify-center space-x-2 mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.floor(product.rating)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {product.rating} ({product.reviews})
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-primary-600 mb-4">
                              {product.price.toLocaleString('uz-UZ')} so'm
                            </p>
                            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                              <ShoppingCart className="w-4 h-4" />
                              <span>Savatga</span>
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-gray-50">
                      <td className="p-6 font-semibold text-gray-900 sticky left-0 z-10 bg-gray-50">
                        Brend
                      </td>
                      {productsToCompare.map(product => (
                        <td key={product.id} className="p-6 text-center">
                          <span className="font-medium text-gray-900">{product.brand}</span>
                        </td>
                      ))}
                    </tr>
                    {allSpecs.map((spec, index) => (
                      <tr key={spec} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className={`p-6 font-semibold text-gray-900 sticky left-0 z-10 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}>
                          {spec}
                        </td>
                        {productsToCompare.map(product => (
                          <td key={product.id} className="p-6 text-center">
                            <span className="text-gray-700">
                              {product.specs[spec] || '-'}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add More Products */}
          {productsToCompare.length > 0 && productsToCompare.length < 4 && (
            <div className="mt-6 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white border-2 border-dashed border-gray-300 text-gray-700 rounded-lg hover:border-primary-600 hover:text-primary-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Yana mahsulot qo'shish</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
