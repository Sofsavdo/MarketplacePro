'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MegaphoneIcon,
  StarIcon,
  TrendingUpIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  UsersIcon,
  ChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export function PromotionServices() {
  const [activeServices, setActiveServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 'top-listing',
      name: 'Top ro\'yxatga chiqish',
      description: 'Mahsulotingizni birinchi sahifada ko\'rsatish',
      price: 500000,
      duration: '30 kun',
      icon: TrendingUpIcon,
      features: [
        'Birinchi sahifada ko\'rsatish',
        'Maxsus belgi bilan ajratish',
        'Ko\'rishlar sonini 3x oshirish',
        'Daromadni 2x oshirish'
      ],
      color: 'purple'
    },
    {
      id: 'blogger-promotion',
      name: 'Blogger reklamasi',
      description: 'Taniqli bloggerlar orqali reklama',
      price: 1000000,
      duration: '7 kun',
      icon: UsersIcon,
      features: [
        'Top 10 blogger bilan ishlash',
        'Instagram, TikTok, YouTube reklama',
        'Professional kontent yaratish',
        'Real-time natija kuzatish'
      ],
      color: 'blue'
    },
    {
      id: 'social-ads',
      name: 'Ijtimoiy tarmoq reklamasi',
      description: 'Facebook, Instagram, TikTok reklama',
      price: 750000,
      duration: '14 kun',
      icon: MegaphoneIcon,
      features: [
        'Targeted reklama',
        'A/B testing',
        'Real-time analytics',
        'ROI tracking'
      ],
      color: 'green'
    },
    {
      id: 'premium-support',
      name: 'Premium qo\'llab-quvvatlash',
      description: '24/7 maxsus qo\'llab-quvvatlash',
      price: 300000,
      duration: '30 kun',
      icon: StarIcon,
      features: [
        '24/7 qo\'llab-quvvatlash',
        'Maxsus menejer',
        'Tezkor yechimlar',
        'Priority support'
      ],
      color: 'yellow'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'blue':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'green':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getButtonColor = (color: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'green':
        return 'bg-green-600 hover:bg-green-700';
      case 'yellow':
        return 'bg-yellow-600 hover:bg-yellow-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Promotion xizmatlari</h1>
        <p className="text-gray-600">Sotuvlaringizni oshirish uchun maxsus xizmatlar</p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          const isActive = activeServices.includes(service.id);
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-300 ${
                isActive ? 'border-purple-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Service Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${getColorClasses(service.color)} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(service.price)}</p>
                    <p className="text-sm text-gray-500">{service.duration}</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>

              {/* Features */}
              <div className="p-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Xizmat tarkibi:</h4>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0">
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedService(service)}
                    className={`flex-1 ${getButtonColor(service.color)} text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center`}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Xizmatni tanlash
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <EyeIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Services */}
      {activeServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Faol xizmatlar</h3>
          <div className="space-y-3">
            {activeServices.map((serviceId) => {
              const service = services.find(s => s.id === serviceId);
              if (!service) return null;
              
              return (
                <div key={serviceId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 ${getColorClasses(service.color)} rounded-lg flex items-center justify-center mr-3`}>
                      <service.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.duration} davomida</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatPrice(service.price)}</p>
                    <p className="text-sm text-green-600">Faol</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedService.name}</h3>
            <p className="text-gray-600 mb-4">{selectedService.description}</p>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Narxi:</span>
                <span className="font-bold">{formatPrice(selectedService.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Davomiyligi:</span>
                <span className="font-bold">{selectedService.duration}</span>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setActiveServices([...activeServices, selectedService.id]);
                  setSelectedService(null);
                }}
                className={`flex-1 ${getButtonColor(selectedService.color)} text-white px-4 py-2 rounded-lg`}
              >
                Xizmatni faollashtirish
              </button>
              <button
                onClick={() => setSelectedService(null)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Bekor qilish
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 