'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  LinkIcon,
  StarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: 'iPhone 15 Pro Max',
          category: 'Elektronika',
          price: 15000000,
          originalPrice: 16000000,
          commission: 5.0,
          rating: 4.8,
          reviews: 1250,
          image: '/iphone.jpg',
          description: 'Eng yangi iPhone modeli, A17 Pro chip bilan',
          affiliateUrl: 'https://affilimart.com/ref/blogger123/iphone15',
          isFavorite: true
        },
        {
          id: 2,
          name: 'MacBook Pro M3 Max',
          category: 'Elektronika',
          price: 25000000,
          originalPrice: 27000000,
          commission: 5.0,
          rating: 4.9,
          reviews: 567,
          image: '/macbook.jpg',
          description: 'Kuchli M3 Max chip bilan MacBook Pro',
          affiliateUrl: 'https://affilimart.com/ref/blogger123/macbook',
          isFavorite: false
        },
        {
          id: 3,
          name: 'AirPods Pro 2',
          category: 'Elektronika',
          price: 2500000,
          originalPrice: 2800000,
          commission: 3.0,
          rating: 4.7,
          reviews: 890,
          image: '/airpods.jpg',
          description: 'Noise cancellation bilan AirPods Pro',
          affiliateUrl: 'https://affilimart.com/ref/blogger123/airpods',
          isFavorite: true
        },
        {
          id: 4,
          name: 'iPad Pro 12.9',
          category: 'Elektronika',
          price: 8500000,
          originalPrice: 9000000,
          commission: 4.0,
          rating: 4.6,
          reviews: 234,
          image: '/ipad.jpg',
          description: '12.9 inch iPad Pro M2 chip bilan',
          affiliateUrl: 'https://affilimart.com/ref/blogger123/ipad',
          isFavorite: false
        },
        {
          id: 5,
          name: 'Nike Air Max 270',
          category: 'Kiyim-kechak',
          price: 850000,
          originalPrice: 950000,
          commission: 2.5,
          rating: 4.5,
          reviews: 456,
          image: '/nike.jpg',
          description: 'Qulay va chiroyli Nike krossovkalar',
          affiliateUrl: 'https://affilimart.com/ref/blogger123/nike',
          isFavorite: false
        },
        {
          id: 6,
          name: 'Rolex Submariner',
          category: 'Luxury',
          price: 85000000,
          originalPrice: 90000000,
          commission: 8.0,
          rating: 5.0,
          reviews: 123,
          image: '/rolex.jpg',
          description: 'Luxury soatlar, premium sifat',
          affiliateUrl: 'https://affilimart.com/ref/blogger123/rolex',
          isFavorite: true
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const createAffiliateLink = (productId: number) => {
    // Create affiliate link logic
    console.log(`Creating affiliate link for product ${productId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mahsulot katalogi</h1>
          <p className="text-gray-600">Affiliate marketing uchun mahsulotlar</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Mahsulot qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Barcha kategoriyalar</option>
              <option value="Elektronika">Elektronika</option>
              <option value="Kiyim-kechak">Kiyim-kechak</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBagIcon className="h-12 w-12 text-gray-400" />
                </div>
                <button className="absolute top-2 right-2 p-1 rounded-full bg-white shadow-sm">
                  <HeartIcon className={`h-4 w-4 ${product.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="text-xs text-gray-500">{product.commission}% komissiya</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center mr-2">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
                    <p className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => createAffiliateLink(product.id)}
                    className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Havola yaratish
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <EyeIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                      <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                    </div>
                    <span className="text-sm text-gray-500">{product.commission}% komissiya</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>
                  <p className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => createAffiliateLink(product.id)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Havola
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <EyeIcon className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <HeartIcon className={`h-4 w-4 ${product.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Jami <span className="font-medium">{filteredProducts.length}</span> mahsulot
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            Oldingi
          </button>
          <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm">
            1
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            Keyingi
          </button>
        </div>
      </div>
    </div>
  );
} 