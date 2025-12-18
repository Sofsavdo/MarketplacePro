'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, User, Building, Users as UsersIcon, Eye } from 'lucide-react'

interface PendingUser {
  id: string
  email: string
  full_name: string
  phone?: string
  role: 'seller' | 'blogger'
  status: 'pending'
  created_at: string
  // Seller fields
  company_name?: string
  business_license?: string
  tax_id?: string
  // Blogger fields
  youtube_channel?: string
  youtube_followers?: number
  instagram_username?: string
  instagram_followers?: number
  telegram_channel?: string
  telegram_followers?: number
}

export default function ApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)

  useEffect(() => {
    loadPendingUsers()
  }, [])

  const loadPendingUsers = () => {
    // Mock data - in production, fetch from API
    const mockUsers: PendingUser[] = [
      {
        id: '1',
        email: 'seller.pending@test.uz',
        full_name: 'Test Seller',
        phone: '+998901234567',
        role: 'seller',
        status: 'pending',
        created_at: new Date().toISOString(),
        company_name: 'Test Company LLC',
        business_license: '123456789',
        tax_id: '987654321',
      },
      {
        id: '2',
        email: 'blogger.pending@test.uz',
        full_name: 'Test Blogger',
        phone: '+998901234568',
        role: 'blogger',
        status: 'pending',
        created_at: new Date().toISOString(),
        youtube_channel: '@testblogger',
        youtube_followers: 800,
        instagram_username: '@testblogger',
        instagram_followers: 600,
        telegram_channel: '@testblogger',
        telegram_followers: 400,
      },
    ]

    setPendingUsers(mockUsers)
    setLoading(false)
  }

  const handleApprove = async (userId: string) => {
    setActionLoading(true)

    try {
      // In production, call API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove from pending list
      setPendingUsers(pendingUsers.filter((u) => u.id !== userId))
      setSelectedUser(null)

      alert('Foydalanuvchi tasdiqlandi!')
    } catch (error) {
      alert('Xatolik yuz berdi')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedUser || !rejectionReason.trim()) {
      alert('Rad etish sababini kiriting')
      return
    }

    setActionLoading(true)

    try {
      // In production, call API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove from pending list
      setPendingUsers(pendingUsers.filter((u) => u.id !== selectedUser.id))
      setSelectedUser(null)
      setShowRejectModal(false)
      setRejectionReason('')

      alert('Foydalanuvchi rad etildi')
    } catch (error) {
      alert('Xatolik yuz berdi')
    } finally {
      setActionLoading(false)
    }
  }

  const getTotalFollowers = (user: PendingUser) => {
    return (
      (user.youtube_followers || 0) +
      (user.instagram_followers || 0) +
      (user.telegram_followers || 0)
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasdiqlash</h1>
            <p className="text-gray-600 mt-1">
              Seller va blogger arizalarini ko'rib chiqing
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">{pendingUsers.length} ta kutilmoqda</span>
          </div>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Barcha arizalar ko'rib chiqildi
            </h3>
            <p className="text-gray-600">
              Hozirda kutilayotgan arizalar yo'q
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pending Users List */}
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition ${
                    selectedUser?.id === user.id
                      ? 'ring-2 ring-primary-500'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        {user.role === 'seller' ? (
                          <Building className="w-6 h-6 text-primary-600" />
                        ) : (
                          <UsersIcon className="w-6 h-6 text-primary-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'seller'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {user.role === 'seller' ? 'Sotuvchi' : 'Bloger'}
                    </span>
                  </div>

                  {user.role === 'seller' && (
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <strong>Kompaniya:</strong> {user.company_name}
                      </p>
                      <p className="text-gray-600">
                        <strong>Litsenziya:</strong> {user.business_license}
                      </p>
                      <p className="text-gray-600">
                        <strong>STIR:</strong> {user.tax_id}
                      </p>
                    </div>
                  )}

                  {user.role === 'blogger' && (
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <strong>Jami obunachilari:</strong> {getTotalFollowers(user).toLocaleString()}
                      </p>
                      {user.youtube_channel && (
                        <p className="text-gray-600">
                          <strong>YouTube:</strong> {user.youtube_channel} ({user.youtube_followers?.toLocaleString()})
                        </p>
                      )}
                      {user.instagram_username && (
                        <p className="text-gray-600">
                          <strong>Instagram:</strong> @{user.instagram_username} ({user.instagram_followers?.toLocaleString()})
                        </p>
                      )}
                      {user.telegram_channel && (
                        <p className="text-gray-600">
                          <strong>Telegram:</strong> {user.telegram_channel} ({user.telegram_followers?.toLocaleString()})
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {new Date(user.created_at).toLocaleDateString('uz-UZ', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <button className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      Ko'rish
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* User Details and Actions */}
            {selectedUser ? (
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6 h-fit">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Ariza tafsilotlari
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Shaxsiy ma'lumotlar</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between">
                        <span className="text-gray-600">Ism:</span>
                        <span className="font-medium">{selectedUser.full_name}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedUser.email}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Telefon:</span>
                        <span className="font-medium">{selectedUser.phone}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-600">Rol:</span>
                        <span className="font-medium">
                          {selectedUser.role === 'seller' ? 'Sotuvchi' : 'Bloger'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {selectedUser.role === 'seller' && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Biznes ma'lumotlari</h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex justify-between">
                          <span className="text-gray-600">Kompaniya:</span>
                          <span className="font-medium">{selectedUser.company_name}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">Litsenziya:</span>
                          <span className="font-medium">{selectedUser.business_license}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-600">STIR:</span>
                          <span className="font-medium">{selectedUser.tax_id}</span>
                        </p>
                      </div>

                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Tekshirish:</strong> Biznes litsenziya va STIR raqamini
                          davlat bazasida tekshiring.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedUser.role === 'blogger' && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Ijtimoiy tarmoqlar</h4>
                      <div className="space-y-3">
                        {selectedUser.youtube_channel && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm font-medium text-red-900">YouTube</p>
                            <p className="text-sm text-red-800">{selectedUser.youtube_channel}</p>
                            <p className="text-sm text-red-700 mt-1">
                              {selectedUser.youtube_followers?.toLocaleString()} obunachi
                            </p>
                          </div>
                        )}
                        {selectedUser.instagram_username && (
                          <div className="p-3 bg-pink-50 border border-pink-200 rounded-lg">
                            <p className="text-sm font-medium text-pink-900">Instagram</p>
                            <p className="text-sm text-pink-800">@{selectedUser.instagram_username}</p>
                            <p className="text-sm text-pink-700 mt-1">
                              {selectedUser.instagram_followers?.toLocaleString()} obunachi
                            </p>
                          </div>
                        )}
                        {selectedUser.telegram_channel && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm font-medium text-blue-900">Telegram</p>
                            <p className="text-sm text-blue-800">{selectedUser.telegram_channel}</p>
                            <p className="text-sm text-blue-700 mt-1">
                              {selectedUser.telegram_followers?.toLocaleString()} obunachi
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-sm text-purple-800 mb-2">
                          <strong>Jami obunachilari:</strong> {getTotalFollowers(selectedUser).toLocaleString()}
                        </p>
                        <p className="text-sm text-purple-700">
                          {getTotalFollowers(selectedUser) >= 500 ? (
                            <span className="text-green-600 font-semibold">✓ Talabga javob beradi (500+)</span>
                          ) : (
                            <span className="text-red-600 font-semibold">✗ Talabga javob bermaydi (500 dan kam)</span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-gray-200 space-y-3">
                    <button
                      onClick={() => handleApprove(selectedUser.id)}
                      disabled={actionLoading}
                      className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Tasdiqlash
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={actionLoading}
                      className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle className="w-5 h-5" />
                      Rad etish
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  Tafsilotlarni ko'rish uchun foydalanuvchini tanlang
                </p>
              </div>
            )}
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Rad etish sababi
              </h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Rad etish sababini kiriting..."
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRejectModal(false)
                    setRejectionReason('')
                  }}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || actionLoading}
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
                >
                  Rad etish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
