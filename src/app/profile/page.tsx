'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
      return
    }
    
    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setFormData({
        full_name: userData.name || '',
        phone: userData.phone || '',
        address: userData.address || '',
      })
    } catch (error) {
      router.push('/login')
    }
    setLoading(false)
  }, [router])

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedUser = { ...user, ...formData }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setEditing(false)
      }
    } catch (error) {
      console.error('Profile update error:', error)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-primary-600" />
                  </div>
                  <div className="text-white">
                    <h1 className="text-3xl font-bold">{user?.name || 'Foydalanuvchi'}</h1>
                    <p className="text-primary-100 mt-1">{user?.email}</p>
                  </div>
                </div>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Tahrirlash</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Saqlash</span>
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center space-x-2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Bekor qilish</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    To'liq ism
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 text-lg">{formData.full_name || 'Kiritilmagan'}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </label>
                  <p className="text-gray-900 text-lg">{user?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Email o'zgartirib bo'lmaydi</p>
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    Telefon raqam
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 text-lg">{formData.phone || 'Kiritilmagan'}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    Manzil
                  </label>
                  {editing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Shahar, ko'cha, uy raqami"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 text-lg">{formData.address || 'Kiritilmagan'}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Ro'yxatdan o'tgan sana
                  </label>
                  <p className="text-gray-900 text-lg">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('uz-UZ') : 'Noma\'lum'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
