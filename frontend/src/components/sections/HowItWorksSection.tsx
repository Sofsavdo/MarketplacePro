'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlusIcon, 
  ShoppingBagIcon, 
  CreditCardIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: UserPlusIcon,
      title: 'Ro\'yxatdan o\'ting',
      description: 'Tezkor va bepul ro\'yxatdan o\'tish orqali platformaga kirish',
      step: '1'
    },
    {
      icon: ShoppingBagIcon,
      title: 'Mahsulot tanlang',
      description: 'Keng assortimentdan o\'zingizga kerakli mahsulotni toping',
      step: '2'
    },
    {
      icon: CreditCardIcon,
      title: 'Xavfsiz to\'lov',
      description: 'Turli xil to\'lov usullari orqali xavfsiz to\'lov qiling',
      step: '3'
    },
    {
      icon: TruckIcon,
      title: 'Yetkazib berish',
      description: 'Tezkor va ishonchli yetkazib berish xizmati',
      step: '4'
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
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
            Qanday ishlaydi?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            AFFILIMART platformasida xarid qilish juda oson. 
            Faqat 4 ta oddiy qadam orqali mahsulotlaringizni oling.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                {step.step}
              </div>

              {/* Card */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 dark:bg-gray-600 transform -translate-y-1/2"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Tayyormisiz? Hozir boshlang!
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Ro'yxatdan o'tish
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 