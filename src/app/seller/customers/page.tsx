'use client'

import { useState, useEffect } from 'react'
import { Users, Mail, Phone, ShoppingBag, TrendingUp, Search, Filter, Download } from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
  status: 'active' | 'inactive'
  joinedDate: string
}

export default function SellerCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    // Mock data - production da API dan olinadi
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'Alisher Karimov',
        email: 'alisher@example.com',
        phone: '+998901234567',
        totalOrders: 15,
        totalSpent: 12500000,
        lastOrder: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        joinedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        name: 'Dilnoza Rahimova',
        email: 'dilnoza@example.com',
        phone: '+998901234568',
        totalOrders: 8,
        totalSpent: 6800000,
        lastOrder: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        joinedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        name: 'Sardor Toshmatov',
        email: 'sardor@example.com',
        phone: '+998901234569',
        totalOrders: 3,
        totalSpent: 2100000,
        lastOrder: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'inactive',
        joinedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
    
    setCustomers(mockCustomers)
    setLoading(false)
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    const matchesFilter = filterStatus === 'all' || customer.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0)

  const exportCustomers = () => {
    const csv = [
      ['Ism', 'Email', 'Telefon', 'Buyurtmalar', 'Jami xarid', 'Holat'],
      ...filteredCustomers.map(c => [
        c.name,
        c.email,
        c.phone,
        c.totalOrders,
        c.totalSpent,
        c.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mijozlar.csv'
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mijozlar CRM</h1>
        <p className="text-gray-600">Mijozlaringiz bilan munosabatlarni boshqaring</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Jami mijozlar</p>
          <p className="text-3xl font-bold text-gray-900">{totalCustomers}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Faol mijozlar</p>
          <p className="text-3xl font-bold text-gray-900">{activeCustomers}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Jami daromad</p>
          <p className="text-3xl font-bold text-gray-900">
            {(totalRevenue / 1000000).toFixed(1)}M
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">O'rtacha xarid</p>
          <p className="text-3xl font-bold text-gray-900">
            {(avgOrderValue / 1000).toFixed(0)}K
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish (ism, email, telefon)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Barcha holat</option>
              <option value="active">Faol</option>
              <option value="inactive">Nofaol</option>
            </select>

            <button
              onClick={exportCustomers}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mijoz</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aloqa</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Buyurtmalar</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jami xarid</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Oxirgi buyurtma</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Holat</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">
                        Qo'shildi: {new Date(customer.joinedDate).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-medium">{customer.totalOrders}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-medium">
                      {customer.totalSpent.toLocaleString('uz-UZ')} so'm
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {new Date(customer.lastOrder).toLocaleDateString('uz-UZ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      customer.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.status === 'active' ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
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
