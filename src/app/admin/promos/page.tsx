'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Tag, Calendar, Percent } from 'lucide-react'

interface Promo {
  id: string
  title: string
  description: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase: number
  maxDiscount: number
  startDate: string
  endDate: string
  usageLimit: number
  usedCount: number
  active: boolean
  products: string[]
  categories: string[]
}

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<Promo[]>([
    {
      id: '1',
      title: 'Yangi yil aksiyasi',
      description: '30% chegirma barcha mahsulotlarga',
      code: 'NEWYEAR2024',
      discountType: 'percentage',
      discountValue: 30,
      minPurchase: 500000,
      maxDiscount: 5000000,
      startDate: '2024-12-25',
      endDate: '2025-01-10',
      usageLimit: 1000,
      usedCount: 234,
      active: true,
      products: [],
      categories: ['electronics', 'fashion'],
    },
    {
      id: '2',
      title: 'Birinchi xarid',
      description: '500,000 so\'m chegirma',
      code: 'FIRST500',
      discountType: 'fixed',
      discountValue: 500000,
      minPurchase: 1000000,
      maxDiscount: 500000,
      startDate: '2024-12-01',
      endDate: '2025-12-31',
      usageLimit: 5000,
      usedCount: 1234,
      active: true,
      products: [],
      categories: [],
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null)
  const [formData, setFormData] = useState<Partial<Promo>>({
    title: '',
    description: '',
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 0,
    maxDiscount: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    usageLimit: 100,
    usedCount: 0,
    active: true,
    products: [],
    categories: [],
  })

  const handleCreate = () => {
    setEditingPromo(null)
    setFormData({
      title: '',
      description: '',
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 0,
      maxDiscount: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      usageLimit: 100,
      usedCount: 0,
      active: true,
      products: [],
      categories: [],
    })
    setShowModal(true)
  }

  const handleEdit = (promo: Promo) => {
    setEditingPromo(promo)
    setFormData(promo)
    setShowModal(true)
  }

  const handleSave = () => {
    if (editingPromo) {
      setPromos(promos.map(p => p.id === editingPromo.id ? { ...formData as Promo, id: editingPromo.id } : p))
    } else {
      const newPromo: Promo = {
        ...formData as Promo,
        id: Date.now().toString(),
      }
      setPromos([...promos, newPromo])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Promoni o\'chirmoqchimisiz?')) {
      setPromos(promos.filter(p => p.id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setPromos(promos.map(p => p.id === id ? { ...p, active: !p.active } : p))
  }

  const generateCode = () => {
    const code = 'PROMO' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setFormData({ ...formData, code })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promo Kodlar</h1>
          <p className="text-gray-600 mt-1">Chegirmalar va aksiyalarni boshqaring</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          Promo qo'shish
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{promos.length}</div>
              <div className="text-sm text-gray-600">Jami promolar</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {promos.filter(p => p.active).length}
              </div>
              <div className="text-sm text-gray-600">Aktiv</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Percent className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {promos.reduce((sum, p) => sum + p.usedCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Ishlatilgan</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {promos.filter(p => new Date(p.endDate) > new Date()).length}
              </div>
              <div className="text-sm text-gray-600">Amal qilmoqda</div>
            </div>
          </div>
        </div>
      </div>

      {/* Promos List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Promo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kod</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Chegirma</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sana</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Foydalanish</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Holat</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {promos.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{promo.title}</div>
                      <div className="text-sm text-gray-500">{promo.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-mono font-semibold">
                      {promo.code}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-primary-600">
                      {promo.discountType === 'percentage'
                        ? `${promo.discountValue}%`
                        : `${promo.discountValue.toLocaleString()} so'm`}
                    </div>
                    {promo.minPurchase > 0 && (
                      <div className="text-xs text-gray-500">
                        Min: {promo.minPurchase.toLocaleString()} so'm
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-600">{promo.startDate}</div>
                      <div className="text-gray-600">{promo.endDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900">
                        {promo.usedCount} / {promo.usageLimit}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(promo.usedCount / promo.usageLimit) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(promo.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        promo.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {promo.active ? 'Aktiv' : 'Noaktiv'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleActive(promo.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        {promo.active ? (
                          <Eye className="w-5 h-5 text-gray-600" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(promo)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingPromo ? 'Promoni tahrirlash' : 'Yangi promo'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Form */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sarlavha *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Masalan: Yangi yil aksiyasi"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tavsif
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    rows={3}
                    placeholder="Qisqa tavsif..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo kod *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono"
                      placeholder="PROMO2024"
                    />
                    <button
                      onClick={generateCode}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                      Generatsiya
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chegirma turi *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="percentage">Foiz (%)</option>
                    <option value="fixed">Qat'iy summa (so'm)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chegirma miqdori *
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder={formData.discountType === 'percentage' ? '10' : '500000'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimal xarid (so'm)
                  </label>
                  <input
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maksimal chegirma (so'm)
                  </label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foydalanish limiti
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Boshlanish sanasi *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tugash sanasi *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Aktiv</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
