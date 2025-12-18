'use client'

import { useState } from 'react'
import { Mail, Send, Users, TrendingUp, Calendar, Eye, MousePointer, DollarSign, Plus, Edit, Trash2 } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  subject: string
  status: 'draft' | 'scheduled' | 'sent'
  recipients: number
  opens: number
  clicks: number
  revenue: number
  scheduledDate?: string
  sentDate?: string
}

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Yangi yil aksiyasi',
      subject: '50% chegirma - Yangi yil maxsus taklifi!',
      status: 'sent',
      recipients: 5420,
      opens: 3245,
      clicks: 892,
      revenue: 45000000,
      sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Haftalik yangiliklar',
      subject: 'Yangi mahsulotlar va chegirmalar',
      status: 'scheduled',
      recipients: 8900,
      opens: 0,
      clicks: 0,
      revenue: 0,
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Tug\'ilgan kun takliflari',
      subject: 'Sizning maxsus kuningiz uchun sovg\'a!',
      status: 'draft',
      recipients: 0,
      opens: 0,
      clicks: 0,
      revenue: 0,
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    segment: 'all',
  })

  const totalSent = campaigns.filter(c => c.status === 'sent').length
  const totalScheduled = campaigns.filter(c => c.status === 'scheduled').length
  const totalDrafts = campaigns.filter(c => c.status === 'draft').length
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0)
  const avgOpenRate = campaigns.filter(c => c.status === 'sent').reduce((sum, c) => 
    sum + (c.opens / c.recipients * 100), 0) / totalSent || 0
  const avgClickRate = campaigns.filter(c => c.status === 'sent').reduce((sum, c) => 
    sum + (c.clicks / c.recipients * 100), 0) / totalSent || 0

  const createCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject) {
      alert('Iltimos, barcha maydonlarni to\'ldiring!')
      return
    }

    const campaign: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      subject: newCampaign.subject,
      status: 'draft',
      recipients: 0,
      opens: 0,
      clicks: 0,
      revenue: 0,
    }

    setCampaigns([...campaigns, campaign])
    setNewCampaign({ name: '', subject: '', content: '', segment: 'all' })
    setShowCreateModal(false)
    alert('Kampaniya yaratildi!')
  }

  const deleteCampaign = (id: string) => {
    if (confirm('Kampaniyani o\'chirmoqchimisiz?')) {
      setCampaigns(campaigns.filter(c => c.id !== id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Yuborildi'
      case 'scheduled': return 'Rejalashtirilgan'
      case 'draft': return 'Qoralama'
      default: return status
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Marketing</h1>
            <p className="text-gray-600">Email kampaniyalarini boshqaring</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Yangi kampaniya</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Send className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Yuborilgan</p>
          <p className="text-3xl font-bold text-gray-900">{totalSent}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Rejalashtirilgan</p>
          <p className="text-3xl font-bold text-gray-900">{totalScheduled}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">O\'rtacha ochish</p>
          <p className="text-3xl font-bold text-gray-900">{avgOpenRate.toFixed(1)}%</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Jami daromad</p>
          <p className="text-3xl font-bold text-gray-900">
            {(totalRevenue / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Asosiy ko'rsatkichlar</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Ochish darajasi</span>
                <span className="text-sm font-bold text-gray-900">{avgOpenRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${avgOpenRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Klik darajasi</span>
                <span className="text-sm font-bold text-gray-900">{avgClickRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${avgClickRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Konversiya</span>
                <span className="text-sm font-bold text-gray-900">3.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: '32%' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Segment statistikasi</h3>
          <div className="space-y-3">
            {[
              { name: 'Barcha mijozlar', count: 8900, percentage: 100 },
              { name: 'Faol mijozlar', count: 5420, percentage: 61 },
              { name: 'VIP mijozlar', count: 890, percentage: 10 },
              { name: 'Yangi mijozlar', count: 1200, percentage: 13 },
            ].map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{segment.name}</p>
                  <p className="text-xs text-gray-500">{segment.count} ta</p>
                </div>
                <div className="w-32">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${segment.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">Kampaniyalar</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kampaniya</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Holat</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Qabul qiluvchilar</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ochishlar</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kliklar</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Daromad</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sana</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-sm text-gray-500">{campaign.subject}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusText(campaign.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{campaign.recipients.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-gray-900">{campaign.opens.toLocaleString()}</span>
                      {campaign.recipients > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({((campaign.opens / campaign.recipients) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="text-gray-900">{campaign.clicks.toLocaleString()}</span>
                      {campaign.recipients > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({((campaign.clicks / campaign.recipients) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {(campaign.revenue / 1000000).toFixed(1)}M
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {campaign.sentDate 
                        ? new Date(campaign.sentDate).toLocaleDateString('uz-UZ')
                        : campaign.scheduledDate
                        ? new Date(campaign.scheduledDate).toLocaleDateString('uz-UZ')
                        : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteCampaign(campaign.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Yangi kampaniya yaratish</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kampaniya nomi
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Masalan: Yangi yil aksiyasi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email mavzusi
                </label>
                <input
                  type="text"
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Masalan: 50% chegirma - maxsus taklif!"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Segment
                </label>
                <select
                  value={newCampaign.segment}
                  onChange={(e) => setNewCampaign({ ...newCampaign, segment: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Barcha mijozlar</option>
                  <option value="active">Faol mijozlar</option>
                  <option value="vip">VIP mijozlar</option>
                  <option value="new">Yangi mijozlar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xabar matni
                </label>
                <textarea
                  value={newCampaign.content}
                  onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Email matni..."
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={createCampaign}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Yaratish
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
