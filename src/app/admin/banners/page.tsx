'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, MoveUp, MoveDown } from 'lucide-react'

interface Banner {
  id: string
  title: string
  description: string
  image: string
  link: string
  buttonText: string
  order: number
  active: boolean
  startDate: string
  endDate: string
  backgroundColor: string
  textColor: string
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: '1',
      title: 'Yangi iPhone 15 Pro Max',
      description: '30% chegirma! Cheklangan vaqt',
      image: 'https://images.unsplash.com/photo-1696446702183-cbd50c2a2476?w=800',
      link: '/product/1',
      buttonText: 'Xarid qilish',
      order: 1,
      active: true,
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      backgroundColor: '#1e40af',
      textColor: '#ffffff',
    },
    {
      id: '2',
      title: 'Samsung Galaxy S24',
      description: 'Yangi yil aksiyasi',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
      link: '/product/2',
      buttonText: 'Ko\'rish',
      order: 2,
      active: true,
      startDate: '2024-12-15',
      endDate: '2025-01-15',
      backgroundColor: '#7c3aed',
      textColor: '#ffffff',
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    description: '',
    image: '',
    link: '',
    buttonText: 'Xarid qilish',
    order: banners.length + 1,
    active: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    backgroundColor: '#1e40af',
    textColor: '#ffffff',
  })

  const handleCreate = () => {
    setEditingBanner(null)
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      buttonText: 'Xarid qilish',
      order: banners.length + 1,
      active: true,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      backgroundColor: '#1e40af',
      textColor: '#ffffff',
    })
    setShowModal(true)
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData(banner)
    setShowModal(true)
  }

  const handleSave = () => {
    if (editingBanner) {
      setBanners(banners.map(b => b.id === editingBanner.id ? { ...formData as Banner, id: editingBanner.id } : b))
    } else {
      const newBanner: Banner = {
        ...formData as Banner,
        id: Date.now().toString(),
      }
      setBanners([...banners, newBanner])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Bannerni o\'chirmoqchimisiz?')) {
      setBanners(banners.filter(b => b.id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setBanners(banners.map(b => b.id === id ? { ...b, active: !b.active } : b))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newBanners = [...banners]
    ;[newBanners[index - 1], newBanners[index]] = [newBanners[index], newBanners[index - 1]]
    newBanners.forEach((b, i) => b.order = i + 1)
    setBanners(newBanners)
  }

  const moveDown = (index: number) => {
    if (index === banners.length - 1) return
    const newBanners = [...banners]
    ;[newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]]
    newBanners.forEach((b, i) => b.order = i + 1)
    setBanners(newBanners)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banner Boshqaruvi</h1>
          <p className="text-gray-600 mt-1">Bosh sahifadagi bannerlarni boshqaring</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          Banner qo'shish
        </button>
      </div>

      {/* Banners List */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tartib</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rasm</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sarlavha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Sana</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Holat</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {banners.sort((a, b) => a.order - b.order).map((banner, index) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">#{banner.order}</span>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveDown(index)}
                          disabled={index === banners.length - 1}
                          className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{banner.title}</div>
                      <div className="text-sm text-gray-500">{banner.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-600">Boshlanish: {banner.startDate}</div>
                      <div className="text-gray-600">Tugash: {banner.endDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(banner.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        banner.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {banner.active ? 'Aktiv' : 'Noaktiv'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleActive(banner.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title={banner.active ? 'Noaktiv qilish' : 'Aktiv qilish'}
                      >
                        {banner.active ? (
                          <Eye className="w-5 h-5 text-gray-600" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition"
                        title="Tahrirlash"
                      >
                        <Edit className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                        title="O'chirish"
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
                {editingBanner ? 'Bannerni tahrirlash' : 'Yangi banner'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Preview */}
              <div className="border rounded-xl p-4">
                <div className="text-sm font-semibold text-gray-700 mb-3">Preview:</div>
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    backgroundColor: formData.backgroundColor,
                    color: formData.textColor,
                  }}
                >
                  <div className="flex items-center justify-between p-8">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold mb-2">{formData.title || 'Sarlavha'}</h3>
                      <p className="text-lg mb-4">{formData.description || 'Tavsif'}</p>
                      <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold">
                        {formData.buttonText || 'Tugma'}
                      </button>
                    </div>
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-64 h-48 object-cover rounded-lg ml-8"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sarlavha *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Masalan: Yangi iPhone 15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tugma matni
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Xarid qilish"
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rasm URL *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Yuklash
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="/product/1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tartib
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Boshlanish sanasi
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
                    Tugash sanasi
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fon rangi
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      className="w-16 h-10 border rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.backgroundColor}
                      onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matn rangi
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.textColor}
                      onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                      className="w-16 h-10 border rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.textColor}
                      onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
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
