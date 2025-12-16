'use client'

import { useState } from 'react'
import { Save, RotateCcw, Brain, TrendingUp, DollarSign, Package, Star, Zap } from 'lucide-react'
import { AISettings, defaultAISettings } from '@/lib/ai-recommendation'

export default function AdminAISettingsPage() {
  const [settings, setSettings] = useState<AISettings>(defaultAISettings)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // Save to localStorage or API
    localStorage.setItem('aiSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    if (confirm('Barcha sozlamalarni qayta tiklashni xohlaysizmi?')) {
      setSettings(defaultAISettings)
    }
  }

  const totalWeight = 
    settings.ratingWeight +
    settings.salesSpeedWeight +
    settings.priceWeight +
    settings.stockWeight +
    settings.sellerWeight

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary-600" />
            AI Recommendation Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Mahsulotlarni avtomatik saralash va tavsiya qilish sozlamalari
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            <RotateCcw className="w-5 h-5" />
            Qayta tiklash
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            <Save className="w-5 h-5" />
            Saqlash
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            ✓
          </div>
          <div className="text-green-800 font-medium">
            Sozlamalar muvaffaqiyatli saqlandi!
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          AI Recommendation Engine qanday ishlaydi?
        </h3>
        <p className="text-gray-700 mb-4">
          Tizim har bir mahsulotni 5 ta asosiy parametr bo'yicha baholaydi va umumiy ball (AI Score) hisoblab chiqadi.
          Yuqori ball olgan mahsulotlar avtomatik ravishda yuqoriga ko'tariladi.
        </p>
        <div className="grid md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-3">
            <Star className="w-6 h-6 text-yellow-500 mb-2" />
            <div className="text-sm font-semibold">Reyting</div>
            <div className="text-xs text-gray-600">Foydalanuvchi baholari</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
            <div className="text-sm font-semibold">Sotilish</div>
            <div className="text-xs text-gray-600">Sotilish tezligi</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <DollarSign className="w-6 h-6 text-blue-500 mb-2" />
            <div className="text-sm font-semibold">Narx</div>
            <div className="text-xs text-gray-600">Raqobatbardoshlik</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <Package className="w-6 h-6 text-purple-500 mb-2" />
            <div className="text-sm font-semibold">Ombor</div>
            <div className="text-xs text-gray-600">Mavjudlik</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <Zap className="w-6 h-6 text-orange-500 mb-2" />
            <div className="text-sm font-semibold">Sotuvchi</div>
            <div className="text-xs text-gray-600">Ko'rsatkich</div>
          </div>
        </div>
      </div>

      {/* Weights Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Parametr Og'irliklari (Weights)
        </h2>
        
        <div className="space-y-6">
          {/* Rating Weight */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Star className="w-5 h-5 text-yellow-500" />
                Reyting og'irligi
              </label>
              <span className="text-lg font-bold text-primary-600">{settings.ratingWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.ratingWeight}
              onChange={(e) => setSettings({ ...settings, ratingWeight: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mahsulot reytingi va sharh sonining ahamiyati
            </p>
          </div>

          {/* Sales Speed Weight */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Sotilish tezligi og'irligi
              </label>
              <span className="text-lg font-bold text-primary-600">{settings.salesSpeedWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.salesSpeedWeight}
              onChange={(e) => setSettings({ ...settings, salesSpeedWeight: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mahsulot qanchalik tez sotilayotganining ahamiyati
            </p>
          </div>

          {/* Price Weight */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <DollarSign className="w-5 h-5 text-blue-500" />
                Narx og'irligi
              </label>
              <span className="text-lg font-bold text-primary-600">{settings.priceWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.priceWeight}
              onChange={(e) => setSettings({ ...settings, priceWeight: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Narx raqobatbardoshligining ahamiyati (arzon = yuqori ball)
            </p>
          </div>

          {/* Stock Weight */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Package className="w-5 h-5 text-purple-500" />
                Ombor og'irligi
              </label>
              <span className="text-lg font-bold text-primary-600">{settings.stockWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.stockWeight}
              onChange={(e) => setSettings({ ...settings, stockWeight: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Omborda mavjudligining ahamiyati
            </p>
          </div>

          {/* Seller Weight */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Zap className="w-5 h-5 text-orange-500" />
                Sotuvchi og'irligi
              </label>
              <span className="text-lg font-bold text-primary-600">{settings.sellerWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.sellerWeight}
              onChange={(e) => setSettings({ ...settings, sellerWeight: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <p className="text-xs text-gray-500 mt-1">
              Sotuvchi ko'rsatkichining ahamiyati
            </p>
          </div>

          {/* Total Weight Indicator */}
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Jami og'irlik:</span>
              <span className={`text-2xl font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                {totalWeight}%
              </span>
            </div>
            {totalWeight !== 100 && (
              <p className="text-xs text-orange-600 mt-2">
                ⚠️ Optimal natija uchun jami og'irlik 100% bo'lishi kerak
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Thresholds Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Minimal Chegaralar (Thresholds)
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimal reyting
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={settings.minRating}
              onChange={(e) => setSettings({ ...settings, minRating: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Bu reytingdan past mahsulotlar ko'rsatilmaydi (0-5)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimal kunlik sotuvlar
            </label>
            <input
              type="number"
              min="0"
              value={settings.minSalesPerDay}
              onChange={(e) => setSettings({ ...settings, minSalesPerDay: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kuniga kamida shuncha sotilishi kerak
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maksimal narx farqi (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.maxPriceDeviation}
              onChange={(e) => setSettings({ ...settings, maxPriceDeviation: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              O'rtacha narxdan maksimal farq
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimal ombor darajasi
            </label>
            <input
              type="number"
              min="0"
              value={settings.minStockLevel}
              onChange={(e) => setSettings({ ...settings, minStockLevel: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Omborda kamida shuncha dona bo'lishi kerak
            </p>
          </div>
        </div>
      </div>

      {/* Boost Factors Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Boost Faktorlar
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yangi mahsulot boost (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.newProductBoost}
              onChange={(e) => setSettings({ ...settings, newProductBoost: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              30 kun ichidagi yangi mahsulotlarga qo'shimcha ball
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trending boost (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.trendingBoost}
              onChange={(e) => setSettings({ ...settings, trendingBoost: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Trend mahsulotlarga qo'shimcha ball
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mavsumiy boost (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.seasonalBoost}
              onChange={(e) => setSettings({ ...settings, seasonalBoost: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mavsumiy mahsulotlarga qo'shimcha ball
            </p>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Tayyor Sozlamalar (Presets)
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => setSettings({
              ...defaultAISettings,
              salesSpeedWeight: 50,
              priceWeight: 30,
              ratingWeight: 20,
            })}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left"
          >
            <div className="font-bold text-gray-900 mb-1">🚀 Tez Sotiluvchi</div>
            <div className="text-sm text-gray-600">
              Sotilish tezligiga asoslangan
            </div>
          </button>

          <button
            onClick={() => setSettings({
              ...defaultAISettings,
              priceWeight: 50,
              ratingWeight: 30,
              salesSpeedWeight: 20,
            })}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left"
          >
            <div className="font-bold text-gray-900 mb-1">💰 Eng Arzon</div>
            <div className="text-sm text-gray-600">
              Narx raqobatiga asoslangan
            </div>
          </button>

          <button
            onClick={() => setSettings({
              ...defaultAISettings,
              ratingWeight: 50,
              salesSpeedWeight: 30,
              priceWeight: 20,
            })}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left"
          >
            <div className="font-bold text-gray-900 mb-1">⭐ Eng Yaxshi</div>
            <div className="text-sm text-gray-600">
              Reytingga asoslangan
            </div>
          </button>
        </div>
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleReset}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
        >
          Qayta tiklash
        </button>
        <button
          onClick={handleSave}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
        >
          Sozlamalarni saqlash
        </button>
      </div>
    </div>
  )
}
