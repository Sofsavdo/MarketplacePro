'use client'

import { useState } from 'react'
import { Activity, User, Package, ShoppingCart, Settings, AlertTriangle, CheckCircle, XCircle, Clock, Filter, Download } from 'lucide-react'

interface ActivityLog {
  id: string
  user: string
  userRole: 'admin' | 'seller' | 'blogger' | 'customer'
  action: string
  type: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'error'
  resource: string
  details: string
  ipAddress: string
  timestamp: string
  status: 'success' | 'failed'
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      user: 'Admin User',
      userRole: 'admin',
      action: 'Mahsulot tasdiqlandi',
      type: 'update',
      resource: 'Product #1234',
      details: 'iPhone 15 Pro Max mahsuloti tasdiqlandi',
      ipAddress: '192.168.1.1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'success',
    },
    {
      id: '2',
      user: 'TechStore UZ',
      userRole: 'seller',
      action: 'Yangi mahsulot qo\'shildi',
      type: 'create',
      resource: 'Product #1235',
      details: 'Samsung Galaxy S24 Ultra qo\'shildi',
      ipAddress: '192.168.1.2',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'success',
    },
    {
      id: '3',
      user: 'Alisher Karimov',
      userRole: 'customer',
      action: 'Buyurtma berildi',
      type: 'create',
      resource: 'Order #DM12345',
      details: 'Yangi buyurtma yaratildi - 15,500,000 so\'m',
      ipAddress: '192.168.1.3',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'success',
    },
    {
      id: '4',
      user: 'Admin User',
      userRole: 'admin',
      action: 'Sozlamalar o\'zgartirildi',
      type: 'update',
      resource: 'Settings',
      details: 'Yetkazib berish narxi yangilandi',
      ipAddress: '192.168.1.1',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: 'success',
    },
    {
      id: '5',
      user: 'System',
      userRole: 'admin',
      action: 'Xatolik yuz berdi',
      type: 'error',
      resource: 'Payment Gateway',
      details: 'To\'lov tizimiga ulanishda xatolik',
      ipAddress: '127.0.0.1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'failed',
    },
  ])

  const [filter, setFilter] = useState<'all' | 'create' | 'update' | 'delete' | 'login' | 'error'>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'seller' | 'blogger' | 'customer'>('all')

  const filteredLogs = logs.filter(log => {
    const matchesType = filter === 'all' || log.type === filter
    const matchesRole = roleFilter === 'all' || log.userRole === roleFilter
    return matchesType && matchesRole
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'create': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'update': return <Activity className="w-5 h-5 text-blue-600" />
      case 'delete': return <XCircle className="w-5 h-5 text-red-600" />
      case 'login': return <User className="w-5 h-5 text-purple-600" />
      case 'logout': return <User className="w-5 h-5 text-gray-600" />
      case 'error': return <AlertTriangle className="w-5 h-5 text-orange-600" />
      default: return <Activity className="w-5 h-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'create': return 'bg-green-100 text-green-800'
      case 'update': return 'bg-blue-100 text-blue-800'
      case 'delete': return 'bg-red-100 text-red-800'
      case 'login': return 'bg-purple-100 text-purple-800'
      case 'logout': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'seller': return 'bg-blue-100 text-blue-800'
      case 'blogger': return 'bg-purple-100 text-purple-800'
      case 'customer': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportLogs = () => {
    const csv = [
      ['ID', 'Foydalanuvchi', 'Rol', 'Amal', 'Turi', 'Resurs', 'Tafsilotlar', 'IP', 'Sana', 'Holat'],
      ...filteredLogs.map(log => [
        log.id,
        log.user,
        log.userRole,
        log.action,
        log.type,
        log.resource,
        log.details,
        log.ipAddress,
        new Date(log.timestamp).toLocaleString('uz-UZ'),
        log.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'activity-logs.csv'
    a.click()
  }

  const stats = [
    { label: 'Jami harakatlar', value: logs.length, icon: Activity, color: 'blue' },
    { label: 'Muvaffaqiyatli', value: logs.filter(l => l.status === 'success').length, icon: CheckCircle, color: 'green' },
    { label: 'Xatolar', value: logs.filter(l => l.status === 'failed').length, icon: AlertTriangle, color: 'red' },
    { label: 'Bugun', value: logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length, icon: Clock, color: 'purple' },
  ]

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Faoliyat Jurnali</h1>
            <p className="text-gray-600">Barcha tizim harakatlarini kuzatib boring</p>
          </div>
          <button
            onClick={exportLogs}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amal turi
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Barchasi</option>
              <option value="create">Yaratish</option>
              <option value="update">Yangilash</option>
              <option value="delete">O'chirish</option>
              <option value="login">Kirish</option>
              <option value="error">Xatolar</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foydalanuvchi roli
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Barchasi</option>
              <option value="admin">Admin</option>
              <option value="seller">Sotuvchi</option>
              <option value="blogger">Bloger</option>
              <option value="customer">Mijoz</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Vaqt</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Foydalanuvchi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amal</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Turi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Resurs</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">IP Manzil</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(log.timestamp).toLocaleString('uz-UZ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{log.user}</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(log.userRole)}`}>
                        {log.userRole}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-500">{log.details}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(log.type)}
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(log.type)}`}>
                        {log.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{log.resource}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-600">{log.ipAddress}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      log.status === 'success' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status === 'success' ? 'Muvaffaqiyatli' : 'Xato'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
