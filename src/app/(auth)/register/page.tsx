'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, User, Phone, Eye, EyeOff, Building, Users, TrendingUp } from 'lucide-react'
import { signUpUser } from '@/lib/auth-service'

type UserRole = 'customer' | 'seller' | 'blogger'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = (searchParams.get('role') as UserRole) || 'customer'
  
  const [role, setRole] = useState<UserRole>(defaultRole)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    // Seller fields
    company_name: '',
    business_license: '',
    tax_id: '',
    // Blogger fields
    youtube_channel: '',
    youtube_followers: '',
    instagram_username: '',
    instagram_followers: '',
    telegram_channel: '',
    telegram_followers: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirm_password) {
      setError('Parollar mos kelmaydi')
      setLoading(false)
      return
    }

    try {
      const { user, error: signUpError } = await signUpUser({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
        role,
        // Seller data
        company_name: role === 'seller' ? formData.company_name : undefined,
        business_license: role === 'seller' ? formData.business_license : undefined,
        tax_id: role === 'seller' ? formData.tax_id : undefined,
        // Blogger data
        youtube_channel: role === 'blogger' ? formData.youtube_channel : undefined,
        youtube_followers: role === 'blogger' && formData.youtube_followers ? parseInt(formData.youtube_followers) : undefined,
        instagram_username: role === 'blogger' ? formData.instagram_username : undefined,
        instagram_followers: role === 'blogger' && formData.instagram_followers ? parseInt(formData.instagram_followers) : undefined,
        telegram_channel: role === 'blogger' ? formData.telegram_channel : undefined,
        telegram_followers: role === 'blogger' && formData.telegram_followers ? parseInt(formData.telegram_followers) : undefined,
      })

      if (signUpError || !user) {
        throw new Error(signUpError || 'Ro\'yxatdan o\'tish xatosi')
      }

      // Redirect based on role and status
      if (role === 'customer') {
        router.push('/')
      } else {
        // Seller and blogger need approval
        router.push('/pending-approval')
      }
    } catch (err: any) {
      setError(err.message || 'Ro\'yxatdan o\'tish xatosi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ro'yxatdan o'tish</h1>
          <p className="text-gray-600">DUBAYMALL platformasiga qo'shiling</p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`p-4 rounded-xl border-2 transition ${
              role === 'customer'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Users className={`w-8 h-8 mx-auto mb-2 ${role === 'customer' ? 'text-primary-600' : 'text-gray-400'}`} />
            <div className="text-sm font-semibold">Mijoz</div>
            <div className="text-xs text-gray-500">Xarid qilish</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`p-4 rounded-xl border-2 transition ${
              role === 'seller'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Building className={`w-8 h-8 mx-auto mb-2 ${role === 'seller' ? 'text-primary-600' : 'text-gray-400'}`} />
            <div className="text-sm font-semibold">Sotuvchi</div>
            <div className="text-xs text-gray-500">Sotish</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('blogger')}
            className={`p-4 rounded-xl border-2 transition ${
              role === 'blogger'
                ? 'border-gold-500 bg-gold-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${role === 'blogger' ? 'text-gold-600' : 'text-gray-400'}`} />
            <div className="text-sm font-semibold">Bloger</div>
            <div className="text-xs text-gray-500">Marketing</div>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To'liq ism
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ism Familiya"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+998 90 123 45 67"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>
          </div>

          {role === 'seller' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kompaniya nomi *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Kompaniya nomi"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biznes litsenziya raqami *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.business_license}
                    onChange={(e) => setFormData({ ...formData, business_license: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Litsenziya raqami"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    STIR (INN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tax_id}
                    onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="STIR raqami"
                  />
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Diqqat:</strong> Sizning ma'lumotlaringiz admin tomonidan tekshiriladi. 
                  Tasdiqlangandan so'ng profilga kirish imkoniyati beriladi.
                </p>
              </div>
            </>
          )}

          {role === 'blogger' && (
            <>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  <strong>Talablar:</strong> Kamida 500 ta faol obunachi (YouTube, Instagram yoki Telegram)
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube kanal
                    </label>
                    <input
                      type="text"
                      value={formData.youtube_channel}
                      onChange={(e) => setFormData({ ...formData, youtube_channel: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="youtube.com/@kanal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      YouTube obunachilari
                    </label>
                    <input
                      type="number"
                      value={formData.youtube_followers}
                      onChange={(e) => setFormData({ ...formData, youtube_followers: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      value={formData.instagram_username}
                      onChange={(e) => setFormData({ ...formData, instagram_username: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram obunachilari
                    </label>
                    <input
                      type="number"
                      value={formData.instagram_followers}
                      onChange={(e) => setFormData({ ...formData, instagram_followers: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telegram kanal
                    </label>
                    <input
                      type="text"
                      value={formData.telegram_channel}
                      onChange={(e) => setFormData({ ...formData, telegram_channel: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="@kanal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telegram obunachilari
                    </label>
                    <input
                      type="number"
                      value={formData.telegram_followers}
                      onChange={(e) => setFormData({ ...formData, telegram_followers: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Diqqat:</strong> Sizning ijtimoiy tarmoq hisoblaringiz admin tomonidan tekshiriladi. 
                    Kamida 500 ta faol obunachi bo'lishi kerak. Tasdiqlangandan so'ng profilga kirish imkoniyati beriladi.
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parol
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parolni tasdiqlash
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              required
              className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label className="ml-2 text-sm text-gray-600">
              Men{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                Foydalanish shartlari
              </Link>{' '}
              va{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                Maxfiylik siyosati
              </Link>
              ga roziman
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Ro\'yxatdan o\'tish...' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Hisobingiz bormi?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
