'use client'

import { useState } from 'react'
import { FileText, Download, Calendar, Filter, TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react'

interface Report {
  id: string
  name: string
  type: 'sales' | 'inventory' | 'customers' | 'financial'
  period: string
  generatedAt: string
  size: string
  status: 'ready' | 'generating' | 'failed'
}

export default function AdminReportsPage() {
  const [selectedType, setSelectedType] = useState<'all' | 'sales' | 'inventory' | 'customers' | 'financial'>('all')
  const [generating, setGenerating] = useState(false)

  const reports: Report[] = [
    {
      id: '1',
      name: 'Oylik savdo hisoboti',
      type: 'sales',
      period: 'Iyun 2024',
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      size: '2.4 MB',
      status: 'ready',
    },
    {
      id: '2',
      name: 'Ombor holati',
      type: 'inventory',
      period: 'Iyun 2024',
      generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      size: '1.8 MB',
      status: 'ready',
    },
    {
      id: '3',
      name: 'Mijozlar tahlili',
      type: 'customers',
      period: 'Q2 2024',
      generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      size: '3.2 MB',
      status: 'ready',
    },
    {
      id: '4',
      name: 'Moliyaviy hisobot',
      type: 'financial',
      period: 'Iyun 2024',
      generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      size: '4.1 MB',
      status: 'ready',
    },
  ]

  const reportTypes = [
    {
      id: 'sales',
      name: 'Savdo hisoboti',
      description: 'Savdo ko\'rsatkichlari va tranzaksiyalar',
      icon: TrendingUp,
      color: 'blue',
    },
    {
      id: 'inventory',
      name: 'Ombor hisoboti',
      description: 'Mahsulotlar zaxirasi va harakati',
      icon: ShoppingBag,
      color: 'green',
    },
    {
      id: 'customers',
      name: 'Mijozlar hisoboti',
      description: 'Mijozlar faolligi va statistikasi',
      icon: Users,
      color: 'purple',
    },
    {
      id: 'financial',
      name: 'Moliyaviy hisobot',
      description: 'Daromad, xarajat va foyda tahlili',
      icon: DollarSign,
      color: 'orange',
    },
  ]

  const filteredReports = reports.filter(report => 
    selectedType === 'all' || report.type === selectedType
  )

  const generateReport = (type: string) => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      alert(`${type} hisoboti yaratilmoqda...`)
    }, 2000)
  }

  const downloadReport = (report: Report) => {
    alert(`${report.name} yuklab olinmoqda...`)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hisobotlar</h1>
        <p className="text-gray-600">Turli hisobotlarni yarating va yuklab oling</p>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {reportTypes.map((type) => {
          const Icon = type.icon
          return (
            <div key={type.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
              <div className={`p-3 bg-${type.color}-100 rounded-lg w-fit mb-4`}>
                <Icon className={`w-6 h-6 text-${type.color}-600`} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{type.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{type.description}</p>
              <button
                onClick={() => generateReport(type.name)}
                disabled={generating}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 transition-colors text-sm font-medium"
              >
                {generating ? 'Yaratilmoqda...' : 'Yaratish'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Filter:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'sales', 'inventory', 'customers', 'financial'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'Barchasi' :
                 type === 'sales' ? 'Savdo' :
                 type === 'inventory' ? 'Ombor' :
                 type === 'customers' ? 'Mijozlar' : 'Moliyaviy'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">Mavjud hisobotlar</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <FileText className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{report.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{report.period}</span>
                      </div>
                      <span>•</span>
                      <span>Yaratildi: {new Date(report.generatedAt).toLocaleDateString('uz-UZ')}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    report.status === 'ready' ? 'bg-green-100 text-green-800' :
                    report.status === 'generating' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {report.status === 'ready' ? 'Tayyor' :
                     report.status === 'generating' ? 'Yaratilmoqda' : 'Xato'}
                  </span>
                  {report.status === 'ready' && (
                    <button
                      onClick={() => downloadReport(report)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Yuklab olish</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Jami hisobotlar</h3>
          <p className="text-4xl font-bold">{reports.length}</p>
          <p className="text-blue-100 text-sm mt-2">Oxirgi 30 kun</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Tayyor hisobotlar</h3>
          <p className="text-4xl font-bold">
            {reports.filter(r => r.status === 'ready').length}
          </p>
          <p className="text-green-100 text-sm mt-2">Yuklab olish mumkin</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Jami hajm</h3>
          <p className="text-4xl font-bold">11.5 MB</p>
          <p className="text-purple-100 text-sm mt-2">Barcha hisobotlar</p>
        </div>
      </div>
    </div>
  )
}
