'use client'

import { useState } from 'react'
import MainLayout from '@/components/layout/MainLayout'
import { Users, Gift, DollarSign, Share2, Copy, Check, Facebook, Twitter, Send } from 'lucide-react'

export default function ReferralPage() {
  const [referralCode, setReferralCode] = useState('ALISHER2024')
  const [copied, setCopied] = useState(false)
  const [referralLink] = useState(`https://dubaymall.uz/register?ref=${referralCode}`)

  const stats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: 2400000,
    pendingEarnings: 600000,
  }

  const referrals = [
    { name: 'Dilnoza R.', date: '15 Dek 2024', status: 'active', earnings: 200000 },
    { name: 'Bobur T.', date: '12 Dek 2024', status: 'active', earnings: 200000 },
    { name: 'Malika A.', date: '10 Dek 2024', status: 'pending', earnings: 200000 },
    { name: 'Sardor K.', date: '08 Dek 2024', status: 'active', earnings: 200000 },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareOnSocial = (platform: string) => {
    const text = `DUBAYMALL'da ro'yxatdan o'ting va 200,000 so'm bonus oling! Mening referal kodim: ${referralCode}`
    const url = referralLink

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        break
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Referal Dasturi</h1>
            <p className="text-gray-600">Do'stlaringizni taklif qiling va pul ishlang!</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <Users className="w-8 h-8 mb-4 opacity-80" />
              <p className="text-blue-100 text-sm mb-1">Jami taklif qilinganlar</p>
              <p className="text-3xl font-bold">{stats.totalReferrals}</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <Users className="w-8 h-8 mb-4 opacity-80" />
              <p className="text-green-100 text-sm mb-1">Faol foydalanuvchilar</p>
              <p className="text-3xl font-bold">{stats.activeReferrals}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <DollarSign className="w-8 h-8 mb-4 opacity-80" />
              <p className="text-purple-100 text-sm mb-1">Jami daromad</p>
              <p className="text-3xl font-bold">{(stats.totalEarnings / 1000000).toFixed(1)}M</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <Gift className="w-8 h-8 mb-4 opacity-80" />
              <p className="text-orange-100 text-sm mb-1">Kutilayotgan</p>
              <p className="text-3xl font-bold">{(stats.pendingEarnings / 1000).toFixed(0)}K</p>
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sizning referal havolangiz</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referal kodi
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={referralCode}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 font-mono text-lg"
                  />
                  <button
                    onClick={() => copyToClipboard(referralCode)}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    <span>{copied ? 'Nusxalandi' : 'Nusxalash'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referal havola
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(referralLink)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    <span>{copied ? 'Nusxalandi' : 'Nusxalash'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ijtimoiy tarmoqlarda ulashing
                </label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => shareOnSocial('facebook')}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={() => shareOnSocial('twitter')}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={() => shareOnSocial('telegram')}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                    <span>Telegram</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Qanday ishlaydi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '1',
                  title: 'Ulashing',
                  desc: 'Referal havolangizni do\'stlaringiz bilan ulashing',
                  icon: Share2,
                },
                {
                  step: '2',
                  title: 'Ro\'yxatdan o\'tish',
                  desc: 'Do\'stingiz havolangiz orqali ro\'yxatdan o\'tadi',
                  icon: Users,
                },
                {
                  step: '3',
                  title: 'Pul ishlang',
                  desc: 'Har bir xarid uchun 200,000 so\'m oling',
                  icon: DollarSign,
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.step} className="bg-white rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Referrals List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">Sizning taklif qilganlaringiz</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Foydalanuvchi</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sana</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Holat</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Daromad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {referrals.map((referral, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{referral.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{referral.date}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          referral.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {referral.status === 'active' ? 'Faol' : 'Kutilmoqda'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-green-600">
                          +{referral.earnings.toLocaleString('uz-UZ')} so'm
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
