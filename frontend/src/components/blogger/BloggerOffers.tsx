'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MegaphoneIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  StarIcon,
  UsersIcon,
  TrendingUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export function BloggerOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOffers([
        {
          id: 1,
          merchant: 'Apple Store Tashkent',
          product: 'iPhone 15 Pro Max',
          offer: 'Mahsulotni Instagram va TikTok da reklama qilish',
          commission: 150000,
          duration: '7 kun',
          requirements: [
            '10K+ obunachilar',
            'Professional kontent',
            'Hashtag #AppleStoreUZ',
            'Story va Reels'
          ],
          status: 'pending',
          deadline: '2024-01-20',
          views: 1250,
          clicks: 89,
          conversions: 12
        },
        {
          id: 2,
          merchant: 'Samsung Uzbekistan',
          product: 'Galaxy S24 Ultra',
          offer: 'YouTube video review va Instagram post',
          commission: 200000,
          duration: '14 kun',
          requirements: [
            '50K+ obunachilar',
            'Video review',
            'Instagram post',
            'Story highlights'
          ],
          status: 'accepted',
          deadline: '2024-01-25',
          views: 2100,
          clicks: 156,
          conversions: 23
        },
        {
          id: 3,
          merchant: 'Nike Uzbekistan',
          product: 'Nike Air Max 270',
          offer: 'Sport kiyimlarini reklama qilish',
          commission: 75000,
          duration: '5 kun',
          requirements: [
            '5K+ obunachilar',
            'Sport kontenti',
            'Hashtag #NikeUZ',
            'Instagram post'
          ],
          status: 'completed',
          deadline: '2024-01-15',
          views: 890,
          clicks: 67,
          conversions: 8
        },
        {
          id: 4,
          merchant: 'Rolex Boutique',
          product: 'Rolex Submariner',
          offer: 'Luxury soatlar haqida kontent',
          commission: 500000,
          duration: '30 kun',
          requirements: [
            '100K+ obunachilar',
            'Luxury kontent',
            'Professional fotolar',
            'Video review'
          ],
          status: 'rejected',
          deadline: '2024-02-01',
          views: 0,
          clicks: 0,
          conversions: 0
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'completed':
        return <StarIcon className="h-4 w-4" />;
      case 'rejected':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const filteredOffers = offers.filter(offer => {
    return filterStatus === 'all' || offer.status === filterStatus;
  });

  const acceptOffer = (offerId: number) => {
    setOffers(offers.map(offer => 
      offer.id === offerId ? { ...offer, status: 'accepted' } : offer
    ));
  };

  const rejectOffer = (offerId: number) => {
    setOffers(offers.map(offer => 
      offer.id === offerId ? { ...offer, status: 'rejected' } : offer
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Takliflar</h1>
          <p className="text-gray-600">Sotuvchilardan kelgan reklama takliflari</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Barcha takliflar</option>
            <option value="pending">Kutilmoqda</option>
            <option value="accepted">Qabul qilingan</option>
            <option value="completed">Bajarilgan</option>
            <option value="rejected">Rad etilgan</option>
          </select>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOffers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Offer Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MegaphoneIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{offer.merchant}</h3>
                    <p className="text-sm text-gray-500">{offer.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatPrice(offer.commission)}</p>
                  <p className="text-sm text-gray-500">{offer.duration}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{offer.offer}</p>
              
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                  {getStatusIcon(offer.status)}
                  <span className="ml-1 capitalize">
                    {offer.status === 'pending' ? 'Kutilmoqda' :
                     offer.status === 'accepted' ? 'Qabul qilingan' :
                     offer.status === 'completed' ? 'Bajarilgan' :
                     offer.status === 'rejected' ? 'Rad etilgan' : offer.status}
                  </span>
                </span>
                <p className="text-xs text-gray-500">Tugash: {new Date(offer.deadline).toLocaleDateString('uz-UZ')}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="p-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Talablar:</h4>
              <ul className="space-y-2 mb-4">
                {offer.requirements.map((requirement, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    {requirement}
                  </li>
                ))}
              </ul>

              {/* Performance Stats */}
              {offer.status !== 'rejected' && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{offer.views.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Ko'rishlar</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{offer.clicks}</p>
                    <p className="text-xs text-gray-500">Bosishlar</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{offer.conversions}</p>
                    <p className="text-xs text-gray-500">Konversiyalar</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {offer.status === 'pending' && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => acceptOffer(offer.id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Qabul qilish
                  </button>
                  <button
                    onClick={() => rejectOffer(offer.id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Rad etish
                  </button>
                </div>
              )}

              {offer.status === 'accepted' && (
                <div className="flex space-x-3">
                  <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                    <TrendingUpIcon className="h-4 w-4 mr-2" />
                    Ishni boshlash
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <EyeIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              )}

              {offer.status === 'completed' && (
                <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Ish bajarildi</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami takliflar</p>
              <p className="text-2xl font-bold text-gray-900">{offers.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MegaphoneIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Qabul qilingan</p>
              <p className="text-2xl font-bold text-gray-900">
                {offers.filter(o => o.status === 'accepted').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Bajarilgan</p>
              <p className="text-2xl font-bold text-gray-900">
                {offers.filter(o => o.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <StarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jami daromad</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(offers.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.commission, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 