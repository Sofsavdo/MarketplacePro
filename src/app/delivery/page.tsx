'use client'

import MainLayout from '@/components/layout/MainLayout'
import { Truck, MapPin, Clock, Package, CheckCircle, DollarSign } from 'lucide-react'

export default function DeliveryPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Yetkazib berish shartlari
            </h1>
            <p className="text-xl text-gray-600">
              Tez va ishonchli yetkazib berish xizmati
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <Truck className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Tez yetkazib berish</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Toshkent shahri bo'ylab 24 soat ichida yetkazib beramiz. 
                Boshqa viloyatlarga 2-3 kun ichida yetkazib beriladi.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Toshkent: 1-2 kun</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Viloyatlar: 2-3 kun</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Tezkor yetkazib berish: 3-6 soat</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Yetkazib berish narxi</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Yetkazib berish narxi buyurtma summasiga va manziliga bog'liq.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Toshkent: 30,000 so'm</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Viloyatlar: 50,000 so'm</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">1,000,000 so'mdan yuqori: BEPUL</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Yetkazib berish jarayoni
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Buyurtma</h3>
                <p className="text-sm text-gray-600">
                  Mahsulotni tanlang va buyurtma bering
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Tasdiqlash</h3>
                <p className="text-sm text-gray-600">
                  Buyurtmangiz tasdiqlanadi
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">3. Yetkazish</h3>
                <p className="text-sm text-gray-600">
                  Mahsulot yo'lga chiqariladi
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">4. Qabul qilish</h3>
                <p className="text-sm text-gray-600">
                  Mahsulotni qabul qiling
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-lg p-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <Clock className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Ish vaqti</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Buyurtma qabul qilish:</h3>
                <p className="text-primary-100">Har kuni, 24/7</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Yetkazib berish:</h3>
                <p className="text-primary-100">Dushanba-Yakshanba: 09:00 - 22:00</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Muhim ma'lumotlar:</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Mahsulotni qabul qilishda shaxsingizni tasdiqlovchi hujjat talab qilinadi</li>
              <li>• Mahsulotni tekshirib ko'rishingiz mumkin</li>
              <li>• Agar mahsulot shikastlangan bo'lsa, qabul qilmasligingiz mumkin</li>
              <li>• To'lovni naqd yoki Click/Payme orqali amalga oshirishingiz mumkin</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
