'use client'

import MainLayout from '@/components/layout/MainLayout'
import { FileText, Shield, AlertCircle } from 'lucide-react'

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-primary-100 rounded-xl">
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Foydalanish shartlari</h1>
                <p className="text-gray-600 mt-1">Oxirgi yangilanish: {new Date().toLocaleDateString('uz-UZ')}</p>
              </div>
            </div>

            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Umumiy qoidalar</h2>
                <p className="text-gray-700 mb-4">
                  DUBAYMALL platformasidan foydalanish orqali siz quyidagi shartlarga rozilik bildirasiz:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Platformadan faqat qonuniy maqsadlarda foydalanish</li>
                  <li>To'g'ri va aniq ma'lumotlar taqdim etish</li>
                  <li>Boshqa foydalanuvchilarning huquqlarini hurmat qilish</li>
                  <li>Platformaning xavfsizligini buzmaslik</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Ro'yxatdan o'tish</h2>
                <p className="text-gray-700 mb-4">
                  Platformadan to'liq foydalanish uchun ro'yxatdan o'tish talab qilinadi:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>18 yoshdan oshgan bo'lishingiz kerak</li>
                  <li>Haqiqiy ma'lumotlarni taqdim etishingiz shart</li>
                  <li>Parolingizni maxfiy saqlashingiz kerak</li>
                  <li>Hisobingiz uchun siz javobgarsiz</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Buyurtmalar va to'lovlar</h2>
                <p className="text-gray-700 mb-4">
                  Buyurtma berish va to'lov qilish shartlari:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Barcha narxlar O'zbekiston so'mida ko'rsatilgan</li>
                  <li>To'lovlar Click, Payme yoki naqd pul orqali amalga oshiriladi</li>
                  <li>Buyurtma tasdiqlanganidan keyin bekor qilish mumkin emas</li>
                  <li>Mahsulot narxi o'zgarishi mumkin</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Qaytarish va almashtirish</h2>
                <p className="text-gray-700 mb-4">
                  Mahsulotlarni qaytarish va almashtirish shartlari:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Mahsulotni 14 kun ichida qaytarish mumkin</li>
                  <li>Mahsulot ishlatilmagan va asl holatida bo'lishi kerak</li>
                  <li>Qaytarish uchun chek yoki faktura talab qilinadi</li>
                  <li>Ba'zi mahsulotlar qaytarilmaydi (masalan, shaxsiy gigiena mahsulotlari)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Sotuvchilar uchun</h2>
                <p className="text-gray-700 mb-4">
                  Sotuvchi sifatida ro'yxatdan o'tish shartlari:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Yuridik shaxs yoki tadbirkor bo'lishingiz kerak</li>
                  <li>Mahsulotlar sifatli va qonuniy bo'lishi shart</li>
                  <li>Mahsulot tavsifi to'g'ri va to'liq bo'lishi kerak</li>
                  <li>Buyurtmalarni o'z vaqtida yetkazib berish majburiyati</li>
                  <li>Platformadan 10% komissiya olinadi</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Blogerlar uchun</h2>
                <p className="text-gray-700 mb-4">
                  Bloger dasturiga qo'shilish shartlari:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Ijtimoiy tarmoqlarda faol bo'lishingiz kerak</li>
                  <li>Kamida 5000 ta obunachi bo'lishi kerak</li>
                  <li>Mahsulotlarni halol va to'g'ri targ'ib qilish</li>
                  <li>Har bir sotuvdan 5-15% komissiya olasiz</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellektual mulk</h2>
                <p className="text-gray-700 mb-4">
                  Platformadagi barcha kontent (logo, dizayn, matnlar) DUBAYMALL mulki hisoblanadi:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Kontentni nusxalash yoki tarqatish taqiqlanadi</li>
                  <li>Mahsulot rasmlari sotuvchilarga tegishli</li>
                  <li>Sharhlar va fikrlar foydalanuvchilarga tegishli</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Javobgarlik cheklovi</h2>
                <p className="text-gray-700 mb-4">
                  DUBAYMALL quyidagilar uchun javobgar emas:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Sotuvchilar tomonidan taqdim etilgan mahsulot sifati</li>
                  <li>Yetkazib berishda kechikishlar (force majeure holatlarda)</li>
                  <li>Uchinchi tomon xizmatlari (Click, Payme)</li>
                  <li>Foydalanuvchilar o'rtasidagi nizolar</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. O'zgarishlar</h2>
                <p className="text-gray-700 mb-4">
                  DUBAYMALL ushbu shartlarni istalgan vaqtda o'zgartirish huquqini o'zida saqlab qoladi. 
                  O'zgarishlar saytda e'lon qilinadi va darhol kuchga kiradi.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Aloqa</h2>
                <p className="text-gray-700 mb-4">
                  Savollar yoki shikoyatlar bo'lsa, biz bilan bog'laning:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Email: support@dubaymall.uz</li>
                  <li>Telefon: +998 90 123 45 67</li>
                  <li>Manzil: Toshkent, O'zbekiston</li>
                </ul>
              </section>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Muhim eslatma</h3>
                    <p className="text-gray-700">
                      Platformadan foydalanishni davom ettirib, siz ushbu shartlarga to'liq rozilik 
                      bildirasiz. Agar shartlar bilan rozi bo'lmasangiz, platformadan foydalanmang.
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
