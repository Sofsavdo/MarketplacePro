'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, MapPin, CreditCard, CheckCircle } from 'lucide-react'
import { useCartStore } from '@/store/cart'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'Toshkent',
    address: '',
    paymentMethod: 'click',
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const subtotal = getTotalPrice()
  const deliveryFee = 30000
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      // Process payment
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map(item => ({
              product_id: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            subtotal,
            delivery_fee: deliveryFee,
            discount: 0,
            total,
            delivery_address: `${formData.address}, ${formData.city}`,
            delivery_phone: formData.phone,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Buyurtma yaratish xatosi')
        }

        // Clear cart and redirect
        clearCart()
        router.push(`/order-success?order=${data.order.order_number}`)
      } catch (error: any) {
        alert(error.message || 'Xatolik yuz berdi')
      }
    }
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
        <div className="max-w-4xl mx-auto">
          {/* Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <span className="font-semibold">Yetkazib berish</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
                <span className="font-semibold">To'lov</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                {step === 1 ? (
                  <div className="bg-white rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="w-6 h-6 text-primary-600" />
                      <h2 className="text-2xl font-bold">Yetkazib berish manzili</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          To'liq ism
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Ism Familiya"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefon raqam
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="+998 90 123 45 67"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shahar
                        </label>
                        <select
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="Toshkent">Toshkent</option>
                          <option value="Samarqand">Samarqand</option>
                          <option value="Buxoro">Buxoro</option>
                          <option value="Andijon">Andijon</option>
                          <option value="Namangan">Namangan</option>
                          <option value="Farg'ona">Farg'ona</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          To'liq manzil
                        </label>
                        <textarea
                          required
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Ko'cha, uy raqami, kvartira"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <CreditCard className="w-6 h-6 text-primary-600" />
                      <h2 className="text-2xl font-bold">To'lov usuli</h2>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-600 transition">
                        <input
                          type="radio"
                          name="payment"
                          value="click"
                          checked={formData.paymentMethod === 'click'}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="w-5 h-5 text-primary-600"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">Click</div>
                          <div className="text-sm text-gray-600">Karta orqali to'lash</div>
                        </div>
                        <img src="https://click.uz/click-logo.svg" alt="Click" className="h-8" />
                      </label>

                      <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-600 transition">
                        <input
                          type="radio"
                          name="payment"
                          value="payme"
                          checked={formData.paymentMethod === 'payme'}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="w-5 h-5 text-primary-600"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">Payme</div>
                          <div className="text-sm text-gray-600">Karta orqali to'lash</div>
                        </div>
                        <img src="https://payme.uz/payme-logo.svg" alt="Payme" className="h-8" />
                      </label>

                      <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-600 transition">
                        <input
                          type="radio"
                          name="payment"
                          value="uzum"
                          checked={formData.paymentMethod === 'uzum'}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="w-5 h-5 text-primary-600"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">Uzum Bank</div>
                          <div className="text-sm text-gray-600">Karta orqali to'lash</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-primary-600 transition">
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          checked={formData.paymentMethod === 'cash'}
                          onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                          className="w-5 h-5 text-primary-600"
                        />
                        <div className="flex-1">
                          <div className="font-semibold">Naqd pul</div>
                          <div className="text-sm text-gray-600">Yetkazib berishda to'lash</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div>
                <div className="bg-white rounded-2xl p-6 sticky top-4">
                  <h3 className="text-xl font-bold mb-4">Buyurtma</h3>

                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</div>
                          <div className="text-sm text-gray-600">{item.quantity} x {item.price.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 pt-6 border-t">
                    <div className="flex justify-between text-gray-600">
                      <span>Mahsulotlar</span>
                      <span className="font-semibold">{subtotal.toLocaleString()} so'm</span>
                    </div>
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
                    type="submit"
                    className="w-full py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold flex items-center justify-center gap-2"
                  >
                    {step === 1 ? (
                      <>Davom ettirish</>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        To'lovni amalga oshirish
                      </>
                    )}
                  </button>

                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full mt-3 py-3 text-gray-600 hover:text-gray-900 font-semibold"
                    >
                      Orqaga
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
