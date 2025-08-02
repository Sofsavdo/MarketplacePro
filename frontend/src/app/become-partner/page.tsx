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
  ShareIcon,
  ShieldCheckIcon,
  CogIcon,
  ArrowRightIcon,
  TrendingUpIcon,
  GiftIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const BecomePartnerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'benefits' | 'how-it-works' | 'register'>('benefits');

  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: 'Yuqori daromad',
      description: 'Har bir sotuvdan 3-10% komissiya oling',
      color: 'text-green-600'
    },
    {
      icon: UserGroupIcon,
      title: 'Katta auditoriya',
      description: '50,000+ faol mijozlar va 500+ sotuvchilar',
      color: 'text-blue-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Real-time statistikalar',
      description: 'Sotuvlar va daromadlaringizni kuzating',
      color: 'text-purple-600'
    },
    {
      icon: ShareIcon,
      title: 'Oson ulashish',
      description: 'Bir tugma bosish bilan mahsulotlarni ulashing',
      color: 'text-orange-600'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Xavfsiz to\'lovlar',
      description: 'Kafolatlangan va tezkor to\'lovlar',
      color: 'text-red-600'
    },
    {
      icon: CogIcon,
      title: 'Qulay boshqaruv',
      description: 'Oson affiliate linklar va kampaniyalar',
      color: 'text-indigo-600'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Ro\'yxatdan o\'ting',
      description: 'Tezkor ro\'yxatdan o\'tish va tasdiqlash',
      icon: UserGroupIcon
    },
    {
      step: 2,
      title: 'Mahsulotlarni tanlang',
      description: 'O\'zingizga yoqqan mahsulotlarni tanlang',
      icon: StarIcon
    },
    {
      step: 3,
      title: 'Ulashing',
      description: 'Ijtimoiy tarmoqlar yoki blogingizda ulashing',
      icon: ShareIcon
    },
    {
      step: 4,
      title: 'Daromad qiling',
      description: 'Har bir sotuvdan komissiya oling',
      icon: CurrencyDollarIcon
    }
  ];

  const stats = [
    { number: '5,000+', label: 'Faol hamkorlar' },
    { number: '10,000+', label: 'Mahsulotlar' },
    { number: '50,000+', label: 'Mamnun mijozlar' },
    { number: '98%', label: 'Mamnuniyat' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Hamkor bo'ling
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Mahsulotlarni tavsiya qiling va har bir sotuvdan daromad qiling. 
              Affiliate marketing orqali o'z daromadingizni oshiring!
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link 
                href="#register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Ro'yxatdan o'tish
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <button 
                onClick={() => setActiveTab('benefits')}
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
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
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
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
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Afzalliklar
            </button>
            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'how-it-works'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Qanday ishlaydi
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'register'
                  ? 'bg-purple-600 text-white'
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

          {activeTab === 'how-it-works' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {howItWorks.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                          {step.step}
                        </span>
                      </div>
                      <step.icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
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
                  Hamkor ro'yxatdan o'tish
                </h3>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ism
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Ismingizni kiriting"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Familiya
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefon raqam
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="+998 90 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Platforma (ixtiyoriy)
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                      <option>Platformani tanlang</option>
                      <option>Instagram</option>
                      <option>Telegram</option>
                      <option>YouTube</option>
                      <option>TikTok</option>
                      <option>Blog</option>
                      <option>Boshqa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Auditoriya soni (taxminiy)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="1000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Izoh
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Qo'shimcha ma'lumotlar..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Arizani yuborish
                  </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                  Ro'yxatdan o'tganingizdan so'ng, biz siz bilan bog'lanamiz va affiliate linklaringizni beramiz.
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BecomePartnerPage; 