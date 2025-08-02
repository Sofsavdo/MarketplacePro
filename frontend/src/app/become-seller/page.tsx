'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon,
  StarIcon,
  UserGroupIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ShieldCheckIcon,
  CogIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const BecomeSellerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'benefits' | 'requirements' | 'register'>('benefits');

  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: 'Yuqori daromad',
      description: 'Har bir sotuvdan 5-15% komissiya oling',
      color: 'text-green-600'
    },
    {
      icon: UserGroupIcon,
      title: 'Katta auditoriya',
      description: '50,000+ faol mijozlar va 5,000+ blogerlar',
      color: 'text-blue-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Analitika va hisobotlar',
      description: 'Batafsil sotuv statistikasi va tahlillar',
      color: 'text-purple-600'
    },
    {
      icon: TruckIcon,
      title: 'Yetkazib berish',
      description: 'Bizning logistika tizimi orqali tezkor yetkazib berish',
      color: 'text-orange-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Xavfsizlik',
      description: 'Kafolatlangan to\'lovlar va xavfsizlik',
      color: 'text-red-600'
    },
    {
      icon: CogIcon,
      title: 'Qulay boshqaruv',
      description: 'Oson mahsulot qo\'shish va boshqarish',
      color: 'text-indigo-600'
    }
  ];

  const requirements = [
    'O\'zbekiston Respublikasi fuqarosi yoki yuridik shaxs bo\'lish',
    'Mahsulotlar sifatli va xavfsiz bo\'lishi kerak',
    'To\'liq ma\'lumotlar va hujjatlar taqdim etilishi',
    'AFFILIMART qoidalariga rioya qilish',
    'Muntazam hisobotlar taqdim etish',
    'Mijozlar bilan sifatli ishlash'
  ];

  const stats = [
    { number: '500+', label: 'Faol sotuvchilar' },
    { number: '10,000+', label: 'Mahsulotlar' },
    { number: '50,000+', label: 'Mamnun mijozlar' },
    { number: '95%', label: 'Mamnuniyat' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Sotuvchi bo'ling
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              O'zbekistondagi eng yirik marketplace'da mahsulotlaringizni soting va daromadingizni oshiring
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link 
                href="#register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Ro'yxatdan o'tish
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <button 
                onClick={() => setActiveTab('benefits')}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
              >
                Afzalliklar
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'benefits'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Afzalliklar
            </button>
            <button
              onClick={() => setActiveTab('requirements')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'requirements'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Talablar
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'register'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Ro'yxatdan o'tish
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'benefits' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4`}>
                    <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'requirements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Sotuvchi bo'lish uchun talablar
                </h3>
                <div className="space-y-4">
                  {requirements.map((requirement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircleIcon className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {requirement}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'register' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Sotuvchi ro'yxatdan o'tish
                </h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ism
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Ismingizni kiriting"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Familiya
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Familiyangizni kiriting"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefon raqam
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="+998 90 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kompaniya nomi (ixtiyoriy)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Kompaniya nomi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mahsulot kategoriyasi
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                      <option>Kategoriyani tanlang</option>
                      <option>Elektronika</option>
                      <option>Moda</option>
                      <option>Uy va bog'</option>
                      <option>Sport</option>
                      <option>Go'zallik</option>
                      <option>Kitoblar</option>
                      <option>O'yinchoqlar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Izoh
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Qo'shimcha ma'lumotlar..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Arizani yuborish
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  Ro'yxatdan o'tganingizdan so'ng, biz siz bilan bog'lanamiz va keyingi qadamlarni ko'rsatamiz.
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BecomeSellerPage; 