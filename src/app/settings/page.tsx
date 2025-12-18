'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { Settings, Bell, Lock, Globe, Moon, Sun, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      orderUpdates: true,
      promotions: true,
      newsletter: false,
    },
    privacy: {
      showProfile: true,
      showOrders: false,
      allowMessages: true,
    },
    preferences: {
      language: 'uz',
      theme: 'light',
      currency: 'UZS',
    },
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
      
      const storedSettings = localStorage.getItem('settings')
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings))
      }
    } catch (error) {
      router.push('/login')
    }
    setLoading(false)
  }, [router])

  const handleSave = () => {
    localStorage.setItem('settings', JSON.stringify(settings))
    alert('Sozlamalar saqlandi!')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('settings')
    router.push('/login')
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sozlamalar</h1>
            <p className="text-gray-600">Hisobingiz va platformani sozlang</p>
          </div>

          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Bildirishnomalar</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email bildirishnomalar</p>
                    <p className="text-sm text-gray-600">Email orqali xabarlar olish</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, email: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Push bildirishnomalar</p>
                    <p className="text-sm text-gray-600">Brauzer orqali xabarlar</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, push: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Buyurtma yangiliklari</p>
                    <p className="text-sm text-gray-600">Buyurtma holati haqida xabarlar</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.orderUpdates}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, orderUpdates: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Aksiyalar va chegirmalar</p>
                    <p className="text-sm text-gray-600">Maxsus takliflar haqida xabarlar</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.promotions}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, promotions: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Lock className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Maxfiylik</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Profilni ko'rsatish</p>
                    <p className="text-sm text-gray-600">Boshqalar profilingizni ko'rishi mumkin</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.showProfile}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, showProfile: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Xabar yuborish</p>
                    <p className="text-sm text-gray-600">Boshqalar sizga xabar yuborishi mumkin</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowMessages}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, allowMessages: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Afzalliklar</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Til
                  </label>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) => setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, language: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="uz">O'zbekcha</option>
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mavzu
                  </label>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, theme: 'light' }
                      })}
                      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 border-2 rounded-lg transition-colors ${
                        settings.preferences.theme === 'light'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                      <span>Yorug'</span>
                    </button>
                    <button
                      onClick={() => setSettings({
                        ...settings,
                        preferences: { ...settings.preferences, theme: 'dark' }
                      })}
                      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 border-2 rounded-lg transition-colors ${
                        settings.preferences.theme === 'dark'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Moon className="w-5 h-5" />
                      <span>Qorong'i</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Saqlash
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
