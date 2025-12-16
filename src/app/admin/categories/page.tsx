'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, MoveUp, MoveDown, Folder } from 'lucide-react'

interface Category {
  id: string
  name: string
  nameUz: string
  nameRu: string
  nameEn: string
  icon: string
  color: string
  order: number
  active: boolean
  productCount: number
  parentId: string | null
  slug: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Elektronika',
      nameUz: 'Elektronika',
      nameRu: 'Электроника',
      nameEn: 'Electronics',
      icon: '📱',
      color: '#3b82f6',
      order: 1,
      active: true,
      productCount: 1234,
      parentId: null,
      slug: 'electronics',
    },
    {
      id: '2',
      name: 'Kiyim',
      nameUz: 'Kiyim',
      nameRu: 'Одежда',
      nameEn: 'Fashion',
      icon: '👕',
      color: '#8b5cf6',
      order: 2,
      active: true,
      productCount: 2456,
      parentId: null,
      slug: 'fashion',
    },
    {
      id: '3',
      name: 'Maishiy texnika',
      nameUz: 'Maishiy texnika',
      nameRu: 'Бытовая техника',
      nameEn: 'Home Appliances',
      icon: '🏠',
      color: '#10b981',
      order: 3,
      active: true,
      productCount: 876,
      parentId: null,
      slug: 'home-appliances',
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    nameUz: '',
    nameRu: '',
    nameEn: '',
    icon: '📦',
    color: '#3b82f6',
    order: categories.length + 1,
    active: true,
    productCount: 0,
    parentId: null,
    slug: '',
  })

  const emojiList = [
    '📱', '💻', '⌚', '📷', '🎧', '🖥️', '⌨️', '🖱️',
    '👕', '👔', '👗', '👠', '👟', '👜', '🎒', '👓',
    '🏠', '🛋️', '🛏️', '🪑', '🚪', '🪟', '💡', '🔌',
    '⚽', '🏀', '🎾', '🏐', '🏈', '⛳', '🏓', '🏸',
    '💄', '💅', '💇', '🧴', '🧼', '🧽', '🧹', '🧺',
    '📚', '📖', '📝', '✏️', '🖊️', '📐', '📏', '📌',
    '🧸', '🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎬',
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
    '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐',
    '🔨', '🔧', '🔩', '⚙️', '🛠️', '⚒️', '🪛', '🪚',
  ]

  const colorPresets = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
    '#06b6d4', '#ec4899', '#6366f1', '#14b8a6', '#f97316',
  ]

  const handleCreate = () => {
    setEditingCategory(null)
    setFormData({
      name: '',
      nameUz: '',
      nameRu: '',
      nameEn: '',
      icon: '📦',
      color: '#3b82f6',
      order: categories.length + 1,
      active: true,
      productCount: 0,
      parentId: null,
      slug: '',
    })
    setShowModal(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData(category)
    setShowModal(true)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSave = () => {
    const slug = formData.slug || generateSlug(formData.nameEn || formData.name || '')
    
    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...formData as Category, id: editingCategory.id, slug } 
          : c
      ))
    } else {
      const newCategory: Category = {
        ...formData as Category,
        id: Date.now().toString(),
        slug,
      }
      setCategories([...categories, newCategory])
    }
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Kategoriyani o\'chirmoqchimisiz?')) {
      setCategories(categories.filter(c => c.id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, active: !c.active } : c))
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    const newCategories = [...categories]
    ;[newCategories[index - 1], newCategories[index]] = [newCategories[index], newCategories[index - 1]]
    newCategories.forEach((c, i) => c.order = i + 1)
    setCategories(newCategories)
  }

  const moveDown = (index: number) => {
    if (index === categories.length - 1) return
    const newCategories = [...categories]
    ;[newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]]
    newCategories.forEach((c, i) => c.order = i + 1)
    setCategories(newCategories)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kategoriyalar</h1>
          <p className="text-gray-600 mt-1">Mahsulot kategoriyalarini boshqaring</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          Kategoriya qo'shish
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Folder className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
              <div className="text-sm text-gray-600">Jami kategoriyalar</div>
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
                {categories.filter(c => c.active).length}
              </div>
              <div className="text-sm text-gray-600">Aktiv</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, c) => sum + c.productCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Jami mahsulotlar</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Folder className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {categories.filter(c => c.parentId === null).length}
              </div>
              <div className="text-sm text-gray-600">Asosiy kategoriyalar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.sort((a, b) => a.order - b.order).map((category, index) => (
          <div
            key={category.id}
            className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                style={{ backgroundColor: category.color + '20' }}
              >
                {category.icon}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === categories.length - 1}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
            
            <div className="space-y-1 mb-4 text-sm text-gray-600">
              <div>🇺🇿 {category.nameUz}</div>
              <div>🇷🇺 {category.nameRu}</div>
              <div>🇬🇧 {category.nameEn}</div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                {category.productCount} ta mahsulot
              </div>
              <button
                onClick={() => toggleActive(category.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  category.active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {category.active ? 'Aktiv' : 'Noaktiv'}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
              >
                Tahrirlash
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}
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
              <div className="border rounded-xl p-6">
                <div className="text-sm font-semibold text-gray-700 mb-3">Preview:</div>
                <div className="flex items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl"
                    style={{ backgroundColor: formData.color + '20' }}
                  >
                    {formData.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {formData.name || 'Kategoriya nomi'}
                    </h3>
                    <div className="text-sm text-gray-600">
                      {formData.productCount || 0} ta mahsulot
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asosiy nom *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Elektronika"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    O'zbekcha 🇺🇿
                  </label>
                  <input
                    type="text"
                    value={formData.nameUz}
                    onChange={(e) => setFormData({ ...formData, nameUz: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Elektronika"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ruscha 🇷🇺
                  </label>
                  <input
                    type="text"
                    value={formData.nameRu}
                    onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Электроника"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inglizcha 🇬🇧
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Electronics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="electronics"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Bo'sh qoldirilsa avtomatik generatsiya qilinadi
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (Emoji) *
                  </label>
                  <div className="grid grid-cols-10 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                    {emojiList.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: emoji })}
                        className={`text-3xl p-2 rounded-lg hover:bg-gray-100 transition ${
                          formData.icon === emoji ? 'bg-primary-100 ring-2 ring-primary-500' : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rang *
                  </label>
                  <div className="flex gap-2 mb-2">
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`w-10 h-10 rounded-lg transition ${
                          formData.color === color ? 'ring-2 ring-offset-2 ring-gray-900' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-10 border rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
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
                    Parent kategoriya
                  </label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Yo'q (Asosiy kategoriya)</option>
                    {categories.filter(c => c.id !== editingCategory?.id).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
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
