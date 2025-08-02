'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Aziza Karimova',
      role: 'Sotuvchi',
      content: 'AFFILIMART platformasi orqali biznesimni rivojlantirdim. Mahsulotlarimni osongina sotish va mijozlarimni boshqarish imkoniyati berdi.',
      rating: 5,
      avatar: '/avatars/aziza.jpg'
    },
    {
      name: 'Dilshod Rahimov',
      role: 'Blogger',
      content: 'Affiliate dasturi orqali yaxshi daromad qilaman. Platforma juda ishonchli va to\'lovlar vaqtida amalga oshiriladi.',
      rating: 5,
      avatar: '/avatars/dilshod.jpg'
    },
    {
      name: 'Malika Yusupova',
      role: 'Mijoz',
      content: 'Mahsulotlar sifatli va narxlari hamyonbop. Yetkazib berish tez va xizmat yaxshi. Tavsiya qilaman!',
      rating: 5,
      avatar: '/avatars/malika.jpg'
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
            Mijozlarimiz fikri
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            AFFILIMART platformasidan foydalanayotgan mijozlarimizning haqiqiy fikrlari
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
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
            Siz ham AFFILIMART oilasiga qo'shiling!
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Hozir boshlang
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 