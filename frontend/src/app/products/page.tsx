'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ViewColumnsIcon,
  ViewListIcon,
  StarIcon,
  ShoppingCartIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000000],
    rating: 0,
    brand: '',
    sortBy: 'newest'
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: 'iPhone 15 Pro Max',
          price: 15000000,
          originalPrice: 18000000,
          image: '/images/products/iphone.jpg',
          rating: 4.8,
          reviews: 1250,
          brand: 'Apple',
          category: 'Electronics',
          inStock: true,
          isNew: true,
          discount: 17
        },
        {
          id: 2,
          name: 'Samsung Galaxy S24 Ultra',
          price: 12000000,
          originalPrice: 14000000,
          image: '/images/products/samsung.jpg',
          rating: 4.6,
          reviews: 890,
          brand: 'Samsung',
          category: 'Electronics',
          inStock: true,
          isNew: true,
          discount: 14
        },
        {
          id: 3,
          name: 'MacBook Pro M3',
          price: 25000000,
          originalPrice: 28000000,
          image: '/images/products/macbook.jpg',
          rating: 4.9,
          reviews: 567,
          brand: 'Apple',
          category: 'Electronics',
          inStock: true,
          isNew: false,
          discount: 11
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mahsulotlar
              </h1>
              <p className="text-gray-600 mt-2">
                {products.length} ta mahsulot topildi
              </p>
            </div>

            {/* Search and View Controls */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Mahsulot qidirish..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ViewColumnsIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${
                    viewMode === 'list'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ViewListIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Filters Button */}
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FunnelIcon className="h-5 w-5" />
                <span>Filtrlash</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <ProductFilters filters={filters} setFilters={setFilters} />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} viewMode="grid" />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard product={product} viewMode="list" />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Load More */}
            <div className="mt-12 text-center">
              <button className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Ko'proq yuklash
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 