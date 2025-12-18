'use client'

import { useState } from 'react'
import { MessageSquare, Clock, CheckCircle, XCircle, User, Calendar, Tag } from 'lucide-react'

interface Ticket {
  id: string
  customer: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  createdAt: string
  updatedAt: string
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'T001',
      customer: 'Alisher Karimov',
      subject: 'Buyurtma yetib kelmadi',
      message: 'Buyurtmam 3 kun oldin yuborilgan, lekin hali yetib kelmadi. Qachon yetib keladi?',
      status: 'open',
      priority: 'high',
      category: 'Yetkazib berish',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'T002',
      customer: 'Dilnoza Rahimova',
      subject: 'Mahsulot shikastlangan',
      message: 'Mahsulot shikastlangan holda yetib keldi. Qaytarish mumkinmi?',
      status: 'in_progress',
      priority: 'urgent',
      category: 'Qaytarish',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'T003',
      customer: 'Bobur Tursunov',
      subject: 'To\'lov muammosi',
      message: 'Click orqali to\'lov qilgandim, lekin buyurtma tasdiqlanmadi.',
      status: 'resolved',
      priority: 'medium',
      category: 'To\'lov',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
  ])

  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  const filteredTickets = filter === 'all' ? tickets : tickets.filter(t => t.status === filter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Ochiq'
      case 'in_progress': return 'Jarayonda'
      case 'resolved': return 'Hal qilindi'
      case 'closed': return 'Yopildi'
      default: return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Shoshilinch'
      case 'high': return 'Yuqori'
      case 'medium': return 'O\'rta'
      case 'low': return 'Past'
      default: return priority
    }
  }

  const updateTicketStatus = (id: string, newStatus: Ticket['status']) => {
    setTickets(tickets.map(t => 
      t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
    ))
    if (selectedTicket?.id === id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus, updatedAt: new Date().toISOString() })
    }
  }

  const stats = [
    { label: 'Ochiq', count: tickets.filter(t => t.status === 'open').length, color: 'blue' },
    { label: 'Jarayonda', count: tickets.filter(t => t.status === 'in_progress').length, color: 'yellow' },
    { label: 'Hal qilindi', count: tickets.filter(t => t.status === 'resolved').length, color: 'green' },
    { label: 'Yopildi', count: tickets.filter(t => t.status === 'closed').length, color: 'gray' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Qo'llab-quvvatlash Ticketlari</h1>
        <p className="text-gray-600">Mijozlar muammolarini boshqaring</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex gap-2">
          {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'Barchasi' :
               f === 'open' ? 'Ochiq' :
               f === 'in_progress' ? 'Jarayonda' :
               f === 'resolved' ? 'Hal qilindi' : 'Yopildi'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow ${
                selectedTicket?.id === ticket.id ? 'ring-2 ring-primary-600' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-mono text-sm text-gray-600">{ticket.id}</span>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusText(ticket.status)}
                    </span>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityText(ticket.priority)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{ticket.subject}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{ticket.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{ticket.customer}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>{ticket.category}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(ticket.createdAt).toLocaleString('uz-UZ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ticket Detail */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ticket Tafsilotlari</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ticket ID</p>
                  <p className="font-mono text-gray-900">{selectedTicket.id}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Mijoz</p>
                  <p className="font-medium text-gray-900">{selectedTicket.customer}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Mavzu</p>
                  <p className="font-medium text-gray-900">{selectedTicket.subject}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Xabar</p>
                  <p className="text-gray-900">{selectedTicket.message}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Kategoriya</p>
                  <p className="text-gray-900">{selectedTicket.category}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Holat</p>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as Ticket['status'])}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="open">Ochiq</option>
                    <option value="in_progress">Jarayonda</option>
                    <option value="resolved">Hal qilindi</option>
                    <option value="closed">Yopildi</option>
                  </select>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Yaratildi</p>
                  <p className="text-gray-900">{new Date(selectedTicket.createdAt).toLocaleString('uz-UZ')}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Yangilandi</p>
                  <p className="text-gray-900">{new Date(selectedTicket.updatedAt).toLocaleString('uz-UZ')}</p>
                </div>

                <div className="pt-4 border-t">
                  <button className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Javob berish
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Ticket tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
