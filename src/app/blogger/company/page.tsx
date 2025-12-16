'use client'

import { useState } from 'react'
import { User, Instagram, Send, Users } from 'lucide-react'

export default function BloggerCompanyPage() {
  const [formData, setFormData] = useState({
    fullName: 'Blogger User',
    email: 'blogger@dubaymall.uz',
    phone: '+998901234569',
    telegramUsername: '@blogger_uz',
    telegramFollowers: 50000,
    instagramUsername: '@blogger_uz',
    instagramFollowers: 75000,
    bio: 'Tech blogger va influencer',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Ma\'lumotlar saqlandi!')
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kompaniya</h1>
        <p className="text-gray-600 mt-1">Profil va ijtimoiy tarmoqlar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold">Shaxsiy ma'lumotlar</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To'liq ism
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Telegram */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <Send className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold">Telegram</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.telegramUsername}
                onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                placeholder="@username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Obunachilar soni
              </label>
              <input
                type="number"
                value={formData.telegramFollowers}
                onChange={(e) => setFormData({ ...formData, telegramFollowers: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Instagram */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <Instagram className="w-6 h-6 text-pink-600" />
            <h2 className="text-xl font-bold">Instagram</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.instagramUsername}
                onChange={(e) => setFormData({ ...formData, instagramUsername: e.target.value })}
                placeholder="@username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Obunachilar soni
              </label>
              <input
                type="number"
                value={formData.instagramFollowers}
                onChange={(e) => setFormData({ ...formData, instagramFollowers: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 border border-primary-200">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary-600" />
            <h3 className="text-lg font-bold text-gray-900">Jami auditoriya</h3>
          </div>
          <div className="text-3xl font-bold text-primary-600">
            {(formData.telegramFollowers + formData.instagramFollowers).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Telegram: {formData.telegramFollowers.toLocaleString()} + Instagram: {formData.instagramFollowers.toLocaleString()}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            Saqlash
          </button>
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Bekor qilish
          </button>
        </div>
      </form>
    </div>
  )
}
