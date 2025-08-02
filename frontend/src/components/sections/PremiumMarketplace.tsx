'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  StarIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const PremiumMarketplace: React.FC = () => {
  const features = [
    {
      icon: StarIcon,
      title: 'Sifatli mahsulotlar',
      description: 'Barcha mahsulotlar sifat nazoratidan o\'tgan'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Xavfsizlik',
      description: 'SSL shifrlash va xavfsiz to\'lov tizimi'
    },
    {
      icon: TruckIcon,
      title: 'Tezkor yetkazib berish',
      description: '1-3 kun ichida yetkazib berish'
    },
    {
      icon: CreditCardIcon,
      title: 'Qulay to\'lov',
      description: 'Turli xil to\'lov usullari'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h2 
                className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Premium Marketplace
              </motion.h2>
              
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                AFFILIMART platformasida siz sifatli mahsulotlarni raqobatbardosh narxlarda topasiz. 
                Bizning marketplace O'zbekistondagi eng yirik va ishonchli platforma hisoblanadi.
              </motion.p>
            </div>

            {/* Features */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Mahsulotlarni ko'rish
              </button>
              
              <button className="inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                Ko'proq ma'lumot
              </button>
            </motion.div>
          </motion.div>

          {/* Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white/20 rounded-lg mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-white/30 rounded w-3/4"></div>
                    <div className="h-2 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white/20 rounded-lg mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-white/30 rounded w-3/4"></div>
                    <div className="h-2 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white/20 rounded-lg mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-white/30 rounded w-3/4"></div>
                    <div className="h-2 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-white/20 rounded-lg mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-white/30 rounded w-3/4"></div>
                    <div className="h-2 bg-white/20 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PremiumMarketplace; 