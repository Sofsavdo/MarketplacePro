'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const StatsSection: React.FC = () => {
  const stats = [
    {
      icon: UsersIcon,
      value: '50,000+',
      label: 'Faol foydalanuvchilar',
      color: 'blue'
    },
    {
      icon: ShoppingBagIcon,
      value: '100,000+',
      label: 'Mahsulotlar',
      color: 'green'
    },
    {
      icon: CurrencyDollarIcon,
      value: '1M+',
      label: 'Buyurtmalar',
      color: 'yellow'
    },
    {
      icon: StarIcon,
      value: '99.9%',
      label: 'Mijozlar mamnuniyati',
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-20 bg-blue-600 dark:bg-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            AFFILIMART raqamlarda
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Platformamizning so'nggi natijalari va muvaffaqiyat ko'rsatkichlari
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`w-16 h-16 ${getColorClasses(stat.color)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className="h-8 w-8" />
              </div>
              
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              
              <div className="text-blue-100 text-lg">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              O'zbekistondagi eng yirik marketplace
            </h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              AFFILIMART platformasi O'zbekistondagi eng yirik va ishonchli marketplace hisoblanadi. 
              Biz mijozlarimizga eng yaxshi xizmatni taqdim etish uchun doimo rivojlanib bormoqdamiz.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection; 