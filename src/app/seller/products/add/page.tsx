'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, Plus, Camera } from 'lucide-react'
import CameraCapture from '@/components/seller/CameraCapture'
import ProductPreview from '@/components/seller/ProductPreview'
import { AIProductScanResult } from '@/lib/ai-scanner'

type ViewMode = 'form' | 'camera' | 'preview'

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('form')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<AIProductScanResult | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Elektronika',
    price: '',
    stock: '',
  })

  const categories = [
    'Elektronika',
    'Kiyim',
    'Maishiy texnika',
    'Sport',
    'Go\'zallik',
    'Kitoblar',
    'O\'yinchoqlar',
    'Avtotovarlar',
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Mock image upload - convert to base64
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleAIScan = async (imageData: string) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/ai/scan-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'AI skanerlash xatosi')
      }

      setScanResult(data)
      setCapturedImage(imageData)
      setViewMode('preview')
    } catch (err: any) {
      setError(err.message)
      setViewMode('form')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmAIProduct = async (finalPrice: number) => {
    if (!scanResult || !capturedImage) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: scanResult.productCard.name,
          description: scanResult.productCard.description,
          category: scanResult.productCard.category,
          price: finalPrice,
          stock: 1,
          images: [capturedImage],
          aiGenerated: true,
          aiConfidence: scanResult.confidence,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Mahsulot qo\'shish xatosi')
      }

      alert('Mahsulot muvaffaqiyatli qo\'shildi! Admin tasdiqlashini kutmoqda.')
      router.push('/seller/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Mahsulot qo\'shish xatosi')
      }

      alert('Mahsulot muvaffaqiyatli qo\'shildi! Admin tasdiqlashini kutmoqda.')
      router.push('/seller/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (viewMode === 'camera') {
    return (
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Mahsulot Skaneri</h1>
          <p className="text-gray-600 mt-1">Mahsulot rasmini oling, AI avtomatik ma'lumot to'ldiradi</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <CameraCapture
          onCapture={handleAIScan}
          onCancel={() => setViewMode('form')}
        />
      </div>
    )
  }

  if (viewMode === 'preview' && scanResult && capturedImage) {
    return (
      <ProductPreview
        scanResult={scanResult}
        imageUrl={capturedImage}
        onConfirm={handleConfirmAIProduct}
        onRetake={() => {
          setScanResult(null)
          setCapturedImage(null)
          setViewMode('camera')
        }}
      />
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mahsulot qo'shish</h1>
        <p className="text-gray-600 mt-1">Yangi mahsulot ma'lumotlarini kiriting</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* AI Scanner Option */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              AI Mahsulot Skaneri
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Mahsulot rasmini oling, AI avtomatik ravishda nomi, tasnifi va narxni aniqlaydi. 
              Siz faqat yakuniy narxni belgilaysiz!
            </p>
            <button
              onClick={() => setViewMode('camera')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              AI Skaner bilan qo'shish
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-50 text-gray-500">yoki qo'lda kiriting</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-xl font-bold mb-6">Asosiy ma'lumotlar</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mahsulot nomi *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Masalan: iPhone 15 Pro Max 256GB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategoriya *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasnif *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Mahsulot haqida batafsil ma'lumot (kamida 50 so'z)"
              />
              <div className="text-sm text-gray-500 mt-1">
                {formData.description.length} belgi
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-xl font-bold mb-6">Rasmlar</h2>

          <div className="grid grid-cols-4 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img src={image} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Rasm yuklash</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <p className="text-sm text-gray-500">
            Maksimal 5 ta rasm. Tavsiya: 800x800px yoki undan katta.
          </p>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-xl font-bold mb-6">Narx va ombor</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tannarx (so'm) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="15500000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Bu narxga bloger va platforma haqi qo'shiladi
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Omborda (dona) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="10"
              />
            </div>
          </div>

          {formData.price && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Narx hisoblash:</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tannarx:</span>
                  <span className="font-semibold">{parseFloat(formData.price || '0').toLocaleString()} so'm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bloger haqi (20%):</span>
                  <span className="font-semibold">{(parseFloat(formData.price || '0') * 0.2).toLocaleString()} so'm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platforma haqi (20%):</span>
                  <span className="font-semibold">{(parseFloat(formData.price || '0') * 0.2).toLocaleString()} so'm</span>
                </div>
                <div className="border-t pt-1 mt-1 flex justify-between">
                  <span className="font-bold text-gray-900">Yakuniy narx:</span>
                  <span className="font-bold text-primary-600">
                    {(parseFloat(formData.price || '0') * 1.4).toLocaleString()} so'm
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Yuklanmoqda...' : 'Mahsulot qo\'shish'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
          >
            Bekor qilish
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Eslatma:</strong> Mahsulot qo'shilgandan so'ng admin tomonidan tekshiriladi. 
            Tasdiqlangandan keyin sotuvga chiqadi.
          </p>
        </div>
      </form>
    </div>
  )
}
