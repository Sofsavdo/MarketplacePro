'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, CheckCircle, XCircle, Mail, Phone } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth-service'

export default function PendingApprovalPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    const { user: currentUser } = await getCurrentUser()
    
    if (!currentUser) {
      router.push('/login')
      return
    }

    setUser(currentUser)
    setLoading(false)

    // If approved, redirect to dashboard
    if (currentUser.status === 'approved' || currentUser.status === 'active') {
      if (currentUser.role === 'seller') {
        router.push('/seller/dashboard')
      } else if (currentUser.role === 'blogger') {
        router.push('/blogger/dashboard')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {user?.status === 'pending' && (
          <>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-yellow-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tekshiruvda
              </h1>
              <p className="text-gray-600">
                Sizning arizangiz admin tomonidan ko'rib chiqilmoqda
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Yuborilgan ma'lumotlar:
                </h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Ism:</strong> {user.full_name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Telefon:</strong> {user.phone}</p>
                  <p><strong>Rol:</strong> {user.role === 'seller' ? 'Sotuvchi' : 'Bloger'}</p>
                  
                  {user.role === 'seller' && (
                    <>
                      <p><strong>Kompaniya:</strong> {user.company_name}</p>
                      <p><strong>Litsenziya:</strong> {user.business_license}</p>
                      <p><strong>STIR:</strong> {user.tax_id}</p>
                    </>
                  )}

                  {user.role === 'blogger' && (
                    <>
                      {user.youtube_channel && (
                        <p><strong>YouTube:</strong> {user.youtube_channel} ({user.youtube_followers} obunachi)</p>
                      )}
                      {user.instagram_username && (
                        <p><strong>Instagram:</strong> @{user.instagram_username} ({user.instagram_followers} obunachi)</p>
                      )}
                      {user.telegram_channel && (
                        <p><strong>Telegram:</strong> {user.telegram_channel} ({user.telegram_followers} obunachi)</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Keyingi qadamlar:
                </h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary-600">1.</span>
                    <span>Admin sizning ma'lumotlaringizni tekshiradi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary-600">2.</span>
                    <span>
                      {user.role === 'seller' 
                        ? 'Biznes litsenziya va STIR raqami tekshiriladi'
                        : 'Ijtimoiy tarmoq hisoblaringiz va obunachilari tekshiriladi (kamida 500 ta faol obunachi)'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary-600">3.</span>
                    <span>Tasdiqlangandan so'ng email orqali xabar beramiz</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-primary-600">4.</span>
                    <span>Profilga kirish imkoniyati beriladi</span>
                  </li>
                </ol>
              </div>

              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Eslatma:</strong> Tekshiruv jarayoni odatda 24-48 soat ichida yakunlanadi. 
                  Agar ma'lumotlaringizda xatolik bo'lsa yoki talablarga javob bermasa, 
                  sizga email orqali xabar beramiz.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                >
                  Bosh sahifaga qaytish
                </button>
                <button
                  onClick={checkStatus}
                  className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  Holatni yangilash
                </button>
              </div>
            </div>
          </>
        )}

        {user?.status === 'rejected' && (
          <>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Ariza rad etildi
              </h1>
              <p className="text-gray-600">
                Afsus, sizning arizangiz qabul qilinmadi
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">
                  Rad etilish sababi:
                </h3>
                <p className="text-sm text-red-800">
                  {user.rejection_reason || 'Ma\'lumotlar talablarga javob bermaydi'}
                </p>
              </div>

              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Nima qilish kerak:
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Ma'lumotlaringizni to'g'rilang</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Barcha talablarga javob berishga ishonch hosil qiling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Qayta ro'yxatdan o'ting</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                >
                  Bosh sahifaga
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  Qayta ro'yxatdan o'tish
                </button>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-2">Savollaringiz bormi?</p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a href="mailto:support@dubaymall.uz" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
              <Mail className="w-4 h-4" />
              support@dubaymall.uz
            </a>
            <a href="tel:+998901234567" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
              <Phone className="w-4 h-4" />
              +998 90 123 45 67
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
