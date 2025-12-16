'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Truck } from 'lucide-react'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Buyurtma qabul qilindi!
          </h1>

          {orderNumber && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600 mb-1">Buyurtma raqami:</div>
              <div className="text-2xl font-bold text-primary-600">{orderNumber}</div>
            </div>
          )}

          <p className="text-gray-600 mb-8">
            Buyurtmangiz muvaffaqiyatli qabul qilindi. Tez orada sizga aloqaga chiqamiz.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Tayyorlanmoqda</div>
                <div className="text-sm text-gray-600">Mahsulot ombordan olinadi</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Yetkazib berish</div>
                <div className="text-sm text-gray-600">1-2 kun ichida</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Bosh sahifaga qaytish
            </Link>
            <Link
              href="/orders"
              className="block w-full py-3 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition font-semibold"
            >
              Buyurtmalarim
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Savollar bo'lsa: +998 90 123 45 67</p>
          <p>yoki @dubaymall_support</p>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}
