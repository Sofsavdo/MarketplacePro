'use client'

import { useState } from 'react'
import { FileText, Image as ImageIcon, Video, Download, Plus, Sparkles, Copy, Check } from 'lucide-react'

interface Content {
  id: string
  type: 'post' | 'story' | 'video'
  title: string
  description: string
  productId: string
  productName: string
  promoCode: string
  views: number
  clicks: number
  conversions: number
  earnings: number
  createdAt: string
  status: 'draft' | 'published'
}

export default function BloggerContentPage() {
  const [contents, setContents] = useState<Content[]>([
    {
      id: '1',
      type: 'post',
      title: 'iPhone 15 Pro Max - Eng yaxshi smartfon!',
      description: 'Yangi iPhone 15 Pro Max haqida batafsil sharh. Titanium korpus, A17 Pro chip...',
      productId: '1',
      productName: 'iPhone 15 Pro Max 256GB',
      promoCode: 'TECH20',
      views: 15420,
      clicks: 892,
      conversions: 45,
      earnings: 6750000,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'published',
    },
    {
      id: '2',
      type: 'video',
      title: 'Samsung Galaxy S24 Ultra Unboxing',
      description: 'Yangi Samsung Galaxy S24 Ultra ni ochib ko\'ramiz va test qilamiz',
      productId: '2',
      productName: 'Samsung Galaxy S24 Ultra',
      promoCode: 'SAMSUNG15',
      views: 8930,
      clicks: 534,
      conversions: 28,
      earnings: 3696000,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'published',
    },
  ])

  const [generatingAI, setGeneratingAI] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const generateAIContent = async () => {
    setGeneratingAI(true)
    setTimeout(() => {
      setGeneratingAI(false)
      alert('AI kontent yaratildi! Tahrirlash uchun ochilmoqda...')
    }, 2000)
  }

  const copyPromoCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return FileText
      case 'story': return ImageIcon
      case 'video': return Video
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'post': return 'bg-blue-100 text-blue-800'
      case 'story': return 'bg-purple-100 text-purple-800'
      case 'video': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalViews = contents.reduce((sum, c) => sum + c.views, 0)
  const totalClicks = contents.reduce((sum, c) => sum + c.clicks, 0)
  const totalConversions = contents.reduce((sum, c) => sum + c.conversions, 0)
  const totalEarnings = contents.reduce((sum, c) => sum + c.earnings, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kontent Boshqaruvi</h1>
        <p className="text-gray-600">Mahsulotlar uchun kontent yarating va boshqaring</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-1">Jami ko'rishlar</p>
          <p className="text-3xl font-bold text-gray-900">{(totalViews / 1000).toFixed(1)}K</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-1">Jami kliklar</p>
          <p className="text-3xl font-bold text-gray-900">{totalClicks}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-1">Konversiyalar</p>
          <p className="text-3xl font-bold text-gray-900">{totalConversions}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 text-sm mb-1">Jami daromad</p>
          <p className="text-3xl font-bold text-gray-900">
            {(totalEarnings / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={generateAIContent}
          disabled={generatingAI}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5" />
          <span>{generatingAI ? 'Yaratilmoqda...' : 'AI bilan yaratish'}</span>
        </button>
        <button className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <Plus className="w-5 h-5" />
          <span>Qo'lda yaratish</span>
        </button>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {contents.map((content) => {
          const TypeIcon = getTypeIcon(content.type)
          return (
            <div key={content.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-3 rounded-lg ${getTypeColor(content.type)}`}>
                    <TypeIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{content.title}</h3>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        content.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {content.status === 'published' ? 'Nashr qilingan' : 'Qoralama'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{content.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Mahsulot: {content.productName}</span>
                      <span>•</span>
                      <span>{new Date(content.createdAt).toLocaleDateString('uz-UZ')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Promo Code */}
              <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Promo kod</p>
                    <p className="text-2xl font-bold text-primary-600 font-mono">
                      {content.promoCode}
                    </p>
                  </div>
                  <button
                    onClick={() => copyPromoCode(content.promoCode, content.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border"
                  >
                    {copiedId === content.id ? (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Nusxalandi</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Nusxalash</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{(content.views / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-gray-600">Ko'rishlar</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{content.clicks}</p>
                  <p className="text-sm text-gray-600">Kliklar</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{content.conversions}</p>
                  <p className="text-sm text-gray-600">Sotuvlar</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {(content.earnings / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-gray-600">Daromad</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
