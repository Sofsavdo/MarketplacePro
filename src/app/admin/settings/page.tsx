'use client'

import { useState } from 'react'
import { Settings, DollarSign, Truck, Bell } from 'lucide-react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformCommission: 20,
    bloggerCommission: 20,
    deliveryFee: 25000,
    freeDeliveryThreshold: 500000,
    paymentHoldDays: 14,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Sozlamalar saqlandi!')
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sozlamalar</h1>
        <p className="text-gray-600 mt-1">Platforma sozlamalari</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Commission Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">Komissiya sozlamalari</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platforma komissiyasi (%)
              </label>
              <input
                type="number"
                value={settings.platformCommission}
                onChange={(e) => setSettings({ ...settings, platformCommission: parseInt(e.target.value) })}
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Hozirgi: {settings.platformCommission}%
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bloger komissiyasi (%)
              </label>
              <input
                type="number"
                value={settings.bloggerCommission}
                onChange={(e) => setSettings({ ...settings, bloggerCommission: parseInt(e.target.value) })}
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Hozirgi: {settings.bloggerCommission}%
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To'lov ushlab turish (kunlar)
              </label>
              <input
                type="number"
                value={settings.paymentHoldDays}
                onChange={(e) => setSettings({ ...settings, paymentHoldDays: parseInt(e.target.value) })}
                min="0"
                max="30"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Bloger to'lovlari {settings.paymentHoldDays} kun kutiladi
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">Yetkazib berish sozlamalari</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yetkazib berish narxi (so'm)
              </label>
              <input
                type="number"
                value={settings.deliveryFee}
                onChange={(e) => setSettings({ ...settings, deliveryFee: parseInt(e.target.value) })}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Hozirgi: {settings.deliveryFee.toLocaleString()} so'm
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bepul yetkazish chegarasi (so'm)
              </label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: parseInt(e.target.value) })}
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                {settings.freeDeliveryThreshold.toLocaleString()} so'mdan yuqori buyurtmalarda bepul
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 border border-primary-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Narx hisoblash misoli</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Sotuvchi narxi:</span>
              <span className="font-semibold">100,000 so'm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bloger komissiyasi ({settings.bloggerCommission}%):</span>
              <span className="font-semibold">+{(100000 * settings.bloggerCommission / 100).toLocaleString()} so'm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platforma komissiyasi ({settings.platformCommission}%):</span>
              <span className="font-semibold">+{(100000 * settings.platformCommission / 100).toLocaleString()} so'm</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-bold text-gray-900">Yakuniy narx:</span>
              <span className="font-bold text-primary-600">
                {(100000 * (1 + (settings.bloggerCommission + settings.platformCommission) / 100)).toLocaleString()} so'm
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            Saqlash
          </button>
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Bekor qilish
          </button>
        </div>
      </form>
    </div>
  )
}
