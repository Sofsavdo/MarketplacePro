'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, AlertTriangle, Users, Activity, Eye } from 'lucide-react'

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  recipientId: string
  recipientName: string
  message: string
  flagged: boolean
  timestamp: string
}

export default function AdminMonitoringPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [filter, setFilter] = useState<'all' | 'flagged'>('all')

  // Mock data
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        senderId: 'customer1',
        senderName: 'Alisher Karimov',
        senderRole: 'customer',
        recipientId: 'seller1',
        recipientName: 'TechStore UZ',
        message: 'Mahsulot qachon yetib keladi?',
        flagged: false,
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        senderId: 'customer2',
        senderName: 'Dilshod Rahimov',
        senderRole: 'customer',
        recipientId: 'seller1',
        recipientName: 'TechStore UZ',
        message: 'Mening telefon raqamim +998901234567, WhatsApp orqali bog\'laning',
        flagged: true,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        senderId: 'seller1',
        senderName: 'TechStore UZ',
        senderRole: 'seller',
        recipientId: 'customer3',
        recipientName: 'Nodira Azimova',
        message: 'Telegram kanalimizga obuna bo\'ling: @techstore_uz',
        flagged: true,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
    ]
    setMessages(mockMessages)
  }, [])

  const filteredMessages = messages.filter(msg => 
    filter === 'all' || (filter === 'flagged' && msg.flagged)
  )

  const stats = {
    totalMessages: messages.length,
    flaggedMessages: messages.filter(m => m.flagged).length,
    activeChats: new Set(messages.map(m => `${m.senderId}-${m.recipientId}`)).size,
    violations: messages.filter(m => m.flagged).length,
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Monitoring</h1>
        <p className="text-gray-600 mt-1">Chat xabarlari va qoidabuzarliklar nazorati</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Jami xabarlar</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalMessages}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Qoidabuzarliklar</div>
          <div className="text-2xl font-bold text-red-600">{stats.flaggedMessages}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Faol chatlar</div>
          <div className="text-2xl font-bold text-green-600">{stats.activeChats}</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-1">Faollik</div>
          <div className="text-2xl font-bold text-purple-600">
            {messages.filter(m => 
              new Date(m.timestamp) > new Date(Date.now() - 3600000)
            ).length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Barcha xabarlar
          </button>
          <button
            onClick={() => setFilter('flagged')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'flagged'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Qoidabuzarliklar
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`bg-white rounded-xl p-6 shadow-sm border ${
              message.flagged ? 'border-red-300 bg-red-50' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-gray-900">
                    {message.senderName}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {message.senderRole}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="font-semibold text-gray-900">
                    {message.recipientName}
                  </span>
                  {message.flagged && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Qoidabuzarlik
                    </span>
                  )}
                </div>
                <p className={`text-gray-700 ${message.flagged ? 'font-medium' : ''}`}>
                  {message.message}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(message.timestamp).toLocaleString('uz-UZ')}
                </div>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Batafsil
                </button>
              </div>
            </div>

            {message.flagged && (
              <div className="flex gap-2 pt-4 border-t border-red-200">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium">
                  Foydalanuvchini ogohlantirish
                </button>
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium">
                  Xabarni o'chirish
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                  Noto'g'ri signal
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border">
            <p className="text-gray-500">Xabarlar topilmadi</p>
          </div>
        )}
      </div>

      {/* Warning Info */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-semibold text-yellow-900 mb-2">
          Avtomatik aniqlangan qoidabuzarliklar:
        </h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Telefon raqamlar (+998...)</li>
          <li>• Ijtimoiy tarmoq havolalari (Telegram, WhatsApp, Instagram)</li>
          <li>• Tashqi aloqa ma'lumotlari</li>
          <li>• Email manzillar</li>
        </ul>
      </div>
    </div>
  )
}
