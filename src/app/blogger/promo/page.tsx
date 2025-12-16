'use client'

import { useState } from 'react'
import { Copy, RefreshCw, ExternalLink, Download } from 'lucide-react'

export default function BloggerPromoPage() {
  const [promoData, setPromoData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const generatePromo = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/blogger/generate-promo', {
        method: 'POST',
      })
      const data = await response.json()
      setPromoData(data)
    } catch (error) {
      alert('Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Nusxalandi!')
  }

  const downloadPromoMaterial = () => {
    const text = `
🔥 MAXSUS CHEGIRMA!

💰 Promo kod: ${promoData.promoCode}
🔗 Havola: ${promoData.referralLink}

✅ Yuqori sifat
✅ Tez yetkazib berish
✅ Kafolat

#DUBAYMALL #Chegirma #OnlineShopping
    `.trim()

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'promo-material.txt'
    a.click()
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Promo Materiallar</h1>
        <p className="text-gray-600 mt-1">Promo kod va referal ssilka yarating</p>
      </div>

      {!promoData ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
          <div className="w-20 h-20 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw className="w-10 h-10 text-gold-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Promo kod yarating
          </h2>
          <p className="text-gray-600 mb-8">
            Shaxsiy promo kod va referal ssilka oling. Har bir sotuvdan yuqori komissiya!
          </p>
          <button
            onClick={generatePromo}
            disabled={loading}
            className="px-8 py-4 bg-gold-600 text-white rounded-xl hover:bg-gold-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Yaratilmoqda...' : 'Promo Kod Yaratish'}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Promo Code */}
          <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Sizning Promo Kodingiz</h2>
              <button
                onClick={generatePromo}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                title="Yangi kod yaratish"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-4">
              <div className="text-sm text-gold-100 mb-2">Promo Kod:</div>
              <div className="text-4xl font-bold mb-4">{promoData.promoCode}</div>
              <button
                onClick={() => copyToClipboard(promoData.promoCode)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gold-600 rounded-lg hover:bg-gold-50 transition font-semibold"
              >
                <Copy className="w-4 h-4" />
                Nusxalash
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gold-100">Komissiya:</div>
                <div className="font-bold text-lg">{promoData.commission}%</div>
              </div>
              <div>
                <div className="text-gold-100">Amal qilish muddati:</div>
                <div className="font-bold text-lg">30 kun</div>
              </div>
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-xl font-bold mb-4">Referal Ssilka</h3>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600 mb-2">Sizning ssilkangiz:</div>
              <div className="font-mono text-sm break-all text-gray-900 mb-3">
                {promoData.referralLink}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(promoData.referralLink)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  <Copy className="w-4 h-4" />
                  Nusxalash
                </button>
                <a
                  href={promoData.referralLink}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition font-semibold"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ochish
                </a>
              </div>
            </div>
          </div>

          {/* Promo Material */}
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-xl font-bold mb-4">Reklama Materiali</h3>
            <div className="bg-gray-50 rounded-lg p-6 mb-4 font-mono text-sm whitespace-pre-wrap">
{`🔥 MAXSUS CHEGIRMA!

💰 Promo kod: ${promoData.promoCode}
🔗 Havola: ${promoData.referralLink}

✅ Yuqori sifat
✅ Tez yetkazib berish
✅ Kafolat

#DUBAYMALL #Chegirma #OnlineShopping`}
            </div>
            <button
              onClick={downloadPromoMaterial}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              <Download className="w-4 h-4" />
              Yuklab olish
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-3">Qanday ishlatish:</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>Promo kodni yoki referal ssilkani nusxalang</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>Telegram, Instagram yoki boshqa ijtimoiy tarmoqlarda ulashing</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>Har bir sotuvdan yuqori komissiya oling</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">4.</span>
                <span>Statistikani real-time kuzating</span>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
