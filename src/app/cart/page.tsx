'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const subtotal = getTotalPrice()
  const deliveryFee = subtotal > 0 ? 30000 : 0
  const total = subtotal - discount + deliveryFee

  const applyPromoCode = async () => {
    try {
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode }),
      })

      const data = await response.json()

      if (data.valid) {
        const discountAmount = subtotal * data.discount
        setDiscount(discountAmount)
        alert(`Promo kod qo'llandi! ${Math.round(data.discount * 100)}% chegirma`)
      } else {
        alert('Noto\'g\'ri promo kod')
      }
    } catch (error) {
      alert('Xatolik yuz berdi')
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <ShoppingBag className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">
                DUBAYMALL
              </span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Savat bo'sh</h1>
            <p className="text-gray-600 mb-8">
              Hozircha savatchangizda mahsulot yo'q. Xarid qilishni boshlang!
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold"
            >
              Xarid qilish
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-gold-500 bg-clip-text text-transparent">
              DUBAYMALL
            </span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Savat</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6">
                <div className="flex gap-6">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-2xl font-bold text-primary-600 mb-4">
                      {item.price.toLocaleString()} so'm
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-50"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="px-6 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-50"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {(item.price * item.quantity).toLocaleString()} so'm
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Buyurtma xulosasi</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo kod
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo kodni kiriting"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                  >
                    Qo'llash
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Mahsulotlar ({items.length})</span>
                  <span className="font-semibold">{subtotal.toLocaleString()} so'm</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Chegirma</span>
                    <span className="font-semibold">-{discount.toLocaleString()} so'm</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Yetkazib berish</span>
                  <span className="font-semibold">{deliveryFee.toLocaleString()} so'm</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Jami</span>
                    <span>{total.toLocaleString()} so'm</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold flex items-center justify-center gap-2"
              >
                Rasmiylashtirish
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                href="/"
                className="block text-center mt-4 text-primary-600 hover:text-primary-700 font-semibold"
              >
                Xaridni davom ettirish
              </Link>
            </div>

            {/* Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🚚</span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900 mb-1">Bepul yetkazib berish</div>
                  <div className="text-gray-600">
                    500,000 so'mdan ortiq xaridlarda yetkazib berish bepul
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
