'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBagIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: ShoppingBagIcon,
      title: 'Marketplace',
      description: 'Mahsulotlarni osongina sotish va sotib olish imkoniyati',
      color: 'blue'
    },
    {
      icon: UserGroupIcon,
      title: 'Affiliate Network',
      description: 'Bloggerlar uchun daromadli hamkorlik tizimi',
      color: 'green'
    },
    {
      icon: ChartBarIcon,
      title: 'AI Analytics',
      description: 'Aqlli tahlil va optimizatsiya vositalari',
      color: 'purple'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Xavfsizlik',
      description: 'Yuqori darajadagi xavfsizlik va himoya',
      color: 'red'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Tezkor ishlash',
      description: 'Zamonaviy texnologiyalar bilan tezkor ishlash',
      color: 'yellow'
    },
    {
      icon: CogIcon,
      title: 'Moslashuvchanlik',
      description: 'Har qanday ehtiyojlarga moslashuvchan tizim',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
      green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
      purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
      red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
      yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400',
      indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Nima uchun AFFILIMART?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Platformamizning asosiy afzalliklari va xususiyatlari
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`w-12 h-12 ${getColorClasses(feature.color)} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 