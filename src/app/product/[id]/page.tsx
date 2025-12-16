'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  Minus,
  Plus
} from 'lucide-react'
import { useCartStore } from '@/store/cart'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // Mock product data
  const product = {
    id: Number(params.id),
    title: 'iPhone 15 Pro Max 256GB',
    description: 'Apple iPhone 15 Pro Max - eng so\'nggi texnologiya va premium dizayn. A17 Pro chip, titanium korpus, ProMotion displey va professional kamera tizimi.',
    images: [
      'https://images.unsplash.com/photo-1696446702183-cbd50c2a2476?w=800',
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
      'https://images.unsplash.com/photo-1695048133082-1a20484d2569?w=800',
    ],
    price: 15500000,
    oldPrice: 17000000,
    rating: 4.8,
    reviews: 124,
    stock: 12,
    seller: 'TechStore UZ',
    category: 'Elektronika',
    features: [
      'A17 Pro chip',
      '256GB xotira',
      '6.7" Super Retina XDR',
      '48MP asosiy kamera',
      'Titanium korpus',
      '5G aloqa',
    ],
    specifications: [
      { label: 'Displey', value: '6.7" Super Retina XDR' },
      { label: 'Processor', value: 'A17 Pro' },
      { label: 'Xotira', value: '256GB' },
      { label: 'Kamera', value: '48MP + 12MP + 12MP' },
      { label: 'Batareya', value: '4422 mAh' },
      { label: 'Og\'irligi', value: '221g' },
    ],
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        image: product.images[0],
        price: product.price,
      })
    }
    router.push('/cart')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Orqaga</span>
            </button>
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">
              DUBAYMALL
            </Link>
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {useCartStore.getState().getTotalItems()}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full aspect-square object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-white rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === index ? 'border-primary-600' : 'border-transparent'
                  }`}
                >
                  <img src={image} alt="" className="w-full aspect-square object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="bg-white rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Link href={`/category/${product.category}`} className="hover:text-primary-600">
                  {product.category}
                </Link>
                <span>/</span>
                <span>{product.seller}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{product.reviews} ta sharh</span>
                <span className="text-gray-400">|</span>
                <span className="text-green-600 font-semibold">Omborda: {product.stock} ta</span>
              </div>

              <div className="mb-6">
                {product.oldPrice && (
                  <div className="text-lg text-gray-400 line-through mb-1">
                    {product.oldPrice.toLocaleString()} so'm
                  </div>
                )}
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {product.price.toLocaleString()} so'm
                </div>
                <div className="text-gray-600">
                  yoki {Math.round(product.price / 12).toLocaleString()} so'm/oy
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-6 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Savatga qo'shish
                </button>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Sevimli
                </button>
                <button className="flex-1 py-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 transition flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Ulashish
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Xususiyatlar</h3>
              <div className="grid grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl p-6">
            <div className="border-b mb-6">
              <div className="flex gap-8">
                <button className="pb-4 border-b-2 border-primary-600 text-primary-600 font-semibold">
                  Tasnif
                </button>
                <button className="pb-4 text-gray-600 hover:text-gray-900">
                  Xususiyatlar
                </button>
                <button className="pb-4 text-gray-600 hover:text-gray-900">
                  Sharhlar ({product.reviews})
                </button>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              
              <h3 className="text-xl font-bold mt-6 mb-4">Texnik xususiyatlar</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">{spec.label}</span>
                    <span className="font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Tez yetkazib berish</h4>
                <p className="text-sm text-gray-600">1-2 kun ichida yetkazamiz</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Kafolat</h4>
                <p className="text-sm text-gray-600">Rasmiy kafolat 1 yil</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Qaytarish</h4>
                <p className="text-sm text-gray-600">14 kun ichida qaytarish</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
