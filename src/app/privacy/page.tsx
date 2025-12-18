'use client'

import MainLayout from '@/components/layout/MainLayout'
import { Shield, Lock, Eye, Database, UserCheck } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-green-100 rounded-xl">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Maxfiylik siyosati</h1>
                <p className="text-gray-600 mt-1">Oxirgi yangilanish: {new Date().toLocaleDateString('uz-UZ')}</p>
              </div>
            </div>

            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Kirish</h2>
                <p className="text-gray-700 mb-4">
                  DUBAYMALL sizning maxfiyligingizni jiddiy qabul qiladi. Ushbu maxfiylik siyosati 
                  biz qanday ma'lumotlarni to'playmiz, qanday ishlatamiz va qanday himoya qilamiz 
                  haqida ma'lumot beradi.
                </p>
              </section>

              <section className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Database className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">1. To'planadigan ma'lumotlar</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Biz quyidagi ma'lumotlarni to'playmiz:
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Shaxsiy ma'lumotlar:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                  <li>Ism va familiya</li>
                  <li>Email manzil</li>
                  <li>Telefon raqam</li>
                  <li>Yetkazib berish manzili</li>
                  <li>To'lov ma'lumotlari (shifrlangan holda)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Texnik ma'lumotlar:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>IP manzil</li>
                  <li>Brauzer turi va versiyasi</li>
                  <li>Qurilma ma'lumotlari</li>
                  <li>Saytda o'tkazilgan vaqt</li>
                  <li>Ko'rilgan sahifalar</li>
                </ul>
              </section>

              <section className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Eye className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">2. Ma'lumotlardan foydalanish</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Sizning ma'lumotlaringizdan quyidagi maqsadlarda foydalanamiz:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Buyurtmalarni qayta ishlash va yetkazib berish</li>
                  <li>Hisobingizni boshqarish</li>
                  <li>Mijozlar xizmatini taqdim etish</li>
                  <li>Xizmatlarimizni yaxshilash</li>
                  <li>Marketing va reklama (roziligingiz bilan)</li>
                  <li>Firibgarlikni oldini olish</li>
                  <li>Qonuniy talablarga rioya qilish</li>
                </ul>
              </section>

              <section className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Lock className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">3. Ma'lumotlar xavfsizligi</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Biz sizning ma'lumotlaringizni himoya qilish uchun quyidagi choralarni ko'ramiz:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>SSL shifrlash texnologiyasi</li>
                  <li>Xavfsiz serverlar</li>
                  <li>Muntazam xavfsizlik tekshiruvlari</li>
                  <li>Cheklangan kirish huquqlari</li>
                  <li>Parollarni shifrlash</li>
                  <li>Ikki faktorli autentifikatsiya (ixtiyoriy)</li>
                </ul>
              </section>

              <section className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <UserCheck className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-900">4. Ma'lumotlarni ulashish</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Biz sizning ma'lumotlaringizni quyidagi hollarda ulashamiz:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Sotuvchilar:</strong> Buyurtmani bajarish uchun zarur ma'lumotlar</li>
                  <li><strong>Yetkazib berish xizmatlari:</strong> Manzil va telefon raqam</li>
                  <li><strong>To'lov tizimlari:</strong> To'lovni qayta ishlash uchun</li>
                  <li><strong>Qonun hujjatlari:</strong> Qonuniy talablar bo'yicha</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Biz sizning ma'lumotlaringizni uchinchi tomonlarga sotmaymiz yoki ijaraga bermaymiz.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookie fayllar</h2>
                <p className="text-gray-700 mb-4">
                  Biz cookie fayllardan quyidagi maqsadlarda foydalanamiz:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Saytning ishlashini ta'minlash</li>
                  <li>Foydalanuvchi tajribasini yaxshilash</li>
                  <li>Statistika to'plash</li>
                  <li>Reklamalarni moslash</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  Siz brauzer sozlamalarida cookie fayllarni o'chirib qo'yishingiz mumkin, 
                  lekin bu saytning ba'zi funksiyalarini cheklashi mumkin.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Sizning huquqlaringiz</h2>
                <p className="text-gray-700 mb-4">
                  Siz quyidagi huquqlarga egasiz:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Kirish huquqi:</strong> O'z ma'lumotlaringizni ko'rish</li>
                  <li><strong>Tuzatish huquqi:</strong> Noto'g'ri ma'lumotlarni tuzatish</li>
                  <li><strong>O'chirish huquqi:</strong> Ma'lumotlaringizni o'chirish</li>
                  <li><strong>Cheklash huquqi:</strong> Ma'lumotlar ishlov berishni cheklash</li>
                  <li><strong>Portativlik huquqi:</strong> Ma'lumotlarni boshqa joyga ko'chirish</li>
                  <li><strong>E'tiroz bildirish huquqi:</strong> Ma'lumotlar ishlov berishga qarshi chiqish</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Bolalar maxfiyligini himoya qilish</h2>
                <p className="text-gray-700 mb-4">
                  Bizning xizmatlarimiz 18 yoshdan katta shaxslar uchun mo'ljallangan. 
                  Biz ongli ravishda 18 yoshdan kichik bolalardan ma'lumot to'plamaymiz. 
                  Agar siz 18 yoshdan kichik bo'lsangiz, iltimos, ota-onangiz yoki vasiyingiz 
                  ruxsati bilan foydalaning.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Ma'lumotlarni saqlash muddati</h2>
                <p className="text-gray-700 mb-4">
                  Biz sizning ma'lumotlaringizni quyidagi muddatlarda saqlaymiz:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Hisob ma'lumotlari: Hisob faol bo'lguncha</li>
                  <li>Buyurtma tarixi: 5 yil</li>
                  <li>To'lov ma'lumotlari: Qonun talablariga muvofiq</li>
                  <li>Marketing ma'lumotlari: Rozilikni bekor qilguningizcha</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Siyosatdagi o'zgarishlar</h2>
                <p className="text-gray-700 mb-4">
                  Biz ushbu maxfiylik siyosatini vaqti-vaqti bilan yangilaymiz. 
                  Muhim o'zgarishlar bo'lsa, sizga email orqali xabar beramiz. 
                  Oxirgi yangilanish sanasi sahifa yuqorisida ko'rsatilgan.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Biz bilan bog'lanish</h2>
                <p className="text-gray-700 mb-4">
                  Maxfiylik siyosati yoki ma'lumotlaringiz haqida savollar bo'lsa, 
                  biz bilan bog'laning:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Email: privacy@dubaymall.uz</li>
                  <li>Telefon: +998 90 123 45 67</li>
                  <li>Manzil: Toshkent, O'zbekiston</li>
                </ul>
              </section>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sizning maxfiyligingiz muhim</h3>
                    <p className="text-gray-700">
                      Biz sizning shaxsiy ma'lumotlaringizni himoya qilish uchun barcha zarur 
                      choralarni ko'ramiz. Agar sizda biron-bir savol yoki tashvish bo'lsa, 
                      iltimos, biz bilan bog'laning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
