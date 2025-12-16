'use client'

import Link from 'next/link'
import MainLayout from '@/components/layout/MainLayout'
import { ChevronRight } from 'lucide-react'

export default function CategoriesPage() {
  const categories = [
    {
      id: 1,
      name: 'Elektronika',
      icon: '📱',
      color: 'bg-blue-50',
      count: 1234,
      subcategories: ['Telefonlar', 'Noutbuklar', 'Planshetlar', 'Aksessuarlar'],
    },
    {
      id: 2,
      name: 'Kiyim',
      icon: '👕',
      color: 'bg-purple-50',
      count: 2456,
      subcategories: ['Erkaklar', 'Ayollar', 'Bolalar', 'Poyabzal'],
    },
    {
      id: 3,
      name: 'Maishiy texnika',
      icon: '🏠',
      color: 'bg-green-50',
      count: 876,
      subcategories: ['Oshxona', 'Tozalash', 'Iqlim', 'Kichik texnika'],
    },
    {
      id: 4,
      name: 'Sport',
      icon: '⚽',
      color: 'bg-orange-50',
      count: 654,
      subcategories: ['Fitnes', 'Futbol', 'Basketbol', 'Velosiped'],
    },
    {
      id: 5,
      name: 'Go\'zallik',
      icon: '💄',
      color: 'bg-pink-50',
      count: 1543,
      subcategories: ['Kosmetika', 'Parfyumeriya', 'Soch parvarishi', 'Teri parvarishi'],
    },
    {
      id: 6,
      name: 'Kitoblar',
      icon: '📚',
      color: 'bg-yellow-50',
      count: 987,
      subcategories: ['Badiiy', 'Ilmiy', 'Bolalar', 'Darsliklar'],
    },
    {
      id: 7,
      name: 'O\'yinchoqlar',
      icon: '🧸',
      color: 'bg-red-50',
      count: 765,
      subcategories: ['Qo\'g\'irchoqlar', 'Konstruktorlar', 'Avtomobillar', 'O\'yinlar'],
    },
    {
      id: 8,
      name: 'Avtotovarlar',
      icon: '🚗',
      color: 'bg-gray-50',
      count: 543,
      subcategories: ['Ehtiyot qismlar', 'Aksessuarlar', 'Moylar', 'Shinalar'],
    },
    {
      id: 9,
      name: 'Mebel',
      icon: '🛋️',
      color: 'bg-indigo-50',
      count: 432,
      subcategories: ['Yotoq xonasi', 'Mehmonxona', 'Oshxona', 'Ofis'],
    },
    {
      id: 10,
      name: 'Bog\'',
      icon: '🌱',
      color: 'bg-teal-50',
      count: 321,
      subcategories: ['Asboblar', 'O\'simliklar', 'Sug\'orish', 'Dekoratsiya'],
    },
    {
      id: 11,
      name: 'Qurilish',
      icon: '🔨',
      color: 'bg-amber-50',
      count: 654,
      subcategories: ['Asboblar', 'Materiallar', 'Elektr', 'Santexnika'],
    },
    {
      id: 12,
      name: 'Oziq-ovqat',
      icon: '🍎',
      color: 'bg-lime-50',
      count: 876,
      subcategories: ['Meva', 'Sabzavot', 'Go\'sht', 'Sut mahsulotlari'],
    },
  ]

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kategoriyalar</h1>
            <p className="text-gray-600">Barcha mahsulot kategoriyalari</p>
          </div>

          {/* Categories Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{category.count} ta mahsulot</p>
                
                <div className="space-y-2 mb-4">
                  {category.subcategories.map((sub, index) => (
                    <div key={index} className="text-sm text-gray-500 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {sub}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-primary-600 font-medium group-hover:gap-3 transition-all">
                  Ko'rish
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
